export interface Customer {
  id: string;
  email: string;
  name: string;
}

export interface PaymentMethod {
  type: "card" | "bank_transfer";
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface ChargeRequest {
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
}

export interface ChargeResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}
