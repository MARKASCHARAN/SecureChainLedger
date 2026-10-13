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
            <span style={{ color: '#0f172a' }}>Safety Recalls</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '0.4rem'
          }}>
            Product Recalls & Quarantines
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '720px' }}>
            Decentralized emergency protocol: instantaneous network-wide notification, batch lockdown, and verified quarantine.
          </p>
        </div>

        {canInitiate && (
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              background: '#e11d48',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <AlertOctagon size={18} /> Initiate Drug Recall
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <div style={{
            background: '#090d16',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Loading safety records...
            </div>
            <div style={{ fontSize: '0.85rem' }}>Querying active emergency orders and quarantine state.</div>
          </div>
        ) : recalls.length === 0 ? (
          <div style={{
            background: '#090d16',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(52, 211, 153, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={32} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ffffff' }}>
              All Batches Certified Safe
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '440px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
              No active drug recalls or quarantine orders have been filed across the monitored supply chain network.
            </p>
          </div>
        ) : (
          recalls.map((recall) => (
            <div
              key={recall.id}
              style={{
                background: '#090d16',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(244, 63, 94, 0.15)', padding: '0.75rem', borderRadius: '12px' }}>
                    <AlertTriangle size={26} color="#fb7185" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff' }}>{recall.reason}</h3>
                      <span style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(244, 63, 94, 0.15)',
                        color: '#fb7185',
                        border: '1px solid rgba(244, 63, 94, 0.4)'
                      }}>
                        {recall.status}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '700px' }}>
                      {recall.description || 'Mandatory recall issued. Quarantine stock immediately.'}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.825rem', color: '#64748b' }}>
                  <div>Initiator: <strong style={{ color: '#ffffff' }}>{recall.initiator?.name}</strong></div>
                  <div>Issued: {new Date(recall.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{
                background: '#05070d',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid #1e293b'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                  Affected Batches ({recall.affectedBatches?.length || 0})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {recall.affectedBatches?.map((item) => (
                    <div
                      key={item.batchId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#fb7185',
                          marginRight: '0.75rem',
                          fontSize: '0.85rem'
                        }}>
                          {item.batch?.batchNumber}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                          {item.batch?.product?.genericName || 'Pharmaceutical Product'}
                        </span>
                      </div>

                      <div>
                        {item.acknowledgedAt ? (
                          <span style={{ color: '#34d399', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                            <CheckCircle2 size={14} /> Quarantine Confirmed ({new Date(item.acknowledgedAt).toLocaleDateString()})
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledge(recall.id, item.batchId)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              background: 'rgba(255, 255, 255, 0.06)',
                              color: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
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

      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            background: '#090d16',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Issue Emergency Recall Order</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInitiateRecall} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Batch to Recall
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    background: '#05070d',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  required
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id} style={{ background: '#090d16', color: '#ffffff' }}>
                      {b.batchNumber} — {b.product?.genericName} ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Recall Reason
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    background: '#05070d',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  placeholder="e.g. Sub-potency discovered during routine stability test"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                  Detailed Quarantine Instructions
                </label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    background: '#05070d',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  rows={3}
                  placeholder="Mandatory isolation of all remaining units in bio-sealed storage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.6rem 1.15rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !reason}
                  style={{
                    padding: '0.6rem 1.15rem',
                    borderRadius: '8px',
                    background: '#e11d48',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
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
