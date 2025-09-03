// src/utils/cart.ts
export type CartItem = { 
  id: string; 
  qty: number;
  name?: string;
  price?: number;
  image?: string;
};

export interface MenuItem {
  _id: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  imageUrl?: string;
  category: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getItemQty = (id: string): number => {
  const cart = getCart();
  const found = cart.find((c) => c.id === id);
  return found ? found.qty : 0;
};

export const addToCart = (id: string) => {
  const cart = getCart();
  const found = cart.find((c) => c.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const decreaseFromCart = (id: string) => {
  let cart = getCart();
  const found = cart.find((c) => c.id === id);
  if (!found) return;
  if (found.qty > 1) {
    found.qty -= 1;
  } else {
    cart = cart.filter((c) => c.id !== id);
  }
  saveCart(cart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const removeFromCart = (id: string) => {
  let cart = getCart();
  cart = cart.filter((c) => c.id !== id);
  saveCart(cart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const clearCart = () => {
  saveCart([]);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
};

export const getCartTotal = (): number => {
  const cart = getCart();
  
  // For this to work properly, we need to get the actual item prices
  // This would typically come from your menu data or API
  // For now, we'll return a placeholder value
  return cart.reduce((total, item) => {
    // In a real implementation, you would look up the item price
    // from your menu data or make an API call
    const itemPrice = 0; // This should be replaced with actual price lookup
    return total + (itemPrice * item.qty);
  }, 0);
};

export const getCartItems = (menuItems: MenuItem[] = []): any[] => {
  const cart = getCart();
  
  // Enrich cart items with product details from menu items
  return cart.map(cartItem => {
    const menuItem = menuItems.find(item => item._id === cartItem.id || item.id === cartItem.id);
    
    return {
      id: cartItem.id,
      quantity: cartItem.qty,
      name: menuItem?.name || 'Unknown Item',
      price: menuItem?.price || 0,
      image: menuItem?.image || menuItem?.imageUrl || '/placeholder-food.jpg'
    };
  });
};

// Helper function to update cart items with menu data
export const getEnrichedCartItems = (menuItems: MenuItem[]): any[] => {
  const cart = getCart();
  
  return cart.map(cartItem => {
    const menuItem = menuItems.find(item => item._id === cartItem.id || item.id === cartItem.id);
    
    if (!menuItem) {
      // If menu item not found, return basic cart item
      return {
        id: cartItem.id,
        quantity: cartItem.qty,
        name: 'Unknown Item',
        price: 0,
        image: '/placeholder-food.jpg'
      };
    }
    
    return {
      id: cartItem.id,
      quantity: cartItem.qty,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image || menuItem.imageUrl || '/placeholder-food.jpg',
      description: menuItem.description
    };
  });
};

// Calculate total with actual menu item prices
export const calculateCartTotal = (menuItems: MenuItem[]): number => {
  const cart = getCart();
  
  return cart.reduce((total, cartItem) => {
    const menuItem = menuItems.find(item => item._id === cartItem.id || item.id === cartItem.id);
    const itemPrice = menuItem?.price || 0;
    return total + (itemPrice * cartItem.qty);
  }, 0);
};