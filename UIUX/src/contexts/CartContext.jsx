import { createContext, useReducer, useCallback } from 'react';
import { cartReducer, initialCartState, CART_ACTIONS, cartSelectors } from '../reducers/cartReducer';

// ============================================================
// CART CONTEXT — Warkop Djoeragan POS
// Optimistic UI: semua aksi sinkron, tanpa loading state
// ============================================================

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // === ACTIONS ===
  const addItem = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product } });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { productId } });
  }, []);

  const updateQty = useCallback((productId, qty) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { productId, qty } });
  }, []);

  const updateNote = useCallback((productId, catatan) => {
    dispatch({ type: CART_ACTIONS.UPDATE_NOTE, payload: { productId, catatan } });
  }, []);

  const setDiscount = useCallback((type, nilai) => {
    dispatch({ type: CART_ACTIONS.SET_DISCOUNT, payload: { type, nilai: Number(nilai) } });
  }, []);

  const setTable = useCallback((tableId) => {
    dispatch({ type: CART_ACTIONS.SET_TABLE, payload: tableId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  // Helper: berapa qty produk ini di keranjang
  const getQty = useCallback((productId) =>
    cartSelectors.getQty(state.items, productId),
  [state.items]);

  // === COMPUTED VALUES ===
  const subtotal       = cartSelectors.subtotal(state.items);
  const discountAmount = cartSelectors.discountAmount(state.items, state.discount);
  const total          = cartSelectors.total(state.items, state.discount);
  const itemCount      = cartSelectors.itemCount(state.items);

  const value = {
    items        : state.items,
    discount     : state.discount,
    tableId      : state.tableId,
    subtotal,
    discountAmount,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQty,
    updateNote,
    setDiscount,
    setTable,
    clearCart,
    getQty,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
