'use client';
import { useState, useEffect } from 'react';

export default function PaymentResult() {
  const [params, setParams] = useState({
    status: '',
    message: '',
    tranRef: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setParams({
      status: searchParams.get('respStatus') || '',
      message: searchParams.get('respMessage') || '',
      tranRef: searchParams.get('tranRef') || '',
    });
  }, []);

  return (
    <div className="p-10">
      <h1>Payment Result</h1>
      <p>Status: {params.status}</p>
      <p>Message: {params.message}</p>
      <p>Reference: {params.tranRef}</p>
    </div>
  );
}
