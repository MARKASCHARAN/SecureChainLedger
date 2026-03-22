import { motion } from 'framer-motion';
import WorldMap from '@/components/ui/world-map';

export const HeroSection = () => {
  return (
    <section className="hero-split">
      <div className="hero-split-container">
        {/* Left Section: Content */}
        <motion.div 
          className="hero-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="hero-eyebrow">SECURE • DATA • PROVENANCE</div>
          
          <h1 className="hero-title">
            The Trust Ledger <br />
            <span>Platform for your</span> <br />
            <strong>whole supply chain</strong>
          </h1>
          
          <p className="hero-description">
            Finally — anyone in your business can get trusted data insights, from advanced provenance to simple verification, in one integrated platform.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">42+</span>
              <span className="stat-label">Deployments <br />worldwide</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">1M+</span>
              <span className="stat-label">Items <br />tracked daily</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">On-chain <br />transparency</span>
            </div>
          </div>
          
          <div className="hero-actions">
            <div className="primary-cta-container">
              <div className="cta-crosshair tl"></div>
              <div className="cta-crosshair tr"></div>
              <div className="cta-crosshair bl"></div>
              <div className="cta-crosshair br"></div>
              <button className="btn-hex-primary">
                Get started for free
              </button>
            </div>
            <button className="btn-hex-outline">
              Request a demo
            </button>
          </div>
        </motion.div>

        {/* Right Section: Animation */}
        <motion.div 
          className="hero-right"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          style={{ width: '100%', minHeight: '400px' }}
        >
          <div className="world-map-wrapper" style={{ width: '100%', height: '100%' }}>
            <WorldMap
              dots={[
                {
                  start: { lat: 20.5937, lng: 78.9629 }, // India
                  end: { lat: 34.0522, lng: -118.2437 }, // LA
                },
                {
                  start: { lat: 20.5937, lng: 78.9629 }, // India
                  end: { lat: 51.5074, lng: -0.1278 }, // London
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 }, // London
                  end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                },
                {
                  start: { lat: -15.7975, lng: -47.8919 }, // Brazil
                  end: { lat: 64.2008, lng: -149.4937 }, // Alaska
                },
              ]}
              lineColor="#38bdf8"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
