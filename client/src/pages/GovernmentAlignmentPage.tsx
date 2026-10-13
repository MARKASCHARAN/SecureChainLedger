import React, { useState } from 'react';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Database, 
  Cpu, 
  QrCode, 
  FileCheck, 
  Calendar, 
  AlertTriangle, 
  Network, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  Server,
  Lock
} from 'lucide-react';

interface GovernmentAlignmentPageProps {
  onNavigateToArchitecture?: () => void;
  onNavigateToVerify?: (batchNumber?: string) => void;
}

export const GovernmentAlignmentPage: React.FC<GovernmentAlignmentPageProps> = ({
  onNavigateToArchitecture,
  onNavigateToVerify
}) => {
  const [activeInitiative, setActiveInitiative] = useState<'meity' | 'niti' | 'traceability'>('meity');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const medicineDataElements = [
    { num: '01', title: 'Unique Product Identification Code', desc: 'Standardized global or national product code distinguishing dosage and formulation.' },
    { num: '02', title: 'Proper and Generic Name of Drug', desc: 'Official non-proprietary pharmacological title for the pharmaceutical substance.' },
    { num: '03', title: 'Brand Name', desc: 'Commercial proprietary brand trademark approved by drug licensing authorities.' },
    { num: '04', title: 'Name and Address of Manufacturer', desc: 'Full corporate identity and geographic facility where the pharmaceutical lot was synthesized.' },
    { num: '05', title: 'Batch Number', desc: 'Specific alphanumeric lot identifier assigned during production run for batch-level tracing.' },
    { num: '06', title: 'Date of Manufacturing', desc: 'Precise month and year marking the completion of pharmaceutical manufacturing.' },
    { num: '07', title: 'Date of Expiry', desc: 'Regulatory terminal date ensuring clinical efficacy and chemical stability.' },
    { num: '08', title: 'Manufacturing Licence Number', desc: 'Authoritative state or central regulatory permit validating compliance with Drugs Rules.' },
    { num: '09', title: 'Qualitative Details of Excipients', desc: 'Comprehensive disclosure of non-active carriers, binders, and preservation elements.' },
  ];

  return (
    <div style={{ background: '#000000', color: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
      <section style={{
        position: 'relative',
        padding: '5rem 2rem 4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, rgba(0, 0, 0, 0.95) 70%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            marginBottom: '1.75rem'
          }}>
            <Building2 size={14} />
            INDIAN PHARMACEUTICAL TRACEABILITY
          </div>

          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            maxWidth: '960px',
            marginInline: 'auto'
          }}>
            Building More Transparent <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #a7f3d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Pharmaceutical Supply Chains</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            maxWidth: '820px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.65,
            fontWeight: 400
          }}>
            SecureChainLedger is exploring how permissioned blockchain, verifiable supply-chain records and QR-based medicine traceability can support India's evolving pharmaceutical traceability ecosystem.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
            <button
              onClick={() => { setActiveInitiative('meity'); scrollToSection('section-meity'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: activeInitiative === 'meity' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: activeInitiative === 'meity' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                color: activeInitiative === 'meity' ? '#38bdf8' : '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Cpu size={15} color="#38bdf8" />
              National Blockchain Framework
            </button>

            <button
              onClick={() => { setActiveInitiative('niti'); scrollToSection('section-niti'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: activeInitiative === 'niti' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: activeInitiative === 'niti' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
                color: activeInitiative === 'niti' ? '#10b981' : '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Layers size={15} color="#10b981" />
              NITI Aayog Blockchain Strategy
            </button>

            <button
              onClick={() => { setActiveInitiative('traceability'); scrollToSection('section-traceability'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: activeInitiative === 'traceability' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: activeInitiative === 'traceability' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                color: activeInitiative === 'traceability' ? '#f59e0b' : '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <QrCode size={15} color="#f59e0b" />
              Medicine Traceability Requirements
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <button
              onClick={() => scrollToSection('initiatives')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                transition: 'transform 0.15s ease'
              }}
            >
              Explore Government Initiatives
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => {
                if (onNavigateToArchitecture) {
                  onNavigateToArchitecture();
                } else {
                  scrollToSection('architecture');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.85rem 1.75rem',
                borderRadius: '8px',
                background: 'transparent',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              Explore Our Architecture
              <Layers size={16} color="#94a3b8" />
            </button>
          </div>
        </div>
      </section>

      <section id="initiatives" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            National Initiatives & Strategic Alignment
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '750px', margin: '0 auto' }}>
            A rigorous review of published policies, institutional roadmaps, and statutory traceability amendments shaping India's pharmaceutical supply chain.
          </p>
        </div>

        <div id="section-meity" style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Ministry of Electronics and Information Technology (MeitY)
              </div>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
                India's National Blockchain Framework
              </h3>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              fontSize: '0.8rem',
              color: '#38bdf8',
              fontWeight: 600
            }}>
              <Server size={14} /> Vishvasya Blockchain Stack & NBFLite
            </div>
          </div>

          <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            MeitY's National Blockchain Framework establishes India's national distributed infrastructure, introducing the <strong>Vishvasya Blockchain Stack</strong> for distributed ledger applications and the <strong>NBFLite</strong> sandbox environment for rapid prototyping, security testing, and institutional multi-tenancy.
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="#38bdf8" /> Relevance to SecureChainLedger
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  Permissioned Blockchain Infrastructure
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Exploring alignment with enterprise permissioned architectures and cryptographic node consensus principles.
                </div>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  Blockchain-as-a-Service Capabilities
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Investigating BaaS integration patterns to lower adoption barriers for pharmaceutical manufacturers and hospitals.
                </div>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  Sandbox-Based Prototyping
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Evaluating isolated sandbox models for high-throughput batch validation and stress-testing under simulated load.
                </div>
              </div>
              <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  Potential Future Interoperability
                </div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  Studying cross-chain bridges and standard event schemas for potential interoperability across public and national chains.
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Resources:
              </span>
              <a
                href="https://blockchain.meity.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                blockchain.meity.gov.in <ExternalLink size={13} />
              </a>
              <span style={{ color: '#475569' }}>•</span>
              <a
                href="https://www.meity.gov.in/blockchain"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                meity.gov.in/blockchain <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
              SecureChainLedger has not been granted access, integration, endorsement or support unless independently verified.
            </div>
          </div>
        </div>

        <div id="section-niti" style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                NITI Aayog (National Institution for Transforming India)
              </div>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
                Learning from India's Blockchain Strategy
              </h3>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.8rem',
              color: '#10b981',
              fontWeight: 600
            }}>
              <CheckCircle2 size={14} /> Track-and-Trace Strategy Framework
            </div>
          </div>

          <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            NITI Aayog's published blockchain strategy document explored pharmaceutical drug track-and-trace use cases and detailed a proof-of-concept (PoC) model involving supply-chain participants and integration with existing enterprise ERP and warehousing systems.
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} color="#10b981" /> Architectural Lessons Informed by NITI Aayog's Analysis
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <ChevronRight size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Record Critical Custody Transitions</div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Cryptographically verify handoffs between authorized entities at each tier.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <ChevronRight size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Maintain Auditable Batch Provenance</div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Generate sequential, immutable parent-to-child lineage records from production.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <ChevronRight size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Support Supply-Chain Event Verification</div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Provide instant multi-party cryptographic verification of checkpoint timestamps.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <ChevronRight size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Transportation & Storage Conditions</div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Incorporate cold-chain excursions and logistics telemetry into event hashes.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                <ChevronRight size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>Enterprise System Integration</div>
                  <div style={{ fontSize: '0.825rem', color: '#94a3b8' }}>Provide clean REST API adapters for legacy SAP, Oracle ERP, and WMS software.</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Source:
              </span>
              <a
                href="https://www.niti.gov.in/node/296"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: '#10b981',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                niti.gov.in/node/296 <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
              SecureChainLedger is not part of the NITI Aayog project and has not been validated by NITI Aayog.
            </div>
          </div>
        </div>

        <div id="section-traceability" style={{
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Drugs Rules, 1945 Statutory Amendment
              </div>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 700, color: '#ffffff' }}>
                Designing for India's Medicine Traceability Requirements
              </h3>
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.8rem',
              color: '#f59e0b',
              fontWeight: 600
            }}>
              <Calendar size={14} /> Phased Regulatory Timelines
            </div>
          </div>

          <div style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Official government gazette notifications mandate QR code and barcode traceability on primary or secondary packaging under the <strong>Drugs Rules, 1945</strong> for specified therapeutic categories, establishing phased national enforcement milestones.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Calendar size={16} /> Phase 1 — 1 July 2027
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                High-Priority Therapeutic Categories
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Mandatory QR/barcode serialization covering <strong>vaccines</strong>, specified <strong>narcotic and psychotropic substances</strong>, and <strong>anti-cancer medicines</strong>.
              </div>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Calendar size={16} /> Phase 2 — 1 July 2028
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                Antimicrobial Formulations
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Extension of mandatory digital traceability barcodes across <strong>antimicrobials</strong> to safeguard against substandard batches and combat counterfeit distribution.
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.75rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} color="#f59e0b" /> Verified Statutory Data Elements (Rule 96)
            </h4>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              The official announcement defines the mandatory barcode/QR elements required to enable direct authentication and public inspection:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {medicineDataElements.map((el) => (
                <div key={el.num} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>{el.num}</span>
                    <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{el.title}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.45 }}>{el.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              How SecureChainLedger Supports These Requirements
            </div>
            <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              Our platform architecture is designed to index applicable product identifiers (GTIN), batch serials, manufacturing timestamps, and licensing attributes directly into verified cryptographic state. Users can scan the GS1 2D DataMatrix barcode to trigger instant authenticated record comparison against on-chain consensus state.
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Announcement:
              </span>
              <a
                href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2277691&lang=1&reg=48"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.85rem',
                  color: '#f59e0b',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Press Information Bureau Release (PRID 2277691) <ExternalLink size={13} />
              </a>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Blockchain alone does not establish physical product authenticity; statutory regulatory compliance requires separate physical testing and verification.
            </div>
          </div>
        </div>
      </section>

      <section style={{
        background: '#090d16',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Practical Capabilities
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              How SecureChainLedger Is Exploring These Opportunities
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
              Translating policy principles into functional, production-ready cryptographic capabilities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Cpu size={22} color="#38bdf8" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  Traceable Batch Provenance
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Records the history of medicine batches and their associated supply-chain events on Hyperledger Fabric chaincode with immutable SHA-256 state hashes.
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} /> Implemented in Current Codebase
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <Network size={22} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  Verifiable Custody Transfers
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Models authorized transfers between manufacturers, distributors, 3PL logistics, and healthcare organizations with digital signatures and role authorization.
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} /> Implemented in Current Codebase
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <QrCode size={22} color="#f59e0b" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  QR-Based Verification
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Enables a user to look up authenticated batch records, inspect timestamped checkpoint history, and review relevant traceability evidence via browser or camera scan.
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} /> Implemented in Current Codebase
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <AlertTriangle size={22} color="#f43f5e" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  Recall and Audit Visibility
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Supports targeted investigation of affected batches and provides authorized users with an auditable event history, enabling rapid quarantine propagation.
                </p>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} /> Implemented in Current Codebase
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            System Topology
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Dual-Layer Cryptographic Architecture
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
            Decoupling high-frequency operational query performance from immutable Byzantine-fault-tolerant consensus verification.
          </p>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', position: 'relative' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Building2 size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tier 1</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>User & Org Interfaces</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Manufacturer dashboards, distributor portals, hospital dispensing & inspector scanner.
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.12)',
                color: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Lock size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tier 2</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Node.js & Authorization</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                JWT auth, RBAC permissions, GS1 parser, cryptographic signing & REST endpoints.
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Database size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tier 3</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>PostgreSQL Records</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                High-speed operational inventory, metadata storage, indexing & sub-second querying.
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Cpu size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tier 4</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>Hyperledger Fabric</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Permissioned Raft consensus, chaincode execution & tamper-proof custody blocks.
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.12)',
                color: '#ec4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <QrCode size={24} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tier 5</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>QR & Audit Verification</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Public token verification, provenance timeline rendering & tamper-detection checks.
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '2.5rem',
            padding: '1.25rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
              Want to see real-time consensus blocks and cryptographic transactions currently committed on-chain?
            </div>
            {onNavigateToArchitecture && (
              <button
                onClick={onNavigateToArchitecture}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  background: '#38bdf8',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Inspect Ledger Explorer <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            References & Citations
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Official Source Reference Index
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto' }}>
            Primary citations verifying policy titles, issuing departments, and direct government URLs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                MeitY Initiative
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                National Blockchain Framework
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                Framework introducing Vishvasya Blockchain Stack and NBFLite sandbox for national distributed applications.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <strong style={{ color: '#ffffff' }}>Distinction:</strong> Published national framework by MeitY. SecureChainLedger is an independent project exploring architectural alignment without official endorsement.
              </div>
            </div>
            <a
              href="https://blockchain.meity.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: '#38bdf8',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              blockchain.meity.gov.in <ExternalLink size={13} />
            </a>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                NITI Aayog Strategy
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                Blockchain: The India Strategy
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                Strategic paper detailing supply-chain track-and-trace proof-of-concept models and multi-tier custody tracking.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <strong style={{ color: '#ffffff' }}>Distinction:</strong> Published policy research document. SecureChainLedger adopts design lessons without formal association or validation by NITI Aayog.
              </div>
            </div>
            <a
              href="https://www.niti.gov.in/node/296"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: '#10b981',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              niti.gov.in/node/296 <ExternalLink size={13} />
            </a>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                PIB / Drugs Rules, 1945
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                Medicine Traceability Requirements
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                Statutory gazette notification requiring 2D barcodes/QR codes across vaccines, narcotics, oncology and antimicrobials.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '6px' }}>
                <strong style={{ color: '#ffffff' }}>Distinction:</strong> Formal statutory regulatory mandate. SecureChainLedger offers cryptographic tooling to support enterprise compliance data workflows.
              </div>
            </div>
            <a
              href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2277691&lang=1&reg=48"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: '#f59e0b',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              pib.gov.in (PRID 2277691) <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.75rem 2rem',
          maxWidth: '980px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#94a3b8',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={16} /> Trust & Transparency Notice
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            lineHeight: 1.65,
            margin: 0
          }}>
            SecureChainLedger is an independent project exploring alignment with published government initiatives and pharmaceutical traceability requirements. References on this page do not imply government endorsement, funding, partnership, certification, regulatory approval or access to government infrastructure. Regulatory applicability and implementation requirements must be independently verified.
          </p>
        </div>
      </section>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#04070d',
        padding: '2.5rem 2rem',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>SecureChainLedger</span>
            <span style={{ margin: '0 0.5rem' }}>—</span>
            <span>Cryptographic Pharmaceutical Supply Chain Architecture</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {onNavigateToVerify && (
              <button
                onClick={() => onNavigateToVerify('BATCH-2026-001')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Verify Batch
              </button>
            )}
            {onNavigateToArchitecture && (
              <button
                onClick={onNavigateToArchitecture}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Architecture Ledger
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
