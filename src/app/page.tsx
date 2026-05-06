'use client';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { CertsSection } from '@/components/sections/CertsSection';
import { CommsSection } from '@/components/sections/CommsSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { IntelSection } from '@/components/sections/IntelSection';
import { ProfileSection } from '@/components/sections/ProfileSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { useScrollSpy } from '@/hooks/useScrollSpy';

function HomeShell(): JSX.Element {
  useScrollSpy(['home', 'about', 'projects', 'skills', 'certifications', 'intel', 'contact']);

  return (
    <div>
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProfileSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <ProjectsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <SkillsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <CertsSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <IntelSection />
      </ErrorBoundary>
      <ErrorBoundary>
        <CommsSection />
      </ErrorBoundary>
    </div>
  );
}

export default function Home(): JSX.Element {
  return <HomeShell />;
}
