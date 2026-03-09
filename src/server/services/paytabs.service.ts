import { PayTabsPayload, PayTabsResponse } from '../types/paytabs.types';
import { PAYTABS_SERVER_KEY, PAYTABS_ENDPOINT } from '../config/paytabs.config';

export const payTabsService = {
  createPaymentRequest: async (
    payload: PayTabsPayload
  ): Promise<PayTabsResponse & { ok: boolean }> => {
    try {
      const response = await fetch(PAYTABS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: PAYTABS_SERVER_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return { ...data, ok: response.ok };
    } catch (error) {
      console.error('Failed to create PayTabs payment request:', error);
      throw error;
    }
  },
};
