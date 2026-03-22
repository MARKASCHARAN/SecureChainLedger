import { motion } from 'framer-motion';
import { AlertTriangle, Search, History } from 'lucide-react';

export const ProblemSection = () => {
  return (
    <section className="container">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The Supply Chain <span style={{ color: '#f97316' }}>Crisis</span></h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Billions of dollars are lost and millions of lives are endangered due to opaque, fragmented, and vulnerable supply chains.
        </p>
      </motion.div>

      <div className="problems-grid">
        {[
          { icon: AlertTriangle, title: 'Counterfeit Drugs', desc: 'Over 1M deaths yearly due to fake medications entering the global market.', color: '#ef4444' },
          { icon: Search, title: 'Lack of Traceability', desc: 'Opaque distribution networks make it impossible to track medicine origins.', color: '#f97316' },
          { icon: History, title: 'Delayed Recalls', desc: 'Outdated systems lead to life-threatening delays when recalling toxic batches.', color: '#eab308' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="problem-card glass-panel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <item.icon size={48} color={item.color} style={{ marginBottom: '24px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{item.title}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
