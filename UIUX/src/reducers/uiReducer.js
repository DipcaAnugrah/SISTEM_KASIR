// ============================================================
// UI REDUCER — Warkop Djoeragan POS
// Sidebar, toast notifications, modal, loading global
// ============================================================

export const UI_ACTIONS = {
  TOGGLE_SIDEBAR  : 'TOGGLE_SIDEBAR',
  SET_SIDEBAR     : 'SET_SIDEBAR',
  COLLAPSE_SIDEBAR: 'COLLAPSE_SIDEBAR',
  ADD_TOAST       : 'ADD_TOAST',
  REMOVE_TOAST    : 'REMOVE_TOAST',
  SET_LOADING     : 'SET_LOADING',
  OPEN_MODAL      : 'OPEN_MODAL',
  CLOSE_MODAL     : 'CLOSE_MODAL',
  SET_THEME       : 'SET_THEME',
  TOGGLE_THEME    : 'TOGGLE_THEME',
};

// Baca preferensi theme dari localStorage saat pertama load
const savedTheme = typeof window !== 'undefined'
  ? (localStorage.getItem('warkop_theme') ?? 'light')
  : 'light';

export const initialUIState = {
  sidebarOpen     : true,
  sidebarCollapsed: false,
  toasts          : [],
  globalLoading   : false,
  activeModal     : null,
  theme           : savedTheme,  // 'light' | 'dark'
};

export function uiReducer(state, action) {
  switch (action.type) {

    case UI_ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case UI_ACTIONS.SET_SIDEBAR:
      return { ...state, sidebarOpen: action.payload };

    case UI_ACTIONS.COLLAPSE_SIDEBAR:
      return { ...state, sidebarCollapsed: action.payload };

    case UI_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id      : action.payload.id,
            type    : action.payload.type    ?? 'info',
            message : action.payload.message,
            duration: action.payload.duration ?? 3500,
          },
        ],
      };

    case UI_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload.id),
      };

    case UI_ACTIONS.SET_LOADING:
      return { ...state, globalLoading: action.payload };

    case UI_ACTIONS.OPEN_MODAL:
      return { ...state, activeModal: action.payload };

    case UI_ACTIONS.CLOSE_MODAL:
      return { ...state, activeModal: null };

    case UI_ACTIONS.SET_THEME: {
      const t = action.payload;
      document.documentElement.dataset.theme = t;
      localStorage.setItem('warkop_theme', t);
      return { ...state, theme: t };
    }

    case UI_ACTIONS.TOGGLE_THEME: {
      const next = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('warkop_theme', next);
      return { ...state, theme: next };
    }

    default:
      return state;
  }
}
