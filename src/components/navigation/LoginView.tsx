import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import './LoginView.css';

const DUR = 300;
const OPEN = [2, 12, 5.6, 3.3, 18.4, 3.3, 22, 12, 18.4, 20.7, 5.6, 20.7, 2, 12];
const CLOSED = [2, 11.8, 5.6, 17.4, 18.4, 17.4, 22, 11.8, 18.4, 17.4, 5.6, 17.4, 2, 11.8];
const PUPIL_R = 3.2;
const LASHES = [
  [6.1, 14.9, 4.7, 17.2],
  [12, 16, 12, 18.4],
  [17.9, 14.9, 19.3, 17.2],
];

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function toPath(p: number[]) {
  return (
    'M' + p[0] + ',' + p[1] +
    'C' + p[2] + ',' + p[3] + ' ' + p[4] + ',' + p[5] + ' ' + p[6] + ',' + p[7] +
    'C' + p[8] + ',' + p[9] + ' ' + p[10] + ',' + p[11] + ' ' + p[12] + ',' + p[13]
  );
}

interface AnimatedEyeToggleProps {
  visible: boolean;
  onClick: () => void;
  className?: string;
}

const AnimatedEyeToggle: React.FC<AnimatedEyeToggleProps> = ({ visible, onClick, className }) => {
  const lidRef = useRef<SVGPathElement>(null);
  const pupilRef = useRef<SVGCircleElement>(null);
  const lashesRef = useRef<(SVGPathElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const tRef = useRef<number>(visible ? 0 : 1);

  const paint = (t: number) => {
    if (!lidRef.current || !pupilRef.current) return;
    const out = [];
    for (let i = 0; i < OPEN.length; i++) {
      out.push(OPEN[i] + (CLOSED[i] - OPEN[i]) * t);
    }
    lidRef.current.setAttribute('d', toPath(out));

    const p = clamp(t / 0.45);
    pupilRef.current.setAttribute('r', String(Math.max(0.001, PUPIL_R * (1 - p))));
    pupilRef.current.setAttribute('cy', String(12 + t * 2.6));
    pupilRef.current.style.opacity = String(1 - p);

    lashesRef.current.forEach((el, n) => {
      if (!el) return;
      const start = 0.52 + (n === 1 ? 0 : 0.06);
      const k = clamp((t - start) / (1 - start));
      const len = el.getAttribute('data-len') || '0';
      el.setAttribute('stroke-dashoffset', String(Number(len) * (1 - k)));
      el.style.opacity = String(k);
    });
  };

  useEffect(() => {
    const targetT = visible ? 0 : 1;
    if (tRef.current === targetT) {
      paint(targetT);
      return;
    }

    const startT = tRef.current;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    const t0 = performance.now();
    const step = (now: number) => {
      const k = clamp((now - t0) / DUR);
      const currentT = startT + (targetT - startT) * ease(k);
      tRef.current = currentT;
      paint(currentT);
      if (k < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  useEffect(() => {
    paint(tRef.current);
  }, []);

  return (
    <button
      type="button"
      className={className || ''}
      onClick={onClick}
      title={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
        <path ref={lidRef} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle ref={pupilRef} cx="12" cy="12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        {LASHES.map((L, i) => {
          const len = Math.hypot(L[2] - L[0], L[3] - L[1]);
          return (
            <path
              key={i}
              ref={el => (lashesRef.current[i] = el)}
              d={`M${L[0]},${L[1]}L${L[2]},${L[3]}`}
              strokeDasharray={len}
              data-len={len}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    </button>
  );
};

interface LoginViewProps {
  onNavigateHome: () => void;
  onLoginSuccess?: (userData: { name: string; email: string; phone?: string }) => void;
}

type AuthView = 'login' | 'signup' | 'recover';

export const LoginView: React.FC<LoginViewProps> = ({ onNavigateHome, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Recovery form state
  const [recoveryEmail, setRecoveryEmail] = useState('');

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawName = email.includes('@') ? email.split('@')[0] : 'Spirit Being User';
    const formattedName = rawName.replace(/[^a-zA-Z]/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());
    if (onLoginSuccess) {
      onLoginSuccess({
        name: formattedName || 'David Jaison',
        email: email || 'david@spiritbeing.in',
        phone: '+91 98765 43210'
      });
    } else {
      onNavigateHome();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess({
        name: signupName || 'New Member',
        email: signupEmail || 'user@spiritbeing.in',
        phone: '+91 98765 43210'
      });
    } else {
      onNavigateHome();
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sending recovery link to: ${recoveryEmail}`);
  };

  return (
    <div className="login-page-container">
      <div className={`page ${view === 'recover' ? 'recover-mode' : ''}`}>
        {/* LEFT: Form Section */}
        <div className="left">
          <button onClick={onNavigateHome} className="back-home-btn" aria-label="Back to Store">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>

          <div className="left-inner">
            {view === 'login' && (
              <>
                <div className="eyebrow">Members only</div>
                <h1>Welcome back to<br />SpiritBeing</h1>
                <p className="sub">Log in to your account and continue your journey.</p>

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
                <form onSubmit={handleLoginSubmit}>
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
                    <AnimatedEyeToggle
                      visible={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-eye"
                    />
                  </div>

                  <button className="btn-submit" type="submit">Log In</button>
                </form>

                <div className="links">
                  <div className="row">
                    <button type="button" className="link-btn" onClick={() => setView('signup')}>Don't have an account? Sign up</button>
                  </div>
                  <div>
                    <button type="button" className="link-btn" onClick={() => setView('recover')}>Forgot password?</button>
                  </div>
                </div>
              </>
            )}

            {view === 'signup' && (
              <>
                <div className="eyebrow">Join the chosen</div>
                <h1>Create a<br />SpiritBeing Account</h1>
                <p className="sub">Sign up for a free account & start your journey.</p>

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

                {/* Signup Form */}
                <form onSubmit={handleSignupSubmit}>
                  <div className="field">
                    <input
                      type="text"
                      placeholder="Name"
                      autoComplete="name"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <input
                      type="email"
                      placeholder="Email address"
                      autoComplete="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="new-password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <AnimatedEyeToggle
                      visible={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                      className="toggle-eye"
                    />
                  </div>

                  <button className="btn-submit" type="submit">Sign Up</button>
                </form>

                <div className="links justify-center">
                  <div className="row">
                    <button type="button" className="link-btn" onClick={() => setView('login')}>Already have an account? Login</button>
                  </div>
                </div>
              </>
            )}

            {view === 'recover' && (
              <>
                <h1 className="text-center">Recover Password</h1>
                <p className="sub text-center">Enter your email address and we'll send you a link to<br/>reset your password.</p>

                {/* Recovery Form */}
                <form onSubmit={handleRecoverySubmit} className="mt-8">
                  <div className="field">
                    <input
                      type="email"
                      placeholder="Email Address"
                      autoComplete="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                  </div>

                  <button className="btn-submit" type="submit">Email me a recovery link</button>
                </form>

                <div className="links justify-center mt-6">
                  <div className="row">
                    <button type="button" className="link-btn" onClick={() => setView('login')}>Back to login</button>
                  </div>
                </div>
              </>
            )}

            {/* Hover signature animation */}
            <div 
              className={`wordmark-wrap cursor-pointer group ${view === 'recover' ? 'mx-auto mt-12' : ''}`}
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
        {view !== 'recover' && (
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
        )}
      </div>
    </div>
  );
};
