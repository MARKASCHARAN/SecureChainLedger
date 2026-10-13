import React, { useState } from 'react';
import { 
  ShieldCheck, AlertOctagon, AlertTriangle, Search, CheckCircle2, 
  Building2, FileCheck, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import type { VerificationResult } from '../types';

export const PublicVerificationPage: React.FC = () => {
  const [batchNumber, setBatchNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Hash check state
  const [docHashInput, setDocHashInput] = useState('');
  const [hashResult, setHashResult] = useState<{ isMatch: boolean; message?: string } | null>(null);

  const handleVerify = async (queryNumber?: string) => {
    const target = queryNumber || batchNumber;
    if (!target.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setHashResult(null);

    try {
      const data = await api.verifyBatch(target.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Batch not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyHash = async () => {
    if (!result || !docHashInput.trim()) return;
    try {
      const res = await api.verifyHash(result.batchNumber, docHashInput.trim());
      setHashResult({ isMatch: res.isMatch });
    } catch (err: any) {
      setHashResult({ isMatch: false, message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div className="badge badge-authentic" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
          <Sparkles size={14} /> Hyperledger Fabric Provenance Verified
        </div>
        <h1 style={{ fontSize: '2.75rem', lineHeight: 1.15, marginBottom: '1rem' }}>
          Verify Medicine <span className="text-gradient">Authenticity</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
          Scan the QR code on your pharmaceutical packaging or enter the batch number below to inspect the complete cryptographic custody chain.
        </p>

        {/* Search Input */}
        <div style={{
          maxWidth: '620px',
          margin: '2rem auto 1rem',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(13, 18, 31, 0.9)',
          padding: '0.4rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--text-muted)' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. BATCH-2026-001 or scan QR"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            style={{ border: 'none', background: 'transparent', fontSize: '1rem' }}
          />
          <button
            onClick={() => handleVerify()}
            disabled={loading || !batchNumber.trim()}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', whiteSpace: 'nowrap' }}
          >
            {loading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>

        {/* Demo Batch shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <span>Try quick demo:</span>
          {['BATCH-2026-001', 'WF-BATCH-TEST'].map((demo) => (
            <button
              key={demo}
              onClick={() => { setBatchNumber(demo); handleVerify(demo); }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {demo}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.08)', marginBottom: '2rem', textAlign: 'center', padding: '2rem' }}>
          <AlertOctagon size={42} color="#fb7185" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ color: '#fda4af', marginBottom: '0.5rem' }}>Verification Notice</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>{error}</p>
        </div>
      )}

      {/* Verification Result Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Status Banner */}
          <div 
            className="glass-card"
            style={{
              borderColor: result.verificationStatus === 'AUTHENTIC' ? 'var(--border-accent)' : result.verificationStatus === 'RECALLED' ? '#f43f5e' : '#f59e0b',
              background: result.verificationStatus === 'AUTHENTIC' ? 'rgba(16, 185, 129, 0.08)' : result.verificationStatus === 'RECALLED' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.08)',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: result.verificationStatus === 'AUTHENTIC' ? 'rgba(16, 185, 129, 0.2)' : result.verificationStatus === 'RECALLED' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: result.verificationStatus === 'AUTHENTIC' ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none'
                }}>
                  {result.verificationStatus === 'AUTHENTIC' ? (
                    <CheckCircle2 size={36} color="#34d399" />
                  ) : result.verificationStatus === 'RECALLED' ? (
                    <AlertTriangle size={36} color="#fb7185" />
                  ) : (
                    <AlertOctagon size={36} color="#fbbf24" />
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                      {result.verificationStatus === 'AUTHENTIC' ? 'Verified Authentic Medicine' : `Status: ${result.verificationStatus}`}
                    </span>
                    <span className={`badge ${result.verificationStatus === 'AUTHENTIC' ? 'badge-authentic' : result.verificationStatus === 'RECALLED' ? 'badge-recalled' : 'badge-pending'}`}>
                      {result.verificationStatus}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{result.message}</p>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <div>Batch: <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{result.batchNumber}</span></div>
                <div>Verified: {new Date(result.verifiedAt).toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid-2">
            {/* Product Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={18} color="#38bdf8" /> Drug Specifications
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem' }}>
                <div>
                  <div className="form-label">Brand Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{result.product.brandName}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div className="form-label">Generic Active Ingredient</div>
                    <div style={{ color: '#fff' }}>{result.product.genericName}</div>
                  </div>
                  <div>
                    <div className="form-label">Formulation & Strength</div>
                    <div style={{ color: '#fff' }}>{result.product.formulation} ({result.product.strength})</div>
                  </div>
                </div>
                {result.product.scheduledDrug && (
                  <div className="badge badge-recalled" style={{ alignSelf: 'flex-start' }}>
                    Scheduled Controlled Formulation
                  </div>
                )}
              </div>
            </div>

            {/* Manufacturer & Dates Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} color="#34d399" /> Manufacturing Origin
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.925rem' }}>
                <div>
                  <div className="form-label">Licensed Manufacturer</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{result.manufacturer.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {result.manufacturer.city || 'Headquarters'}, {result.manufacturer.country}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div className="form-label">Manufactured Date</div>
                    <div style={{ color: '#fff' }}>
                      {new Date(result.manufacturedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="form-label">Expiration Date</div>
                    <div style={{ color: '#fff' }}>
                      {result.expiresAt ? new Date(result.expiresAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-label">Storage Standards</div>
                  <div style={{ color: '#cbd5e1' }}>{result.storageConditions || 'Standard temperature (15°C - 25°C)'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Provenance Custody Trail */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={20} color="#10b981" /> Supply Chain Provenance Trail
            </h3>
            
            <div style={{ padding: '0.5rem 0' }}>
              {result.provenanceTrail && result.provenanceTrail.length > 0 ? (
                result.provenanceTrail.map((step, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker">
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>{step.step}</span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                          {step.actor}
                        </div>
                        <span className="badge badge-transit" style={{ fontSize: '0.725rem' }}>
                          {step.role}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {step.event === 'MANUFACTURED_AND_QA_APPROVED' ? (
                          <span>Manufactured and QA certified batch at facility</span>
                        ) : (
                          <span>Custody received from <strong>{step.transferredFrom}</strong> ({step.quantity?.toLocaleString()} units)</span>
                        )}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                        Timestamp: {step.timestamp ? new Date(step.timestamp).toLocaleString() : 'Registered on Ledger'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>No transfer logs recorded yet.</div>
              )}
            </div>
          </div>

          {/* QA Document Hash Check */}
          <div className="glass-card" style={{ background: 'rgba(13, 18, 31, 0.6)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#a7f3d0" /> Cryptographic QA Certificate Verification
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Have an off-chain certificate or laboratory test document? Enter the SHA-256 hash to confirm it matches the immutable root anchored on the blockchain.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter SHA-256 document hash"
                value={docHashInput}
                onChange={(e) => setDocHashInput(e.target.value)}
                style={{ flex: 1, minWidth: '280px' }}
              />
              <button
                onClick={handleVerifyHash}
                disabled={!docHashInput.trim()}
                className="btn btn-secondary"
              >
                Validate Hash
              </button>
            </div>
            {hashResult && (
              <div style={{ marginTop: '1rem' }}>
                {hashResult.isMatch ? (
                  <div className="badge badge-authentic" style={{ padding: '0.5rem 1rem' }}>
                    <CheckCircle2 size={16} /> Certificate hash matches the ledger QA certification.
                  </div>
                ) : (
                  <div className="badge badge-recalled" style={{ padding: '0.5rem 1rem' }}>
                    <AlertTriangle size={16} /> Hash mismatch: This document does not match the certified QA record.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
