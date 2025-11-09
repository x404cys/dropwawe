export async function subscribePlan(type: string) {
  try {
    const res = await fetch(`/api/plans/subscriptions/upgrade/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to subscribe');
    }

    return data;
  } catch (error: any) {
    console.error('Subscription error:', error.message);
    throw error;
  }
}
