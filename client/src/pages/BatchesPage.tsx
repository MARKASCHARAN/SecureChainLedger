// client/src/pages/BatchesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, Plus, CheckCircle2, Truck, ShieldCheck, 
  X, Sparkles, AlertTriangle, Package, Search
} from 'lucide-react';
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

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // AI Inspection modal state
  const [selectedAiBatch, setSelectedAiBatch] = useState<AiIntelligence | null>(null);
  const [aiLoadingBatchId, setAiLoadingBatchId] = useState<string | null>(null);

  // New product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [prodBrandName, setProdBrandName] = useState('');
  const [prodGenericName, setProdGenericName] = useState('');
  const [prodFormulation, setProdFormulation] = useState('Tablet');
  const [prodStrength, setProdStrength] = useState('500mg');
  const [prodScheduled, setProdScheduled] = useState(false);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBatchNumber, setNewBatchNumber] = useState('');
  const [newProductId, setNewProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState(1000);
  const [newUnitPrice, setNewUnitPrice] = useState(25.0);
  const [newExpiresAt, setNewExpiresAt] = useState('');
  const [newQaHash, setNewQaHash] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [transferBatch, setTransferBatch] = useState<Batch | null>(null);
  const [transferReceiverId, setTransferReceiverId] = useState('');
  const [transferQty, setTransferQty] = useState(500);
  const [transferNotes, setTransferNotes] = useState('');

  const openCreateModal = () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2);
    setNewExpiresAt(futureDate.toISOString().split('T')[0]);
    if (products.length > 0 && !newProductId) {
      setNewProductId(products[0].id);
    }
    setShowCreateModal(true);
  };

  const openTransferModal = (batch: Batch) => {
    setTransferBatch(batch);
    setTransferQty(Math.min(batch.quantity, 500));
    setTransferNotes('');
    const eligible = orgs.filter(o => o.id !== user.organizationId && o.type !== 'REGULATOR');
    if (eligible.length > 0) {
      setTransferReceiverId(eligible[0].id);
    } else {
      setTransferReceiverId('');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [batchData, prodData, orgData] = await Promise.all([
        api.listBatches().catch(() => ({ batches: [] })),
        api.listProducts().catch(() => ({ products: [] })),
        api.listOrganizations().catch(() => api.getOrganizations()).catch(() => ({ organizations: [] })),
      ]);
      setBatches(batchData.batches || []);
      setProducts(prodData.products || []);
      const orgList = (orgData as any)?.organizations || (orgData as any)?.orgs || [];
      setOrgs(orgList);
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

  useEffect(() => {
    if (transferBatch && !transferReceiverId && orgs.length > 0) {
      const eligible = orgs.filter(o => o.id !== user.organizationId && o.type !== 'REGULATOR');
      if (eligible.length > 0) {
        setTransferReceiverId(eligible[0].id);
      }
    }
  }, [transferBatch, orgs, user.organizationId, transferReceiverId]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodBrandName || !prodGenericName) return;
    setSubmittingProduct(true);
    try {
      const res = await api.createProduct({
        brandName: prodBrandName.trim(),
        genericName: prodGenericName.trim(),
        formulation: prodFormulation,
        strength: prodStrength.trim(),
        scheduledDrug: prodScheduled,
      });
      setShowProductModal(false);
      setProdBrandName('');
      setProdGenericName('');
      await loadData();
      if (res?.product?.id) {
        setNewProductId(res.product.id);
      }
    } catch (err: any) {
      alert(`Error creating product: ${err.message}`);
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchNumber.trim()) {
      alert('Please enter a valid Batch Number / Lot ID.');
      return;
    }
    if (!newProductId) {
      alert('Please select a Drug Product.');
      return;
    }
    const expDate = newExpiresAt ? new Date(newExpiresAt) : new Date(Date.now() + 365 * 86400000 * 2);
    if (isNaN(expDate.getTime()) || expDate <= new Date()) {
      alert('Expiration date must be in the future.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createBatch({
        batchNumber: newBatchNumber.trim(),
        productId: newProductId,
        quantity: Number(newQuantity),
        unitPrice: Number(newUnitPrice),
        manufacturedAt: new Date().toISOString(),
        expiresAt: expDate.toISOString(),
        qaDocumentHash: newQaHash.trim() || undefined,
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
    if (!transferBatch) return;
    if (!transferReceiverId) {
      alert('Please select a recipient organization before dispatching.');
      return;
    }
    if (transferQty <= 0 || transferQty > transferBatch.quantity) {
      alert(`Please enter a transfer quantity between 1 and ${transferBatch.quantity}.`);
      return;
    }
    setSubmitting(true);
    try {
      await api.initiateTransfer({
        batchId: transferBatch.id,
        receiverId: transferReceiverId,
        quantity: Number(transferQty),
        notes: transferNotes.trim() || undefined,
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

  // Filtered batch rows
  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        b.batchNumber.toLowerCase().includes(query) ||
        b.product?.brandName?.toLowerCase().includes(query) ||
        b.product?.genericName?.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [batches, searchQuery, statusFilter]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>
      {/* ─── Breadcrumb & Header ────────────────────────────────────────── */}
      <div style={{ marginBottom: '2.25rem' }}>
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
          <span style={{ color: '#0f172a' }}>Batch Registry</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '0.4rem'
            }}>
              Pharmaceutical Batch Registry
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '720px' }}>
              Anchored GS1 DataMatrix batches, QA compliance certification, and Hyperledger Fabric cryptographic state.
            </p>
          </div>

          {isManufacturer && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowProductModal(true)}
                className="light-btn-secondary"
              >
                <Package size={17} color="#475569" />
                <span>Add Drug Product</span>
              </button>
              <button
                onClick={openCreateModal}
                className="light-btn-emerald"
              >
                <Plus size={18} />
                <span>Register New Batch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Stats KPI Row (Light Surface Cards) ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Batches */}
        <div className="light-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Batches
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={17} color="#0f172a" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {batches.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Cryptographically anchored to Fabric
          </div>
        </div>

        {/* Approved & Salable */}
        <div className="light-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Approved & Salable
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={17} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#059669', lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {batches.filter(b => b.status === 'APPROVED' || b.status === 'DELIVERED').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            QA certified & available for dispatch
          </div>
        </div>

        {/* In Custody Transit */}
        <div className="light-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              In Custody Transit
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={17} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0284c7', lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {batches.filter(b => b.status === 'IN_TRANSIT').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Active logistics & 3PL waybills
          </div>
        </div>

        {/* Recalled */}
        <div className="light-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recalled / Quarantine
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={17} color="#e11d48" />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#e11d48', lineHeight: 1.1, marginBottom: '0.35rem' }}>
            {batches.filter(b => b.status === 'RECALLED').length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Emergency compliance quarantine
          </div>
        </div>
      </div>

      {/* ─── Batches Table Container ─────────────────────────────────────── */}
      <div className="light-table-container">
        {/* Table Controls Header Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#ffffff'
        }}>
          {/* Search input */}
          <div style={{ position: 'relative', maxWidth: '340px', width: '100%' }}>
            <input
              type="text"
              placeholder="Filter by batch number, brand or generic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="light-input"
              style={{ paddingLeft: '2.35rem' }}
            />
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Status Filter Tabs & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
              {['ALL', 'APPROVED', 'IN_TRANSIT', 'PENDING_QA', 'RECALLED'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  style={{
                    background: statusFilter === status ? '#ffffff' : 'transparent',
                    border: 'none',
                    color: statusFilter === status ? '#0f172a' : '#64748b',
                    fontWeight: statusFilter === status ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: statusFilter === status ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {status === 'ALL' ? 'All Batches' : status.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {filteredBatches.length} batch{filteredBatches.length === 1 ? '' : 'es'}
            </span>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>Loading blockchain ledger records...</div>
            <div style={{ fontSize: '0.85rem' }}>Querying peer nodes and verifiable state anchors.</div>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
            <Layers size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: '#0f172a' }} />
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>No batch records found</div>
            <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              {searchQuery || statusFilter !== 'ALL' 
                ? 'Try resetting the search filters or status tags to view all ledger entries.' 
                : 'Click "Register New Batch" above to anchor your first pharmaceutical lot on the blockchain.'}
            </p>
            {isManufacturer && (
              <button onClick={openCreateModal} className="light-btn-primary">
                <Plus size={16} /> Register First Batch
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="light-table">
              <thead>
                <tr>
                  <th>Batch Number</th>
                  <th>Drug Product</th>
                  <th>Quantity</th>
                  <th>Manufactured</th>
                  <th>Status</th>
                  <th>QA Certification</th>
                  <th>AI Surveillance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr key={batch.id}>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: '#0284c7',
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        {batch.batchNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.925rem' }}>
                        {batch.product?.brandName || 'Drug Product'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {batch.product?.genericName} ({batch.product?.strength})
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {batch.quantity?.toLocaleString()}
                      </span>{' '}
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>units</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {new Date(batch.manufacturedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      {batch.status === 'APPROVED' || batch.status === 'DELIVERED' ? (
                        <span className="light-badge-approved">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                          {batch.status}
                        </span>
                      ) : batch.status === 'RECALLED' ? (
                        <span className="light-badge-recalled">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e11d48' }} />
                          {batch.status}
                        </span>
                      ) : batch.status === 'IN_TRANSIT' ? (
                        <span className="light-badge-transit">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }} />
                          {batch.status}
                        </span>
                      ) : (
                        <span className="light-badge-pending">
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d97706' }} />
                          {batch.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {batch.qaApprovedAt ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontSize: '0.825rem', fontWeight: 600 }}>
                          <CheckCircle2 size={15} color="#059669" /> Certified
                        </div>
                      ) : (
                        <span style={{ color: '#d97706', fontSize: '0.8rem', fontWeight: 500, background: '#fffbeb', padding: '0.2rem 0.45rem', borderRadius: '4px', border: '1px solid #fde68a' }}>
                          Pending QA
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleInspectAi(batch.batchNumber)}
                        disabled={aiLoadingBatchId === batch.batchNumber}
                        className="light-btn-ai"
                      >
                        <Sparkles size={13} />
                        <span>{aiLoadingBatchId === batch.batchNumber ? 'Analyzing...' : 'AI Insights'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        {isManufacturer && (batch.status === 'PENDING_QA' || batch.status === 'DRAFT') && (
                          <button
                            onClick={() => handleApproveBatch(batch.id)}
                            className="light-btn-emerald"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
                          >
                            <ShieldCheck size={14} /> Approve QA
                          </button>
                        )}
                        {(user.role === 'MANUFACTURER' || user.role === 'DISTRIBUTOR') && batch.status === 'APPROVED' && batch.currentOwnerId === user.organizationId && (
                          <button
                            onClick={() => openTransferModal(batch)}
                            className="light-btn-primary"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
                          >
                            <Truck size={14} /> Dispatch Transfer
                          </button>
                        )}
                        {batch.status === 'APPROVED' && batch.currentOwnerId !== user.organizationId && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '0.35rem 0.65rem', borderRadius: '6px' }}>
                            Transferred
                          </span>
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

      {/* ─── Modal: Register New Batch ───────────────────────────────────── */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="light-card" style={{ maxWidth: '540px', width: '100%', padding: '2.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Register New Pharma Batch</h3>
                <div style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.2rem' }}>Generates GS1 DataMatrix and anchors cryptographic lot ID</div>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Drug Product
                </label>
                <select
                  className="light-input"
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  required
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.brandName} — {p.genericName} ({p.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Batch Number / Lot ID
                </label>
                <input
                  type="text"
                  className="light-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="e.g. BATCH-2026-X01"
                  value={newBatchNumber}
                  onChange={(e) => setNewBatchNumber(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Units Produced
                  </label>
                  <input
                    type="number"
                    className="light-input"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="light-input"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    min={0}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Expiration Date
                </label>
                <input
                  type="date"
                  className="light-input"
                  value={newExpiresAt}
                  onChange={(e) => setNewExpiresAt(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  QA Certificate Hash (SHA-256)
                </label>
                <input
                  type="text"
                  className="light-input"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="Optional cert hash or off-chain digest"
                  value={newQaHash}
                  onChange={(e) => setNewQaHash(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="light-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="light-btn-primary">
                  {submitting ? 'Anchoring...' : 'Anchor on Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: Dispatch Custody Transfer ────────────────────────────── */}
      {transferBatch && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="light-card" style={{ maxWidth: '480px', width: '100%', padding: '2.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Dispatch Batch Custody</h3>
                <div style={{ fontSize: '0.825rem', color: '#64748b' }}>Transfer ownership on Hyperledger Fabric</div>
              </div>
              <button onClick={() => setTransferBatch(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Initiating transfer reserves stock and creates an immutable custody record for batch <strong style={{ color: '#0f172a' }}>{transferBatch.batchNumber}</strong>.
            </p>

            <form onSubmit={handleInitiateTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Recipient Organization
                </label>
                <select
                  className="light-input"
                  value={transferReceiverId}
                  onChange={(e) => setTransferReceiverId(e.target.value)}
                  required
                >
                  <option value="">Select recipient distributor or hospital</option>
                  {orgs
                    .filter(o => o.id !== user.organizationId && o.type !== 'REGULATOR')
                    .map(o => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.type})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Transfer Quantity
                </label>
                <input
                  type="number"
                  className="light-input"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  min={1}
                  max={transferBatch.quantity}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Shipment Notes / Waybill
                </label>
                <input
                  type="text"
                  className="light-input"
                  placeholder="e.g. Cold-chain seal #9021, dispatched via DHL Medical"
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setTransferBatch(null)} className="light-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting || !transferReceiverId} className="light-btn-primary">
                  {submitting ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: AI Provenance & Anomaly Surveillance ─────────────────── */}
      {selectedAiBatch && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="light-card" style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#f5f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7c3aed'
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      AI Provenance Intelligence
                    </h3>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '12px',
                      background: selectedAiBatch.aiProvider?.includes('Groq') ? '#f0fdf4' : '#f8fafc',
                      color: selectedAiBatch.aiProvider?.includes('Groq') ? '#15803d' : '#475569',
                      border: `1px solid ${selectedAiBatch.aiProvider?.includes('Groq') ? '#bbf7d0' : '#e2e8f0'}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      ⚡ {selectedAiBatch.model || 'Groq Llama-3.3'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Batch: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f172a' }}>{selectedAiBatch.batchNumber}</span>
                    {selectedAiBatch.aiProvider && (
                      <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>• Engine: {selectedAiBatch.aiProvider}</span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedAiBatch(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Provenance Integrity Score
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: selectedAiBatch.provenanceScore >= 85 ? '#059669' : selectedAiBatch.provenanceScore >= 70 ? '#d97706' : '#e11d48',
                  lineHeight: 1.1
                }}>
                  {selectedAiBatch.provenanceScore}<span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/100</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Risk Profile
                </div>
                <span className={selectedAiBatch.riskLevel === 'LOW' ? 'light-badge-approved' : selectedAiBatch.riskLevel === 'MODERATE' ? 'light-badge-pending' : 'light-badge-recalled'} style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  {selectedAiBatch.ratingLabel}
                </span>
              </div>
            </div>

            {selectedAiBatch.anomalies && selectedAiBatch.anomalies.length > 0 ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#be123c', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={16} /> Flagged Anomaly Signals ({selectedAiBatch.anomalies.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedAiBatch.anomalies.map((anom, idx) => (
                    <div key={idx} style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#9f1239' }}>
                        [{anom.severity}] {anom.type.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: '#475569', marginTop: '0.2rem' }}>
                        {anom.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                marginBottom: '1.25rem',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={20} color="#059669" />
                <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
                  <strong>Zero Anomalies Detected.</strong> Cryptographic custody flow matches authentic baseline distribution.
                </div>
              </div>
            )}

            {selectedAiBatch.auditSummary && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                    AI Recommendation
                  </div>
                  {selectedAiBatch.auditSummary.regulatoryCompliance && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {selectedAiBatch.auditSummary.regulatoryCompliance}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.5 }}>
                  "{selectedAiBatch.auditSummary.recommendation}"
                </div>
              </div>
            )}

            {/* Positive & Negative Factors */}
            {selectedAiBatch.scoreBreakdown && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {selectedAiBatch.scoreBreakdown.bonuses?.map((b, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    ✓ {b}
                  </span>
                ))}
                {selectedAiBatch.scoreBreakdown.deductions?.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                    ⚠ {d}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setSelectedAiBatch(null)} className="light-btn-secondary">
                Close Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal: Register Drug Product ────────────────────────────────── */}
      {showProductModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(6px)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="light-card" style={{ maxWidth: '520px', width: '100%', padding: '2.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={19} color="#0284c7" />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Register Drug Formulation</h3>
              </div>
              <button onClick={() => setShowProductModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Commercial Brand Name
                </label>
                <input
                  type="text"
                  className="light-input"
                  placeholder="e.g. Lipitor-XR, CiproMax, Amox-500"
                  value={prodBrandName}
                  onChange={(e) => setProdBrandName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Generic Active Molecule
                </label>
                <input
                  type="text"
                  className="light-input"
                  placeholder="e.g. Atorvastatin Calcium, Ciprofloxacin"
                  value={prodGenericName}
                  onChange={(e) => setProdGenericName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Formulation Type
                  </label>
                  <select
                    className="light-input"
                    value={prodFormulation}
                    onChange={(e) => setProdFormulation(e.target.value)}
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Liquid">Liquid / Syrup</option>
                    <option value="Injection">Injection (IV/IM)</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Topical">Topical Cream</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Dosage Strength
                  </label>
                  <input
                    type="text"
                    className="light-input"
                    placeholder="e.g. 500mg, 10mg/5ml"
                    value={prodStrength}
                    onChange={(e) => setProdStrength(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="scheduledDrug"
                  checked={prodScheduled}
                  onChange={(e) => setProdScheduled(e.target.checked)}
                  style={{ accentColor: '#0f172a', width: '16px', height: '16px' }}
                />
                <label htmlFor="scheduledDrug" style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                  Controlled / Scheduled Formulation (Requires heightened custody tracking)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="light-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submittingProduct} className="light-btn-primary">
                  {submittingProduct ? 'Registering...' : 'Register Formulation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
