'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
} from 'lucide-react';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  wallet: number;
  referralCode: string | null;
  referredBy: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  emailVerified: string | null;
  _count: {
    orders: number;
    referrals: number;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching user detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async () => {
    if (!user) return;

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setUser({ ...user, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
      USER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      AFFILIATE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return styles[role as keyof typeof styles] || styles.USER;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
      INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      BANNED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return styles[status as keyof typeof styles] || styles.INACTIVE;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Usuario no encontrado</p>
        <Link
          href="/admin/users"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          Volver a usuarios
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Detalle del Usuario
            </h1>
            <p className="text-gray-400 mt-1">
              ID: {user.id}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleUserStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              user.status === 'ACTIVE'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {user.status === 'ACTIVE' ? (
              <>
                <Ban className="w-4 h-4" />
                Desactivar
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Activar
              </>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {user.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Registro: {new Date(user.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Último acceso: {new Date(user.lastLoginAt).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {user.role === 'AFFILIATE' && user.referralCode && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">
                Código de Referido
              </h3>
              <p className="text-2xl font-bold text-purple-400">
                {user.referralCode}
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-gray-400">Billetera</span>
            </div>
            <p className="text-3xl font-bold text-green-400">
              ${user.wallet.toFixed(2)}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Pedidos</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {user._count.orders}
            </p>
          </div>

          {user.role === 'AFFILIATE' && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Referidos</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">
                {user._count.referrals}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">
          Pedidos Recientes
        </h3>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No hay pedidos registrados
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block bg-slate-700/50 hover:bg-slate-700 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      #{order.orderNumber}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-xl">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={deleteUser}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}