import React, { useState, useEffect } from 'react';
import { Layers, Plus, CheckCircle2, Truck, ShieldCheck, X } from 'lucide-react';
import { api } from '../services/api';
import type { Batch, Product, User, Organization } from '../types';

interface BatchesPageProps {
  user: User;
  onNavigateToTransfers: () => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ user, onNavigateToTransfers }) => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
};
