const LIFETIME_SUBSCRIPTION_YEARS = 100;

export function isLifetimeSubscription(planType?: string | null, durationDays?: number | null) {
  return planType === 'trader-basic' || (durationDays ?? 0) <= 0;
}

export function buildSubscriptionEndDate(
  startDate: Date,
  durationDays: number,
  planType?: string | null
) {
  const endDate = new Date(startDate);

  if (isLifetimeSubscription(planType, durationDays)) {
    endDate.setFullYear(endDate.getFullYear() + LIFETIME_SUBSCRIPTION_YEARS);
    return endDate;
  }

  endDate.setDate(endDate.getDate() + durationDays);
  return endDate;
}
