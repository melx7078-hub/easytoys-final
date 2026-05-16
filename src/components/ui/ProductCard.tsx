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
        "bg-white rounded-xl shadow-sm border border-transparent hover:border-primary-100 hover:shadow-lg group flex flex-col transition-all duration-300",
        featured ? "col-span-1 sm:col-span-2 lg:col-span-2 row-span-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className={cn("bg-white rounded-t-xl relative overflow-hidden flex flex-col items-center justify-center p-4", featured ? "h-64 sm:h-96" : "h-48 sm:h-64")}>
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              NUEVO
            </span>
          )}
          {product.originalPrice ? (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm">
              -{Math.round((1 - (Number(product.price)||0) / (Number(product.originalPrice)||1)) * 100)}%
            </span>
          ) : null}
        </div>

        <img 
          src={product.image} 
          alt={product.name}
          className={cn(
            "object-contain w-full h-full transition-transform duration-500 ease-out",
            isHovered ? "scale-105" : "scale-100"
          )}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] uppercase tracking-wider text-primary-500 font-bold mb-1">{product.category}</p>
        
        <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star}
                className={cn("w-3.5 h-3.5", star <= Math.round(Number(product.rating) || 5) ? "fill-current text-amber-400" : "fill-slate-200 text-slate-200")} 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            ({product.reviewCount || 0})
          </span>
        </div>
        
        <div className="mt-auto pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div className="flex flex-col">
            {product.originalPrice ? (
              <span className="text-xs font-medium text-slate-400 line-through">
                €{(Number(product.originalPrice) || 0).toFixed(2)}
              </span>
            ) : null}
            <span className="text-primary-600 font-black text-lg">
              €{(Number(product.price) || 0).toFixed(2)}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full sm:w-auto text-sm bg-slate-100 text-slate-700 hover:bg-primary-500 hover:text-white px-4 py-2 rounded-full transition-colors font-bold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
