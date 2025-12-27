// ============================================
// app/(dashboard)/admin/orders/[id]/page.tsx
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => setOrder(data.order));
  }, [params.id]);

  if (!order) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 bg-slate-700 rounded-xl">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Pedido #{order.orderNumber}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Items del Pedido</h3>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center bg-slate-700 rounded-xl p-4">
                <div>
                  <p className="font-semibold text-white">{item.productName}</p>
                  <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                </div>
                <span className="text-green-400 font-bold">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Resumen</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Descuento:</span>
                <span>${order.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-green-400 pt-2 border-t border-slate-700">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Cliente</h3>
            <p className="text-white">{order.user.name}</p>
            <p className="text-gray-400 text-sm">{order.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}