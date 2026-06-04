// ============================================================
// CART REDUCER — Warkop Djoeragan POS
// ============================================================

export const CART_ACTIONS = {
  ADD_ITEM     : 'ADD_ITEM',
  REMOVE_ITEM  : 'REMOVE_ITEM',
  UPDATE_QTY   : 'UPDATE_QTY',
  UPDATE_NOTE  : 'UPDATE_NOTE',
  SET_DISCOUNT : 'SET_DISCOUNT',
  SET_TABLE    : 'SET_TABLE',
  CLEAR_CART   : 'CLEAR_CART',
};

export const initialCartState = {
  items   : [],                              // CartItem[]
  discount: { type: 'nominal', nilai: 0 },  // diskon
  tableId : null,                            // meja aktif
};

export function cartReducer(state, action) {
  switch (action.type) {

    // === TAMBAH / INCREMENT ITEM ===
    case CART_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;
      const existing    = state.items.find((i) => i.productId === product.id);

      if (existing) {
        // Sudah ada → increment qty
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === product.id
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }

      // Belum ada → tambah baru
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            nama     : product.nama,
            harga    : product.harga,
            emoji    : product.emoji,
            qty      : 1,
            catatan  : '',
          },
        ],
      };
    }

    // === HAPUS ITEM SEPENUHNYA ===
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      };

    // === SET QTY (jika 0 → otomatis hapus) ===
    case CART_ACTIONS.UPDATE_QTY: {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, qty } : i
        ),
      };
    }

    // === UPDATE CATATAN PER ITEM ===
    case CART_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, catatan: action.payload.catatan }
            : i
        ),
      };

    // === SET DISKON ===
    case CART_ACTIONS.SET_DISCOUNT:
      return {
        ...state,
        discount: action.payload,
      };

    // === SET MEJA ===
    case CART_ACTIONS.SET_TABLE:
      return {
        ...state,
        tableId: action.payload,
      };

    // === KOSONGKAN KERANJANG ===
    case CART_ACTIONS.CLEAR_CART:
      return { ...initialCartState };

    default:
      return state;
  }
}

// === COMPUTED SELECTORS ===
export const cartSelectors = {
  subtotal: (items) =>
    items.reduce((sum, i) => sum + i.harga * i.qty, 0),

  discountAmount: (items, discount) => {
    const sub = cartSelectors.subtotal(items);
    if (discount.type === 'persen') return Math.floor(sub * discount.nilai / 100);
    return Math.min(discount.nilai, sub);
  },

  total: (items, discount) =>
    cartSelectors.subtotal(items) - cartSelectors.discountAmount(items, discount),

  itemCount: (items) =>
    items.reduce((sum, i) => sum + i.qty, 0),

  getQty: (items, productId) =>
    items.find((i) => i.productId === productId)?.qty ?? 0,
};
