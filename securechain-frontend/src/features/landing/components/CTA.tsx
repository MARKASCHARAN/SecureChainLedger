import { motion } from 'framer-motion';

export const CTA = () => {
  return (
    <section className="container">
      <motion.div 
        className="final-cta glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
          Build Trust in Every <span className="text-gradient">Supply Chain</span>
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px' }}>
          Join the consortium of forward-thinking pharmaceutical leaders securing the future of global health.
        </p>
        <button className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.2rem' }}>
          Request Enterprise Demo
        </button>
      </motion.div>
    </section>
  );
};
