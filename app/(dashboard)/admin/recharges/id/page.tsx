'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  X,
  User,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  Clock,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface Recharge {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    wallet: number;
  };
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  paymentProof: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function RechargeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rechargeId = params.id as string;

  const [recharge, setRecharge] = useState<Recharge | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (rechargeId) {
      fetchRechargeDetail();
    }
  }, [rechargeId]);

  const fetchRechargeDetail = async () => {
    try {
      const response = await fetch(`/api/recharges/${rechargeId}`);
      if (response.ok) {
        const data = await response.json();
        setRecharge(data.recharge);
      }
    } catch (error) {
      console.error('Error fetching recharge detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('¿Estás seguro de aprobar esta recarga?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/recharges/approve/${rechargeId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Recarga aprobada exitosamente');
        router.push('/admin/recharges');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al aprobar la recarga');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aprobar la recarga');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Por favor ingresa una razón para rechazar');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/recharges/reject/${rechargeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (response.ok) {
        alert('Recarga rechazada');
        router.push('/admin/recharges');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al rechazar la recarga');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al rechazar la recarga');
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      APPROVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
      CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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

  if (!recharge) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Recarga no encontrada</p>
        <Link
          href="/admin/recharges"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          Volver a recargas
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
            href="/admin/recharges"
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Detalle de Recarga</h1>
            <p className="text-gray-400 mt-1">ID: {recharge.id}</p>
          </div>
        </div>

        <div>
          <span
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(
              recharge.status
            )}`}
          >
            {recharge.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-8 h-8" />
              <h3 className="text-xl font-semibold">Monto de Recarga</h3>
            </div>
            <p className="text-5xl font-bold">${recharge.amount.toFixed(2)}</p>
          </div>

          {/* User Info */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Información del Usuario
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Nombre</p>
                  <p className="text-white font-semibold">{recharge.user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-semibold">{recharge.user.email}</p>
                </div>
              </div>
              {recharge.user.phone && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="text-white font-semibold">{recharge.user.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Billetera Actual</p>
                  <p className="text-green-400 font-bold text-xl">
                    ${recharge.user.wallet.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Información de Pago
            </h3>
            <div className="space-y-3">
              {recharge.paymentMethod && (
                <div>
                  <p className="text-sm text-gray-400">Método de Pago</p>
                  <p className="text-white font-semibold">{recharge.paymentMethod}</p>
                </div>
              )}
              {recharge.paymentReference && (
                <div>
                  <p className="text-sm text-gray-400">Referencia</p>
                  <p className="text-white font-semibold">{recharge.paymentReference}</p>
                </div>
              )}
              {recharge.paymentProof && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Comprobante de Pago</p>
                  <a
                    href={recharge.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Ver comprobante
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Reason */}
          {recharge.status === 'REJECTED' && recharge.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                Razón de Rechazo
              </h3>
              <p className="text-gray-300">{recharge.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Right Column - Actions & Timeline */}
        <div className="space-y-6">
          {/* Actions */}
          {recharge.status === 'PENDING' && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Acciones</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5" />
                  Aprobar Recarga
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                  Rechazar
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              Cronología
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-white font-semibold">Solicitud Creada</p>
                  <p className="text-sm text-gray-400">
                    {new Date(recharge.createdAt).toLocaleString('es-PE')}
                  </p>
                </div>
              </div>

              {recharge.approvedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-semibold">Aprobada</p>
                    <p className="text-sm text-gray-400">
                      {new Date(recharge.approvedAt).toLocaleString('es-PE')}
                    </p>
                  </div>
                </div>
              )}

              {recharge.rejectedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white font-semibold">Rechazada</p>
                    <p className="text-sm text-gray-400">
                      {new Date(recharge.rejectedAt).toLocaleString('es-PE')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link
                href={`/admin/users/${recharge.user.id}`}
                className="block w-full text-left px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Ver Usuario
              </Link>
              <Link
                href="/admin/recharges"
                className="block w-full text-left px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Volver a Recargas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Rechazar Recarga</h3>
            <p className="text-gray-300 mb-4">
              Por favor, ingresa la razón por la cual estás rechazando esta recarga:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              placeholder="Ej: Comprobante de pago inválido..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}