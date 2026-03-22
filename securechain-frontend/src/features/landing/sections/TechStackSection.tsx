export const TechStackSection = () => {
  return (
    <section className="container" style={{ padding: '60px 0' }}>
      <p className="text-center" style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '40px' }}>
        Powered By Next-Gen Infrastructure
      </p>
      <div className="tech-grid">
        {['React', 'TypeScript', 'Hyperledger Fabric', 'PostgreSQL', 'Node.js', 'IPFS'].map((tech, idx) => (
          <div key={idx} className="tech-item">
            <strong style={{ fontSize: '1.5rem', fontFamily: 'var(--font-outfit)' }}>{tech}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};
