import { PayTabsPayload, PayTabsResponse } from '../types/paytabs.types';
import { PAYTABS_SERVER_KEY, PAYTABS_ENDPOINT } from '../config/paytabs.config';

export const payTabsService = {
  createPaymentRequest: async (
    payload: PayTabsPayload
  ): Promise<PayTabsResponse & { ok: boolean }> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(PAYTABS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: PAYTABS_SERVER_KEY,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      return { ...data, ok: response.ok };
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Payment gateway timed out. Please try again.');
      }
      console.error('Failed to create PayTabs payment request:', error);
      throw error;
    }
  },
};
