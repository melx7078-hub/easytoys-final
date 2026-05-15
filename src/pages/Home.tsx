import { useEffect, useState } from 'react';
import { Product } from '../types';
import { getProducts } from '../lib/mockData';
import { ProductCard } from '../components/ui/ProductCard';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="h-auto md:h-[500px] bg-slate-900 relative overflow-hidden flex items-center px-4 md:px-12 py-16">
        <div className="relative z-10 max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <span className="text-primary-500 font-bold uppercase tracking-widest text-xs mb-4 block">
            Spring Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
            Elevate Your <br className="hidden md:block" />
            <span className="font-bold">Lifestyle.</span>
          </h1>
          <p className="text-slate-300 mb-10 leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
            Discover our curated selection of premium products designed to bring joy, style, and functionality to your everyday routine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-primary-600 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary-700 transition-colors">
              Shop New Arrivals
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors">
              View Bestsellers
            </button>
          </div>
        </div>
        {/* Geometric background element */}
        <div className="hidden md:flex absolute right-0 top-0 w-1/2 h-full bg-slate-800 items-center justify-center pointer-events-none">
          <div className="w-96 h-[30rem] border-8 border-slate-700 rotate-12 flex items-center justify-center">
             <div className="text-slate-600 uppercase font-black text-6xl -rotate-12 tracking-tighter">AURA</div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 flex-1 w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight">Featured Picks</h2>
            <p className="mt-2 text-sm uppercase tracking-widest font-bold text-slate-400">Hand-selected items we know you'll love.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-slate-200 h-64 border border-slate-300"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                featured={index === 0} // Make the first item larger
              />
            ))}
          </div>
        )}
      </section>
      
      {/* Footer Banner */}
      <section className="bg-slate-900 py-16 border-t-[12px] border-primary-600 mt-auto">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-white mb-4 uppercase tracking-widest">Ready to upgrade?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm uppercase tracking-widest">Join our newsletter to get 15% off your first order.</p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="flex-1 px-5 py-4 bg-slate-800 border-none text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-xs font-bold tracking-widest uppercase"
            />
            <button className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold uppercase tracking-widest text-xs transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      
      {/* System Status Footer */}
      <footer className="h-12 bg-white border-t border-slate-200 flex items-center px-4 md:px-8 justify-between text-[10px] text-slate-400 uppercase tracking-widest overflow-hidden">
        <div className="hidden md:flex gap-8">
          <span>Shipping Worldwide</span>
          <span>Free returns over $50</span>
          <span>Secure checkout</span>
        </div>
        <div className="flex gap-4 items-center bg-slate-900 text-slate-300 px-4 h-full ml-auto md:ml-0 md:-mr-8">
          <span className="text-emerald-400 font-mono">SYS_STATUS:</span>
          <span className="font-mono">DB CONNECTED // PRODUCTS_SYNCED: 50</span>
        </div>
      </footer>
    </div>
  );
}
