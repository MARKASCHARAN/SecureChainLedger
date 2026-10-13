import React, { useState } from 'react';
import { 
  ShieldCheck, AlertOctagon, AlertTriangle, Search, CheckCircle2, 
  Building2, FileCheck, Sparkles, QrCode, Camera, X 
} from 'lucide-react';
import { api } from '../services/api';
import type { VerificationResult } from '../types';

interface PublicVerificationPageProps {
  initialBatchNumber?: string;
}

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({ initialBatchNumber }) => {
  const [batchNumber, setBatchNumber] = useState(initialBatchNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  // Scanner & QR modal states
  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

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

  React.useEffect(() => {
    if (initialBatchNumber && initialBatchNumber.trim()) {
      handleVerify(initialBatchNumber.trim());
    }
  }, [initialBatchNumber]);

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
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(5, 150, 105, 0.1)',
          color: '#059669',
          padding: '0.35rem 0.95rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700,
          border: '1px solid rgba(5, 150, 105, 0.3)',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} /> Hyperledger Fabric Provenance Verified
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#0f172a',
          lineHeight: 1.15,
          marginBottom: '1rem'
        }}>
          Verify Medicine <span style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Authenticity</span>
        </h1>
        <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Scan the QR code on your pharmaceutical packaging or enter the batch number below to inspect the complete cryptographic custody chain.
        </p>

        <div style={{
          maxWidth: '640px',
          margin: '2rem auto 1rem',
          display: 'flex',
          gap: '0.5rem',
          background: '#090d16',
          padding: '0.5rem',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.85rem', color: '#94a3b8' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="e.g. BATCH-2026-001 or scan QR"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '1rem',
              color: '#ffffff',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={() => setScannerOpen(true)}
            style={{
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Scan Packaging QR Code"
          >
            <Camera size={18} />
            <span>Scan QR</span>
          </button>
          <button
            onClick={() => handleVerify()}
            disabled={loading || !batchNumber.trim()}
            style={{
              padding: '0.65rem 1.4rem',
              whiteSpace: 'nowrap',
              background: '#059669',
              border: 'none',
              color: '#ffffff',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              opacity: loading || !batchNumber.trim() ? 0.6 : 1
            }}
          >
            {loading ? 'Verifying...' : 'Verify Now'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.825rem', color: '#64748b' }}>
          <span>Try quick demo:</span>
          {['BATCH-2026-001', 'BATCH-2026-004', 'BATCH-2026-006'].map((demo) => (
            <button
              key={demo}
              onClick={() => { setBatchNumber(demo); handleVerify(demo); }}
              style={{
                background: '#090d16',
                border: '1px solid #1e293b',
                color: '#38bdf8',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 600
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

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <QrCode size={14} color="#38bdf8" /> Packaging QR
                </button>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <div>Batch: <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{result.batchNumber}</span></div>
                  <div>Verified: {new Date(result.verifiedAt).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Intelligence & Provenance Risk Scoring */}
          {result.aiIntelligence && (
            <div
              className="glass-card"
              style={{
                borderColor:
                  result.aiIntelligence.riskLevel === 'LOW'
                    ? 'rgba(56, 189, 248, 0.35)'
                    : result.aiIntelligence.riskLevel === 'MODERATE'
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(244, 63, 94, 0.4)',
                background: 'linear-gradient(135deg, rgba(13, 18, 31, 0.95), rgba(15, 23, 42, 0.85))',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
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
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      AI Provenance & Anomaly Intelligence
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Continuous heuristic & statistical anomaly surveillance
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color:
                      result.aiIntelligence.provenanceScore >= 85
                        ? '#34d399'
                        : result.aiIntelligence.provenanceScore >= 70
                        ? '#fbbf24'
                        : '#fb7185',
                  }}>
                    {result.aiIntelligence.provenanceScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
                  </div>
                  <span
                    className={`badge ${
                      result.aiIntelligence.riskLevel === 'LOW'
                        ? 'badge-authentic'
                        : result.aiIntelligence.riskLevel === 'MODERATE'
                        ? 'badge-pending'
                        : 'badge-recalled'
                    }`}
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                  >
                    {result.aiIntelligence.ratingLabel}
                  </span>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: `${result.aiIntelligence.provenanceScore}%`,
                  height: '100%',
                  background:
                    result.aiIntelligence.provenanceScore >= 85
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : result.aiIntelligence.provenanceScore >= 70
                      ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                      : 'linear-gradient(90deg, #e11d48, #f43f5e)',
                  transition: 'width 0.8s ease-in-out'
                }} />
              </div>

              {/* Anomaly Alerts Section */}
              {result.aiIntelligence.anomalies && result.aiIntelligence.anomalies.length > 0 ? (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fb7185', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertTriangle size={16} /> Anomaly Signals Flagged ({result.aiIntelligence.anomalies.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {result.aiIntelligence.anomalies.map((anom, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fda4af' }}>
                            [{anom.severity}] {anom.type.replace(/_/g, ' ')}
                          </div>
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            {anom.message}
                          </div>
                        </div>
                        {anom.confidence && (
                          <span className="badge badge-recalled" style={{ fontSize: '0.72rem' }}>
                            {Math.round(anom.confidence * 100)}% Conf.
                          </span>
                        )}
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
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <CheckCircle2 size={20} color="#34d399" />
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                    <strong>Zero Anomaly Signals Detected.</strong> Velocity, quantity, and multi-location consumer scan patterns are consistent with authentic distribution.
                  </div>
                </div>
              )}

              {/* Natural Language Audit Summary & Recommendation */}
              {result.aiIntelligence.auditSummary && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  marginBottom: '1rem',
                }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    AI Recommendation & Safety Assessment
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    "{result.aiIntelligence.auditSummary.recommendation}"
                  </div>
                </div>
              )}

              {/* Score Breakdown factors */}
              {result.aiIntelligence.scoreBreakdown && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {result.aiIntelligence.scoreBreakdown.bonuses?.map((b, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#a7f3d0', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      ✓ {b}
                    </span>
                  ))}
                  {result.aiIntelligence.scoreBreakdown.deductions?.map((d, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(244, 63, 94, 0.1)', color: '#fda4af', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                      ⚠ {d}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                {result.aiIntelligence.disclaimer}
              </div>
            </div>
          )}

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

      {/* Camera / Packaging QR Scanner Viewfinder Modal */}
      {scannerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="#38bdf8" />
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Optical Barcode Scanner</h3>
              </div>
              <button onClick={() => setScannerOpen(false)} className="btn" style={{ padding: '0.35rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Viewfinder Target */}
            <div style={{
              position: 'relative',
              width: '260px',
              height: '260px',
              margin: '0 auto 1.5rem',
              borderRadius: '16px',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, rgba(0, 0, 0, 0.6) 100%)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.2)'
            }}>
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 8, left: 8, width: 24, height: 24, borderTop: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderTop: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 8, left: 8, width: 24, height: 24, borderBottom: '3px solid #38bdf8', borderLeft: '3px solid #38bdf8' }} />
              <div style={{ position: 'absolute', bottom: 8, right: 8, width: 24, height: 24, borderBottom: '3px solid #38bdf8', borderRight: '3px solid #38bdf8' }} />

              {/* Animated laser scan beam */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #38bdf8, #34d399, transparent)',
                boxShadow: '0 0 12px #38bdf8',
                animation: 'scanLaser 2.2s infinite ease-in-out',
                top: '40%'
              }} />

              <div style={{ opacity: 0.3, color: '#38bdf8' }}>
                <QrCode size={110} />
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Hold pharmaceutical packaging QR or 2D DataMatrix code in front of the lens.
            </p>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Instant Simulated Recognition Test:
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              {['BATCH-2026-001', 'WF-BATCH-TEST'].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setScannerOpen(false);
                    setBatchNumber(b);
                    handleVerify(b);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  Scan {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2D DataMatrix / QR Code Generator Modal */}
      {qrModalOpen && result && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <QrCode size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>GS1 Packaging DataMatrix</h3>
              </div>
              <button onClick={() => setQrModalOpen(false)} className="btn" style={{ padding: '0.35rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* High-fidelity SVG QR Visualizer */}
            <div style={{
              background: '#ffffff',
              padding: '1.25rem',
              borderRadius: '12px',
              display: 'inline-block',
              margin: '0 auto 1.25rem',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              <svg width="180" height="180" viewBox="0 0 29 29" shapeRendering="crispEdges">
                <rect width="29" height="29" fill="#ffffff" />
                {/* Corner Finder 1 */}
                <rect x="2" y="2" width="7" height="7" fill="#000000" />
                <rect x="3" y="3" width="5" height="5" fill="#ffffff" />
                <rect x="4" y="4" width="3" height="3" fill="#000000" />
                {/* Corner Finder 2 */}
                <rect x="20" y="2" width="7" height="7" fill="#000000" />
                <rect x="21" y="3" width="5" height="5" fill="#ffffff" />
                <rect x="22" y="4" width="3" height="3" fill="#000000" />
                {/* Corner Finder 3 */}
                <rect x="2" y="20" width="7" height="7" fill="#000000" />
                <rect x="3" y="21" width="5" height="5" fill="#ffffff" />
                <rect x="4" y="22" width="3" height="3" fill="#000000" />
                {/* Simulated DataMatrix Pixels */}
                <rect x="11" y="2" width="2" height="2" fill="#000" />
                <rect x="15" y="4" width="2" height="2" fill="#000" />
                <rect x="11" y="6" width="3" height="1" fill="#000" />
                <rect x="10" y="10" width="3" height="3" fill="#000" />
                <rect x="15" y="10" width="2" height="2" fill="#000" />
                <rect x="14" y="14" width="4" height="2" fill="#000" />
                <rect x="10" y="15" width="2" height="3" fill="#000" />
                <rect x="11" y="20" width="2" height="2" fill="#000" />
                <rect x="15" y="22" width="3" height="2" fill="#000" />
                <rect x="20" y="11" width="2" height="3" fill="#000" />
                <rect x="24" y="13" width="2" height="2" fill="#000" />
                <rect x="20" y="17" width="3" height="2" fill="#000" />
                <rect x="24" y="20" width="2" height="4" fill="#000" />
                <rect x="21" y="23" width="2" height="2" fill="#000" />
              </svg>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.825rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div><strong>(01) GTIN:</strong> <span className="font-mono" style={{ color: '#fff' }}>08901234567890</span></div>
              <div><strong>(10) BATCH / LOT:</strong> <span className="font-mono" style={{ color: '#38bdf8' }}>{result.batchNumber}</span></div>
              <div><strong>(17) EXP DATE:</strong> <span className="font-mono" style={{ color: '#fff' }}>{new Date(result.expiresAt).toISOString().split('T')[0]}</span></div>
              <div><strong>(21) SERIAL:</strong> <span className="font-mono" style={{ color: '#34d399' }}>SC-{result.batchNumber}-0091</span></div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`urn:securechain:pharma:batch:${result.batchNumber}`);
                alert('Cryptographic Batch URI copied to clipboard!');
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Copy Cryptographic GS1 Payload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
