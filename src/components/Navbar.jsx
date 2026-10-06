import React from 'react';
import { Zap, Plus, Sun, Moon, Server, Layers, HelpCircle } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, onOpenCreateModal, onOpenDeployModal, totalLinks }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className="card-surface" 
      style={{ 
        position: 'sticky', 
        top: '1rem', 
        zIndex: 40, 
        padding: '0.75rem 1.5rem', 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1rem',
        backdropFilter: 'blur(12px)',
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.92)'
      }}
      aria-label="Main Navigation"
    >
      {/* Brand Logo & Name */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        onClick={() => scrollToSection('hero-section')}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-accent)'
        }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--color-text-primary)' }}>
              LinkPulse
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
              <span className="pulse-indicator" /> v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }} className="nav-links-container">
        <button 
          onClick={() => scrollToSection('hero-section')} 
          className="btn-ghost" 
          style={{ fontSize: '0.85rem' }}
        >
          Shorten
        </button>
        <button 
          onClick={() => scrollToSection('demos-section')} 
          className="btn-ghost" 
          style={{ fontSize: '0.85rem' }}
        >
          Capabilities
        </button>
        <button 
          onClick={() => scrollToSection('workflow-section')} 
          className="btn-ghost" 
          style={{ fontSize: '0.85rem' }}
        >
          How It Works
        </button>
        <button 
          onClick={() => scrollToSection('hub-section')} 
          className="btn-ghost" 
          style={{ fontSize: '0.85rem' }}
        >
          Link Hub <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--color-accent)', marginLeft: '2px' }}>({totalLinks})</span>
        </button>
      </div>

      {/* Actions & Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={onOpenDeployModal}
          className="btn-secondary"
          style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
          title="$0/month Production Architecture"
        >
          <Server size={14} color="#059669" /> $0 Stack
        </button>

        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
        >
          <Plus size={15} /> Create Link
        </button>
      </div>
    </nav>
  );
}
