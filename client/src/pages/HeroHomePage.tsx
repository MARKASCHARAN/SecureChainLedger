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
  const [activeProductTab, setActiveProductTab] = useState<'2d' | 'radar' | 'space' | 'access'>('2d');

  const productFamilyData = {
    '2d': {
      badge: '2D',
      title: 'Fast, accurate, detailed imagery of any location on Earth',
      description: "Powered by 10 of the world's most advanced imaging satellites, WorldView 2D gives you access to ~7 million sq km of daily collection capacity—the equivalent of Australia's landmass—including 3.5+ million sq km of 30 cm resolution imagery. With self-service ordering and optimized scheduling, you can task high-resolution imagery of any location on Earth on mission-relevant timelines.",
      image: '/product-family/tab-2d.png',
    },
    'radar': {
      badge: 'Radar',
      title: 'Actionable, 24/7 all-weather intelligence',
      description: "Through Vantor's virtual constellation, customers can task Umbra's synthetic aperture radar (SAR) satellites, which can collect imagery at night and through clouds and smoke. Vantor's proprietary SAR data processing results in the highest-quality radar imagery, maximizing intelligence value for everything from crisis response to change monitoring.",
      image: '/product-family/tab-radar.png',
    },
    'space': {
      badge: 'Space',
      title: 'Advanced orbital intelligence with centimeter-level clarity',
      description: "With so much happening in space, it's critical to be able to see activity in near real-time to maintain space domain awareness, protect your assets, and troubleshoot anomalies. Vantor's satellites capture other spacecraft at <10 cm resolution. With a growing library of non-Earth imagery (NEI), you can also track changes over time.",
      image: '/product-family/tab-space.png',
    },
    'access': {
      badge: 'Access Programs',
      title: 'Integrated access to the most capable commercial imaging constellation',
      description: "Get satellite-ownership capabilities without the space hardware expenditures. WorldView Access Programs give you priority tasking, secure workflows, and privacy—with delivery timelines as fast as 15 minutes after collection. Integrate Vantor's capabilities into your operation while maintaining full operational security and data ownership.",
      image: '/product-family/tab-access.png',
    },
  };

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

      {/* ─── Section 5: The WorldView Product Family (Interactive 4-Tab Showcase) ── */}
      <section style={{
        background: '#000000',
        padding: '6rem 0 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', padding: '0 1.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2.25rem, 4.5vw, 3.6rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: '#ffffff'
          }}>
            The WorldView product family
          </h2>
        </div>

        {/* 50/50 Split Showcase */}
        <div className="product-family-grid" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Left Column: Visual Media with Overlay Tab Navigation */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            minHeight: '520px',
            backgroundColor: '#05070a'
          }}>
            <img
              src={productFamilyData[activeProductTab].image}
              alt={productFamilyData[activeProductTab].title}
              key={activeProductTab}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                animation: 'fadeIn 0.35s ease forwards'
              }}
            />

            {/* Gradient shadow overlay for tab text legibility */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* Overlay Tab Buttons */}
            <div style={{
              position: 'absolute',
              top: '2.5rem',
              left: '2.75rem',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              {(['2d', 'radar', 'space', 'access'] as const).map(tabKey => {
                const label = tabKey === '2d' ? '2D' : tabKey === 'radar' ? 'Radar' : tabKey === 'space' ? 'Space' : 'Access Programs';
                const isActive = activeProductTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveProductTab(tabKey)}
                    className={`product-family-tab-btn ${isActive ? 'active' : 'inactive'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Solid Jet-Black Content Container */}
          <div style={{
            background: '#000000',
            padding: 'clamp(2.5rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            {/* Category dot and label */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#cbd5e1',
              fontSize: '0.88rem',
              fontWeight: 500,
              marginBottom: '1.75rem',
              letterSpacing: '0.02em'
            }}>
              <span style={{ fontSize: '0.65rem' }}>●</span>
              <span>{productFamilyData[activeProductTab].badge}</span>
            </div>

            {/* Main Headline */}
            <h3 style={{
              fontSize: 'clamp(2rem, 3.2vw, 3.25rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              marginBottom: '1.75rem',
              maxWidth: '560px'
            }}>
              {productFamilyData[activeProductTab].title}
            </h3>

            {/* Body Description */}
            <p style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
              lineHeight: 1.65,
              maxWidth: '560px',
              marginBottom: '2.75rem'
            }}>
              {productFamilyData[activeProductTab].description}
            </p>

            {/* Vantor Bracket Button */}
            <button
              onClick={onNavigateToLedger}
              className="vantor-bracket-btn"
            >
              <span className="bracket-corner tl" />
              <span className="bracket-corner tr" />
              <span className="bracket-corner bl" />
              <span className="bracket-corner br" />
              <span style={{ position: 'relative', zIndex: 2 }}>Learn more</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Provenance Verification Quick Action ────────────────────── */}
      <section style={{
        padding: '5.5rem 2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to verify pharmaceutical provenance?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.25rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
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

      {/* ─── Section 7: Enterprise Footer (Matching Vantor Directory Grid) ──────── */}
      <footer style={{ background: '#ffffff', color: '#000000', width: '100%' }}>
        {/* Top Header Bar */}
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          padding: '2.5rem 3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          maxWidth: '1440px',
          margin: '0 auto'
        }}>
          {/* Vantor aperture Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <path d="M11 7C7 11 4 15 4 20C4 25 7 29 11 33" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <path d="M29 7C33 11 36 15 36 20C36 25 33 29 29 33" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
              <circle cx="20" cy="20" r="7.5" stroke="#000000" strokeWidth="3" />
            </svg>
            <span style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#000000' }}>
              Vantor
            </span>
          </div>

          {/* Contact Us Bracket Button */}
          <button onClick={onOpenAuth} className="vantor-bracket-btn-dark">
            <span className="bracket-corner tl" />
            <span className="bracket-corner tr" />
            <span className="bracket-corner bl" />
            <span className="bracket-corner br" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* 5-Column Directory Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          maxWidth: '1440px',
          margin: '0 auto',
          borderBottom: '1px solid #e5e7eb'
        }} className="footer-grid-container">
          {/* Column 1 */}
          <div style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Spatial Intelligence Platform
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Tensorglobe
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2.5rem' }}>
              <a href="#cortex" className="footer-link-sub">↳ Cortex</a>
              <a href="#forge" className="footer-link-sub">↳ Forge</a>
              <a href="#nexus" className="footer-link-sub">↳ Nexus</a>
              <a href="#hub" className="footer-link-sub">↳ Hub</a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Dynamic Foundation
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              Vivid
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a href="#mosaic" className="footer-link-sub">↳ Mosaic</a>
              <a href="#terrain" className="footer-link-sub">↳ Terrain</a>
              <a href="#features" className="footer-link-sub">↳ Features</a>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Real-Time Tasking
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              WorldView
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2.5rem' }}>
              <a href="#2d" className="footer-link-sub" onClick={(e) => { e.preventDefault(); setActiveProductTab('2d'); }}>↳ 2D</a>
              <a href="#3d" className="footer-link-sub">↳ 3D</a>
              <a href="#radar" className="footer-link-sub" onClick={(e) => { e.preventDefault(); setActiveProductTab('radar'); }}>↳ Radar</a>
              <a href="#space" className="footer-link-sub" onClick={(e) => { e.preventDefault(); setActiveProductTab('space'); }}>↳ Space</a>
              <a href="#access" className="footer-link-sub" onClick={(e) => { e.preventDefault(); setActiveProductTab('access'); }}>↳ Access Programs</a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Mission Solutions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Raptor</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>Sentry</div>
            </div>
          </div>

          {/* Column 3 */}
          <div style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Industries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2.5rem' }}>
              <a href="#defense" className="footer-link-primary">Defense</a>
              <a href="#intelligence" className="footer-link-primary">Intelligence</a>
              <a href="#systems" className="footer-link-primary">Systems Integrators</a>
              <a href="#civil" className="footer-link-primary">Civil Government</a>
              <a href="#commercial" className="footer-link-primary">Commercial</a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Additional Information
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a href="#news-bureau" className="footer-link-primary">News Bureau Program</a>
              <a href="#open-data" className="footer-link-primary">Open Data Program</a>
              <a href="#resources" className="footer-link-primary">Resources</a>
            </div>
          </div>

          {/* Column 4 */}
          <div style={{ padding: '2.5rem 2rem', borderRight: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              News & Events
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2.5rem' }}>
              <a href="#latest" className="footer-link-primary">Latest at Vantor</a>
              <a href="#events" className="footer-link-primary">Events</a>
              <a href="#media" className="footer-link-primary">Media Coverage</a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Connect
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a href="#contact" className="footer-link-primary" onClick={(e) => { e.preventDefault(); onOpenAuth(); }}>Contact Us</a>
              <a href="#partner" className="footer-link-primary">Become a Partner</a>
              <a href="#directory" className="footer-link-primary">Partner Directory</a>
            </div>
          </div>

          {/* Column 5 */}
          <div style={{ padding: '2.5rem 2rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Company
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2.5rem' }}>
              <a href="#about" className="footer-link-primary">About</a>
              <a href="#leadership" className="footer-link-primary">Leadership</a>
              <a href="#careers" className="footer-link-primary">Careers</a>
              <a href="#constellation" className="footer-link-primary">Our Constellation</a>
              <a href="#sustainability" className="footer-link-primary">Sustainability</a>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.75rem' }}>
              Login & Explore
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <a href="#hub" className="footer-link-primary" onClick={(e) => { e.preventDefault(); onOpenAuth(); }}>The Vantor Hub</a>
              <a href="#discover" className="footer-link-primary" onClick={(e) => { e.preventDefault(); onNavigateToLedger(); }}>Discover</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Social */}
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '2rem 3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Legal Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            <a href="#privacy" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>License Terms & Policies</a>
            <a href="#terms-use" style={{ color: '#0f172a', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>Website Terms of Use</a>
          </div>

          {/* Copyright text */}
          <div style={{ color: '#64748b', fontSize: '0.75rem', maxWidth: '440px', lineHeight: 1.5 }}>
            ©2026 Vantor. Vantor, Raptor, Sentry, Vivid, WorldView, Tensorglobe, Cortex, Forge, and Nexus are trademarks of Vantor Holdings, Inc.
          </div>

          {/* Social Media Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: '#000000' }}>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: '#000000' }} aria-label="YouTube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#000000' }} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: '#000000' }} aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#000000' }} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noreferrer" style={{ color: '#000000' }} aria-label="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
