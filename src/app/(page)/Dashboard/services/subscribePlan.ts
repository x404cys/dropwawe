export async function subscribePlan(type: string) {
  if (type == 'trader-basic') {
    try {
      const res = await fetch(`/api/plans/free-trader-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
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
     throw error;
  }
}
