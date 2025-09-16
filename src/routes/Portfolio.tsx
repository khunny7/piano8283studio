import React, { useState } from 'react';
import projects from '../data/projects.json';
import type { Project } from '../types/project';
import { ProjectCard } from '../components/ProjectCard';

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPersonalNotes, setShowPersonalNotes] = useState(true);
  
  const allProjects = projects as Project[];
  
  const categories = [
    { id: 'all', name: 'Everything', emoji: '🌟' },
    { id: 'web-app', name: 'Web Apps', emoji: '🌐' },
    { id: 'tool', name: 'Tools', emoji: '🛠️' },
    { id: 'productivity', name: 'Productivity', emoji: '⚡' },
    { id: 'mobile', name: 'Mobile', emoji: '📱' },
    { id: 'design', name: 'Design', emoji: '🎨' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory);

  const stats = {
    totalProjects: allProjects.length,
    liveProjects: allProjects.filter(p => p.liveUrl).length,
    coffeeConsumed: '∞',
    bugsFixed: allProjects.length * 47 // Totally scientific calculation
  };

  return (
    <div className="portfolio-page">
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="container">
          <div className="portfolio-header">
            <div className="header-content">
              <h1>My Digital Creations 🚀</h1>
              <p className="hero-subtitle">
                A collection of projects born from real problems, fueled by coffee, and 
                seasoned with a healthy dose of "how hard could it be?"
              </p>
              <div className="portfolio-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalProjects}</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.liveProjects}</span>
                  <span className="stat-label">Live Sites</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.coffeeConsumed}</span>
                  <span className="stat-label">Cups of Coffee</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.bugsFixed}</span>
                  <span className="stat-label">Bugs Fixed</span>
                </div>
              </div>
            </div>
            <div className="header-visual">
              <div className="code-window">
                <div className="window-header">
                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="window-title">projects.filter()</span>
                </div>
                <div className="window-content">
                  <div className="code-line">
                    <span className="code-comment">// My development philosophy</span>
                  </div>
                  <div className="code-line">
                    <span className="code-keyword">const</span>
                    <span className="code-variable"> approach</span>
                    <span className="code-operator"> = </span>
                    <span className="code-punctuation">&#123;</span>
                  </div>
                  <div className="code-line code-indent">
                    <span className="code-property">step1:</span>
                    <span className="code-string"> 'Have problem'</span>,
                  </div>
                  <div className="code-line code-indent">
                    <span className="code-property">step2:</span>
                    <span className="code-string"> 'Build solution'</span>,
                  </div>
                  <div className="code-line code-indent">
                    <span className="code-property">step3:</span>
                    <span className="code-string"> 'Over-engineer it'</span>,
                  </div>
                  <div className="code-line code-indent">
                    <span className="code-property">step4:</span>
                    <span className="code-string"> 'Ship it anyway'</span>
                  </div>
                  <div className="code-line">
                    <span className="code-punctuation">&#125;;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="portfolio-controls">
        <div className="container">
          <div className="controls-wrapper">
            <div className="category-filters">
              <h3>Browse by Category</h3>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  >
                    <span className="filter-emoji">{category.emoji}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="view-controls">
              <label className="toggle-control">
                <input
                  type="checkbox"
                  checked={showPersonalNotes}
                  onChange={(e) => setShowPersonalNotes(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Show personal stories</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="portfolio-projects">
        <div className="container">
          <div className="projects-header">
            <h2>
              {selectedCategory === 'all' 
                ? `All Projects (${filteredProjects.length})` 
                : `${categories.find(c => c.id === selectedCategory)?.name} (${filteredProjects.length})`
              }
            </h2>
            {selectedCategory !== 'all' && (
              <p className="category-description">
                {selectedCategory === 'web-app' && "Full-featured web applications that solve real problems"}
                {selectedCategory === 'tool' && "Utilities and tools that make life easier"}
                {selectedCategory === 'productivity' && "Apps to help you get things done (or at least try to)"}
                {selectedCategory === 'mobile' && "Mobile experiences for on-the-go problem solving"}
                {selectedCategory === 'design' && "Design systems and visual experiments"}
              </p>
            )}
          </div>
          
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                showPersonalNote={showPersonalNotes}
              />
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No projects found</h3>
              <p>Looks like I haven't built anything in this category yet. Maybe that's my next project!</p>
            </div>
          )}
        </div>
      </section>

      {/* Fun Footer */}
      <section className="portfolio-footer">
        <div className="container">
          <div className="footer-content">
            <h2>What's Next? 🤔</h2>
            <p>
              Always cooking up new ideas. Current obsessions include: making CSS animations 
              that serve no purpose, building tools I'll use once, and convincing myself 
              that this time I'll actually document my code properly.
            </p>
            <div className="next-projects">
              <div className="coming-soon">
                <h4>🔮 Coming Eventually</h4>
                <ul>
                  <li>🎮 Retro game collection (because the world needs more pixel art)</li>
                  <li>📚 Personal learning tracker (to guilt myself into studying)</li>
                  <li>🌱 Plant care reminder app (my succulents keep dying)</li>
                  <li>🎵 Spotify playlist mood analyzer (very important research)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
