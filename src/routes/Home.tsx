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
      description: "A heartwarming website we built for finding toddler-friendly places around Seattle. Born from personal experience - because finding good spots for little ones shouldn't be that hard!",
      tech: ["React", "Vite", "Firebase", "Love"],
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=250&fit=crop",
      status: "Live & Loved",
      personal: "One of our favorite projects - built while chasing around a team member's nephew!"
    },
    {
      id: 2,
      title: "Piano Practice Tracker 🎹",
      description: "Because we kept forgetting how long we practiced (spoiler: it wasn't as much as we thought). Now with guilt-inducing statistics and motivational quotes.",
      tech: ["TypeScript", "React", "Firebase", "Persistence"],
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=250&fit=crop",
      status: "Daily Driver",
      personal: "Yes, our team actually uses this every day (when we remember to practice)"
    },
    {
      id: 3,
      title: "Mood-based Color Palette Generator 🌈",
      description: "Ever wanted colors that match your Monday morning energy? Or Friday afternoon vibes? This generates palettes based on how you're feeling right now.",
      tech: ["JavaScript", "Canvas API", "Psychology", "Coffee"],
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop",
      status: "Mood Dependent",
      personal: "Built during a particularly colorful week of team brainstorming"
    }
  ];

  const personalQuirks = [
    { emoji: "☕", fact: "Our debugging is 20% code, 80% coffee" },
    { emoji: "🌙", fact: "Best ideas come at 2 AM (worst time to implement them)" },
    { emoji: "🎵", fact: "Can't code without Lo-fi hip hop playlists" },
    { emoji: "🐛", fact: "We name our bugs. Current team favorite: Gerald the Persistent" }
  ];

  const realSkills = [
    { 
      category: "Frontend Magic ✨", 
      items: ["React (our comfort zone)", "TypeScript (saves our sanity)", "CSS (the pretty stuff)", "Vue.js (when React won't cooperate)"],
      vibe: "Making pixels dance since 2020"
    },
    { 
      category: "Backend Wizardry 🧙‍♂️", 
      items: ["Node.js (JavaScript everywhere!)", "Python (for when we feel smart)", "Firebase (Google does the heavy lifting)", "PostgreSQL (data needs a home)"],
      vibe: "Servers are just other people's computers"
    },
    { 
      category: "Design & UX 🎨", 
      items: ["Figma (our digital canvas)", "User Research (talking to humans)", "Prototyping (failing fast)", "Accessibility (everyone deserves good UX)"],
      vibe: "Making things that don't suck to use"
    },
    { 
      category: "Life Skills 🌱", 
      items: ["Stack Overflow (our second brain)", "Git (time travel for code)", "Coffee Brewing (essential dev tool)", "Rubber Duck Debugging (quack quack)"],
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
                <span>Hey there! We're</span>
              </div>
              <h1 className="hero-title">
                Piano8283
                <span className="subtitle">
                  (Yes, that's really what we go by)
                </span>
              </h1>
              <p className="hero-description">
                We're a team of developers who actually enjoy CSS, designers who code our own prototypes, 
                and writers who think good UX is like a good joke - if you have to explain it, it's probably not working.
                <br /><br />
                When we're not turning coffee into code, you'll find us exploring with our cameras, 
                practicing various instruments (hence the name), or convincing people that dark mode is superior.
              </p>
              <div className="hero-actions">
                <Link to="/portfolio" className="btn-primary">
                  🚀 See Our Work
                </Link>
                <Link to="/blog" className="btn-gold">
                  📚 Read Our Thoughts
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
                      <span className="code-variable"> team</span> 
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
            <h2>Things We've Built (And Actually Use) 🛠️</h2>
            <p>These aren't just portfolio pieces - they're real projects born from real problems we've encountered</p>
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
            <h2>Our Digital Toolbox 🧰</h2>
            <p>Technologies we use to bring ideas to life (and occasionally break things)</p>
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
              Got an idea that needs some digital magic? We're always up for interesting projects, 
              especially if they involve solving real problems or making someone's day a little better.
              <br /><br />
              <strong>Fair warning:</strong> We might suggest adding way too many animations. It's a problem we're working on.
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
