import React from 'react';
import { Link } from 'react-router-dom';
import { UserDebug } from '../components/UserDebug';
import { FirestoreTest } from '../components/FirestoreTest';

export default function Home() {
  // Check for debug URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const showDebug = urlParams.get('debug') === 'true';

  const featuredProjects = [
    {
      id: 1,
      title: "Little Trip with Yunsol 👶",
      description: "A heartwarming website I built for finding toddler-friendly places around Seattle. Born from personal experience - because finding good spots for little ones shouldn't be that hard!",
      tech: ["React", "Vite", "Firebase", "Love"],
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
      status: "Live & Loved",
      personal: "One of my favorite projects - built while watching little Yunsol explore the world!"
    },
    {
      id: 2,
      title: "KWordle 🎯",
      description: "A Korean twist on the popular word guessing game. I built this to practice Korean vocabulary while having fun with this localized version of Wordle.",
      tech: ["JavaScript", "CSS Grid", "Game Logic", "Korean"],
      image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=250&fit=crop",
      status: "Daily Challenge",
      personal: "Combining my love for word games with Korean language learning. Perfect for keeping my vocabulary sharp!"
    },
    {
      id: 3,
      title: "Dangun Land 🏛️",
      description: "An interactive exploration of Korean mythology and culture, featuring the legendary story of Dangun. A digital journey through ancient tales brought to life.",
      tech: ["React", "Animation", "Storytelling", "Culture"],
      image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=250&fit=crop",
      status: "Mythical",
      personal: "Diving into my cultural roots through code - bringing ancient Korean legends into the digital age"
    }
  ];

  const personalQuirks = [
    { emoji: "☕", fact: "My debugging is 20% code, 80% coffee" },
    { emoji: "🌙", fact: "Best ideas come at 2 AM (worst time to implement them)" },
    { emoji: "🎵", fact: "Can't code without Lo-fi hip hop playlists" },
    { emoji: "🐛", fact: "I name my bugs. Current favorite: Gerald the Persistent" }
  ];

  const realSkills = [
    { 
      category: "Frontend Magic ✨", 
      items: ["React (my comfort zone)", "TypeScript (saves my sanity)", "CSS (the pretty stuff)", "Vue.js (when React won't cooperate)"],
      vibe: "Making pixels dance since 2020"
    },
    { 
      category: "Backend Wizardry 🧙‍♂️", 
      items: ["Node.js (JavaScript everywhere!)", "Python (for when I feel smart)", "Firebase (Google does the heavy lifting)", "PostgreSQL (data needs a home)"],
      vibe: "Servers are just other people's computers"
    },
    { 
      category: "Design & UX 🎨", 
      items: ["Figma (my digital canvas)", "User Research (talking to humans)", "Prototyping (failing fast)", "Accessibility (everyone deserves good UX)"],
      vibe: "Making things that don't suck to use"
    },
    { 
      category: "Life Skills 🌱", 
      items: ["Stack Overflow (my second brain)", "Git (time travel for code)", "Coffee Brewing (essential dev tool)", "Rubber Duck Debugging (quack quack)"],
      vibe: "The real skills they don't teach in bootcamp"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="greeting">
                <span className="wave">👋</span>
                <span>Hey there! I'm</span>
              </div>
              <h1 className="hero-title">
                Piano8283
                <span className="subtitle">
                  (Yes, that's really what I go by)
                </span>
              </h1>
              <p className="hero-description">
                I'm a developer who actually enjoys CSS, designs my own prototypes, 
                and thinks good UX is like a good joke - if you have to explain it, it's probably not working.
                <br /><br />
                When I'm not turning coffee into code, you'll find me exploring with my camera, 
                practicing piano (hence the name), or convincing people that dark mode is superior.
              </p>
              <div className="hero-actions">
                <Link to="/portfolio" className="btn-primary">
                  🚀 See My Work
                </Link>
                <Link to="/blog" className="btn-gold">
                  📚 Read My Thoughts
                </Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card floating">
                <div className="code-snippet">
                  <div className="code-header">
                    <div className="code-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="code-title">about-me.js</span>
                  </div>
                  <div className="code-content">
                    <div className="code-line">
                      <span className="code-keyword">const</span> 
                      <span className="code-variable"> developer</span> 
                      <span className="code-operator"> = </span>
                      <span className="code-punctuation">&#123;</span>
                    </div>
                    <div className="code-line code-indent">
                      <span className="code-property">name:</span> 
                      <span className="code-string">'Piano8283'</span>,
                    </div>
                    <div className="code-line code-indent">
                      <span className="code-property">coffee:</span> 
                      <span className="code-string">'essential'</span>,
                    </div>
                    <div className="code-line code-indent">
                      <span className="code-property">bugs:</span> 
                      <span className="code-string">'they're features'</span>,
                    </div>
                    <div className="code-line code-indent">
                      <span className="code-property">motto:</span> 
                      <span className="code-string">'Ship it! 🚢'</span>
                    </div>
                    <div className="code-line">
                      <span className="code-punctuation">&#125;;</span>
                    </div>
                  </div>
                </div>
                <div className="personal-quirks">
                  {personalQuirks.map((quirk, index) => (
                    <div key={index} className="quirk-item">
                      <span className="quirk-emoji">{quirk.emoji}</span>
                      <span className="quirk-text">{quirk.fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section featured-projects">
        <div className="container">
          <div className="section-header">
            <h2>Things I've Built (And Actually Use) 🛠️</h2>
            <p>These aren't just portfolio pieces - they're real projects born from real problems I've encountered</p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map(project => (
              <div key={project.id} className="project-card card">
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-status">{project.status}</div>
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="personal-note">
                    <span className="note-emoji">💭</span>
                    <em>{project.personal}</em>
                  </div>
                  <div className="project-tech">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/portfolio" className="btn-secondary">
              🔍 Explore All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section skills-section">
        <div className="container">
          <div className="section-header">
            <h2>My Digital Toolbox 🧰</h2>
            <p>Technologies I use to bring ideas to life (and occasionally break things)</p>
          </div>
          <div className="skills-grid">
            {realSkills.map(skill => (
              <div key={skill.category} className="skill-category card">
                <h3>{skill.category}</h3>
                <p className="skill-vibe">{skill.vibe}</p>
                <div className="skill-items">
                  {skill.items.map(item => (
                    <span key={item} className="skill-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Let's Build Something Cool Together 🤝</h2>
            <p>
              Got an idea that needs some digital magic? I'm always up for interesting projects, 
              especially if they involve solving real problems or making someone's day a little better.
              <br /><br />
              <strong>Fair warning:</strong> I might suggest adding way too many animations. It's a problem I'm working on.
            </p>
            <div className="cta-actions">
              <a href="mailto:contact@piano8283.dev" className="btn-gold">
                ☕ Let's Chat
              </a>
              <Link to="/portfolio" className="btn-ghost">
                👀 See More Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Section */}
      {showDebug && (
        <div className="debug-section">
          <div className="container">
            <div className="debug-banner">
              <strong>🐛 Debug Mode Active (Gerald is watching)</strong>
              <p>Debug components are visible. Remove <code>?debug=true</code> from URL to hide.</p>
            </div>
            <FirestoreTest />
            <UserDebug />
          </div>
        </div>
      )}
    </div>
  );
}
