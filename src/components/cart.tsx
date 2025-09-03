// components/Cart.tsx
import { useEffect, useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { getCartItems, removeFromCart, clearCart, getCartTotal, getCartItemCount } from '@/utils/cart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart = ({ isOpen, onClose, onCheckout }: CartProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      updateCart();
    }
  }, [isOpen]);

  const updateCart = () => {
    setCartItems(getCartItems());
    setTotal(getCartTotal());
    setItemCount(getCartItemCount());
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    if (change > 0) {
      // Add to cart logic would go here
    } else {
      removeFromCart(itemId);
    }
    updateCart();
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    updateCart();
  };

  const handleClearCart = () => {
    clearCart();
    updateCart();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Cart Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({itemCount})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="h-full flex flex-col">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-gray-500 text-center">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    <img 
                      src={item.image || "/placeholder-food.jpg"} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total: €{total.toFixed(2)}</span>
                  <button 
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear cart
                  </button>
                </div>
                <Button 
                  onClick={onCheckout}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;