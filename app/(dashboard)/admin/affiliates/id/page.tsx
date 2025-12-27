'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Link2,
  CheckCircle,
  XCircle,
  Ban,
  Copy,
  Check,
} from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  referralCode: string;
  status: string;
  wallet: number;
  totalCommissions: number;
  pendingCommissions: number;
  createdAt: string;
  lastLoginAt: string | null;
  referrals: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
    status: string;
  }>;
  commissions: Array<{
    id: string;
    amount: number;
    orderTotal: number;
    status: string;
    createdAt: string;
    order: {
      orderNumber: string;
    };
  }>;
}

export default function AffiliateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const affiliateId = params.id as string;

  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (affiliateId) {
      fetchAffiliateDetail();
    }
  }, [affiliateId]);

  const fetchAffiliateDetail = async () => {
    try {
      const response = await fetch(`/api/affiliates/${affiliateId}`);
      if (response.ok) {
        const data = await response.json();
        setAffiliate(data.affiliate);
      }
    } catch (error) {
      console.error('Error fetching affiliate detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${affiliate?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApprove = async () => {
    if (!confirm('¿Aprobar este afiliado?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/affiliates/approve/${affiliateId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Afiliado aprobado exitosamente');
        fetchAffiliateDetail();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStatus = async () => {
    if (!affiliate) return;

    const newStatus = affiliate.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!confirm(`¿${newStatus === 'ACTIVE' ? 'Activar' : 'Desactivar'} este afiliado?`))
      return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/affiliates/${affiliateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchAffiliateDetail();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
      INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      BANNED: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status as keyof typeof colors] || colors.INACTIVE;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Afiliado no encontrado</p>
        <Link
          href="/admin/affiliates"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          Volver a afiliados
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
            href="/admin/affiliates"
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Detalle del Afiliado</h1>
            <p className="text-gray-400 mt-1">ID: {affiliate.id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <span
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(
              affiliate.status
            )}`}
          >
            {affiliate.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Info Card */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                {affiliate.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{affiliate.name}</h2>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{affiliate.email}</span>
                  </div>
                  {affiliate.phone && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{affiliate.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Registro: {new Date(affiliate.createdAt).toLocaleDateString('es-PE')}
                    </span>
                  </div>
                  {affiliate.lastLoginAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Último acceso:{' '}
                        {new Date(affiliate.lastLoginAt).toLocaleDateString('es-PE')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Código de Referido</h3>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-3">
              <p className="text-white text-3xl font-bold text-center tracking-wider">
                {affiliate.referralCode}
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={`${window.location.origin}/register?ref=${affiliate.referralCode}`}
                readOnly
                className="flex-1 px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-white text-sm"
              />
              <button
                onClick={copyReferralLink}
                className="px-4 py-2 bg-white hover:bg-white/90 text-purple-600 rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Referrals List */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Referidos ({affiliate.referrals.length})
            </h3>
            {affiliate.referrals.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Este afiliado aún no tiene referidos
              </p>
            ) : (
              <div className="space-y-3">
                {affiliate.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between bg-slate-700 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{referral.name}</p>
                      <p className="text-sm text-gray-400">{referral.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(referral.createdAt).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        referral.status
                      )}`}
                    >
                      {referral.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commissions History */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Historial de Comisiones
            </h3>
            {affiliate.commissions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No hay comisiones registradas
              </p>
            ) : (
              <div className="space-y-3">
                {affiliate.commissions.map((commission) => (
                  <div
                    key={commission.id}
                    className="flex items-center justify-between bg-slate-700 rounded-xl p-4"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        Pedido #{commission.order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        Monto del pedido: ${commission.orderTotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(commission.createdAt).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        ${commission.amount.toFixed(2)}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          commission.status === 'PAID'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {commission.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats & Actions */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Billetera</span>
              </div>
              <p className="text-3xl font-bold text-green-400">
                ${affiliate.wallet.toFixed(2)}
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Comisiones Totales</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">
                ${affiliate.totalCommissions.toFixed(2)}
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Total Referidos</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {affiliate.referrals.length}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Acciones</h3>
            <div className="space-y-3">
              {affiliate.status === 'PENDING' && (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aprobar Afiliado
                </button>
              )}

              <button
                onClick={toggleStatus}
                disabled={actionLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-colors ${
                  affiliate.status === 'ACTIVE'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {affiliate.status === 'ACTIVE' ? (
                  <>
                    <Ban className="w-5 h-5" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Activar
                  </>
                )}
              </button>

              <Link
                href={`/admin/users/${affiliate.id}`}
                className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Ver como Usuario
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}