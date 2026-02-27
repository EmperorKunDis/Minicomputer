import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ProductData } from '../lib/products';

export interface CartItem {
  product: ProductData;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; product: ProductData }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE'; id: string; qty: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE' }
  | { type: 'SET_OPEN'; isOpen: boolean };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      return {
        ...state,
        isOpen: true,
        items: existing
          ? state.items.map(i => i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.product.id !== action.id) };
    case 'UPDATE':
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.product.id !== action.id) };
      return { ...state, items: state.items.map(i => i.product.id === action.id ? { ...i, quantity: action.qty } : i) };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_OPEN':
      return { ...state, isOpen: action.isOpen };
    default:
      return state;
  }
}

interface CartCtx {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ProductData) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  total: number;
  itemsCount: number;
}

const CartContext = createContext<CartCtx | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false });

  const total = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const itemsCount = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      addItem: (product) => dispatch({ type: 'ADD', product }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      updateQty: (id, qty) => dispatch({ type: 'UPDATE', id, qty }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
      toggleCart: () => dispatch({ type: 'TOGGLE' }),
      setCartOpen: (isOpen) => dispatch({ type: 'SET_OPEN', isOpen }),
      total,
      itemsCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
