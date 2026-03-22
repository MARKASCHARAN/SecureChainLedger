import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, QrCode, ChevronRight, Activity, PackageCheck, Globe, FileCheck } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownContent: Record<string, any[]> = {
    'Solutions': [
      { title: 'Pharma Traceability', desc: 'End-to-end tracking for medicine batches', icon: <ShieldCheck size={18} /> },
      { title: 'Regulatory Compliance', desc: 'Cryptographic proof for FDA/EMA audits', icon: <QrCode size={18} /> },
      { title: 'Cold Chain IoT', desc: 'Secure sensor data integration', icon: <Activity size={18} /> },
    ],
    'Enterprise': [
      { title: 'SCL Network', desc: 'Private Hyperledger Fabric nodes', icon: <PackageCheck size={18} /> },
      { title: 'Global Node Fleet', desc: 'Scale across 42+ countries', icon: <Globe size={18} /> },
    ],
    'Resources': [
      { title: 'Whitepapers', desc: 'Deep dive into blockchain architecture', icon: <FileCheck size={18} /> },
      { title: 'API Docs', desc: 'Build on top of the SCL protocol', icon: <Menu size={18} /> },
      { title: 'Research', desc: 'Future of pharmaceutical supply chains', icon: <ChevronRight size={18} /> },
    ]
  };

  const navLinks = [
    { title: 'Platform', href: '#platform' },
    { title: 'Solutions', href: '#solutions', hasDropdown: true },
    { title: 'Enterprise', href: '#enterprise', hasDropdown: true },
    { title: 'Resources', href: '#resources', hasDropdown: true }
  ];

  return (
    <>
      <div className="top-ticker-wrapper">
        <div className="top-ticker-container">
          <motion.div 
            className="ticker-track"
            animate={{ x: [0, -1000] }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="ticker-group">
                <div className="ticker-item">
                  <ShieldCheck size={14} /> 
                  Platform Update: SECURECHAIN V2.4 is now live for all enterprise nodes
                  <span className="ticker-arrow">→</span>
                </div>
                <div className="ticker-item">
                  <QrCode size={14} /> 
                  Global Reach: 14M+ medical batches verified across 42 countries
                  <span className="ticker-arrow">→</span>
                </div>
                <div className="ticker-item">
                  <Menu size={14} /> 
                  Case Study: How Merck optimized supply chain transparency with SCL
                  <span className="ticker-arrow">→</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-full-width">
          <div className="navbar-perspective">
            <div className="navbar-wrapper">
              <div className="blueprint-corner top-left"></div>
              <div className="blueprint-corner top-right"></div>
              <div className="blueprint-corner bottom-left"></div>
              <div className="blueprint-corner bottom-right"></div>

              <nav className="navbar-links left-links">
                {navLinks.map((link) => (
                  <div 
                    key={link.title} 
                    className="nav-link-wrapper"
                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a href={link.href} className="nav-link">
                      {link.title}
                      {link.hasDropdown && (
                        <span className="dropdown-arrow">
                          {activeDropdown === link.title ? '▴' : '▾'}
                        </span>
                      )}
                    </a>
                    
                    <AnimatePresence>
                      {activeDropdown === link.title && (
                        <motion.div 
                          className="technical-dropdown"
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="dropdown-grid">
                            {dropdownContent[link.title].map((item: any, idx: number) => (
                              <a href="#" key={idx} className="dropdown-item">
                                <div className="item-header">
                                  <span className="item-icon">{item.icon}</span>
                                  <span className="item-title">{item.title}</span>
                                  <span className="item-arrow">↗</span>
                                </div>
                                <p className="item-desc">{item.desc}</p>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              <a href="/" className="navbar-logo center-logo">
                
                <span className="logo-text">SCL</span>
              </a>

              <div className="navbar-actions right-actions">
                <button className="btn-hex-outline">
                  <QrCode size={16} /> Verify
                </button>
                <button className="btn-ghost" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Log In</button>
                <div className="primary-cta-container">
                  <div className="cta-crosshair tl"></div>
                  <div className="cta-crosshair tr"></div>
                  <div className="cta-crosshair bl"></div>
                  <div className="cta-crosshair br"></div>
                  <button className="btn-hex-primary">Get started</button>
                </div>
              </div>

              <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navLinks.map((link) => (
            <a 
              key={link.title} 
              href={link.href} 
              className="dropdown-item"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}
            >
              <div className="item-header">
                <span className="item-title" style={{ fontSize: '1.2rem' }}>{link.title}</span>
                <span className="item-arrow">→</span>
              </div>
            </a>
          ))}
          
          <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button className="btn-hex-outline" style={{ justifyContent: 'center', width: '100%', padding: '16px' }}>
              <QrCode size={18} /> Verify Medicine
            </button>
            <div className="primary-cta-container" style={{ width: '100%' }}>
              <div className="cta-crosshair tl"></div>
              <div className="cta-crosshair tr"></div>
              <div className="cta-crosshair bl"></div>
              <div className="cta-crosshair br"></div>
              <button className="btn-hex-primary" style={{ justifyContent: 'center', width: '100%', padding: '16px' }}>
                Get Started
              </button>
            </div>
            <button className="btn-ghost" style={{ fontSize: '1rem', marginTop: '8px' }}>Log In</button>
          </div>
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
