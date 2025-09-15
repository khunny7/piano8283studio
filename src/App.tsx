import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './routes/Home';
import Portfolio from './routes/Portfolio';
import Blog from './routes/Blog';
import NotFound from './routes/NotFound';
import { ThemeToggle } from './components/layout/ThemeToggle';
import { HeaderAuth } from './components/layout/HeaderAuth';
import { FirestoreDemo } from './components/FirestoreDemo';
import { BlogAdmin } from './components/BlogAdmin';
import { UserManagement } from './components/UserManagement';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '1.5rem', maxWidth: 1080, margin: '0 auto' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/">Home</Link>
              <Link to="/portfolio">Portfolio</Link>
              <Link to="/blog">Blog</Link>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <HeaderAuth />
              <ThemeToggle />
            </div>
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FirestoreDemo />
          <BlogAdmin />
          <UserManagement />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
