import React, { useState, useEffect } from 'react';
import { Layers, Plus, CheckCircle2, Truck, ShieldCheck, X, Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Batch, Product, User, Organization, AiIntelligence } from '../types';

interface BatchesPageProps {
  user: User;
  onNavigateToTransfers: () => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ user, onNavigateToTransfers }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Inspection modal state
  const [selectedAiBatch, setSelectedAiBatch] = useState<AiIntelligence | null>(null);
  const [aiLoadingBatchId, setAiLoadingBatchId] = useState<string | null>(null);

  // New batch modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBatchNumber, setNewBatchNumber] = useState('');
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1000);
  const [newUnitPrice, setNewUnitPrice] = useState(25.0);
  const [newExpiresAt, setNewExpiresAt] = useState('');
  const [newQaHash, setNewQaHash] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Transfer modal state
  const [transferBatch, setTransferBatch] = useState<Batch | null>(null);
  const [transferReceiverId, setTransferReceiverId] = useState('');
  const [transferQty, setTransferQty] = useState(500);
  const [transferNotes, setTransferNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [batchData, prodData, orgData] = await Promise.all([
        api.listBatches().catch(() => ({ batches: [] })),
        api.listProducts().catch(() => ({ products: [] })),
        api.listOrganizations().catch(() => ({ organizations: [] })),
      ]);
      setBatches(batchData.batches || []);
      setProducts(prodData.products || []);
      setOrgs(orgData.organizations || []);
      if (prodData.products?.length > 0) {
        setNewProductId(prodData.products[0].id);
      }
    } catch (err: any) {
      console.error(err.message || 'Failed to load batch records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchNumber || !newProductId) return;
    setSubmitting(true);
    try {
      await api.createBatch({
        batchNumber: newBatchNumber,
        productId: newProductId,
        quantity: Number(newQuantity),
        unitPrice: Number(newUnitPrice),
        manufacturedAt: new Date().toISOString(),
        expiresAt: newExpiresAt ? new Date(newExpiresAt).toISOString() : new Date(Date.now() + 365*86400000).toISOString(),
        qaDocumentHash: newQaHash || undefined,
      });
      setShowCreateModal(false);
      setNewBatchNumber('');
      setNewQaHash('');
      await loadData();
    } catch (err: any) {
      alert(`Error creating batch: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveBatch = async (batchId: string) => {
    try {
      await api.approveBatch(batchId);
      await loadData();
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleInitiateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferBatch || !transferReceiverId) return;
    setSubmitting(true);
    try {
      await api.initiateTransfer({
        batchId: transferBatch.id,
        receiverId: transferReceiverId,
        quantity: Number(transferQty),
        notes: transferNotes,
      });
      setTransferBatch(null);
      await loadData();
      onNavigateToTransfers();
    } catch (err: any) {
      alert(`Transfer error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInspectAi = async (batchNumber: string) => {
    setAiLoadingBatchId(batchNumber);
    try {
      const data = await api.getBatchAiAnalysis(batchNumber);
      setSelectedAiBatch(data);
    } catch (err: any) {
      alert(`AI Analysis error: ${err.message}`);
    } finally {
      setAiLoadingBatchId(null);
    }
  };

  const isManufacturer = user.role === 'MANUFACTURER';

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Pharmaceutical Batch Registry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Anchored batches, QA compliance certification, and blockchain state status.
          </p>
        </div>

        {isManufacturer && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Register New Batch
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div className="form-label">Total Batches</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{batches.length}</div>
        </div>
        <div className="glass-card">
          <div className="form-label">Approved & Salable</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34d399' }}>
            {batches.filter(b => b.status === 'APPROVED' || b.status === 'DELIVERED').length}
          </div>
        </div>
        <div className="glass-card">
          <div className="form-label">In Custody Transit</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#38bdf8' }}>
            {batches.filter(b => b.status === 'IN_TRANSIT').length}
          </div>
        </div>
        <div className="glass-card">
          <div className="form-label">Recalled</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fb7185' }}>
            {batches.filter(b => b.status === 'RECALLED').length}
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading blockchain records...
          </div>
        ) : batches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Layers size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p>No pharmaceutical batches registered yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Batch Number</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Manufactured</th>
                  <th>Status</th>
                  <th>QA Certification</th>
                  <th>AI Surveillance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id}>
                    <td>
                      <span className="font-mono" style={{ fontWeight: 600, color: '#38bdf8' }}>
                        {batch.batchNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>
                        {batch.product?.brandName || 'Drug Product'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {batch.product?.genericName} ({batch.product?.strength})
                      </div>
                    </td>
                    <td>{batch.quantity?.toLocaleString()} units</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      {new Date(batch.manufacturedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${
                        batch.status === 'APPROVED' || batch.status === 'DELIVERED'
                          ? 'badge-authentic'
                          : batch.status === 'RECALLED'
                          ? 'badge-recalled'
                          : batch.status === 'IN_TRANSIT'
                          ? 'badge-transit'
                          : 'badge-pending'
                      }`}>
                        {batch.status}
                      </span>
                    </td>
                    <td>
                      {batch.qaApprovedAt ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#34d399', fontSize: '0.8rem' }}>
                          <CheckCircle2 size={14} /> Certified
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending QA</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleInspectAi(batch.batchNumber)}
                        disabled={aiLoadingBatchId === batch.batchNumber}
                        className="btn"
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38bdf8',
                          padding: '0.25rem 0.65rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Sparkles size={12} />
                        {aiLoadingBatchId === batch.batchNumber ? 'Analyzing...' : 'AI Insights'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        {isManufacturer && batch.status === 'PENDING_QA' && (
                          <button
                            onClick={() => handleApproveBatch(batch.id)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                          >
                            <ShieldCheck size={14} /> Approve QA
                          </button>
                        )}
                        {isManufacturer && batch.status === 'APPROVED' && (
                          <button
                            onClick={() => setTransferBatch(batch)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                          >
                            <Truck size={14} /> Dispatch Transfer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Register New Batch */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem' }}>Register New Pharma Batch</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Product</label>
                <select
                  className="form-input"
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id} style={{ background: '#0d121f' }}>
                      {p.brandName} — {p.genericName} ({p.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Batch Number / Lot ID</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. BATCH-2026-X01"
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Units Produced</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Expiration Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={newExpiresAt}
                  onChange={(e) => setNewExpiresAt(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">QA Certificate Hash (SHA-256)</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="Optional cert hash or off-chain digest"
                  value={newQaHash}
                  onChange={(e) => setNewQaHash(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Registering...' : 'Anchor on Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dispatch Custody Transfer */}
      {transferBatch && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Dispatch Batch Custody</h3>
              <button onClick={() => setTransferBatch(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Initiating transfer reserves stock and creates an immutable custody record for batch <strong style={{ color: '#fff' }}>{transferBatch.batchNumber}</strong>.
            </p>

            <form onSubmit={handleInitiateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Recipient Organization</label>
                <select
                  className="form-input"
                  value={transferReceiverId}
                  onChange={(e) => setTransferReceiverId(e.target.value)}
                  required
                >
                  <option value="" style={{ background: '#0d121f' }}>Select recipient distributor or hospital</option>
                  {orgs
                    .filter(o => o.id !== user.organizationId)
                    .map(o => (
                      <option key={o.id} value={o.id} style={{ background: '#0d121f' }}>
                        {o.name} ({o.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="form-label">Transfer Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  min={1}
                  max={transferBatch.quantity}
                  required
                />
              </div>

              <div>
                <label className="form-label">Shipment Notes / Waybill</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Cold-chain seal #9021, dispatched via DHL Medical"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setTransferBatch(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || !transferReceiverId} className="btn btn-primary">
                  {submitting ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Provenance & Anomaly Surveillance */}
      {selectedAiBatch && (
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
          <div className="glass-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>AI Provenance Intelligence</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Batch: <span className="font-mono" style={{ color: '#fff' }}>{selectedAiBatch.batchNumber}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAiBatch(null)} className="btn" style={{ padding: '0.35rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Score & Risk Level */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Provenance Integrity Score</div>
                <div style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: selectedAiBatch.provenanceScore >= 85 ? '#34d399' : selectedAiBatch.provenanceScore >= 70 ? '#fbbf24' : '#fb7185',
                }}>
                  {selectedAiBatch.provenanceScore}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assessed Risk Profile</div>
                <span className={`badge ${selectedAiBatch.riskLevel === 'LOW' ? 'badge-authentic' : selectedAiBatch.riskLevel === 'MODERATE' ? 'badge-pending' : 'badge-recalled'}`} style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  {selectedAiBatch.ratingLabel}
                </span>
              </div>
            </div>

            {/* Anomalies List */}
            {selectedAiBatch.anomalies && selectedAiBatch.anomalies.length > 0 ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fb7185', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} /> Flagged Anomaly Signals ({selectedAiBatch.anomalies.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedAiBatch.anomalies.map((anom, idx) => (
                    <div key={idx} style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fda4af' }}>
                        [{anom.severity}] {anom.type.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {anom.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                marginBottom: '1.25rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={20} color="#34d399" />
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  <strong>Zero Anomalies Detected.</strong> Cryptographic custody flow matches authentic baseline distribution.
                </div>
              </div>
            )}

            {/* Audit Summary & Recommendation */}
            {selectedAiBatch.auditSummary && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  AI Recommendation
                </div>
                <div style={{ fontSize: '0.925rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  "{selectedAiBatch.auditSummary.recommendation}"
                </div>
              </div>
            )}

            {/* Positive & Negative Factors */}
            {selectedAiBatch.scoreBreakdown && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {selectedAiBatch.scoreBreakdown.bonuses?.map((b, i) => (
                  <span key={i} style={{ fontSize: '0.725rem', background: 'rgba(16, 185, 129, 0.1)', color: '#a7f3d0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ✓ {b}
                  </span>
                ))}
                {selectedAiBatch.scoreBreakdown.deductions?.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.725rem', background: 'rgba(244, 63, 94, 0.1)', color: '#fda4af', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    ⚠ {d}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setSelectedAiBatch(null)} className="btn btn-secondary">
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
