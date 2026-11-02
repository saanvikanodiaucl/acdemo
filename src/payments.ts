import { ChargeRequest, ChargeResult } from "./types.js";

export interface Receipt {
  transactionId: string;
  amount: number;
  customerId: string;
  timestamp: Date;
}

/**
 * Charges a card for the given amount.
 */
export async function chargeCard(request: ChargeRequest): Promise<ChargeResult> {
  // Simulate card network call
  const networkSuccess = Math.random() > 0.1;

  if (!networkSuccess) {
    return { success: false, error: "Card network unavailable" };
  }

  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    success: true,
    transactionId,
  };
}

export function createReceipt(
  transactionId: string,
  amount: number,
  customerId: string
): Receipt {
  return {
    transactionId,
    amount,
    customerId,
    timestamp: new Date(),
  };
}
