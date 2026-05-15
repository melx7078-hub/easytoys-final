import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 md:pl-0 sm:w-[28rem]">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-primary-500" />
              Your Cart
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 bg-primary-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex py-2">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2 pr-4">{item.name}</h3>
                          <p className="ml-4 tabular-nums">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                          <button 
                            className="px-2 py-1 text-gray-500 hover:text-primary-600 transition"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium tabular-nums text-gray-900">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-2 py-1 text-gray-500 hover:text-primary-600 transition"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-500 hover:text-red-600 flex items-center p-2 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p className="tabular-nums">${cartTotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                className={cn(
                  "w-full flex items-center justify-center rounded-full border border-transparent px-6 py-4 text-base font-medium text-white shadow-sm transition-all",
                  "bg-primary-600 hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                )}
                onClick={() => {
                  alert('Checkout flow will connect to your payment processor later!');
                  setIsCartOpen(false);
                }}
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
