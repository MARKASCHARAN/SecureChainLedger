import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Custody Handover & Shipments</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Multi-party transfer protocol: verified dispatch, cold-chain receipt, and ownership transfer.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
          {(['ALL', 'INITIATED', 'DELIVERED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="btn"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                background: activeFilter === filter ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeFilter === filter ? '#34d399' : 'var(--text-secondary)',
                border: 'none',
              }}
            >
              {filter === 'INITIATED' ? 'In Transit' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Transfers Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading custody transactions...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Truck size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No transfer events matching current criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Batch / Item</th>
                  <th>Custody Route</th>
                  <th>Quantity</th>
                  <th>Dispatched</th>
                  <th>Status</th>
                  <th>Waybill Notes</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((xfer) => {
                  const isReceiver = xfer.receiverId === user.organizationId;
                  const canAct = isReceiver && (xfer.status === 'INITIATED' || xfer.status === 'IN_TRANSIT');

                  return (
                    <tr key={xfer.id}>
                      <td>
                        <div className="font-mono" style={{ fontWeight: 600, color: '#38bdf8' }}>
                          {xfer.batch?.batchNumber || 'Batch Lot'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {xfer.batch?.product?.genericName}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                          <span style={{ color: '#fff', fontWeight: 600 }}>{xfer.sender?.name}</span>
                          <ArrowRight size={14} color="var(--accent-cyan)" />
                          <span style={{ color: '#34d399', fontWeight: 600 }}>{xfer.receiver?.name}</span>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#fff' }}>{xfer.quantity.toLocaleString()}</strong> units
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {new Date(xfer.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`badge ${
                          xfer.status === 'DELIVERED'
                            ? 'badge-authentic'
                            : xfer.status === 'REJECTED'
                            ? 'badge-recalled'
                            : 'badge-transit'
                        }`}>
                          {xfer.status === 'DELIVERED' ? 'Delivered' : xfer.status === 'REJECTED' ? 'Rejected' : 'In Transit'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                        {xfer.notes || 'Standard logistics dispatch'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {canAct ? (
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleConfirm(xfer.id)}
                              disabled={actionLoading === xfer.id}
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                            >
                              <CheckCircle2 size={13} /> Confirm Receipt
                            </button>
                            <button
                              onClick={() => handleReject(xfer.id)}
                              disabled={actionLoading === xfer.id}
                              className="btn btn-danger"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        ) : xfer.status === 'DELIVERED' ? (
                          <div style={{ fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
                            <CheckCircle2 size={13} /> Custody Settled
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
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
