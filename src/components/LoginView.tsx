import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './LoginView.css';

interface LoginViewProps {
  onNavigateHome: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigateHome }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const wordmarkText = "SpiritBeing";

  const particlesCount = 22;
  const particleSpans = Array.from({ length: particlesCount }).map((_, idx) => {
    // Deterministic layout values derived from index to prevent hydration mismatch/jumping
    const x = (idx * 17.3) % 100;
    const y = (idx * 23.7) % 100;
    const delay = (idx * 0.36) % 8;
    const duration = 7 + (idx * 0.27) % 6;
    return (
      <span
        key={idx}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Native authentication / Shop Pay sync placeholder
    alert(`Logging in with: ${email}`);
  };

  return (
    <div className="login-page-container">
      <div className="page">
        {/* LEFT: Form Section */}
        <div className="left">
          <button onClick={onNavigateHome} className="back-home-btn" aria-label="Back to Store">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>

          <div className="left-inner">
            <div className="eyebrow">Members only</div>
            <h1>Welcome back to<br />SpiritBeing</h1>
            <p className="sub">Log in to your account and keep creating.</p>

            {/* Google Sign-in */}
            <button className="btn-google" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18z" />
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33z" />
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
              </svg>
              Continue with Google
            </button>

            <div className="divider">Or</div>

            {/* Email Form */}
            <form onSubmit={handleSubmit}>
              <div className="field">
                <input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
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
                  className="toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>

              <button className="btn-submit" type="submit">Log In</button>
            </form>

            <div className="links">
              <div className="row"><a href="#signup">Don't have an account? Sign up</a></div>
              <div><a href="#forgot">Forgot password?</a></div>
            </div>

            {/* Hover signature animation */}
            <div 
              className="wordmark-wrap cursor-pointer group" 
              onClick={onNavigateHome}
              title="Return to Store Homepage"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onNavigateHome();
                }
              }}
            >
              <span className="wordmark">
                {wordmarkText.split('').map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Visual Ambient Section */}
        <div className="right">
          <div className="aura">
            <div className="ring r3"></div>
            <div className="ring r2"></div>
            <div className="ring r1"></div>
            <div className="orb"></div>
            <div className="particles">
              {particleSpans}
            </div>
          </div>

          <div className="gif-slot-filled">
            <img
              src="/login-ambient.gif"
              alt="SpiritBeing ambient loop"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          <div className="right-caption">a space to find your center</div>
        </div>
      </div>
    </div>
  );
};
