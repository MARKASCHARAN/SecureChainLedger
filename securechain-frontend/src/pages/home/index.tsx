import {
  HeroSection,
  ProblemSection,
  SolutionSection,
  WorkflowSection,
  ArchitectureSection,
  FeatureSection,
  VerificationSection,
  UseCaseSection,
  TechStackSection,
  CTA,
} from '../../features/landing';
import { Navbar } from '../../components/layout';

export default function HomePage() {
  return (
    <div className="app-container">
      <Navbar />
      {/* Background Orbs */}
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>

      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <ArchitectureSection />
      <FeatureSection />
      <VerificationSection />
      <UseCaseSection />
      <TechStackSection />
      <CTA />
    </div>
  );
}
