// client/src/components/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, Mail, 
  Eye, EyeOff, CheckCircle2, AlertCircle,
  Layers, Truck, Stethoscope, Pill, Scale
} from 'lucide-react';
import { api, setToken } from '../services/api';
import type { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register';
}

const DEMO_PRESETS = [
  { 
    role: 'MANUFACTURER', 
    label: 'Manufacturer', 
    email: 'mfr.admin@demo.invalid', 
    org: 'DEMO Pharma Pvt Ltd', 
    badgeColor: '#38bdf8'
  },
  { 
    role: 'DISTRIBUTOR', 
    label: 'Distributor', 
    email: 'dist.admin@demo.invalid', 
    org: 'DEMO Distrib Co', 
    badgeColor: '#34d399'
  },
  { 
    role: 'REGULATOR', 
    label: 'Regulator', 
    email: 'regulator@demo.invalid', 
    org: 'DEMO CDSCO', 
    badgeColor: '#fb7185'
  },
  { 
    role: 'HOSPITAL', 
    label: 'Hospital', 
    email: 'hosp.admin@demo.invalid', 
    org: 'Metro General Hospital', 
    badgeColor: '#c084fc'
  },
];

const ROLE_OPTIONS: { role: UserRole; label: string; icon: any }[] = [
  { role: 'MANUFACTURER', label: 'Manufacturer', icon: Layers },
  { role: 'DISTRIBUTOR', label: '3PL Logistics', icon: Truck },
  { role: 'HOSPITAL', label: 'Hospital', icon: Stethoscope },
  { role: 'PHARMACY', label: 'Pharmacy', icon: Pill },
  { role: 'REGULATOR', label: 'Regulator', icon: Scale },
];

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Dev@1234!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
  
  // Register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('MANUFACTURER');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [orgList, setOrgList] = useState<Array<{ id: string; name: string; type: string }>>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLoginStep('email');
      setError(null);
      setSuccessMsg(null);
      api.getOrganizations()
        .then(res => {
          if (res?.organizations?.length) {
            setOrgList(res.organizations);
            setSelectedOrgId(res.organizations[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handle Login Step 1 ("Next") -> moves to password or logs in if preset
  const handleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter a valid work email address.');
      return;
    }
    setError(null);
    setLoginStep('password');
  };

  // Execute Login
  const handleLogin = async (overrideEmail?: string) => {
    const targetEmail = overrideEmail || email;
    if (!targetEmail || !password) {
      setError('Please provide your password to proceed.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const data = await api.login({ email: targetEmail, password });
      setToken(data.accessToken);
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handlePresetSelect = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('Dev@1234!');
    setLoginStep('password');
    handleLogin(presetEmail);
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !firstName || !lastName) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(regPassword)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(regPassword)) {
      setError('Password must contain at least one number.');
      return;
    }

    const orgId = selectedOrgId || (orgList[0]?.id || '');
    if (!orgId) {
      setError('Please select a valid organization entity.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.register({
        email: regEmail,
        password: regPassword,
        firstName,
        lastName,
        role: regRole,
        organizationId: orgId,
      });

      if (res.accessToken) {
        setToken(res.accessToken);
        setSuccessMsg('Account registered successfully! Entering portal...');
        setTimeout(() => {
          onLoginSuccess(res.user);
          onClose();
        }, 700);
      } else {
        const loginData = await api.login({ email: regEmail, password: regPassword });
        setToken(loginData.accessToken);
        onLoginSuccess(loginData.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: '#000000 url("/login-bg-3d.png") center center / cover no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      {/* Subtle bottom-edge ambient shadow if desired */}

      {/* ─── Top-Left Brand Logo (Matching Screenshot) ────────────────────── */}
      <div style={{
        position: 'absolute',
        top: '2.5rem',
        left: '3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        zIndex: 10
      }}>
        <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
          <path d="M11 7C7 11 4 15 4 20C4 25 7 29 11 33" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <path d="M29 7C33 11 36 15 36 20C36 25 33 29 29 33" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="20" r="7.5" stroke="#ffffff" strokeWidth="3" />
        </svg>
        <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
          SecureChain
        </span>
      </div>

      {/* ─── Top-Right Close Button ───────────────────────────────────────── */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2.5rem',
          right: '3rem',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
        aria-label="Close modal"
      >
        <X size={20} />
      </button>

      {/* ─── Centered Auth Card (Matching Screenshot Exact Look) ──────────── */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        background: '#000000',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        maxWidth: '560px',
        width: '100%',
        padding: 'clamp(2.25rem, 5vw, 3.75rem)',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 40px rgba(168, 85, 247, 0.15)'
      }}>
        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '2rem'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              fontWeight: mode === 'login' ? 700 : 500,
              color: mode === 'login' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
              padding: '0.6rem 0.2rem',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
            {mode === 'login' && (
              <span style={{
                position: 'absolute',
                left: 0,
                bottom: -1,
                width: '100%',
                height: '2px',
                background: '#a855f7',
                borderRadius: '1px'
              }} />
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              fontWeight: mode === 'register' ? 700 : 500,
              color: mode === 'register' ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
              padding: '0.6rem 0.2rem',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            Register Node
            {mode === 'register' && (
              <span style={{
                position: 'absolute',
                left: 0,
                bottom: -1,
                width: '100%',
                height: '2px',
                background: '#a855f7',
                borderRadius: '1px'
              }} />
            )}
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '6px',
            padding: '0.8rem 1rem',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '6px',
            padding: '0.8rem 1rem',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ══════════ LOGIN FLOW ════════════════════════════════════════════ */}
        {mode === 'login' && (
          <div>
            {/* Title (Matching Screenshot Headline) */}
            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              marginBottom: '0.9rem',
              lineHeight: 1.2
            }}>
              Login to your SecureChain account
            </h1>

            {/* Subtitle (Matching Screenshot Paragraph) */}
            <p style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: '0.925rem',
              lineHeight: 1.55,
              marginBottom: '2rem'
            }}>
              Enterprise Provenance is now the SecureChain Hub. Use the same credentials to log in. No change to our API keys. Reach out to support@securechain.io with any questions.
            </p>

            {/* Quick One-Click Demo Personas (Sleek horizontal badge pills) */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.55rem' }}>
                One-Click Demo Accounts
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {DEMO_PRESETS.map(preset => (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handlePresetSelect(preset.email)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '100px',
                      padding: '0.35rem 0.8rem',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: preset.badgeColor }} />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Email Form */}
            {loginStep === 'email' && (
              <form onSubmit={handleEmailNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#cbd5e1',
                    marginBottom: '0.5rem'
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="vantor-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {/* Remember Me Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#a855f7',
                      cursor: 'pointer',
                      borderRadius: '3px'
                    }}
                  />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.88rem', color: '#e2e8f0', cursor: 'pointer' }}>
                    Remember me
                  </label>
                </div>

                {/* Purple Outline Button: Next */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="vantor-purple-btn"
                  >
                    <span>Next</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Password Form */}
            {loginStep === 'password' && (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {/* Selected Email Display with Change Link */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={15} color="#94a3b8" />
                    <span style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: 500 }}>{email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginStep('email')}
                    style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Change
                  </button>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 500, color: '#cbd5e1' }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setPassword('Dev@1234!')}
                      style={{ background: 'none', border: 'none', color: '#a855f7', fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      Fill Default Demo
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="vantor-input"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer'
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <input
                    type="checkbox"
                    id="rememberMe2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#a855f7',
                      cursor: 'pointer',
                      borderRadius: '3px'
                    }}
                  />
                  <label htmlFor="rememberMe2" style={{ fontSize: '0.88rem', color: '#e2e8f0', cursor: 'pointer' }}>
                    Remember me
                  </label>
                </div>

                {/* Purple Outline Button: Sign In */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={loading || !password}
                    className="vantor-purple-btn"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ══════════ REGISTER FLOW ═════════════════════════════════════════ */}
        {mode === 'register' && (
          <div>
            <h1 style={{
              fontSize: 'clamp(1.65rem, 3vw, 2.1rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              marginBottom: '0.9rem',
              lineHeight: 1.2
            }}>
              Register your SecureChain account
            </h1>

            <p style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: '0.925rem',
              lineHeight: 1.55,
              marginBottom: '1.75rem'
            }}>
              Provision your organization identity on the Hyperledger Fabric 2.5 consortium network.
            </p>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Role Options */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                  Stakeholder Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '0.35rem' }}>
                  {ROLE_OPTIONS.map((item) => {
                    const isSelected = regRole === item.role;
                    return (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setRegRole(item.role)}
                        style={{
                          padding: '0.55rem 0.35rem',
                          background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: isSelected ? '1.5px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Names 2 Columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    className="vantor-input"
                    placeholder="Jane"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="vantor-input"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  className="vantor-input"
                  placeholder="jane.doe@organization.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              {/* Organization Entity */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Organization Entity
                </label>
                <select
                  className="vantor-input"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  style={{ appearance: 'none', background: '#000000', color: '#ffffff' }}
                >
                  {orgList.map(org => (
                    <option key={org.id} value={org.id} style={{ background: '#0a0a0a', color: '#ffffff' }}>
                      {org.name} ({org.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Password (min 8 chars, 1 uppercase, 1 number)
                </label>
                <input
                  type="password"
                  className="vantor-input"
                  placeholder="••••••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              {/* Purple Outline Button: Create Account */}
              <div style={{ paddingTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={loading || !regEmail || !regPassword || !firstName || !lastName}
                  className="vantor-purple-btn"
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
