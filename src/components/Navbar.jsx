import React from 'react';
import { Zap, Sun, Moon, History } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, recentCount, onScrollToHistory }) {
  return (
    <header 
      className="surface-card" 
      style={{ 
        position: 'sticky', 
        top: '1rem', 
        zIndex: 40, 
        padding: '0.75rem 1.25rem', 
        marginBottom: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1rem',
        backdropFilter: 'blur(12px)',
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)'
      }}
      aria-label="Main Navigation"
    >
      {/* Brand Logo & Tagline */}
      <a 
        href="/" 
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
      >
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: 'var(--shadow-accent)'
        }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              KissURL
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
              <span className="pulse-indicator" /> Free
            </span>
          </div>
        </div>
      </a>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {recentCount > 0 && (
          <button
            onClick={onScrollToHistory}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
          >
            <History size={15} /> My Links <span className="tabular-nums badge badge-info" style={{ marginLeft: '4px' }}>{recentCount}</span>
          </button>
        )}

        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  );
}
