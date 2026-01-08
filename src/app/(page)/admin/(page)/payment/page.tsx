'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Clock, ChevronDown } from 'lucide-react';

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

function StatusBadge({ status }: { status: 'SUCCESS' | 'FAILED' | 'PENDING' }) {
  const config = {
    SUCCESS: {
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Success',
    },
    FAILED: {
      icon: XCircle,
      className: 'bg-red-50 text-red-700 border-red-200',
      label: 'Failed',
    },
    PENDING: {
      icon: Clock,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Pending',
    },
  };

  const current = config[status] ?? {
    icon: Clock,
    className: 'bg-gray-50 text-gray-600 border-gray-200',
    label: 'Unknown',
  };

  const { icon: Icon, className, label } = current;

  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

function PaymentCard({ payment }: { payment: Payment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:bg-muted/50 w-full p-4 text-left transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {payment.amount.toLocaleString()} IQD
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {new Date(payment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={payment.status} />
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </button>

        {expanded && (
          <div className="bg-muted/20 space-y-2 border-t px-4 pt-2 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs">{payment.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cart ID:</span>
              <span className="font-mono text-xs">{payment.cartId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="text-xs">{new Date(payment.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentOrderCard({ paymentOrder }: { paymentOrder: PaymentOrder }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:bg-muted/50 w-full p-4 text-left transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {paymentOrder.amount.toLocaleString()} IQD
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {paymentOrder.order?.user?.name || paymentOrder.customerEmail || 'No customer'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={paymentOrder.status} />
              <ChevronDown
                className={`text-muted-foreground h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </button>

        {expanded && (
          <div className="bg-muted/20 space-y-2 border-t px-4 pt-2 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-mono text-xs">{paymentOrder.orderId}</span>
            </div>
            {paymentOrder.tranRef && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction:</span>
                <span className="font-mono text-xs">{paymentOrder.tranRef}</span>
              </div>
            )}
            {paymentOrder.respMessage && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Message:</span>
                <span className="text-xs">{paymentOrder.respMessage}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-xs">{new Date(paymentOrder.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PaymentPage() {
  const [showTable, setShowTable] = useState<'payment' | 'paymentOrder'>('payment');
  const { data, isLoading } = useSWR('/api/storev2/payment/latest', fetcher);

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { payment, paymentOrder } = data;
  const activeData = showTable === 'payment' ? payment : paymentOrder;

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-foreground text-2xl font-semibold text-balance">
            Payment Transactions
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">View and manage all payment records</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-muted mb-8 inline-flex rounded-lg p-1">
          <button
            onClick={() => setShowTable('payment')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              showTable === 'payment'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Store Payments
          </button>
          <button
            onClick={() => setShowTable('paymentOrder')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              showTable === 'paymentOrder'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Order Payments
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Total</div>
              <div className="mt-1 text-2xl font-semibold">{activeData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Successful</div>
              <div className="mt-1 text-2xl font-semibold text-emerald-600">
                {activeData.filter(item => item.status === 'SUCCESS').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Failed</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">
                {activeData.filter(item => item.status === 'FAILED').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {activeData.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground text-sm">No payment transactions found</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {showTable === 'payment' && payment.map(p => <PaymentCard key={p.id} payment={p} />)}
            {showTable === 'paymentOrder' &&
              paymentOrder.map(po => <PaymentOrderCard key={po.id} paymentOrder={po} />)}
          </div>
        )}
      </div>
    </div>
  );
}
