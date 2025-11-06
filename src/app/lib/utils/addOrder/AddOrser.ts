export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export const createOrder = async (userId: string, items: OrderItem[]) =>
  fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, items }),
  }).then(res => {
    if (!res.ok) throw new Error('فشل في إنشاء الطلب');
    return res.json();
  });
