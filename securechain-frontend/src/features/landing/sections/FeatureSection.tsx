import { motion } from 'framer-motion';
import { PackageCheck, ShieldCheck, QrCode, ShieldAlert, FileCheck, Activity } from 'lucide-react';

export const FeatureSection = () => {
  return (
    <section className="container">
      <div className="text-center">
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Powerful <span className="text-gradient">Features</span></h2>
      </div>

      <div className="features-grid">
        {[
          { icon: PackageCheck, title: 'Batch Tracking', desc: 'Real-time granular tracking of medicine batches globally.' },
          { icon: ShieldCheck, title: 'Chain of Custody', desc: 'Unbroken historical record of ownership transfers.' },
          { icon: QrCode, title: 'Instant Verification', desc: 'End users can instantly verify drug authenticity via QR.' },
          { icon: ShieldAlert, title: 'Automated Recalls', desc: 'Smart contracts instantly freeze compromised batches.' },
          { icon: FileCheck, title: 'Audit Logs', desc: 'Compliance-ready cryptographic logs for regulatory bodies.' },
          { icon: Activity, title: 'IoT Integration', desc: 'Temperature & humidity sensors writing data directly to chain.' }
        ].map((feat, idx) => (
          <motion.div
            key={idx}
            className="feature-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <feat.icon size={40} color="var(--accent-blue)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{feat.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
