// client/src/components/Navbar.tsx
import React from 'react';
import { ShieldCheck, LogOut, UserCircle2, Layers, Truck, AlertTriangle, PackageCheck } from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'verify', label: 'Public Verification', icon: ShieldCheck, public: true },
    { id: 'batches', label: 'Batches & Catalog', icon: Layers, roles: ['MANUFACTURER', 'REGULATOR', 'ADMIN'] },
    { id: 'transfers', label: 'Custody Transfers', icon: Truck, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'inventory', label: 'Inventory', icon: PackageCheck, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'recalls', label: 'Safety & Recalls', icon: AlertTriangle, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
  ];

  const visibleItems = navItems.filter(item => {
    if (item.public) return true;
    if (!user) return false;
    return item.roles?.includes(user.role);
  });

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.85rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('verify')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={22} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              Secure<span style={{ color: '#10b981' }}>Chain</span>
            </span>
            <span style={{ 
              fontSize: '0.7rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              color: 'var(--text-muted)',
              display: 'block',
              marginTop: '-3px'
            }}>
              Ledger v1.0
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: isActive ? 'var(--border-accent)' : 'transparent',
                  background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                  color: isActive ? '#34d399' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', display: 'none', minWidth: '100px' }} className="user-details">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user.organization?.name || user.role}
                </div>
              </div>

              <span className="badge badge-authentic" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                <UserCircle2 size={13} />
                {user.role}
              </span>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.825rem' }}
                title="Sign out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.15rem' }}
            >
              <UserCircle2 size={16} />
              <span>Portal Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
