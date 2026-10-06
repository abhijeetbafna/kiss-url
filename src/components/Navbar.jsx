import React from 'react';
import { Plus, Sun, Moon, Globe, User, ShieldCheck } from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  onOpenCreateModal, 
  onOpenBioStudio, 
  onOpenDomainModal, 
  onOpenSafetyModal,
  onOpenErrorBrandingModal,
  onWorkspaceChanged,
  totalLinks 
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2.5rem',
        transition: 'background-color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)'
      }}
    >
      <div style={{ 
        maxWidth: '1020px', 
        margin: '0 auto', 
        padding: '0.85rem 1.25rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        {/* Brand & Workspace Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              textDecoration: 'none',
              color: 'var(--text-primary)'
            }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero-section');
            }}
          >
            <span style={{ 
              fontSize: '1.05rem', 
              fontWeight: '700', 
              letterSpacing: '-0.03em', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem' 
            }}>
              KissURL
            </span>
          </a>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-default)' }} />

          {/* Workspace Switcher */}
          <WorkspaceSwitcher 
            onWorkspaceChanged={onWorkspaceChanged} 
            onOpenSettings={onOpenErrorBrandingModal}
          />
        </div>

        {/* Navigation links */}
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button 
            onClick={() => scrollToSection('hero-section')} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}
          >
            Shorten
          </button>
          <button 
            onClick={() => scrollToSection('hub-section')} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}
          >
            Links <span className="tabular-nums" style={{ color: 'var(--text-muted)', marginLeft: '2px' }}>({totalLinks})</span>
          </button>
          <button 
            onClick={onOpenBioStudio} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Create & Edit Link in Bio Pages"
          >
            <User size={13} /> Bio
          </button>
          <button 
            onClick={onOpenDomainModal} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Custom Domain & CNAME Manager"
          >
            <Globe size={13} /> Domains
          </button>
          <button 
            onClick={onOpenSafetyModal} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Scan URL Safety & Malware Threats"
          >
            <ShieldCheck size={13} /> Safety
          </button>
        </nav>

        {/* Actions & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={onToggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary"
            style={{ fontSize: '0.825rem', padding: '0.4rem 0.75rem' }}
          >
            <Plus size={14} /> New Link
          </button>
        </div>
      </div>
    </header>
  );
}
