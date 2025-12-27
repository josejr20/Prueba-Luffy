/ ============================================
// app/(dashboard)/admin/reports/page.tsx
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Package, DollarSign, Download } from 'lucide-react';

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    salesByMonth: [] as { month: string; amount: number }[],
    topProducts: [] as { name: string; sold: number }[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/stats/admin');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reportes y Estadísticas</h1>
          <p className="text-gray-400">Análisis detallado del sistema</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white">
          <DollarSign className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-green-100 text-sm">Ventas Totales</p>
          <p className="text-3xl font-bold mt-2">${stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
          <Package className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-blue-100 text-sm">Pedidos</p>
          <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
          <Users className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-purple-100 text-sm">Usuarios</p>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-6 text-white">
          <TrendingUp className="w-12 h-12 mb-4 opacity-80" />
          <p className="text-pink-100 text-sm">Productos</p>
          <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {stats.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-700 rounded-xl p-4">
                <div>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.sold} vendidos</p>
                </div>
                <span className="text-2xl font-bold text-green-400">#{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Ventas por Mes</h3>
          <div className="space-y-3">
            {stats.salesByMonth.map((item, idx) => (
              <div key={idx} className="bg-slate-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{item.month}</span>
                  <span className="text-xl font-bold text-green-400">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}