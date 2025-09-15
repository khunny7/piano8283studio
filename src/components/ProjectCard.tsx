import React from 'react';
import type { Project } from '../types/project';

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  return (
    <article style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>{project.title}</h3>
      <p>{project.description}</p>
      <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Year: {project.year}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ background: '#eee', padding: '0.25rem 0.5rem', borderRadius: 4, fontSize: '0.75rem' }}>{tag}</span>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem' }}>
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>}
        {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer">Code</a>}
      </div>
    </article>
  );
}
