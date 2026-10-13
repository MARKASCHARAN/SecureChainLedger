import React, { useState } from 'react';
import { 
  Layers, Truck, PackageCheck, AlertTriangle, 
  Database, QrCode, ShieldCheck, Search,
  Sparkles
} from 'lucide-react';
import type { User, UserRole } from '../types';

interface AppSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | null;
  roles: UserRole[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  activeTab,
  setActiveTab
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  // Primary Operational Navigation
  const mainNavItems: NavItem[] = [
    { 
      id: 'batches', 
      label: 'Batch Registry', 
      icon: Layers, 
      badge: user.role === 'MANUFACTURER' ? 'Active' : null, 
      roles: ['MANUFACTURER', 'REGULATOR', 'ADMIN'] 
    },
    { 
      id: 'transfers', 
      label: 'Custody Transfers', 
      icon: Truck, 
      badge: 'Live',
      roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] 
    },
    { 
      id: 'inventory', 
      label: 'Inventory Stock', 
      icon: PackageCheck, 
      badge: null,
      roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] 
    },
    { 
      id: 'recalls', 
      label: 'Safety & Recalls', 
      icon: AlertTriangle, 
      badge: null,
      roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] 
    },
  ];

  // Protocol & Audit Navigation
  const auditNavItems: NavItem[] = [
    { 
      id: 'ledger', 
      label: 'Ledger Telemetry', 
      icon: Database, 
      roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] 
    },
    { 
      id: 'verify', 
      label: 'GS1 Verification', 
      icon: QrCode, 
      roles: ['MANUFACTURER', 'DISTRIBUTOR', 'HOSPITAL', 'PHARMACY', 'REGULATOR', 'ADMIN'] 
    },
  ];

  const visibleMain = mainNavItems
    .filter(item => item.roles.includes(user.role))
    .filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()));

  const visibleAudit = auditNavItems
    .filter(item => item.roles.includes(user.role))
    .filter(item => !searchFilter || item.label.toLowerCase().includes(searchFilter.toLowerCase()));



  return (
    <aside style={{
      width: '280px',
      flexShrink: 0,
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px',
      zIndex: 40
    }}>
      {/* ─── Sidebar Header: Quick Search ───────────────────────────────── */}
      <div style={{ padding: '1.25rem 1.25rem 0.75rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search 
            size={15} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            type="text"
            placeholder="Search navigation..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              paddingLeft: '2.35rem',
              paddingRight: '0.85rem',
              fontSize: '0.85rem',
              color: '#0f172a',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#0f172a';
              e.currentTarget.style.background = '#ffffff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.background = '#f8fafc';
            }}
          />
        </div>
      </div>

      {/* ─── Sidebar Content Navigation ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
        {/* Main Menu Group */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 0.5rem 0.5rem'
          }}>
            Main Operations
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {visibleMain.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComp size={18} color={isActive ? '#ffffff' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '100px',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#ecfdf5',
                      color: isActive ? '#ffffff' : '#059669',
                      border: isActive ? 'none' : '1px solid #a7f3d0'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Protocol & Verification Group */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 0.5rem 0.5rem'
          }}>
            Ledger & Telemetry
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {visibleAudit.map((item) => {
              const isActive = activeTab === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#0f172a' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f1f5f9';
                      e.currentTarget.style.color = '#0f172a';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComp size={18} color={isActive ? '#ffffff' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Pro Workspace / Fabric Network Card (Matching Reference) ──── */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <div style={{
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)',
          padding: '1rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669'
            }}>
              <ShieldCheck size={16} />
            </div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Hyperledger Node
            </h5>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 0.75rem 0' }}>
            Raft consensus active with 4 peer MSPs. Zero ledger drift detected.
          </p>

          <div 
            onClick={() => setActiveTab('ledger')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              width: '100%',
              padding: '0.45rem',
              borderRadius: '6px',
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s ease'
            }}
          >
            <Sparkles size={13} color="#34d399" />
            <span>Channel: pharma-channel</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
