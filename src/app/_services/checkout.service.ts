import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ApiMessage,
  CodOrderCreated,
  CreateOrderRequest,
  RazorpayOrderCreated,
  RazorpaySuccessResponse
} from '../_interface/payment';
import { PaymentService } from './payment.service';

export type CheckoutOutcome =
  /** COD — order is confirmed, nothing was charged. */
  | { status: 'placed'; orderNumber: string }
  /** Paid online and the signature checked out server-side. */
  | { status: 'paid'; orderNumber: string }
  /** Customer closed the payment window without paying. */
  | { status: 'cancelled' }
  /**
   * Money likely left the customer's account but we could not confirm it — the
   * Razorpay webhook settles these server-side, so this must never be shown as
   * a plain failure.
   */
  | { status: 'unconfirmed'; orderNumber: string; message: string }
  /** Nothing was charged. */
  | { status: 'failed'; message: string };

const GENERIC_ERROR = 'Something went wrong. Please try again.';

/**
 * The whole online-payment dance in one place: ask the API to open an order, show
 * the Razorpay window, then hand the result back for signature verification. The
 * cart and the product page both check out through here so there is only ever one
 * copy of this logic.
 */
@Injectable({ providedIn: 'root' })
export class CheckoutService {

  constructor(private payments: PaymentService) { }

  async checkout(request: CreateOrderRequest): Promise<CheckoutOutcome> {
    let created: ApiMessage<CodOrderCreated | RazorpayOrderCreated>;

    try {
      created = await firstValueFrom(this.payments.createOrder(request));
    } catch (err) {
      return { status: 'failed', message: this.readError(err, 'Could not start checkout. Please try again.') };
    }

    if (!created || !created.isSuccess) {
      return { status: 'failed', message: created?.returnMessage || GENERIC_ERROR };
    }

    if (request.paymentMethod === 'COD') {
      return { status: 'placed', orderNumber: (created.data as CodOrderCreated).orderNumber };
    }

    return this.payAndVerify(created.data as RazorpayOrderCreated);
  }

  private payAndVerify(order: RazorpayOrderCreated): Promise<CheckoutOutcome> {
    // Razorpay talks in callbacks, so the modal is wrapped into a single promise.
    // Whichever callback fires first settles it; later ones are no-ops.
    return new Promise<CheckoutOutcome>(resolve => {
      this.payments.openCheckout(order, {
        onSuccess: response => {
          this.verify(order, response).then(resolve);
        },
        onFailure: response => {
          resolve({
            status: 'failed',
            message: response?.error?.description || 'The payment did not go through. You have not been charged.'
          });
        },
        onDismiss: () => {
          resolve({ status: 'cancelled' });
        }
      }).catch(err => {
        resolve({ status: 'failed', message: err?.message || 'Could not open the payment window.' });
      });
    });
  }

  private async verify(order: RazorpayOrderCreated, response: RazorpaySuccessResponse): Promise<CheckoutOutcome> {
    try {
      const verified = await firstValueFrom(this.payments.verifyPayment({
        orderId: order.orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      }));

      if (!verified || !verified.isSuccess) {
        return { status: 'failed', message: verified?.returnMessage || 'We could not confirm this payment.' };
      }

      return { status: 'paid', orderNumber: verified.data?.orderNumber || order.orderNumber };
    } catch {
      // The request failed, not the payment. Razorpay's webhook reaches the server
      // independently of this browser, so the order still gets settled there.
      return {
        status: 'unconfirmed',
        orderNumber: order.orderNumber,
        message: 'Your payment went through, but we could not confirm it just now. '
          + 'It will be confirmed automatically and you will get an email shortly. '
          + 'Please do not pay again.'
      };
    }
  }

  /** Pulls the API's own message out of an HttpErrorResponse when there is one. */
  private readError(err: any, fallback: string): string {
    return err?.error?.returnMessage || err?.error?.message || fallback;
  }
}
