import { motion } from 'framer-motion';
import { Microscope, Truck, Building2, Stethoscope } from 'lucide-react';

export const WorkflowSection = () => {
  return (
    <section className="container">
      <div className="workflow-timeline">
        {[
          { icon: Microscope, label: 'Manufacturer' },
          { icon: Truck, label: 'Distributor' },
          { icon: Building2, label: 'Hospital/Pharmacy' },
          { icon: Stethoscope, label: 'Patient' }
        ].map((step, idx) => (
          <motion.div
            key={idx}
            className="workflow-step"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2 }}
          >
            <div className="step-icon">
              <step.icon size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{step.label}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
