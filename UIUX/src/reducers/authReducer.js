// ============================================================
// AUTH REDUCER — Warkop Djoeragan POS
// Mengelola state autentikasi: login, logout, error
// ============================================================

export const AUTH_ACTIONS = {
  LOGIN_REQUEST  : 'LOGIN_REQUEST',
  LOGIN_SUCCESS  : 'LOGIN_SUCCESS',
  LOGIN_FAILURE  : 'LOGIN_FAILURE',
  LOGOUT         : 'LOGOUT',
  CLEAR_ERROR    : 'CLEAR_ERROR',
  RESTORE_SESSION: 'RESTORE_SESSION',
};

export const initialAuthState = {
  user           : null,
  token          : null,
  isAuthenticated: false,
  isLoading      : false,
  error          : null,
};

export function authReducer(state, action) {
  switch (action.type) {

    case AUTH_ACTIONS.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        error    : null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user           : action.payload.user,
        token          : action.payload.token,
        isAuthenticated: true,
        isLoading      : false,
        error          : null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user           : null,
        token          : null,
        isAuthenticated: false,
        isLoading      : false,
        error          : action.payload.message,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialAuthState,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user           : action.payload.user,
        token          : action.payload.token,
        isAuthenticated: true,
      };

    default:
      return state;
  }
}
