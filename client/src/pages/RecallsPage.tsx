import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';
import type { Recall, Batch, User } from '../types';

interface RecallsPageProps {
  user: User;
}

export const RecallsPage: React.FC<RecallsPageProps> = ({ user }) => {
  const [recalls, setRecalls] = useState<Recall[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  // New Recall Modal
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recallData, batchData] = await Promise.all([
        api.listRecalls().catch(() => ({ recalls: [] })),
        api.listBatches().catch(() => ({ batches: [] })),
      ]);
      setRecalls(recallData.recalls || []);
      setBatches(batchData.batches || []);
      if (batchData.batches?.length > 0) {
        setSelectedBatchId(batchData.batches[0].id);
      }
    } catch (err) {
      console.error('Failed to load recalls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInitiateRecall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !selectedBatchId) return;
    setSubmitting(true);
    try {
      await api.initiateRecall({
        reason,
        description,
        batchIds: [selectedBatchId],
      });
      setShowModal(false);
      setReason('');
      setDescription('');
      await loadData();
    } catch (err: any) {
      alert(`Recall trigger error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async (recallId: string, batchId: string) => {
    const notes = prompt('Enter quarantine verification note (e.g., "Isolated 300 units in locked bio-storage"):');
    if (notes === null) return;
    try {
      await api.acknowledgeRecall(recallId, batchId, notes);
      await loadData();
    } catch (err: any) {
      alert(`Acknowledgement error: ${err.message}`);
    }
  };

  const canInitiate = user.role === 'REGULATOR' || user.role === 'ADMIN' || user.role === 'MANUFACTURER';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Safety Recalls & Quarantines</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Decentralized emergency protocol: instantaneous network-wide notification, batch lockdown, and verified quarantine.
          </p>
        </div>

        {canInitiate && (
          <button onClick={() => setShowModal(true)} className="btn btn-danger">
            <AlertOctagon size={18} /> Initiate Drug Recall
          </button>
        )}
      </div>

      {/* Recalls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading safety recalls...
          </div>
        ) : recalls.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <CheckCircle2 size={44} color="#34d399" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>All Batches Certified Safe</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
              No active drug recalls or quarantine orders have been filed across the monitored supply chain.
            </p>
          </div>
        ) : (
          recalls.map((recall) => (
            <div key={recall.id} className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.35)', background: 'rgba(244, 63, 94, 0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
                    <AlertTriangle size={26} color="#fb7185" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.25rem', color: '#fda4af' }}>{recall.reason}</h3>
                      <span className="badge badge-recalled">{recall.status}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {recall.description || 'Mandatory recall issued. Quarantine stock immediately.'}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <div>Initiator: <strong style={{ color: '#fff' }}>{recall.initiator?.name}</strong></div>
                  <div>Issued: {new Date(recall.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Affected Batches */}
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Affected Batches ({recall.affectedBatches?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {recall.affectedBatches?.map((item) => (
                    <div
                      key={item.batchId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '6px',
                      }}
                    >
                      <div>
                        <span className="font-mono" style={{ fontWeight: 600, color: '#fb7185', marginRight: '0.75rem' }}>
                          {item.batch?.batchNumber}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {item.batch?.product?.genericName}
                        </span>
                      </div>

                      <div>
                        {item.acknowledgedAt ? (
                          <span style={{ color: '#34d399', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={14} /> Quarantine Confirmed ({new Date(item.acknowledgedAt).toLocaleDateString()})
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(recall.id, item.batchId)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                          >
                            <ShieldAlert size={14} /> Acknowledge Quarantine
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Initiate Drug Recall */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', borderColor: '#f43f5e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fda4af' }}>Issue Emergency Recall Order</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInitiateRecall} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Batch to Recall</label>
                <select
                  className="form-input"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  required
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id} style={{ background: '#0d121f' }}>
                      {b.batchNumber} — {b.product?.genericName} (Status: {b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Recall Reason</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sub-potency discovered during routine stability test"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Detailed Quarantine Instructions</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Mandatory isolation of all remaining units in bio-sealed storage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || !reason} className="btn btn-danger">
                  {submitting ? 'Broadcasting...' : 'Broadcast Emergency Recall'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
