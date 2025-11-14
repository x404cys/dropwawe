export const dynamic = 'force-dynamic';

export default function PaymentResultPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  console.log('Callback Received:', searchParams);

  const tranRef = searchParams.tranRef ?? null;
  const cartId = searchParams.cartId ?? null;
  const respStatus = searchParams.respStatus ?? null;
  const respMessage = searchParams.respMessage ?? null;

  return (
    <div className="p-10">
      <h1 className="mb-6 text-2xl font-bold">Payment Result</h1>

      <pre className="rounded bg-gray-200 p-4">{JSON.stringify(searchParams, null, 2)}</pre>

      {!tranRef && (
        <p className="mt-6 text-xl text-red-600">
          ❌ لا توجد بيانات دفع. PayTabs لم يُرسل أي معلومات.
        </p>
      )}
    </div>
  );
}
