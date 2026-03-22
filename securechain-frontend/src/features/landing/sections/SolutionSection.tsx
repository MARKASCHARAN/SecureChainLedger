import { motion } from 'framer-motion';

export const SolutionSection = () => {
  return (
    <section className="container" style={{ marginTop: '80px' }}>
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>The Immutable <span className="text-gradient-green">Solution</span></h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          SecureChainLedger maps every physical movement to an immutable blockchain record. Total transparency from end to end.
        </p>
      </motion.div>
    </section>
  );
};
