import { prisma } from '@/app/lib/db';
import { redirect } from 'next/navigation';

export default async function PaymentCallbackPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { cart_id?: string; respStatus?: string };
}) {
  const cartId = searchParams.cart_id;

  if (!cartId) redirect(`/pay/${params.id}?error=1`);

  const submission = await prisma.paymentLinkSubmission.findUnique({
    where: { cartId },
  });

  if (!submission) redirect(`/pay/${params.id}?error=1`);

  const isSuccess =
    submission.status === 'PAID' ||
    searchParams.respStatus === 'A' ||
    searchParams.respStatus === 'H';

  if (isSuccess && submission.status !== 'PAID') {
    await prisma.paymentLinkSubmission.update({
      where: { cartId },
      data: { status: 'PAID' },
    });
  }

  redirect(`/pay/${params.id}?status=${isSuccess ? 'success' : 'failed'}&cart=${cartId}`);
}
