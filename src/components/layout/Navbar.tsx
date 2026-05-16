import { ShoppingCart, Menu, X, Search, Heart, User, Sparkles } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

export function Navbar() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-primary-950 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center py-2 px-4 flex justify-center items-center gap-2">
        <Sparkles className="w-3 h-3 text-primary-400" />
        <span>ENVÍO GRATIS A PARTIR DE 60€</span>
        <Sparkles className="w-3 h-3 text-primary-400" />
      </div>

      <header className="h-20 border-b border-primary-100 bg-white flex items-center px-4 md:px-8 justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-primary-800 hover:text-primary-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-primary-600 flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-600 mr-2 flex items-center justify-center text-white">
              e
            </div>
            easytoys
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 text-sm font-bold text-slate-700">
            <a href="/" className="hover:text-primary-600 transition-colors pb-1">Inicio</a>
            <a href="/catalog?category=Juguetes sexuales" className="hover:text-primary-600 transition-colors pb-1">Juguetes</a>
            <a href="/catalog?category=Lencería y ropa" className="hover:text-primary-600 transition-colors pb-1">Lencería</a>
            <a href="/catalog?category=BDSM" className="hover:text-primary-600 transition-colors pb-1">BDSM</a>
            <a href="/catalog?category=Farmacia" className="hover:text-primary-600 transition-colors pb-1">Farmacia</a>
          </nav>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-4 md:gap-6">
          <form 
            action="/catalog" 
            method="get" 
            className="relative hidden md:block group"
          >
            <input 
              type="text" 
              name="q"
              placeholder="¿Qué estás buscando?" 
              className="bg-slate-100 border border-transparent rounded-full px-5 py-2 pl-10 text-sm w-64 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 focus:outline-none placeholder:text-slate-400 font-medium transition-all" 
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500" />
          </form>
          <div className="flex gap-4 items-center text-primary-800">
            <button className="hover:text-primary-500 transition-colors hidden sm:block">
              <Search className="w-6 h-6 md:hidden" />
            </button>
            <button className="hover:text-primary-500 transition-colors hidden sm:block">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:text-primary-500 transition-colors hidden sm:block">
              <User className="w-6 h-6" />
            </button>
            <button 
              className="relative hover:text-primary-500 transition-colors flex items-center"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-primary-100 py-4 px-4 shadow-lg flex flex-col space-y-4 text-sm font-bold text-slate-700">
            <a href="#" className="text-primary-600 block px-2 py-2 border-b border-slate-100">Inicio</a>
            <a href="#" className="hover:text-primary-600 block px-2 py-2 border-b border-slate-100">Juguetes</a>
            <a href="#" className="hover:text-primary-600 block px-2 py-2 border-b border-slate-100">Lencería</a>
            <a href="#" className="hover:text-primary-600 block px-2 py-2 border-b border-slate-100">BDSM</a>
            <a href="#" className="hover:text-primary-600 block px-2 py-2 text-red-500">Ofertas</a>
          </div>
        )}
      </header>
    </>
  );
}
