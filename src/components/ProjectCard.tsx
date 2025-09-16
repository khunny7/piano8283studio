import React from 'react';
import type { Project } from '../types/project';

interface Props {
  project: Project;
  showPersonalNote?: boolean;
}

export function ProjectCard({ project, showPersonalNote = true }: Props) {
  return (
    <article className="project-card card">
      {project.image && (
        <div className="project-image">
          <img src={project.image} alt={project.title} />
          {project.status && (
            <div className="project-status">{project.status}</div>
          )}
          <div className="project-overlay">
            <div className="project-links">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary project-link"
                >
                  🚀 Live Site
                </a>
              )}
              {project.repoUrl && (
                <a 
                  href={project.repoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-secondary project-link"
                >
                  👀 Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="project-content">
        <div className="project-header">
          <h3>{project.title}</h3>
          <span className="project-year">{project.year}</span>
        </div>
        
        <p className="project-description">{project.description}</p>
        
        {showPersonalNote && project.personal && (
          <div className="personal-note">
            <span className="note-emoji">💭</span>
            <em>{project.personal}</em>
          </div>
        )}

        <div className="project-footer">
          {project.tech && project.tech.length > 0 && (
            <div className="project-tech">
              {project.tech.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>
          )}
          
          {(!project.image) && (
            <div className="project-links-bottom">
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="project-link-simple"
                >
                  🚀 Live Site
                </a>
              )}
              {project.repoUrl && (
                <a 
                  href={project.repoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="project-link-simple"
                >
                  👀 Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
