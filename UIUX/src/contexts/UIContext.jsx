import { createContext, useReducer, useCallback, useEffect } from 'react';
import { uiReducer, initialUIState, UI_ACTIONS } from '../reducers/uiReducer';

// ============================================================
// UI CONTEXT — Warkop Djoeragan POS
// Sidebar, toast, modal, loading global
// ============================================================

export const UIContext = createContext(null);

let toastIdCounter = 0;

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  // === INIT THEME — apply saved theme ke <html> saat mount ===
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // === SIDEBAR ===
  const toggleSidebar    = useCallback(() => dispatch({ type: UI_ACTIONS.TOGGLE_SIDEBAR }), []);
  const setSidebar       = useCallback((open) => dispatch({ type: UI_ACTIONS.SET_SIDEBAR, payload: open }), []);
  const collapseSidebar  = useCallback((col) => dispatch({ type: UI_ACTIONS.COLLAPSE_SIDEBAR, payload: col }), []);

  // === TOAST ===
  const addToast = useCallback(({ type = 'info', message, duration = 3500 }) => {
    const id = `toast-${++toastIdCounter}-${Date.now()}`;
    dispatch({ type: UI_ACTIONS.ADD_TOAST, payload: { id, type, message, duration } });

    // Auto-remove setelah duration
    setTimeout(() => {
      dispatch({ type: UI_ACTIONS.REMOVE_TOAST, payload: { id } });
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: UI_ACTIONS.REMOVE_TOAST, payload: { id } });
  }, []);

  // Shorthand helpers
  const toast = {
    success: (msg, dur) => addToast({ type: 'success', message: msg, duration: dur }),
    error  : (msg, dur) => addToast({ type: 'error',   message: msg, duration: dur }),
    warning: (msg, dur) => addToast({ type: 'warning', message: msg, duration: dur }),
    info   : (msg, dur) => addToast({ type: 'info',    message: msg, duration: dur }),
  };

  // === MODAL ===
  const openModal  = useCallback((modalId) => dispatch({ type: UI_ACTIONS.OPEN_MODAL,  payload: modalId }), []);
  const closeModal = useCallback(()         => dispatch({ type: UI_ACTIONS.CLOSE_MODAL }), []);

  // === LOADING ===
  const setLoading = useCallback((val) => dispatch({ type: UI_ACTIONS.SET_LOADING, payload: val }), []);

  // === THEME ===
  const toggleTheme = useCallback(() => dispatch({ type: UI_ACTIONS.TOGGLE_THEME }), []);
  const setTheme    = useCallback((t) => dispatch({ type: UI_ACTIONS.SET_THEME, payload: t }), []);

  const value = {
    sidebarOpen     : state.sidebarOpen,
    sidebarCollapsed: state.sidebarCollapsed,
    toasts          : state.toasts,
    globalLoading   : state.globalLoading,
    activeModal     : state.activeModal,
    theme           : state.theme,
    isDark          : state.theme === 'dark',
    toggleSidebar,
    setSidebar,
    collapseSidebar,
    addToast,
    removeToast,
    toast,
    openModal,
    closeModal,
    setLoading,
    toggleTheme,
    setTheme,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}
