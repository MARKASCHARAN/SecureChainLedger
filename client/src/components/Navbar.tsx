// client/src/components/Navbar.tsx
import React, { useState } from 'react';
import { 
  LogOut, Layers, Truck, AlertTriangle, 
  PackageCheck, Search, Menu, X, Database, QrCode
} from 'lucide-react';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenAuth,
  onOpenSearch,
}) => {
  const [productsOpen, setProductsOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated operational workspace items
  const authenticatedItems = [
    { id: 'batches', label: 'Batches & Catalog', icon: Layers, roles: ['MANUFACTURER', 'REGULATOR', 'ADMIN'] },
    { id: 'transfers', label: 'Custody Transfers', icon: Truck, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'inventory', label: 'Inventory', icon: PackageCheck, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'recalls', label: 'Safety & Recalls', icon: AlertTriangle, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'ledger', label: 'Ledger Telemetry', icon: Database, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
    { id: 'verify', label: 'GS1 Verification', icon: QrCode, roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] },
  ];

  const visibleAuthItems = user ? authenticatedItems.filter(item => item.roles.includes(user.role)) : [];

  // =========================================================================
  // AUTHENTICATED CONSOLE NAVBAR (When User Is Logged In)
  // =========================================================================
  if (user) {
    const roleLabel = user.role === 'MANUFACTURER' 
      ? 'Manufacturer Console' 
      : user.role === 'REGULATOR' 
      ? 'Regulator Oversight Hub' 
      : `${user.role} Workspace`;

    return (
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 1.75rem',
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Brand + Console Identifier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div 
              onClick={() => setActiveTab(user.role === 'MANUFACTURER' ? 'batches' : 'inventory')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="16" cy="16" r="7" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="16" cy="16" r="3" fill="#0f172a" />
                <line x1="16" y1="2" x2="16" y2="8" stroke="#0f172a" strokeWidth="2" />
                <line x1="16" y1="24" x2="16" y2="30" stroke="#0f172a" strokeWidth="2" />
                <line x1="2" y1="16" x2="8" y2="16" stroke="#0f172a" strokeWidth="2" />
                <line x1="24" y1="16" x2="30" y2="16" stroke="#0f172a" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
                SecureChain
              </span>
            </div>

            <div style={{ width: '1px', height: '18px', background: '#e2e8f0' }} />

            <span style={{
              background: '#f1f5f9',
              color: '#475569',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              letterSpacing: '0.02em'
            }}>
              {roleLabel}
            </span>
          </div>

          {/* Center: Operational Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            {visibleAuthItems.map(item => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: isActive ? '#0f172a' : '#64748b',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 0.2rem',
                    borderBottom: isActive ? '2px solid #0f172a' : '2px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <IconComp size={15} color={isActive ? '#0f172a' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Telemetry Health, Org Pill, User & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            {/* Quick Search */}
            <button
              onClick={() => { setActiveTab('verify'); if (onOpenSearch) onOpenSearch(); }}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '0.4rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8rem',
                color: '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Quick Search Batches & Ledgers"
            >
              <Search size={14} color="#64748b" />
              <span className="search-hint">Search GS1 / Batch</span>
            </button>

            {/* Node Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#15803d'
            }} className="desktop-nav">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span>Peer 0 • Synced</span>
            </div>

            {/* Role Badge */}
            <span style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              {user.role}
            </span>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                borderRadius: '6px',
                padding: '0.38rem 0.8rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // PUBLIC MARKETING NAVBAR (When User Is Logged Out)
  // =========================================================================
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#ffffff',
      color: '#000000',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 12px rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 1.75rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo (Matching Vantor aperture + wordmark) */}
        <div 
          onClick={() => { setActiveTab('home'); setProductsOpen(false); setIndustriesOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          {/* Custom geometric aperture / iris logo */}
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#000000" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="7" stroke="#000000" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="16" cy="16" r="3" fill="#000000" />
            <line x1="16" y1="2" x2="16" y2="8" stroke="#000000" strokeWidth="2" />
            <line x1="16" y1="24" x2="16" y2="30" stroke="#000000" strokeWidth="2" />
            <line x1="2" y1="16" x2="8" y2="16" stroke="#000000" strokeWidth="2" />
            <line x1="24" y1="16" x2="30" y2="16" stroke="#000000" strokeWidth="2" />
          </svg>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#000000' }}>
            SecureChain
          </span>
        </div>

        {/* Center Nav Links (Matching Vantor nav links with °) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {/* Products ° Mega-Menu Trigger */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => { setProductsOpen(true); setIndustriesOpen(false); }}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              onClick={() => { setProductsOpen(!productsOpen); setIndustriesOpen(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: productsOpen ? '#000000' : '#374151',
                fontSize: '0.925rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0',
                borderBottom: productsOpen ? '2px solid #000000' : '2px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Products</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>°</span>
            </button>

            {/* Mega Menu Dropdown */}
            {productsOpen && (
              <div style={{
                position: 'fixed',
                top: '70px',
                left: 0,
                right: 0,
                background: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                padding: '2.5rem 2rem 3rem',
                zIndex: 99
              }}>
                <div style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '3rem'
                }}>
                  {/* Column 1 */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                      Provenance Platform
                    </div>
                    <div 
                      onClick={() => { setActiveTab('ledger'); setProductsOpen(false); }}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', cursor: 'pointer', marginBottom: '0.85rem' }}
                    >
                      Hyperledger Fabric
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                      <div onClick={() => { setActiveTab('ledger'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Smart Contracts</div>
                      <div onClick={() => { setActiveTab('ledger'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Outbox Reconciler</div>
                      <div onClick={() => { setActiveTab('ledger'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Raft Consensus</div>
                      <div onClick={() => { setActiveTab('ledger'); setProductsOpen(false); }} style={{ fontWeight: 700, color: '#000000', marginTop: '0.5rem', cursor: 'pointer' }}>Node Hub</div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                      AI Surveillance
                    </div>
                    <div 
                      onClick={() => { setActiveTab('verify'); setProductsOpen(false); }}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', cursor: 'pointer', marginBottom: '0.85rem' }}
                    >
                      Anomaly Engine
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Velocity & Transit</div>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Geo-Scan Clones</div>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ 0–100 Trust Score</div>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Heuristic Policies</div>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                      Dynamic Foundation
                    </div>
                    <div 
                      onClick={() => { setActiveTab('verify'); setProductsOpen(false); }}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', cursor: 'pointer', marginBottom: '0.85rem' }}
                    >
                      Verification
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ GS1 DataMatrix</div>
                      <div onClick={() => { setActiveTab('verify'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ QA Hash Anchors</div>
                      <div onClick={() => { setActiveTab('batches'); setProductsOpen(false); }} style={{ cursor: 'pointer' }}>↳ Batch Registry</div>
                    </div>
                  </div>

                  {/* Column 4 */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                      Enterprise Custody
                    </div>
                    <div 
                      onClick={() => { setActiveTab('transfers'); setProductsOpen(false); }}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', cursor: 'pointer', marginBottom: '0.85rem' }}
                    >
                      Transfers
                    </div>
                    <div 
                      onClick={() => { setActiveTab('recalls'); setProductsOpen(false); }}
                      style={{ fontSize: '1.25rem', fontWeight: 700, color: '#000000', cursor: 'pointer' }}
                    >
                      Emergency Recalls
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Industries ° Dropdown Trigger */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => { setIndustriesOpen(true); setProductsOpen(false); }}
            onMouseLeave={() => setIndustriesOpen(false)}
          >
            <button
              onClick={() => { setIndustriesOpen(!industriesOpen); setProductsOpen(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: industriesOpen ? '#000000' : '#374151',
                fontSize: '0.925rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.5rem 0',
                borderBottom: industriesOpen ? '2px solid #000000' : '2px solid transparent',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Industries</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>°</span>
            </button>

            {/* Industries Dropdown */}
            {industriesOpen && (
              <div style={{
                position: 'absolute',
                top: '55px',
                left: 0,
                width: '320px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 16px 32px rgba(0,0,0,0.08)',
                padding: '2rem 1.75rem',
                zIndex: 99
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                  Industries
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', fontWeight: 700, color: '#000000' }}>
                  <div onClick={() => { setActiveTab('batches'); setIndustriesOpen(false); }} style={{ cursor: 'pointer' }}>Defense & Health</div>
                  <div onClick={() => { setActiveTab('batches'); setIndustriesOpen(false); }} style={{ cursor: 'pointer' }}>Manufacturers</div>
                  <div onClick={() => { setActiveTab('transfers'); setIndustriesOpen(false); }} style={{ cursor: 'pointer' }}>3PL & Logistics</div>
                  <div onClick={() => { setActiveTab('inventory'); setIndustriesOpen(false); }} style={{ cursor: 'pointer' }}>Hospital Networks</div>
                  <div onClick={() => { setActiveTab('verify'); setIndustriesOpen(false); }} style={{ cursor: 'pointer' }}>Regulators (CDSCO / FDA)</div>
                </div>
              </div>
            )}
          </div>

          {/* Public Verification */}
          <button
            onClick={() => { setActiveTab('verify'); setProductsOpen(false); setIndustriesOpen(false); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'verify' ? '#000000' : '#374151',
              fontWeight: 600,
              fontSize: '0.925rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'verify' ? '2px solid #000000' : '2px solid transparent',
              padding: '0.5rem 0'
            }}
          >
            Public Verification
          </button>

          {/* Ledger Explorer */}
          <button
            onClick={() => { setActiveTab('ledger'); setProductsOpen(false); setIndustriesOpen(false); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'ledger' ? '#000000' : '#374151',
              fontWeight: 600,
              fontSize: '0.925rem',
              cursor: 'pointer',
              borderBottom: activeTab === 'ledger' ? '2px solid #000000' : '2px solid transparent',
              padding: '0.5rem 0'
            }}
          >
            Ledger Explorer
          </button>
        </nav>

        {/* Right Section: Search & Auth Portal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Quick Search Button */}
          <button
            onClick={() => { setActiveTab('verify'); if (onOpenSearch) onOpenSearch(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.4rem',
            }}
            title="Search & Verify Batches"
          >
            <Search size={19} />
          </button>

          {/* Guest Action: Sign In & Register */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => onOpenAuth('login')}
              style={{
                background: 'transparent',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '0.5rem 0.95rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              style={{
                background: '#000000',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.55rem 1.15rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                transition: 'opacity 0.2s ease'
              }}
            >
              Register Node
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#000000',
              cursor: 'pointer',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} style={{ fontWeight: 600, cursor: 'pointer' }}>Home</div>
          <div onClick={() => { setActiveTab('verify'); setMobileMenuOpen(false); }} style={{ fontWeight: 600, cursor: 'pointer' }}>Public Verification</div>
          <div onClick={() => { setActiveTab('ledger'); setMobileMenuOpen(false); }} style={{ fontWeight: 600, cursor: 'pointer' }}>Ledger Explorer</div>
        </div>
      )}
    </header>
  );
};
