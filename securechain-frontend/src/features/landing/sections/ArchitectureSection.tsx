import { motion } from 'framer-motion';

export const ArchitectureSection = () => {
  return (
    <section className="container">
      <div className="text-center" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem' }}>Enterprise System <span className="text-gradient">Architecture</span></h2>
      </div>

      <div className="architecture-diagram">
        <motion.div className="arch-layer layer-ui" whileHover={{ scale: 1.02 }}>Client UI / Mobile Apps</motion.div>
        <motion.div className="arch-layer layer-api" whileHover={{ scale: 1.02 }}>Secure API Gateway & Node Backend</motion.div>
        <motion.div
          className="arch-layer layer-trust glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
        >
          🔥 HYPERLEDGER FABRIC TRUST LAYER 🔥
        </motion.div>
        <motion.div className="arch-layer layer-network" whileHover={{ scale: 1.02 }}>IPFS Distributed Storage & Postgres DB</motion.div>
      </div>
    </section>
  );
};
