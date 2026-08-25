import React, { useState, useEffect } from 'react';
import './LoginView.css';

interface LoginViewProps {
  onBackToShop: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onBackToShop }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: string; duration: string }[]>([]);

  // Initialize random particles matching the original script
  useEffect(() => {
    const list = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${7 + Math.random() * 6}s`,
    }));
    setParticles(list);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in as: ${email}`);
    onBackToShop();
  };

  const handleShopPayLogin = () => {
    alert('Connecting to Shopify Shop Pay express authentication...');
    // Shopify Shop Pay checkout/login flow trigger stub
    onBackToShop();
  };

  const handleGoogleLogin = () => {
    alert('Connecting to Google accounts authentication...');
    onBackToShop();
  };

  const wordmarkLetters = 'SpiritBeing'.split('');

  return (
    <div className="sb-login-page">
      {/* LEFT COLUMN: Input Form */}
      <div className="sb-login-left">
        <div className="sb-login-left-inner">
          <div className="sb-login-eyebrow">Members only</div>
          <h1>
            Welcome back to
            <br />
            SpiritBeing
          </h1>
          <p className="sb-login-sub">Log in to your account and keep creating.</p>

          {/* SHOP PAY Express Accelerated Checkout Button */}
          <button
            onClick={handleShopPayLogin}
            className="btn-shoppay-login"
            type="button"
            aria-label="Continue with Shop Pay"
          >
            {/* Shop Pay official styled SVG logo */}
            <svg viewBox="0 0 162 38" className="w-auto h-4 inline-block mr-1">
              <path
                fill="currentColor"
                d="M17.4 22.8c0 4.1-2.9 6.8-7.3 6.8-4.4 0-7.3-2.7-7.3-6.8s2.9-6.8 7.3-6.8c4.4 0 7.3 2.7 7.3 6.8zm-11.2 0c0 2.3 1.6 3.6 3.9 3.6s3.9-1.3 3.9-3.6-1.6-3.6-3.9-3.6-3.9 1.3-3.9 3.6zM28.4 16.4h3.1v2.1c.8-1.5 2.4-2.5 4.3-2.5 3.3 0 5.4 2.1 5.4 5.7v7.5h-3.3v-6.9c0-2.1-1.1-3.2-2.9-3.2-1.9 0-3.3 1.3-3.3 3.6v6.5h-3.3v-12.8zm23.1 6.4c0 4.1 3 6.8 7.4 6.8 2.3 0 4.3-.8 5.4-2.1l-1.9-1.9c-.8.9-2.1 1.4-3.5 1.4-2.5 0-4-1.3-4-3.5h9.8v-1c0-4.1-2.6-6.5-6.8-6.5-4.1.2-6.4 2.8-6.4 6.8zm7.4-4.2c2.1 0 3.3 1.1 3.5 2.6H58.8c.2-1.5 1.5-2.6 3.7-2.6zm14.1-2.2H76v2.5h.1c.9-1.8 2.6-2.9 4.6-2.9.5 0 .9.1 1.2.2v3.1c-.4-.2-.9-.3-1.5-.3-2.1 0-3.7 1.6-3.7 4.1v6.2h-3.3v-12.9zm13.1 9.8c0-3.3 2.6-4.6 6.8-4.6h3v-1c0-2-1.3-3.1-3.6-3.1-2.1 0-3.5 1-4.2 2.3l-2.1-1.7c1.3-2.1 3.7-3.2 7-3.2 4.4 0 6.6 2.3 6.6 6.1v8.8h-3.1v-1.7h-.1c-1 1.3-2.6 2.1-4.7 2.1-3.7-.1-5.9-2.1-5.9-5.7zm9.8.9v-2.3c-2.3 0-3.6.7-3.6 2.2 0 1.2.9 1.9 2.2 1.9.9 0 1.4-.4 1.4-1.8zm11-12.9h3.4l3.9 9.3h.1l3.8-9.3h3.4l-7.7 17.5h-3.4l1.6-3.8-5.1-13.7z"
              />
              <path
                fill="currentColor"
                d="M129.8 8.6h10.9c4.3 0 7.3 2.7 7.3 6.9s-3 6.9-7.3 6.9h-7.6v6.8h-3.3V8.6zm10.7 10.7c2.6 0 4.1-1.4 4.1-3.8s-1.5-3.8-4.1-3.8h-7.4v7.6h7.4zm16.5-2.9c0-3.3 2.6-4.6 6.8-4.6h3v-1c0-2-1.3-3.1-3.6-3.1-2.1 0-3.5 1-4.2 2.3l-2.1-1.7c1.3-2.1 3.7-3.2 7-3.2 4.4 0 6.6 2.3 6.6 6.1v8.8H171v-1.7h-.1c-1 1.3-2.6 2.1-4.7 2.1-3.7-.1-5.9-2.1-5.9-5.7zm9.8.9v-2.3c-2.3 0-3.6.7-3.6 2.2 0 1.2 9 1.9 2.2 1.9.9 0 1.4-.4 1.4-1.8zm11-12.9h3.4l3.9 9.3h.1l3.8-9.3h3.4l-7.7 17.5h-3.4l1.6-3.8-5.1-13.7z"
                opacity=".6"
              />
            </svg>
            Continue with Shop Pay
          </button>

          {/* GOOGLE Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="btn-google-login"
            type="button"
            aria-label="Continue with Google"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" className="inline-block mr-1">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="sb-login-divider">Or</div>

          {/* Email & Password Fields Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="sb-login-field">
              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="sb-login-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-eye"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.4 21.4 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.5 21.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button className="btn-login-submit" type="submit">
              Log In
            </button>
          </form>

          {/* Links */}
          <div className="sb-login-links">
            <div className="row">
              <a href="#signup" onClick={(e) => { e.preventDefault(); alert('Account signup is coming soon.'); }}>
                Don't have an account? Sign up
              </a>
            </div>
            <div>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password recovery details sent to your registered email.'); }}>
                Forgot password?
              </a>
            </div>
          </div>

          {/* Shop Pay Benefits Promo Box */}
          <div className="shoppay-benefits-card">
            <div className="title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Express Checkout with Shop Pay
            </div>
            <ul>
              <li>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Check out <b>up to 4x faster</b> using saved details</span>
              </li>
              <li>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Seamless <b>one-click transactions</b> for lower friction</span>
              </li>
              <li>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><b>Automatic order tracking</b> directly in the Shop App</span>
              </li>
            </ul>
          </div>

          {/* Rising Logo Wordmark */}
          <div className="sb-login-wordmark-wrap">
            <span className="sb-login-wordmark" id="wordmark">
              {wordmarkLetters.map((letter, idx) => (
                <span key={idx}>{letter}</span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Ambient glowing rings & particle space + visual loop */}
      <div className="sb-login-right">
        <div className="sb-login-aura">
          <div className="ring r3"></div>
          <div className="ring r2"></div>
          <div className="ring r1"></div>
          <div className="orb"></div>
          <div className="sb-login-particles">
            {particles.map((p) => (
              <span
                key={p.id}
                style={{
                  left: p.left,
                  top: p.top,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>
        </div>

        {/* Ambient video/GIF placeholder showcasing branding */}
        <div className="sb-login-gif-slot">
          <img src="/sb-story-bg.jpeg" alt="Spirit Being aesthetic loop" />
        </div>

        <div className="sb-login-right-caption">a space to find your center</div>
      </div>
    </div>
  );
};
