'use client';

import { useEffect, useState } from 'react';
import { Check, X, Clock, Eye } from 'lucide-react';

interface Recharge {
  id: string;
  user: { name: string; email: string };
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function RechargesPage() {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const response = await fetch('/api/recharges');
      if (response.ok) {
        const data = await response.json();
        setRecharges(data.recharges);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/recharges/${action}/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchRecharges();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredRecharges = recharges.filter((r) => filter === 'ALL' || r.status === filter);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status as keyof typeof colors];
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
          <h1 className="text-3xl font-bold text-white">Recargas de Billetera</h1>
          <p className="text-gray-400">
            Pendientes: {recharges.filter((r) => r.status === 'PENDING').length}
          </p>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              filter === status
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredRecharges.map((recharge) => (
          <div
            key={recharge.id}
            className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{recharge.user.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      recharge.status
                    )}`}
                  >
                    {recharge.status}
                  </span>
                </div>
                <p className="text-gray-400">{recharge.user.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(recharge.createdAt).toLocaleString('es-PE')}
                </p>
                {recharge.paymentMethod && (
                  <p className="text-sm text-gray-400 mt-1">
                    Método: {recharge.paymentMethod}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-green-400">
                  ${recharge.amount.toFixed(2)}
                </p>
              </div>
            </div>

            {recharge.status === 'PENDING' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleRecharge(recharge.id, 'approve')}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  <Check className="w-5 h-5" />
                  Aprobar Recarga
                </button>
                <button
                  onClick={() => handleRecharge(recharge.id, 'reject')}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  <X className="w-5 h-5" />
                  Rechazar
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredRecharges.length === 0 && (
          <div className="text-center py-12 bg-slate-800 rounded-2xl border border-slate-700">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay recargas {filter.toLowerCase()}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Total Recargas</p>
          <p className="text-2xl font-bold text-white mt-1">{recharges.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Monto Total</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            ${recharges
              .filter((r) => r.status === 'APPROVED')
              .reduce((sum, r) => sum + r.amount, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-gray-400 text-sm">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {recharges.filter((r) => r.status === 'PENDING').length}
          </p>
        </div>
      </div>
    </div>
  );
}