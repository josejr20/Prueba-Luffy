'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data.product));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      router.push('/admin/products');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-slate-700 rounded-xl">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-3xl font-bold text-white">Editar Producto</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre"
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
          />
          <input
            type="text"
            value={formData.provider || ''}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            placeholder="Proveedor"
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
          />
          <input
            type="number"
            value={formData.priceUSD || ''}
            onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) })}
            placeholder="Precio USD"
            step="0.01"
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
          />
          <input
            type="number"
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            placeholder="Stock"
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  );
}