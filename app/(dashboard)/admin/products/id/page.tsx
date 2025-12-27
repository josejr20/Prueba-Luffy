// ============================================
// app/(dashboard)/admin/products/[id]/page.tsx
// ============================================
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.product))
      .finally(() => setLoading(false));
  }, [params.id]);

  const deleteProduct = async () => {
    if (confirm('¿Eliminar este producto?')) {
      await fetch(`/api/products/${params.id}`, { method: 'DELETE' });
      router.push('/admin/products');
    }
  };

  if (loading || !product) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-slate-700 rounded-xl">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
          >
            <Edit className="w-4 h-4" />
            Editar
          </Link>
          <button
            onClick={deleteProduct}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="relative h-64 mb-6">
            <Image
              src={product.image || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
          <p className="text-gray-300">{product.description}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Proveedor:</span>
                <span className="text-white font-semibold">{product.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stock:</span>
                <span className="text-green-400 font-semibold">{product.stock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vendidos:</span>
                <span className="text-blue-400 font-semibold">{product.sold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Categoría:</span>
                <span className="text-white">{product.category}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Precios</h3>
            <div className="space-y-2">
              <div>
                <p className="text-gray-400 text-sm">Precio USD</p>
                <p className="text-2xl font-bold text-green-400">${product.priceUSD}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Precio PEN</p>
                <p className="text-xl font-bold text-green-400">S/ {product.pricePEN}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}