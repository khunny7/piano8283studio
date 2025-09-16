import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Blog from './routes/Blog';
import Admin from './routes/Admin';
import NotFound from './routes/NotFound';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { HeaderAuth } from './components/layout/HeaderAuth';
import { AuthProvider } from './context/AuthContext';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="nav-links">
      <Link 
        to="/" 
        className={`nav-link ${isActive('/') ? 'active' : ''}`}
      >
        Home
      </Link>
      <Link 
        to="/portfolio" 
        className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}
      >
        Portfolio
      </Link>
      <Link 
        to="/blog" 
        className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
      >
        Blog
      </Link>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app-container">
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <Link to="/" className="logo">
                <span className="logo-text">Piano8283</span>
                <span className="logo-subtitle">Developers • Designers • Writers</span>
              </Link>
            </div>
            
            <Navigation />
            
            <div className="header-actions">
              <HeaderAuth />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Piano8283 🎹</h3>
              <p>
                Just a developer who loves turning ideas into pixels and code into experiences. 
                Currently based in Seattle, where the coffee is strong and the WiFi is stronger.
              </p>
              <div className="footer-status">
                <span className="status-indicator">🟢</span>
                <span>Available for interesting projects</span>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Escapes</h4>
              <Link to="/portfolio">🚀 My Projects</Link>
              <Link to="/blog">📝 Random Thoughts</Link>
              <a href="mailto:contact@piano8283.dev">📧 Say Hello</a>
              <a href="/portfolio?debug=true">🐛 Debug Mode</a>
            </div>
            <div className="footer-section">
              <h4>Find Me Online</h4>
              <a href="https://github.com/khunny7" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
              <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">🎵 My Coding Playlist</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; 2025 Piano8283. Made with ☕ and a questionable amount of CSS animations.
              <br />
              <small>No bugs were harmed in the making of this website (they're all features).</small>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
