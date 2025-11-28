'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

type Payment = {
  id: string;
  cartId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  createdAt: string;
};

type User = {
  name: string | null;
  email: string | null;
};

type Order = {
  user?: User | null;
};

type PaymentOrder = {
  id: string;
  orderId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  tranRef?: string | null;
  respCode?: string | null;
  respMessage?: string | null;
  customerEmail?: string | null;
  order?: Order | null;
  createdAt: string;
};

type PaymentResponse = {
  payment: Payment[];
  paymentOrder: PaymentOrder[];
};

const fetcher = (url: string): Promise<PaymentResponse> => fetch(url).then(res => res.json());

export default function PaymentPage() {
  const [showTable, setShowTable] = useState<'payment' | 'paymentOrder'>('payment');
  const { data, isLoading } = useSWR('/api/storev2/payment/latest', fetcher);

  if (isLoading || !data) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      </div>
    );
  }

  const { payment, paymentOrder } = data;

  return (
    <div className="space-y-10 p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">عمليات الدفع</h1>

      <div className="mb-6 flex flex-wrap gap-2 md:gap-4">
        <button
          onClick={() => setShowTable('payment')}
          className={`rounded-lg px-4 py-2 text-sm font-medium md:text-base ${
            showTable === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          عمليات الدفع العامة
        </button>

        <button
          onClick={() => setShowTable('paymentOrder')}
          className={`rounded-lg px-4 py-2 text-sm font-medium md:text-base ${
            showTable === 'paymentOrder' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          عمليات الدفع للطلبات
        </button>
      </div>

      {showTable === 'payment' && (
        <>
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold text-gray-800">
                  Payments (من نظام المتجر)
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table className="min-w-[500px] md:min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cart ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {payment.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-6 text-center text-gray-500">
                          لا توجد عمليات دفع
                        </TableCell>
                      </TableRow>
                    )}

                    {payment.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.id}</TableCell>
                        <TableCell>{p.cartId}</TableCell>
                        <TableCell>{p.amount} IQD</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              p.status === 'SUCCESS'
                                ? 'border-green-600 text-green-700'
                                : p.status === 'FAILED'
                                  ? 'border-red-600 text-red-700'
                                  : 'border-gray-600 text-gray-700'
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {showTable === 'paymentOrder' && (
        <>
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold text-gray-800">
                  Payment Orders (تفاصيل الدفع للطلبات)
                </CardTitle>
              </CardHeader>

              <CardContent className="overflow-x-scroll">
                <Table className="min-w-[700px] md:min-w-[400px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>TranRef</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>RespCode</TableHead>
                      <TableHead>RespMessage</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paymentOrder.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={10} className="py-6 text-center text-gray-500">
                          لا توجد عمليات دفع للطلبات
                        </TableCell>
                      </TableRow>
                    )}

                    {paymentOrder.map(po => (
                      <TableRow key={po.id}>
                        <TableCell>{po.id}</TableCell>
                        <TableCell>{po.orderId}</TableCell>
                        <TableCell>{po.order?.user?.name || '—'}</TableCell>
                        <TableCell>{po.customerEmail || po.order?.user?.email || '—'}</TableCell>
                        <TableCell>{po.amount} IQD</TableCell>
                        <TableCell>{po.tranRef || '—'}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              po.status === 'SUCCESS'
                                ? 'border-green-600 text-green-700'
                                : po.status === 'FAILED'
                                  ? 'border-red-600 text-red-700'
                                  : 'border-gray-600 text-gray-700'
                            }
                          >
                            {po.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{po.respCode || '—'}</TableCell>
                        <TableCell>{po.respMessage || '—'}</TableCell>
                        <TableCell>{new Date(po.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
