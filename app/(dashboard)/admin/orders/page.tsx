'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Download, Filter } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  user: { name: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  _count: { items: number };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      PROCESSING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Pedidos</h1>
          <p className="text-gray-400">Total: {filteredOrders.length} pedidos</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de orden o usuario..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="PROCESSING">Procesando</option>
            <option value="COMPLETED">Completado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Pedido</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Cliente</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Items</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Fecha</th>
                <th className="px-6 py-4 text-center text-white font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-purple-400">#{order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{order.user.name}</p>
                      <p className="text-sm text-gray-400">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{order._count.items}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 font-semibold text-lg">
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((status) => (
          <div key={status} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-gray-400 text-sm">{status}</p>
            <p className="text-2xl font-bold text-white mt-1">
              {orders.filter((o) => o.status === status).length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}