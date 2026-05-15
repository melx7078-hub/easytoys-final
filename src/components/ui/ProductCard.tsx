import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { cn } from '../../lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "bg-white border border-slate-200 group flex flex-col transition-all duration-300 hover:border-slate-400",
        featured ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className={cn("bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center", featured ? "h-64 sm:h-96" : "h-48 sm:h-64")}>
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              NEW
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        <img 
          src={product.image} 
          alt={product.name}
          className={cn(
            "object-cover w-full h-full transition-transform duration-500 ease-out mix-blend-multiply",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-tighter text-slate-400 mb-1">{product.category}</p>
        
        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {featured && (
          <p className="hidden sm:block text-xs text-slate-500 mb-4 line-clamp-2">{product.description}</p>
        )}
        
        <div className="mt-auto pt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-primary-600 font-bold font-mono">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs font-medium text-slate-400 line-through font-mono">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="text-xs border border-slate-300 px-3 py-1.5 hover:bg-slate-900 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-1"
          >
            <ShoppingCart className="w-3 h-3 hidden sm:block" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
