import { useState } from 'react';
import { motion } from 'framer-motion';

export const UseCaseSection = () => {
  const [activeTab, setActiveTab] = useState('manufacturer');

  return (
    <section className="container">
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Built for the <span className="text-gradient">Ecosystem</span></h2>
      </div>
      
      <div className="tabs-header">
        {['Manufacturer', 'Distributor', 'Hospital', 'Regulator'].map((tab) => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <motion.div 
        key={activeTab}
        className="tab-content glass-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'manufacturer' && (
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#38bdf8' }}>For Manufacturers</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Mint digital twins of new batch productions. Secure intellectual property, prevent unauthorized cloning, and maintain direct oversight of your global distribution network in real-time.</p>
          </div>
        )}
        {activeTab === 'distributor' && (
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#f97316' }}>For Distributors</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Automate chain of custody handoffs via smart contracts. Reduce massive compliance overhead and minimize liability with provable, tamper-evident transfer records.</p>
          </div>
        )}
        {activeTab === 'hospital' && (
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#10b981' }}>For Hospitals & Pharmacies</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Instantly authenticate incoming inventory. Protect patients from expired or compromised medications, and auto-sync records with internal hospital management systems.</p>
          </div>
        )}
        {activeTab === 'regulator' && (
          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '16px', color: '#c084fc' }}>For Regulators</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Access global, real-time macro-level data. Streamline audits, issue immediate network-wide recalls, and ensure absolute compliance with global health standards (DSCSA, FMD).</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};
