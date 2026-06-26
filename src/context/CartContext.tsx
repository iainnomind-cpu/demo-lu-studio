import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Product, CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luhub_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('luhub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size?: string) => {
    setCartItems(prev => {
      // Create a unique ID based on product ID and selected size
      const cartItemId = `${product.id}-${size || 'default'}`;
      
      const existingItem = prev.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...product, cartItemId, selectedSize: size, quantity: 1 }];
    });
    
    // Auto-open cart when adding items
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('luhub_cart');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
