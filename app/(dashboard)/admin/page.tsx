'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalSales: number;
  pendingRecharges: number;
  totalOrders: number;
  activeAffiliates: number;
  todaySales: number;
  monthSales: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    pendingRecharges: 0,
    totalOrders: 0,
    activeAffiliates: 0,
    todaySales: 0,
    monthSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/stats/admin');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Usuarios Totales',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-blue-100',
      link: '/admin/users',
    },
    {
      title: 'Productos',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-purple-500 to-purple-700',
      textColor: 'text-purple-100',
      link: '/admin/products',
    },
    {
      title: 'Ventas Totales',
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-700',
      textColor: 'text-green-100',
      link: '/admin/orders',
    },
    {
      title: 'Recargas Pendientes',
      value: stats.pendingRecharges,
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-700',
      textColor: 'text-orange-100',
      link: '/admin/recharges',
      badge: stats.pendingRecharges > 0,
    },
    {
      title: 'Pedidos Totales',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'from-pink-500 to-pink-700',
      textColor: 'text-pink-100',
      link: '/admin/orders',
    },
    {
      title: 'Afiliados Activos',
      value: stats.activeAffiliates,
      icon: TrendingUp,
      color: 'from-indigo-500 to-indigo-700',
      textColor: 'text-indigo-100',
      link: '/admin/affiliates',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'PROCESSING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CANCELLED':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'PROCESSING':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-400">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-200 shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`${stat.textColor} text-sm font-medium`}>
                  {stat.title}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="relative">
                <stat.icon className="w-12 h-12 opacity-80" />
                {stat.badge && stat.value > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {stat.value}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">
            Ventas de Hoy
          </h3>
          <p className="text-4xl font-bold text-green-400">
            ${stats.todaySales.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Actualizado en tiempo real
          </p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">
            Ventas del Mes
          </h3>
          <p className="text-4xl font-bold text-purple-400">
            ${stats.monthSales.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Total del mes actual
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Pedidos Recientes
          </h3>
          <Link
            href="/admin/orders"
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay pedidos recientes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-slate-700/50 hover:bg-slate-700 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-semibold">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {order.user.name} • {order.user.email}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString('es-PE', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-4 text-center transition-colors"
          >
            <Package className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Nuevo Producto</p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center transition-colors"
          >
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Ver Usuarios</p>
          </Link>
          <Link
            href="/admin/recharges"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-4 text-center transition-colors relative"
          >
            {stats.pendingRecharges > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {stats.pendingRecharges}
              </span>
            )}
            <DollarSign className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Recargas</p>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 text-center transition-colors"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Reportes</p>
          </Link>
        </div>
      </div>
    </div>
  );
}