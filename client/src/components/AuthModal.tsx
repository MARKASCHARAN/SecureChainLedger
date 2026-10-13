// client/src/components/AuthModal.tsx
import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, Lock, Mail, 
  Building2, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles,
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
    label: 'Manufacturer Admin', 
    email: 'mfr.admin@demo.invalid', 
    org: 'DEMO Pharma Pvt Ltd', 
    badgeColor: '#38bdf8',
    sub: 'Batch formulation & QA anchors'
  },
  { 
    role: 'DISTRIBUTOR', 
    label: 'Distributor Logistics', 
    email: 'dist.admin@demo.invalid', 
    org: 'DEMO Distrib Co', 
    badgeColor: '#34d399',
    sub: 'Custody dispatch & transit tracking'
  },
  { 
    role: 'REGULATOR', 
    label: 'Health Regulator', 
    email: 'regulator@demo.invalid', 
    org: 'DEMO CDSCO', 
    badgeColor: '#fb7185',
    sub: 'Surveillance & emergency recall'
  },
  { 
    role: 'HOSPITAL', 
    label: 'Hospital Pharmacist', 
    email: 'hosp.admin@demo.invalid', 
    org: 'Metro General Hospital', 
    badgeColor: '#c084fc',
    sub: 'Dispense verification & quarantine'
  },
];

