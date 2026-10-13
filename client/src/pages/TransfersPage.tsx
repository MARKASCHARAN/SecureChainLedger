import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import type { Transfer, User } from '../types';

interface TransfersPageProps {
  user: User;
}

export const TransfersPage: React.FC<TransfersPageProps> = ({ user }) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'INITIATED' | 'DELIVERED'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const data = await api.listTransfers();
      setTransfers(data.transfers || []);
    } catch (err: any) {
      console.error('Failed to load transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const handleConfirm = async (transferId: string) => {
    const notes = prompt('Enter receipt verification notes (e.g., "Inspected cold chain, all seals intact"):') || undefined;
    setActionLoading(transferId);
    try {
      await api.confirmReceipt(transferId, notes);
      await loadTransfers();
    } catch (err: any) {
      alert(`Receipt confirmation failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (transferId: string) => {
    const reason = prompt('Please specify reason for rejecting this transfer (e.g., "Tampered seal, temperature breach"):');
    if (!reason) return;
    setActionLoading(transferId);
    try {
      await api.rejectTransfer(transferId, reason);
      await loadTransfers();
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = transfers.filter((t) => {
    if (activeFilter === 'ALL') return true;
    return t.status === activeFilter;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.25rem' }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#64748b',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <span>SecureChain</span>
            <span>/</span>
            <span>Enterprise Workspace</span>
            <span>/</span>
            <span style={{ color: '#0f172a' }}>Custody Transfers</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '0.4rem'
          }}>
            Custody Handover & Shipments
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '720px' }}>
            Multi-party transfer protocol: verified dispatch, cold-chain receipt, and ownership transfer.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: '#090d16',
          border: '1px solid #1e293b',
          padding: '0.35rem',
          borderRadius: '10px'
        }}>
          {(['ALL', 'INITIATED', 'DELIVERED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '7px',
                cursor: 'pointer',
                border: 'none',
                background: activeFilter === filter ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: activeFilter === filter ? '#38bdf8' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              {filter === 'INITIATED' ? 'In Transit' : filter === 'ALL' ? 'All Transfers' : 'Delivered'}
            </button>
          ))}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Custody Transfer Waybills
            </div>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px'
            }}>
              {filtered.length} shipments
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.1)',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            <ShieldCheck size={14} /> Signed Chaincode Handshakes
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Loading custody transactions...
            </div>
            <div style={{ fontSize: '0.85rem' }}>Querying peer transfer logs and active shipments.</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8' }}>
            <Truck size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: '#ffffff' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.25rem' }}>
              No transfer events found
            </div>
            <p style={{ fontSize: '0.85rem' }}>No shipments matching current filter criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Batch / Item</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Custody Route</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Quantity</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Dispatched</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Status</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b' }}>Waybill Notes</th>
                  <th style={{ background: '#05070d', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '1rem 1.25rem', borderBottom: '1px solid #1e293b', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((xfer) => {
                  const isReceiver = xfer.receiverId === user.organizationId;
                  const canAct = isReceiver && (xfer.status === 'INITIATED' || xfer.status === 'IN_TRANSIT');

                  return (
                    <tr
                      key={xfer.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{
                          display: 'inline-block',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#38bdf8',
                          background: 'rgba(56, 189, 248, 0.1)',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          fontSize: '0.85rem',
                          marginBottom: '0.25rem'
                        }}>
                          {xfer.batch?.batchNumber || 'Batch Lot'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {xfer.batch?.product?.genericName || 'Pharmaceutical Formulation'}
                        </div>
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{xfer.sender?.name}</span>
                          <ArrowRight size={14} color="#38bdf8" />
                          <span style={{ color: '#34d399', fontWeight: 600 }}>{xfer.receiver?.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                        <strong style={{ color: '#ffffff', fontSize: '1rem' }}>{xfer.quantity.toLocaleString()}</strong> <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>units</span>
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontSize: '0.825rem', color: '#cbd5e1' }}>
                        {new Date(xfer.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: xfer.status === 'DELIVERED' ? 'rgba(16, 185, 129, 0.15)' : xfer.status === 'REJECTED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: xfer.status === 'DELIVERED' ? '#34d399' : xfer.status === 'REJECTED' ? '#fb7185' : '#38bdf8',
                          border: xfer.status === 'DELIVERED' ? '1px solid rgba(16, 185, 129, 0.3)' : xfer.status === 'REJECTED' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          {xfer.status === 'DELIVERED' ? 'Delivered' : xfer.status === 'REJECTED' ? 'Rejected' : 'In Transit'}
                        </span>
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', fontSize: '0.825rem', color: '#94a3b8', maxWidth: '240px' }}>
                        {xfer.notes || 'Standard logistics dispatch'}
                      </td>
                      <td style={{ padding: '1.15rem 1.25rem', verticalAlign: 'middle', textAlign: 'right' }}>
                        {canAct ? (
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleConfirm(xfer.id)}
                              disabled={actionLoading === xfer.id}
                              style={{
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: '#10b981',
                                color: '#000000',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <CheckCircle2 size={13} /> Confirm Receipt
                            </button>
                            <button
                              onClick={() => handleReject(xfer.id)}
                              disabled={actionLoading === xfer.id}
                              style={{
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                background: 'rgba(244, 63, 94, 0.15)',
                                color: '#fb7185',
                                border: '1px solid rgba(244, 63, 94, 0.35)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem'
                              }}
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        ) : xfer.status === 'DELIVERED' ? (
                          <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem', fontWeight: 600 }}>
                            <CheckCircle2 size={13} /> Custody Settled
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                            Awaiting Recipient
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
