import { chargeCard, createReceipt, Receipt } from "./payments.js";
import { ChargeRequest, Customer, PaymentMethod } from "./types.js";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutResult {
  success: boolean;
  receipt?: Receipt;
  error?: string;
}

export async function checkout(
  customer: Customer,
  items: CartItem[],
  paymentMethod: PaymentMethod
): Promise<CheckoutResult> {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (total <= 0) {
    return { success: false, error: "Cart is empty" };
  }

  const chargeRequest: ChargeRequest = {
    customerId: customer.id,
    amount: total,
    paymentMethod,
    description: `Order: ${items.map((i) => i.name).join(", ")}`,
  };

  const result = await chargeCard(chargeRequest);

  if (!result.success || !result.transactionId) {
    return { success: false, error: result.error || "Payment failed" };
  }

  const receipt = createReceipt(result.transactionId, total, customer.id);

  return { success: true, receipt };
}
