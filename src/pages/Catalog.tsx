import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../lib/mockData';
import { ProductCard } from '../components/ui/ProductCard';

export function Catalog() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts();
        
        let filtered = data;
        
        if (categoryParam) {
          filtered = filtered.filter((p: any) => p.category === categoryParam);
        }
        
        if (queryParam) {
          const q = queryParam.toLowerCase();
          filtered = filtered.filter((p: any) => 
            p.name.toLowerCase().includes(q) || 
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryParam, queryParam]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="mb-10">
          {/* Breadcrumb / Title */}
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Link to="/" className="hover:text-primary-600">Inicio</Link>
            <span>/</span>
            {categoryParam ? (
              <span className="text-primary-600">{categoryParam}</span>
            ) : queryParam ? (
              <span className="text-primary-600">Resultados para "{queryParam}"</span>
            ) : (
              <span className="text-primary-600">Todos los productos</span>
            )}
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
            {categoryParam || (queryParam ? `Búsqueda: ${queryParam}` : 'Catálogo')}
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Mostrando {products.length} productos
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-slate-200 h-64 border border-slate-300 rounded"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron productos.</h3>
            <p className="text-slate-500 mb-6">Modifica tu búsqueda o vuelve a inicio.</p>
            <Link to="/" className="inline-block bg-primary-600 text-white font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-full hover:bg-primary-500 transition-colors">Volver al inicio</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
