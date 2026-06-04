import { createContext, useReducer, useEffect, useCallback } from 'react';
import { authReducer, initialAuthState, AUTH_ACTIONS } from '../reducers/authReducer';
import { findUser } from '../data/users';

// ============================================================
// AUTH CONTEXT — Warkop Djoeragan POS
// Provides: user, role, token, login/logout, error
// ============================================================

const SESSION_KEY = 'warkop_session';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // === RESTORE SESSION dari localStorage ===
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const { user, token } = JSON.parse(saved);
        if (user && token) {
          dispatch({
            type   : AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user, token },
          });
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  // === LOGIN — simulasi async (ganti dengan fetch ke FastAPI) ===
  const login = useCallback(async (username, password, rememberMe = false) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_REQUEST });

    // Simulasi network delay
    await new Promise((r) => setTimeout(r, 900));

    const user = findUser(username.trim().toLowerCase(), password);

    if (!user) {
      dispatch({
        type   : AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { message: 'Username atau password salah. Coba lagi.' },
      });
      return false;
    }

    // Buat token dummy (di produksi: JWT dari server)
    const token = `dummy-token-${user.id}-${Date.now()}`;

    // Buang password dari user object sebelum simpan ke state
    const { password: _pw, ...safeUser } = user;

    dispatch({
      type   : AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { user: safeUser, token },
    });

    // Simpan sesi jika "Ingat Saya"
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: safeUser, token }));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: safeUser, token }));
    }

    return true;
  }, []);

  // === LOGOUT ===
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // === CLEAR ERROR ===
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const value = {
    user           : state.user,
    token          : state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading      : state.isLoading,
    error          : state.error,
    role           : state.user?.role ?? null,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
