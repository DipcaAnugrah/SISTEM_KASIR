import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// === GLOBAL STYLES ===
import './styles/global.css';
import './styles/animations.css';

// === CONTEXT PROVIDERS ===
import { AuthProvider }  from './contexts/AuthContext';
import { UIProvider }    from './contexts/UIContext';
import { CartProvider }  from './contexts/CartContext';
import { ShiftProvider } from './contexts/ShiftContext';

// === ROUTER ===
import AppRouter from './router/AppRouter';

// ============================================================
// MAIN ENTRY — Warkop Djoeragan POS
// Provider Tree: Auth → UI → Cart → Shift → Router
// ============================================================

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UIProvider>
        <CartProvider>
          <ShiftProvider>
            <AppRouter />
          </ShiftProvider>
        </CartProvider>
      </UIProvider>
    </AuthProvider>
  </StrictMode>
);