const ROLE_OPTIONS: { role: UserRole; label: string; icon: any; desc: string }[] = [
  { role: 'MANUFACTURER', label: 'Manufacturer', icon: Layers, desc: 'Batch Production & QA' },
  { role: 'DISTRIBUTOR', label: '3PL Logistics', icon: Truck, desc: 'Custody Transport' },
  { role: 'HOSPITAL', label: 'Hospital', icon: Stethoscope, desc: 'Inpatient Dispensing' },
  { role: 'PHARMACY', label: 'Pharmacy', icon: Pill, desc: 'Retail Verification' },
  { role: 'REGULATOR', label: 'Regulator', icon: Scale, desc: 'Audit & Recall Mandates' },
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
      setError(null);
      setSuccessMsg(null);
      // Fetch organizations for registration dropdown
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

  // Handle Login
  const handleLogin = async (overrideEmail?: string) => {
    const targetEmail = overrideEmail || email;
    if (!targetEmail || !password) return;

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

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !firstName || !lastName) {
      setError('Please fill in all required fields.');
      return;
    }

    // Password validation: 8+ chars, 1 uppercase, 1 number
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
      setError('Please select or specify a valid organization.');
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
        }, 800);
      } else {
        // Fallback login
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
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      {/* ─── Modal Main Window ──────────────────────────────────────────────── */}
      <div style={{
        maxWidth: '1080px',
        width: '100%',
        maxHeight: '92vh',
        background: '#04060a',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        boxShadow: '0 30px 100px -10px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.12)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; }}
          aria-label="Close authentication modal"
        >
          <X size={18} />
        </button>

        {/* ─── Two-Column Responsive Layout ─────────────────────────────────── */}
        <div className="auth-terminal-grid" style={{ flex: 1, overflowY: 'auto' }}>
          {/* Left Panel: Cinematic Video & Node Telemetry HUD */}
          <div className="auth-left-panel" style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '3rem 2.5rem',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                filter: 'brightness(0.68) contrast(1.1)'
              }}
            >
              <source src="/HomeVideo.mp4" type="video/mp4" />
            </video>

            {/* Cinematic Vignette */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(4, 6, 10, 0.4) 40%, rgba(4, 6, 10, 0.95) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />

            {/* Brand Header */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <path d="M11 7C7 11 4 15 4 20C4 25 7 29 11 33" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <path d="M29 7C33 11 36 15 36 20C36 25 33 29 29 33" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="7.5" stroke="#ffffff" strokeWidth="3" />
                </svg>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                  SecureChain
                </span>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Hyperledger Fabric 2.5 • Cryptographic Gateway
              </div>
            </div>

            {/* Middle Message */}
            <div style={{ position: 'relative', zIndex: 2, margin: '2.5rem 0' }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                lineHeight: 1.2,
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}>
                Total clarity from source to patient
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Enterprise permissioned chaincode and real-time AI anomaly detection engineered for verifiable, counterfeit-proof medicine supply chains.
              </p>
            </div>

            {/* Bottom Telemetry HUD Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                <Sparkles size={14} />
                <span>CONSENSUS & AUDIT TELEMETRY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Channel Status:</span>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>pharma-channel (mTLS Active)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Consensus Protocol:</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>Raft Quorum (3/3 Synced)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>AI Surveillance:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>0–100 Trust Score Radar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Authentication Terminal */}
          <div style={{
            background: '#04060a',
            padding: '2.5rem 3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Mode Switcher Tabs */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              marginBottom: '2rem'
            }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              >
                Create Account
              </button>
            </div>

            {/* Error & Success Feedback Banners */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                color: '#fda4af',
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                <AlertCircle size={17} style={{ flexShrink: 0 }} />
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
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                color: '#6ee7b7',
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ══════════ MODE: LOGIN ══════════════════════════════════════════ */}
            {mode === 'login' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                    Enterprise Portal Access
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Select a verified stakeholder role or authenticate with your email credentials.
                  </p>
                </div>

                {/* Quick 1-Click Demo Personas (Grid) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Quick One-Click Demo Personas
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
                    {DEMO_PRESETS.map((preset) => (
                      <button
                        key={preset.role}
                        type="button"
                        onClick={() => {
                          setEmail(preset.email);
                          setPassword('Dev@1234!');
                          handleLogin(preset.email);
                        }}
                        disabled={loading}
                        className="demo-persona-card"
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: preset.badgeColor }} />
                            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {preset.label}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {preset.org}
                          </div>
                        </div>
                        <ArrowRight size={14} color="#64748b" style={{ flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  margin: '1.5rem 0',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  <span>OR ENTER CREDENTIALS</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                </div>

                {/* Standard Manual Login Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      Enterprise Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="e.g. mfr.admin@demo.invalid"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setPassword('Dev@1234!')}
                        style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Reset to Demo
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="auth-input"
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      />
                      <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Vantor Signature Bracket Button for Submit */}
                  <div style={{ paddingTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={loading || !email}
                      className="vantor-bracket-btn"
                      style={{ width: '100%', padding: '0.95rem 2rem' }}
                    >
                      <span className="bracket-corner tl" />
                      <span className="bracket-corner tr" />
                      <span className="bracket-corner bl" />
                      <span className="bracket-corner br" />
                      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {loading ? 'Authenticating...' : 'Sign In to Portal'}
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══════════ MODE: REGISTER ═══════════════════════════════════════ */}
            {mode === 'register' && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                    Register Stakeholder Node
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Enroll your organization into the permissioned pharmaceutical ledger.
                  </p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Stakeholder Role Selector */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.45rem' }}>
                      Stakeholder Role
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem' }}>
                      {ROLE_OPTIONS.map((item) => {
                        const Icon = item.icon;
                        const isSelected = regRole === item.role;
                        return (
                          <button
                            key={item.role}
                            type="button"
                            onClick={() => setRegRole(item.role)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.65rem 0.4rem',
                              background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                              border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Icon size={16} color={isSelected ? '#38bdf8' : '#94a3b8'} style={{ marginBottom: '0.2rem' }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name Fields (2 Columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="auth-input"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Work Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        className="auth-input"
                        placeholder="john.doe@company.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  {/* Organization Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Organization Entity
                    </label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="auth-input"
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        style={{ paddingLeft: '2.5rem', appearance: 'none', background: '#090d16', color: '#ffffff' }}
                      >
                        {orgList.map(org => (
                          <option key={org.id} value={org.id} style={{ background: '#090d16', color: '#ffffff' }}>
                            {org.name} ({org.type})
                          </option>
                        ))}
                      </select>
                      <Building2 size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  {/* Password with Requirement Feedback */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.35rem' }}>
                      Password (min 8 chars, 1 uppercase, 1 number)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        className="auth-input"
                        placeholder="e.g. SecurePass2026!"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <Lock size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  {/* Submit Bracket Button */}
                  <div style={{ paddingTop: '0.4rem' }}>
                    <button
                      type="submit"
                      disabled={loading || !regEmail || !regPassword || !firstName || !lastName}
                      className="vantor-bracket-btn"
                      style={{ width: '100%', padding: '0.95rem 2rem' }}
                    >
                      <span className="bracket-corner tl" />
                      <span className="bracket-corner tr" />
                      <span className="bracket-corner bl" />
                      <span className="bracket-corner br" />
                      <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {loading ? 'Registering Node...' : 'Create Enterprise Account'}
                        <ArrowRight size={16} />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
