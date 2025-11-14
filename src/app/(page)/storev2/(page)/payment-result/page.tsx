export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  console.log('Callback Received:', params);

  const tranRef = params.tranRef ?? null;
  const cartId = params.cartId ?? null;
  const respStatus = params.respStatus ?? null;
  const respMessage = params.respMessage ?? null;

  return (
    <div className="p-10">
      <h1 className="mb-6 text-2xl font-bold">Payment Result</h1>

      <pre className="rounded bg-gray-200 p-4">{JSON.stringify(params, null, 2)}</pre>

      {!tranRef && (
        <p className="mt-6 text-xl text-red-600">
          ❌ لا توجد بيانات دفع. PayTabs لم يُرسل أي معلومات.
        </p>
      )}
    </div>
  );
}
