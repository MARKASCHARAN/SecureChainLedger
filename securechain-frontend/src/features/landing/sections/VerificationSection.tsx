import { motion } from 'framer-motion';
import { ShieldCheck, QrCode } from 'lucide-react';

export const VerificationSection = () => {
  return (
    <section className="container">
      <div className="verification-container">
        <motion.div 
          className="verification-content"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>
            Instant <span className="text-gradient-green">Authenticity Check</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Empower patients and pharmacists. A simple scan reveals the entire journey of the medicine, confirming it is genuine, safe, and stored under proper conditions.
          </p>
          <ul style={{ listStyle: 'none', gap: '16px', display: 'flex', flexDirection: 'column' }}>
            {[
              'Cryptographic proof of origin',
              'Real-time temperature telemetry data',
              'Expiration and recall status alerts'
            ].map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                <ShieldCheck color="var(--accent-green)" /> {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '40px' }}>
            <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              Try Interactive Demo
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="verification-visual"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="phone-mockup">
            <div className="phone-screen">
              <QrCode size={120} color="#34d399" />
              <h3 style={{ marginTop: '24px', color: '#f8fafc', fontWeight: '600' }}>Scanning Code...</h3>
              <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'var(--accent-green)' }}
                  animate={{ width: ['0%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
            </div>
            <div className="scan-line"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
