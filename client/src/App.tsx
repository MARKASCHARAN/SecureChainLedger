// client/src/App.tsx
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AppSidebar } from './components/AppSidebar';
import { AuthModal } from './components/AuthModal';
import { HeroHomePage } from './pages/HeroHomePage';
import { PublicVerificationPage } from './pages/PublicVerificationPage';
import { LedgerExplorerPage } from './pages/LedgerExplorerPage';
import { BatchesPage } from './pages/BatchesPage';
import { TransfersPage } from './pages/TransfersPage';
import { InventoryPage } from './pages/InventoryPage';
import { RecallsPage } from './pages/RecallsPage';
import { api, clearToken } from './services/api';
import type { User } from './types';
import { Database, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [verifyBatchNumber, setVerifyBatchNumber] = useState<string>('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await api.me();
        if (data?.user) {
          setUser(data.user);
        }
      } catch {
        clearToken();
      }
    };
    verifySession();
  }, []);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setActiveTab('home');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'MANUFACTURER') {
      setActiveTab('batches');
    } else if (loggedInUser.role === 'DISTRIBUTOR') {
      setActiveTab('transfers');
    } else {
      setActiveTab('inventory');
    }
  };

  const isWorkspaceView = user !== null && activeTab !== 'home';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: isWorkspaceView ? '#f8fafc' : undefined,
      color: isWorkspaceView ? '#0f172a' : undefined
    }}>
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'verify') setVerifyBatchNumber('');
          setActiveTab(tab);
        }}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        onOpenSearch={() => {
          setVerifyBatchNumber('');
          setActiveTab('verify');
        }}
      />

      {user ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
          <AppSidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab !== 'verify') setVerifyBatchNumber('');
              setActiveTab(tab);
            }}
            onLogout={handleLogout}
          />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
              {activeTab === 'batches' && (
                <BatchesPage user={user} onNavigateToTransfers={() => setActiveTab('transfers')} />
              )}
              {activeTab === 'transfers' && <TransfersPage user={user} />}
              {activeTab === 'inventory' && <InventoryPage user={user} />}
              {activeTab === 'recalls' && <RecallsPage user={user} />}
              {activeTab === 'ledger' && <LedgerExplorerPage />}
              {activeTab === 'verify' && <PublicVerificationPage initialBatchNumber={verifyBatchNumber} />}
            </main>

            {/* Authenticated Workspace Footer */}
            <footer style={{
              borderTop: '1px solid #e2e8f0',
              background: '#ffffff',
              padding: '1.25rem 2rem',
              marginTop: 'auto',
            }}>
              <div style={{
                maxWidth: '1440px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.825rem',
                color: '#64748b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>SecureChainLedger</span>
                  <span>— Dual-layer Cryptographic Pharmaceutical Supply Chain Architecture</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 600 }}>
                    <Cpu size={14} color="#0284c7" /> Hyperledger Fabric 2.5
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 600 }}>
                    <Database size={14} color="#059669" /> PostgreSQL
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      ) : (
        <main style={{ flex: 1 }}>
          {activeTab === 'home' && (
            <HeroHomePage
              onNavigateToVerify={(batch) => {
                if (batch) setVerifyBatchNumber(batch);
                setActiveTab('verify');
              }}
              onNavigateToLedger={() => setActiveTab('ledger')}
              onOpenAuth={handleOpenAuth}
            />
          )}
          {activeTab === 'verify' && <PublicVerificationPage initialBatchNumber={verifyBatchNumber} />}
          {activeTab === 'ledger' && <LedgerExplorerPage />}
        </main>
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
