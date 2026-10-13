// client/src/pages/LedgerExplorerPage.tsx
import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, RefreshCw, ArrowUpRight, Copy, Check, FileCode2, X, Terminal } from 'lucide-react';
import { api } from '../services/api';

export const LedgerExplorerPage: React.FC = () => {
  const [data, setData] = useState<{ transactions: any[]; outbox: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await api.listLedgerTransactions();
      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch ledger transactions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const transactions = data?.transactions || [];
  const outbox = data?.outbox || {
    pending: 0,
    processed: 0,
    channel: 'pharma-channel',
    chaincode: 'securechain-cc',
    peerEndpoint: 'grpc://localhost:7051',
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.3rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Cpu size={14} /> Hyperledger Fabric v2.5 Network Explorer
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>
            Immutable <span className="text-gradient">Ledger Audit Trail</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time on-chain transaction blocks, consensus state, and outbox reconciler sync queue.
          </p>
        </div>

        <button
          onClick={fetchLedger}
          disabled={loading}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Network Health KPI Grid */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div className="form-label">Ledger Consensus State</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#34d399',
              boxShadow: '0 0 10px #34d399',
              display: 'inline-block'
            }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>SYNCHRONIZED</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Peer: <code className="font-mono">{outbox.peerEndpoint}</code>
          </div>
        </div>

        <div className="glass-card">
          <div className="form-label">Channel & Chaincode</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.25rem' }}>
            {outbox.channel}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Smart Contract: <code className="font-mono">{outbox.chaincode}</code>
          </div>
        </div>

        <div className="glass-card">
          <div className="form-label">Outbox Event Queue</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{outbox.processed}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>anchored</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({outbox.pending} pending)</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={13} /> Reconciler active & polling
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="#38bdf8" /> On-Chain Cryptographic Transactions ({transactions.length})
        </h3>

        {loading && transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Polling blockchain gateway...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Cpu size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No transactions committed on-chain yet.</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Dispatch a batch or confirm a custody transfer to create immutable ledger entries.
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Fabric Tx ID</th>
                  <th>Event Type</th>
                  <th>Batch Number</th>
                  <th>Product</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Payload</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="font-mono" style={{ color: '#38bdf8', fontSize: '0.825rem' }}>
                          {tx.fabricTxId ? `${tx.fabricTxId.slice(0, 14)}...` : `${tx.id.slice(0, 12)}...`}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.fabricTxId || tx.id, tx.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === tx.id ? '#34d399' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                          title="Copy Tx Hash"
                        >
                          {copiedId === tx.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        tx.eventType === 'BATCH_CREATED'
                          ? 'badge-authentic'
                          : tx.eventType === 'CUSTODY_TRANSFERRED' || tx.eventType === 'RECEIPT_CONFIRMED'
                          ? 'badge-transit'
                          : tx.eventType === 'RECALL_INITIATED'
                          ? 'badge-recalled'
                          : 'badge-pending'
                      }`} style={{ fontSize: '0.72rem' }}>
                        {tx.eventType}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>
                        {tx.batch?.batchNumber || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                        {tx.batch?.product?.brandName || 'Drug Item'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {tx.confirmedAt ? new Date(tx.confirmedAt).toLocaleTimeString() : new Date(tx.createdAt).toLocaleTimeString()}
                    </td>
                    <td>
                      <span className={`badge ${tx.status === 'CONFIRMED' ? 'badge-authentic' : 'badge-pending'}`} style={{ fontSize: '0.72rem' }}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="btn"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '0.25rem 0.6rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          borderRadius: '6px'
                        }}
                      >
                        <FileCode2 size={13} /> Inspect <ArrowUpRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Payload Modal */}
      {selectedTx && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>On-Chain Payload Detail</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Event: <span className="font-mono" style={{ color: '#38bdf8' }}>{selectedTx.eventType}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTx(null)} className="btn" style={{ padding: '0.35rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Fabric Tx ID:</strong> <code className="font-mono" style={{ color: '#fff' }}>{selectedTx.fabricTxId || selectedTx.id}</code></div>
              <div><strong>Batch:</strong> <code className="font-mono" style={{ color: '#38bdf8' }}>{selectedTx.batch?.batchNumber || 'N/A'}</code></div>
              <div><strong>Status:</strong> <span style={{ color: '#34d399' }}>{selectedTx.status}</span></div>
            </div>

            <div className="form-label" style={{ marginBottom: '0.4rem' }}>Cryptographic State Payload</div>
            <pre style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              color: '#34d399',
              fontSize: '0.825rem',
              fontFamily: 'var(--font-mono)',
              overflowX: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(selectedTx.payload, null, 2)}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setSelectedTx(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
