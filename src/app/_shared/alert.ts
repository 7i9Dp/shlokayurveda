import Swal, { SweetAlertIcon } from 'sweetalert2';
import { PaymentMethod } from '../_interface/payment';

const BRAND_GREEN = '#2f6b1f';

/**
 * Same SweetAlert2 look everywhere in the storefront — brand-green confirm button
 * instead of the library's stock purple — so success/info/error popups read as
 * part of one design instead of each screen rolling its own defaults.
 */
export function brandAlert(title: string, text: string, icon: SweetAlertIcon) {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: BRAND_GREEN,
    confirmButtonText: 'OK'
  });
}

export interface OrderSuccessDetails {
  orderNumber: string;
  paymentMethod: PaymentMethod;
}

/**
 * The popup every successful checkout ends on — COD or paid. Kept to one clean
 * headline and one reassurance line; the order number sits below as its own
 * quiet reference chip rather than being folded into that sentence.
 *
 * Swal renders its markup straight onto <body>, outside Angular's view, so a
 * component's scoped stylesheet can never reach in here — hence inline styles
 * instead of a CSS class the caller could style itself.
 */
export function orderSuccessAlert(details: OrderSuccessDetails): Promise<unknown> {
  const isCod = details.paymentMethod === 'COD';

  return Swal.fire({
    icon: 'success',
    title: isCod ? 'Order Placed!' : 'Payment Successful!',
    html: `
      <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#6b7280;">
        ${isCod
          ? 'A confirmation email is on its way to your inbox &mdash; it may take a minute to arrive. Please keep the amount ready to pay on delivery.'
          : 'A confirmation email is on its way to your inbox &mdash; it may take a minute to arrive.'}
      </p>
      <p style="margin:0;font-size:12px;letter-spacing:.02em;color:#9ca3af;">
        Order&nbsp;<span style="color:#14200d;font-weight:700;">${details.orderNumber}</span>
      </p>
    `,
    confirmButtonColor: BRAND_GREEN,
    confirmButtonText: 'Continue Shopping'
  });
}
