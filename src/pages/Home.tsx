import { useEffect, useState } from 'react';
import { Product } from '../types';
import { getProducts } from '../lib/mockData';
import { ProductCard } from '../components/ui/ProductCard';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Get a lot of products
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Group products by category
  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary-600 relative overflow-hidden flex items-center px-4 md:px-12 py-16 text-white text-center md:text-left h-[400px]">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
              EXPLORA EL PLACER
            </h1>
            <p className="text-primary-100 mb-8 font-medium max-w-lg text-lg">
              Descubre miles de juguetes sexuales, lencería y artículos de farmacia. 
              Disfruta de ofertas exclusivas hoy mismo.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-white text-primary-600 px-8 py-3 font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors rounded-sm shadow-md">
                Ver Favoritos
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm">
                Nuevas Llegadas
              </button>
            </div>
          </div>
          
          <div className="hidden md:block w-72 h-72 rounded-full border-8 border-primary-500 bg-primary-700 items-center justify-center relative translate-x-12 opacity-80">
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black opacity-50 rotate-12">+2000</div>
          </div>
        </div>
      </section>

      {/* Categories loop */}
      <div className="flex-1 w-full pb-20">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-200 h-64 border border-slate-300 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          categories.map(category => {
            const categoryProducts = products.filter(p => p.category === category).slice(0, 8);
            if (categoryProducts.length === 0) return null;
            
            return (
              <section key={category} className="max-w-7xl mx-auto px-4 sm:px-8 pt-16">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter">
                    {category}
                  </h2>
                  <a href={`/catalog?category=${encodeURIComponent(category)}`} className="text-sm font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest flex items-center gap-2">
                    Ver todos
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </a>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                  {categoryProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
      
      {/* Newsletter */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black text-primary-900 mb-4 tracking-tighter">¿Quieres un descuento?</h2>
          <p className="text-primary-700 mb-8 max-w-xl mx-auto font-medium">Apúntate a nuestra newsletter y llévate un 15% de descuento en tu primer pedido.</p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto shadow-xl rounded-full overflow-hidden">
            <input 
              type="email" 
              placeholder="E-MAIL" 
              className="flex-1 px-6 py-4 bg-white border-none text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold uppercase tracking-widest text-sm transition-colors">
              Suscribir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
