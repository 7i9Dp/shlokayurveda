/** Payload shapes for the Payment API (SlokAyurvedaAPI/Controllers/PaymentController.cs). */

export type PaymentMethod = 'Razorpay' | 'COD';

export interface OrderItemRequest {
  productId: number;
  productName: string;
  pack: string;
  duration: string;
  isKit: boolean;
  /** Sent so the server can confirm the cart shows the price it is about to charge. */
  unitPrice: number;
  quantity: number;
  includeItems: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  items: OrderItemRequest[];
}

/** Every endpoint answers with this envelope — see Models/Message.cs. */
export interface ApiMessage<T = any> {
  isSuccess: boolean;
  returnMessage: string;
  data: T;
}

/** `data` from createorder when paymentMethod was COD. */
export interface CodOrderCreated {
  orderId: number;
  orderNumber: string;
  paymentMethod: 'COD';
  /** Rupees. */
  amount: number;
}

/** `data` from createorder when paymentMethod was Razorpay. */
export interface RazorpayOrderCreated {
  orderId: number;
  orderNumber: string;
  paymentMethod: 'Razorpay';
  razorpayOrderId: string;
  /** Rupees — matches the COD field above. */
  amount: number;
  /** Paise — what Checkout.js expects. */
  amountInPaise: number;
  currency: string;
  /** Public key, handed over by the server so it lives in exactly one place. */
  keyId: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
}

export interface VerifyPaymentRequest {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/** What Checkout.js hands back on a successful payment. */
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: { order_id: string; payment_id: string };
  };
}
