export async function subscribePlan(type: string) {
  try {
    const res = await fetch(`/api/storev2/payment/paytabs/plans/subscriptions/upgrade/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: type,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to subscribe');
    }

    return data;
  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
}
