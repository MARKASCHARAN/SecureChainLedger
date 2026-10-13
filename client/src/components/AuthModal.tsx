import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { api, setToken } from '../services/api';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const DEMO_PRESETS = [
  { role: 'MANUFACTURER', label: 'Manufacturer Admin', email: 'mfr.admin@demo.invalid', org: 'Apex Pharma' },
  { role: 'DISTRIBUTOR', label: 'Distributor Admin', email: 'dist.admin@demo.invalid', org: 'National ColdChain' },
  { role: 'HOSPITAL', label: 'Hospital Admin', email: 'hosp.admin@demo.invalid', org: 'Metro General Hospital' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Dev@1234!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (overrideEmail?: string) => {
    const targetEmail = overrideEmail || email;
    if (!targetEmail || !password) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.login({ email: targetEmail, password });
      setToken(data.accessToken);
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(10px)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '2.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>Portal Sign In</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Access organization dashboard</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem',
            color: '#fda4af',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Quick Demo Role Shortcuts */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="form-label" style={{ marginBottom: '0.5rem' }}>Quick One-Click Demo Logins</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#38bdf8' }}>{preset.label}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{preset.org}</div>
                </div>
                <ArrowRight size={14} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Standard Manual Login Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. mfr.admin@demo.invalid"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
