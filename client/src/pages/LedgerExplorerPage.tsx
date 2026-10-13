import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, RefreshCw, ArrowUpRight, Copy, Check, FileCode2, X, Terminal, Server } from 'lucide-react';
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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.25rem' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(56, 189, 248, 0.1)',
            color: '#0284c7',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: '1px solid rgba(56, 189, 248, 0.25)',
            marginBottom: '0.85rem'
          }}>
            <Cpu size={14} /> Hyperledger Fabric v2.5 Network Explorer
          </div>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '0.4rem'
          }}>
            Immutable <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Ledger Audit Trail</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '720px' }}>
            Real-time on-chain transaction blocks, consensus state, and outbox reconciler sync queue.
          </p>
        </div>

        <button
          onClick={fetchLedger}
          disabled={loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            background: '#090d16',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: '1px solid #1e293b',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.15s ease'
          }}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              Ledger Consensus State
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 10px #34d399',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>SYNCHRONIZED</span>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            Peer: <code style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{outbox.peerEndpoint}</code>
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              Channel & Chaincode
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.01em', marginBottom: '0.4rem' }}>
              {outbox.channel}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            Smart Contract: <code style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{outbox.chaincode}</code>
          </div>
        </div>

        <div style={{
          background: '#090d16',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '1.6rem 1.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
              Outbox Event Queue
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff' }}>{outbox.processed}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>anchored</span>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({outbox.pending} pending)</span>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
            <CheckCircle2 size={13} /> Reconciler active & polling
          </div>
        </div>
      </div>

      <div style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.35)'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#05070d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Terminal size={18} color="#38bdf8" />
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              On-Chain Cryptographic Transactions ({transactions.length})
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: '#34d399',
            background: 'rgba(52, 211, 153, 0.1)',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid rgba(52, 211, 153, 0.25)'
          }}>
            <Server size={13} /> Verified Fabric 2.5 Blocks
          </div>
        </div>

        {loading && transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Polling blockchain gateway...
            </div>
            <div style={{ fontSize: '0.85rem' }}>Synchronizing state from Raft orderer nodes.</div>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <Cpu size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: '#ffffff' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
              No transactions committed on-chain yet
            </div>
            <p style={{ fontSize: '0.85rem' }}>
              Dispatch a batch or confirm a custody transfer to create immutable ledger entries.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Fabric Tx ID</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Event Type</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Batch Number</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Product</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Timestamp</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Status</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b', textAlign: 'right' }}>Payload</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{
                          fontFamily: 'monospace',
                          color: '#38bdf8',
                          fontSize: '0.825rem',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.25)'
                        }}>
                          {tx.fabricTxId ? `${tx.fabricTxId.slice(0, 14)}...` : `${tx.id.slice(0, 12)}...`}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.fabricTxId || tx.id, tx.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedId === tx.id ? '#34d399' : '#64748b',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Copy Tx Hash"
                        >
                          {copiedId === tx.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background:
                          tx.eventType === 'BATCH_CREATED'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : tx.eventType === 'CUSTODY_TRANSFERRED' || tx.eventType === 'RECEIPT_CONFIRMED'
                            ? 'rgba(56, 189, 248, 0.15)'
                            : tx.eventType === 'RECALL_INITIATED'
                            ? 'rgba(244, 63, 94, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          tx.eventType === 'BATCH_CREATED'
                            ? '#34d399'
                            : tx.eventType === 'CUSTODY_TRANSFERRED' || tx.eventType === 'RECEIPT_CONFIRMED'
                            ? '#38bdf8'
                            : tx.eventType === 'RECALL_INITIATED'
                            ? '#fb7185'
                            : '#fbbf24',
                        border:
                          tx.eventType === 'BATCH_CREATED'
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : tx.eventType === 'CUSTODY_TRANSFERRED' || tx.eventType === 'RECEIPT_CONFIRMED'
                            ? '1px solid rgba(56, 189, 248, 0.3)'
                            : tx.eventType === 'RECALL_INITIATED'
                            ? '1px solid rgba(244, 63, 94, 0.3)'
                            : '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {tx.eventType}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'monospace', color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                        {tx.batch?.batchNumber || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                        {tx.batch?.product?.brandName || 'Drug Item'}
                      </div>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontSize: '0.825rem', color: '#94a3b8' }}>
                      {tx.confirmedAt ? new Date(tx.confirmedAt).toLocaleTimeString() : new Date(tx.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: tx.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: tx.status === 'CONFIRMED' ? '#34d399' : '#fbbf24',
                        border: tx.status === 'CONFIRMED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                      }}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedTx(tx)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: '6px',
                          cursor: 'pointer'
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
          <div style={{
            maxWidth: '640px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            background: '#090d16',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>On-Chain Payload Detail</h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Event: <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{selectedTx.eventType}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <div><strong>Fabric Tx ID:</strong> <code style={{ fontFamily: 'monospace', color: '#ffffff' }}>{selectedTx.fabricTxId || selectedTx.id}</code></div>
              <div><strong>Batch:</strong> <code style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{selectedTx.batch?.batchNumber || 'N/A'}</code></div>
              <div><strong>Status:</strong> <span style={{ color: '#34d399', fontWeight: 600 }}>{selectedTx.status}</span></div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Cryptographic State Payload
            </div>
            <pre style={{
              background: '#05070d',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '1rem',
              color: '#34d399',
              fontSize: '0.825rem',
              fontFamily: 'monospace',
              overflowX: 'auto',
              maxHeight: '300px'
            }}>
              {JSON.stringify(selectedTx.payload, null, 2)}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedTx(null)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
