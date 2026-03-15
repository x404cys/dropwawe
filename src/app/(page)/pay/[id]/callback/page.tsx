import { prisma } from '@/app/lib/db';
import { redirect } from 'next/navigation';

export default async function PaymentCallbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ cartId?: string; respStatus?: string }>;
}) {
  const { id } = await params;
  const { cartId: cartId, respStatus } = await searchParams;

  if (!cartId) redirect(`/pay/${id}?error=1`);

  const submission = await prisma.paymentLinkSubmission.findUnique({
    where: { cartId },
  });

  if (!submission) redirect(`/pay/${id}?error=1`);

  const isSuccess = submission.status === 'PAID' || respStatus === 'A' || respStatus === 'H';

  if (isSuccess && submission.status !== 'PAID') {
    await prisma.paymentLinkSubmission.update({
      where: { cartId },
      data: { status: 'PAID' },
    });
  }

  redirect(`/pay/${id}?status=${isSuccess ? 'success' : 'failed'}&cart=${cartId}`);
}
