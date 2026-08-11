import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ApiMessage,
  CodOrderCreated,
  CreateOrderRequest,
  RazorpayFailureResponse,
  RazorpayOrderCreated,
  RazorpaySuccessResponse,
  VerifyPaymentRequest
} from '../_interface/payment';

declare const Razorpay: any;

const API_URL = environment.apiURL;
const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND_GREEN = '#2f6b1f';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export interface CheckoutHandlers {
  /** Payment went through — the ids still need verifying server-side. */
  onSuccess: (response: RazorpaySuccessResponse) => void;
  /** Razorpay reported the payment itself failed (bad card, declined UPI, …). */
  onFailure: (response: RazorpayFailureResponse) => void;
  /** Customer closed the modal without paying. */
  onDismiss: () => void;
}

/**
 * Razorpay Standard Checkout. The browser never sees the key secret and never
 * decides what an order costs — it asks the API to open an order, shows the modal
 * for it, then hands the result back for signature verification.
 */
@Injectable({ providedIn: 'root' })
export class PaymentService {

  private scriptPromise: Promise<void> | null = null;

  constructor(private http: HttpClient, private zone: NgZone) { }

  createOrder(request: CreateOrderRequest): Observable<ApiMessage<CodOrderCreated | RazorpayOrderCreated>> {
    return this.http.post<ApiMessage<CodOrderCreated | RazorpayOrderCreated>>(
      API_URL + 'Payment/createorder', request, httpOptions
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<ApiMessage<{ orderNumber: string }>> {
    return this.http.post<ApiMessage<{ orderNumber: string }>>(
      API_URL + 'Payment/verifypayment', request, httpOptions
    );
  }

  /**
   * Pulls in checkout.js the first time it is needed, rather than on every page
   * load — most visitors never reach the cart. The promise is cached so repeated
   * checkout attempts reuse the one script tag.
   */
  loadCheckout(): Promise<void> {
    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise<void>((resolve, reject) => {
      if (typeof Razorpay !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = CHECKOUT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        // Let the next attempt retry instead of caching the failure forever.
        this.scriptPromise = null;
        reject(new Error('Could not load the payment window. Please check your connection.'));
      };
      document.body.appendChild(script);
    });

    return this.scriptPromise;
  }

  /**
   * Opens the payment modal for an order the API already created. Razorpay fires
   * its callbacks outside Angular, so each one is bounced back through NgZone —
   * without that the UI would not update until the next unrelated event.
   */
  async openCheckout(order: RazorpayOrderCreated, handlers: CheckoutHandlers): Promise<void> {
    await this.loadCheckout();

    const options = {
      key: order.keyId,
      order_id: order.razorpayOrderId,
      amount: order.amountInPaise,
      currency: order.currency,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      theme: { color: BRAND_GREEN },
      // We show our own message and let the customer press Pay again, so Razorpay's
      // built-in retry prompt would only duplicate that.
      retry: { enabled: false },
      handler: (response: RazorpaySuccessResponse) => {
        this.zone.run(() => handlers.onSuccess(response));
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => handlers.onDismiss());
        }
      }
    };

    const checkout = new Razorpay(options);

    checkout.on('payment.failed', (response: RazorpayFailureResponse) => {
      this.zone.run(() => handlers.onFailure(response));
    });

    checkout.open();
  }
}
