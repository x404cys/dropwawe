import { prisma } from '@/app/lib/db';

interface Props {
  params: { orderId: string };
}

export default async function OrderDetailsPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) return <div>الطلب غير موجود</div>;

  return (
    <div>
      <h1>تفاصيل الطلب</h1>

      <p>الاسم: {order.fullName}</p>
      <p>الهاتف: {order.phone}</p>
      <p>الموقع: {order.location}</p>
      <p>المجموع: {order.total}</p>

      <h2>المنتجات</h2>

      {order.items.map(item => (
        <div key={item.id}>
          {item.product?.name} × {item.quantity}
        </div>
      ))}
    </div>
  );
}
