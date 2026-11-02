import { ChargeRequest, ChargeResult } from "./types.js";

export interface Receipt {
  transactionId: string;
  amount: number;
  customerId: string;
  timestamp: Date;
}

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 100;

/**
 * Charges a card for the given amount.
 * Retries up to 3 times with exponential backoff on network failures.
 * See postmortems/2026-03-payment-outage.md for why this retry logic exists.
 */
export async function chargeCard(request: ChargeRequest): Promise<ChargeResult> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    // Simulate card network call
    const networkSuccess = Math.random() > 0.1;

    if (networkSuccess) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return {
        success: true,
        transactionId,
      };
    }

    lastError = "Card network unavailable";

    // Don't wait after the last attempt
    if (attempt < MAX_RETRIES) {
      const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { success: false, error: lastError };
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
