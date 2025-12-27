// ============================================
// app/(dashboard)/admin/affiliates/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  status: string;
  totalCommissions: number;
  _count: { referrals: number };
  createdAt: string;
}

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/affiliates');
      if (response.ok) {
        const data = await response.json();
        setAffiliates(data.affiliates);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveAffiliate = async (id: string) => {
    try {
      const response = await fetch(`/api/affiliates/approve/${id}`, {
        method: 'PUT',
      });
      if (response.ok) fetchAffiliates();
    } catch (error) {
      console.error('Error:', error);
    }
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
      <div>
        <h1 className="text-3xl font-bold text-white">Gestión de Afiliados</h1>
        <p className="text-gray-400">Total: {affiliates.length} afiliados</p>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold">Afiliado</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Código</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Referidos</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Comisiones</th>
              <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
              <th className="px-6 py-4 text-center text-white font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="hover:bg-slate-700/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-white">{affiliate.name}</p>
                    <p className="text-sm text-gray-400">{affiliate.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-purple-400 font-semibold">
                    {affiliate.referralCode}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-400 font-semibold">
                  {affiliate._count.referrals}
                </td>
                <td className="px-6 py-4 text-green-400 font-semibold">
                  ${affiliate.totalCommissions.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      affiliate.status === 'ACTIVE'
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}
                  >
                    {affiliate.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {affiliate.status === 'PENDING' && (
                      <button
                        onClick={() => approveAffiliate(affiliate.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Aprobar
                      </button>
                    )}
                    <Link
                      href={`/admin/affiliates/${affiliate.id}`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <p className="text-gray-400 text-sm">Total Afiliados</p>
          </div>
          <p className="text-2xl font-bold text-white">{affiliates.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <p className="text-gray-400 text-sm">Total Referidos</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {affiliates.reduce((sum, a) => sum + a._count.referrals, 0)}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <p className="text-gray-400 text-sm">Comisiones Totales</p>
          </div>
          <p className="text-2xl font-bold text-green-400">
            ${affiliates.reduce((sum, a) => sum + a.totalCommissions, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}