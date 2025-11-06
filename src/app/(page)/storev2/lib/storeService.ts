export async function getStoreBysubLink(subLink: string) {
  const res = await fetch(`/api/storev2/info/${subLink}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}
