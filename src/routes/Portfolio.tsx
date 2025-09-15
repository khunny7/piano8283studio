import React from 'react';
import projects from '../data/projects.json';
import type { Project } from '../types/project';
import { ProjectCard } from '../components/ProjectCard';

export default function Portfolio() {
  const list = projects as Project[];
  return (
    <div>
      <h1>Portfolio</h1>
      <p>Project list with simple static data (will later support filtering / categories).</p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', marginTop: '1rem' }}>
        {list.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </div>
  );
}
