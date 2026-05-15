import { ShoppingCart, Menu, X, Search, Heart, User } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

export function Navbar() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="h-20 border-b border-slate-200 bg-white flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
      <div className="flex items-center gap-8">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 focus:outline-none"
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
        <div className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary-600 mr-2"></div>
          AuraLife
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
          <a href="#" className="text-primary-600 border-b-2 border-primary-600 pb-1">Store</a>
          <a href="#" className="hover:text-slate-900 transition-colors pb-1">New Arrivals</a>
          <a href="#" className="hover:text-slate-900 transition-colors pb-1">Bestsellers</a>
          <a href="#" className="hover:text-slate-900 transition-colors pb-1">Collections</a>
        </nav>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="bg-slate-100 border-none rounded-none px-4 py-2 text-xs w-48 focus:ring-1 focus:ring-primary-500 focus:outline-none placeholder:text-slate-400 font-medium" 
          />
        </div>
        <div className="flex gap-4 items-center text-slate-600">
          <button className="hover:text-slate-900 hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-slate-900 hidden sm:block">
            <Heart className="w-5 h-5" />
          </button>
          <button className="hover:text-slate-900 hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button 
            className="relative hover:text-slate-900 flex items-center"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 py-4 px-4 shadow-lg flex flex-col space-y-4 text-xs font-bold uppercase tracking-widest text-slate-500">
          <a href="#" className="text-primary-600 block px-2 py-1">Store</a>
          <a href="#" className="hover:text-slate-900 block px-2 py-1">New Arrivals</a>
          <a href="#" className="hover:text-slate-900 block px-2 py-1">Bestsellers</a>
          <a href="#" className="hover:text-slate-900 block px-2 py-1">Collections</a>
        </div>
      )}
    </header>
  );
}
