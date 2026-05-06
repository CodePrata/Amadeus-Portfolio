'use client';

import { ProjectLogCard } from '@/components/ui/ProjectLogCard';
import { getVisibleProjects } from '@/data/registry';
import { useSystemStore } from '@/store/useSystemStore';

export function ProjectsSection(): JSX.Element {
  const projects = getVisibleProjects();
  const activeProjectId = useSystemStore((state) => state.activeProjectId);
  const setActiveProjectId = useSystemStore((state) => state.setActiveProjectId);

  const handleToggle = (projectId: string): void => {
    setActiveProjectId(activeProjectId === projectId ? null : projectId);
  };

  return (
    <section
      id="projects"
      className="min-h-screen border-b border-matrix-green/20 px-4 py-20 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <h2 className="text-xl font-bold text-matrix-green">PROJECTS</h2>
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectLogCard
              key={project.id}
              project={project}
              expanded={activeProjectId === project.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
