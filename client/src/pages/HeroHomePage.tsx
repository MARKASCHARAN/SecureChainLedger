// client/src/pages/HeroHomePage.tsx
import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, Search, Sparkles, Cpu, Activity
} from 'lucide-react';

interface HeroHomePageProps {
  onNavigateToVerify: (batchNumber?: string) => void;
  onNavigateToLedger: () => void;
  onOpenAuth: () => void;
}

export const HeroHomePage: React.FC<HeroHomePageProps> = ({
  onNavigateToVerify,
  onNavigateToLedger,
  onOpenAuth,
}) => {
  const [quickSearch, setQuickSearch] = useState('');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigateToVerify(quickSearch.trim());
    } else {
      onNavigateToVerify('BATCH-2026-001');
    }
  };

  return (
    <div style={{ background: '#000000', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ─── Hero Video Section ─────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 2rem 2.5rem',
        overflow: 'hidden'
      }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.72) contrast(1.08)',
          }}
        >
          <source src="/HomeVideo.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 45%, rgba(0, 0, 0, 0.7) 80%, #000000 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Top Spacer / Breadcrumb */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#ffffff'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            Hyperledger Fabric 2.5 • Cryptographic Custody Anchor
          </div>
        </div>

        {/* Main Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1360px',
          margin: 'auto auto 0',
          width: '100%',
          paddingBottom: '2.5rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.75rem, 6.5vw, 5.25rem)',
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            maxWidth: '1000px',
            marginBottom: '1.5rem',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)'
          }}>
            Total clarity from<br />source to patient
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '1.75rem'
          }}>
            <div style={{ maxWidth: '540px' }}>
              <p style={{
                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                marginBottom: '1.25rem'
              }}>
                Cryptographic batch provenance & AI anomaly surveillance for a more verifiable, counterfeit-proof pharmaceutical supply chain.
              </p>

              {/* Quick Verify Search */}
              <form onSubmit={handleQuickVerify} style={{
                display: 'flex',
                gap: '0.4rem',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(12px)',
                padding: '0.35rem 0.4rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                maxWidth: '440px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.6rem', color: '#94a3b8' }}>
                  <Search size={17} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. BATCH-2026-001"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Verify <ArrowRight size={14} />
                </button>
              </form>
            </div>

            {/* Bracket Button Matching Vantor Style */}
            <div>
              <button
                onClick={() => onNavigateToVerify('BATCH-2026-001')}
                className="vantor-bracket-btn"
              >
                <span className="bracket-corner tl" />
                <span className="bracket-corner tr" />
                <span className="bracket-corner bl" />
                <span className="bracket-corner br" />
                <span style={{ position: 'relative', zIndex: 2 }}>Our Mission</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Unify Your Intelligence (Matching Image 4) ──────────────── */}
      <section style={{
        background: '#000000',
        padding: '7rem 2rem 5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)',
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            marginBottom: '1.75rem',
            color: '#ffffff'
          }}>
            SecureChain gives you the tools<br />to unify your provenance
          </h2>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: '#94a3b8',
            maxWidth: '720px',
            margin: '0 auto'
          }}>
            Across drug manufacturing, cold-chain logistics, and hospital dispensing, unified provenance is harder than ever — siloed databases, unverified paper certificates, and counterfeit injection risks. SecureChain solves this by anchoring all custody events to an AI-ready cryptographic ground truth, delivering intelligence that lets you operate at the speed of patient safety.
          </p>
        </div>
      </section>

      {/* ─── Section 3: The SecureChain Advantage (Matching Image 5) ────────────── */}
      <section style={{
        background: '#000000',
        padding: '4rem 2rem 7rem',
        maxWidth: '1360px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          {/* Left Column: Isometric Visual & Advantage Label */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '2rem'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7', display: 'inline-block' }} />
              The SecureChain Advantage
            </div>

            {/* Glowing 3D City / Lattice Vector Graphic */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(13, 18, 31, 0.4) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              padding: '2rem',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(168, 85, 247, 0.15)'
            }}>
              <svg viewBox="0 0 400 300" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>

                {/* Isometric Grid Base */}
                <g stroke="#3b0764" strokeWidth="0.75" opacity="0.6">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <line key={`h-${i}`} x1={i * 30} y1="0" x2={i * 30 - 150} y2="300" />
                  ))}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <line key={`v-${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25 + 100} />
                  ))}
                </g>

                {/* 3D Isometric Buildings / Clusters */}
                {[
                  { x: 50, y: 160, w: 28, h: 70 },
                  { x: 90, y: 140, w: 35, h: 95 },
                  { x: 135, y: 170, w: 30, h: 60 },
                  { x: 180, y: 120, w: 42, h: 125 },
                  { x: 235, y: 155, w: 32, h: 80 },
                  { x: 280, y: 180, w: 30, h: 55 },
                  { x: 110, y: 210, w: 40, h: 50 },
                  { x: 160, y: 220, w: 36, h: 45 },
                  { x: 210, y: 200, w: 44, h: 65 },
                ].map((b, idx) => (
                  <g key={idx}>
                    {/* Top Face */}
                    <polygon
                      points={`${b.x},${b.y} ${b.x + b.w / 2},${b.y - 12} ${b.x + b.w},${b.y} ${b.x + b.w / 2},${b.y + 12}`}
                      fill="#d8b4fe"
                      opacity="0.9"
                    />
                    {/* Left Face */}
                    <polygon
                      points={`${b.x},${b.y} ${b.x + b.w / 2},${b.y + 12} ${b.x + b.w / 2},${b.y + b.h} ${b.x},${b.y + b.h - 12}`}
                      fill="#9333ea"
                      opacity="0.75"
                    />
                    {/* Right Face */}
                    <polygon
                      points={`${b.x + b.w / 2},${b.y + 12} ${b.x + b.w},${b.y} ${b.x + b.w},${b.y + b.h - 12} ${b.x + b.w / 2},${b.y + b.h}`}
                      fill="#6b21a8"
                      opacity="0.85"
                    />
                    {/* Vertical Sensor Beacon */}
                    {idx % 2 === 0 && (
                      <g>
                        <line x1={b.x + b.w / 2} y1={b.y - 12} x2={b.x + b.w / 2} y2={b.y - 45} stroke="url(#lineGlow)" strokeWidth="1.5" />
                        <circle cx={b.x + b.w / 2} cy={b.y - 45} r="2.5" fill="#f3e8ff" />
                      </g>
                    )}
                  </g>
                ))}

                {/* Decentralized Ledger Interconnect Lines */}
                <path
                  d="M 64,115 L 107,95 L 201,75 L 251,110 L 295,135"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
              </svg>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#c084fc',
                fontFamily: 'var(--font-mono)',
                marginTop: '1rem',
                borderTop: '1px solid rgba(168, 85, 247, 0.2)',
                paddingTop: '0.75rem'
              }}>
                <span>FABRIC_RAFT_CONSENSUS</span>
                <span>STATUS: 100% FINALITY</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Powerful Statements with Dividers (Matching Image 5) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '2.25rem' }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                Own the ground truth with the most trusted batch provenance, anchored on Hyperledger Fabric.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.975rem', lineHeight: 1.6 }}>
                Every manufactured batch receives an immutable cryptographic state entry. QA documentation hashes cannot be retroactively modified or forged.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '2.25rem' }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                Fuse all your sensors across cold-chain, transit, and warehousing by anchoring them to an accurate spatial foundation.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.975rem', lineHeight: 1.6 }}>
                Seamless custody handshakes between manufacturers, 3PL distributors, and hospitals ensure zero blind spots across air, sea, and road freight.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '2.25rem' }}>
              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                lineHeight: 1.25,
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                Keep pace with change by automating the intelligence cycle, from tasking and production to fusion and AI-powered analysis.
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.975rem', lineHeight: 1.6 }}>
                Instant heuristic anomaly surveillance continuously flags rapid custody handovers, quantity leakage, and concurrent multi-location consumer scans.
              </p>
            </div>

            {/* Bracket Button Matching Vantor Style */}
            <div style={{ paddingTop: '0.5rem' }}>
              <button
                onClick={onNavigateToLedger}
                className="vantor-bracket-btn"
              >
                <span className="bracket-corner tl" />
                <span className="bracket-corner tr" />
                <span className="bracket-corner bl" />
                <span className="bracket-corner br" />
                <span style={{ position: 'relative', zIndex: 2 }}>Our Spatial Intelligence Platform</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 4: Live Platform Capabilities Grid ─────────────────────────── */}
      <section style={{
        background: '#07090e',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '5rem 2rem'
      }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ color: '#38bdf8', marginBottom: '1rem' }}>
                <Cpu size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hyperledger Fabric v2.5</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Enterprise permissioned chaincode with Raft consensus, zero public gas volatility, and private MSP channel partitions.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ color: '#34d399', marginBottom: '1rem' }}>
                <Sparkles size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>0–100 AI Provenance Scoring</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Real-time risk scoring, velocity surveillance, and duplicate QR scan detection designed to protect patient health.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ color: '#c084fc', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>GS1 DataMatrix Serialization</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Full compliance with international drug packaging standards: GTIN, Lot identifier, expiration date, and unique serials.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ color: '#fb7185', marginBottom: '1rem' }}>
                <Activity size={28} />
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sub-Minute Recall Enforcement</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Regulator-grade batch quarantining broadcasts immediate recall freezes across every distributor and hospital node simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 5: Bottom CTA ─────────────────────────────────────────────── */}
      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to verify pharmaceutical provenance?</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Inspect certified medicine batches anonymously or sign into the enterprise supply-chain portal.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToVerify('BATCH-2026-001')}
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              Verify Sample Batch BATCH-2026-001
            </button>
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              Enterprise Portal Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
