import { useState, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Coffee, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';

// ============================================================
// LOGIN PAGE — Warkop Djoeragan POS
// ============================================================

function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [shakeError,  setShakeError]  = useState(false);

  // === Unique IDs untuk accessibility ===
  const usernameId   = useId();
  const passwordId   = useId();
  const rememberMeId = useId();

  // Redirect target setelah login
  const from = location.state?.from?.pathname ?? '/dashboard';

  // === SUBMIT HANDLER ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }

    const success = await login(username, password, rememberMe);

    if (success) {
      navigate(from, { replace: true });
    } else {
      // Shake animation saat error
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    }
  };

  // === INPUT CHANGE — reset error saat user mulai mengetik ===
  const handleInputChange = (setter) => (e) => {
    if (error) clearError();
    setter(e.target.value);
  };

  return (
    <div className={styles.card}>

      {/* === LOGO & TITLE === */}
      <div className={styles.logoSection}>
        <div className={styles.logoMark} aria-hidden="true">
          <Coffee size={28} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={styles.appName}>Warkop Djoeragan</h1>
          <p className={styles.appTagline}>Sistem Kasir Multi-Cabang</p>
        </div>
      </div>

      <div className={styles.divider} />

      {/* === FORM === */}
      <form
        onSubmit={handleSubmit}
        className={`${styles.form} ${shakeError ? styles.shake : ''}`}
        noValidate
        autoComplete="on"
      >
        <h2 className={styles.formTitle}>Masuk ke Akun Anda</h2>

        {/* === USERNAME === */}
        <div className={styles.fieldGroup}>
          <label htmlFor={usernameId} className={styles.label}>
            Username
          </label>
          <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
            <input
              id            = {usernameId}
              type          = "text"
              name          = "username"
              autoComplete  = "username"
              placeholder   = "Masukkan username"
              value         = {username}
              onChange      = {handleInputChange(setUsername)}
              className     = {styles.input}
              disabled      = {isLoading}
              spellCheck    = {false}
              autoCapitalize= "none"
            />
          </div>
        </div>

        {/* === PASSWORD === */}
        <div className={styles.fieldGroup}>
          <label htmlFor={passwordId} className={styles.label}>
            Password
          </label>
          <div className={`${styles.inputWrapper} ${error ? styles.inputError : ''}`}>
            <input
              id          = {passwordId}
              type        = {showPass ? 'text' : 'password'}
              name        = "password"
              autoComplete= "current-password"
              placeholder = "Masukkan password"
              value       = {password}
              onChange    = {handleInputChange(setPassword)}
              className   = {styles.input}
              disabled    = {isLoading}
            />
            <button
              type        = "button"
              className   = {styles.togglePass}
              onClick     = {() => setShowPass((v) => !v)}
              aria-label  = {showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              tabIndex    = {0}
            >
              {showPass
                ? <EyeOff size={18} strokeWidth={2} />
                : <Eye    size={18} strokeWidth={2} />
              }
            </button>
          </div>
        </div>

        {/* === ERROR MESSAGE === */}
        {error && (
          <div className={styles.errorBox} role="alert" aria-live="polite">
            <AlertCircle size={15} strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        {/* === REMEMBER ME === */}
        <div className={styles.rememberRow}>
          <label htmlFor={rememberMeId} className={styles.checkLabel}>
            <input
              id       = {rememberMeId}
              type     = "checkbox"
              checked  = {rememberMe}
              onChange = {(e) => setRememberMe(e.target.checked)}
              className= {styles.checkbox}
              disabled = {isLoading}
            />
            <span className={styles.checkText}>Ingat saya</span>
          </label>
        </div>

        {/* === SUBMIT BUTTON === */}
        <button
          id        = "btn-login"
          type      = "submit"
          className = {styles.submitBtn}
          disabled  = {isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className={styles.spinner} />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>

      {/* === HINT AKUN DEMO === */}
      <div className={styles.demoHint}>
        <p>Demo: <strong>budi</strong> / <strong>warkop123</strong></p>
      </div>

    </div>
  );
}

export default Login;
