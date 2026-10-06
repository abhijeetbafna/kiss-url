import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  ShieldCheck, 
  Layers, 
  LogIn, 
  ChevronDown, 
  Target, 
  Webhook, 
  BarChart3, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import WorkspaceSwitcher from './WorkspaceSwitcher';

export default function Navbar({ 
  theme, 
  onToggleTheme, 
  user,
  onOpenAuthModal,
  onOpenCreateModal, 
  onOpenPixelModal,
  onOpenWebhookModal,
  onOpenWorkspaceAnalytics,
  onOpenBioStudio, 
  onOpenDomainModal, 
  onOpenBulkModal,
  onOpenSafetyModal,
  onOpenErrorBrandingModal,
  onOpenUserManual,
  onWorkspaceChanged,
  totalLinks 
}) {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target)) {
        setIsToolsOpen(false);
      }
    };
    if (isToolsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isToolsOpen]);

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
        padding: '0.75rem 1.25rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Left: Brand Logo & Workspace Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <a 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
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
              fontWeight: '800', 
              letterSpacing: '-0.03em', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem' 
            }}>
              KissURL
            </span>
          </a>

          <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-default)' }} />

          {/* Persistent Workspace Switcher */}
          <WorkspaceSwitcher 
            onWorkspaceChanged={onWorkspaceChanged} 
            onOpenSettings={onOpenErrorBrandingModal}
          />
        </div>

        {/* Center: Clean Streamlined Navigation */}
        <nav style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button 
            onClick={() => scrollToSection('hub-section')} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem' }}
          >
            Links <span className="tabular-nums" style={{ color: 'var(--text-muted)', marginLeft: '3px', fontWeight: '600' }}>({totalLinks})</span>
          </button>

          <button 
            onClick={onOpenWorkspaceAnalytics} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Visual Heatmap & Analytics Suite"
          >
            <BarChart3 size={13} /> Analytics
          </button>

          {/* Tools & Features Dropdown Menu */}
          <div style={{ position: 'relative' }} ref={toolsMenuRef}>
            <button 
              onClick={() => setIsToolsOpen(!isToolsOpen)} 
              className={`btn ${isToolsOpen ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Tools <ChevronDown size={12} style={{ transform: isToolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
            </button>

            {isToolsOpen && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 6px)', 
                  left: '0', 
                  width: '230px', 
                  backgroundColor: 'var(--bg-surface)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-md)', 
                  boxShadow: 'var(--shadow-md)', 
                  padding: '0.4rem', 
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.15rem'
                }}
              >
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenPixelModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <Target size={14} style={{ color: '#3b82f6' }} />
                  <span>Retargeting Pixels</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenWebhookModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <Webhook size={14} style={{ color: '#a855f7' }} />
                  <span>Webhooks & Automations</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenBioStudio();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <User size={14} style={{ color: '#10b981' }} />
                  <span>Bio Link Tree Studio</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenDomainModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <Globe size={14} style={{ color: '#f59e0b' }} />
                  <span>Custom Domains (CNAME)</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenBulkModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <Layers size={14} style={{ color: '#06b6d4' }} />
                  <span>Bulk CSV Shortener</span>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenSafetyModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem' }}
                >
                  <ShieldCheck size={14} style={{ color: '#ec4899' }} />
                  <span>URL Safety Auditor</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    if (onOpenUserManual) onOpenUserManual();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.65rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.5rem', color: 'var(--primary-bg)', fontWeight: '600' }}
                >
                  <BookOpen size={14} />
                  <span>Interactive User Manual</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right: Theme & Account & Create Link Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <button
            onClick={onToggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Account Profile / Login Button */}
          <button
            onClick={onOpenAuthModal}
            className="btn btn-secondary"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.35rem 0.65rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              borderRadius: 'var(--radius-md)'
            }}
            title={user ? `Signed in as ${user.email}` : 'Sign In or Sign Up'}
          >
            {user ? (
              <>
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-bg)', 
                  color: '#fff', 
                  fontSize: '0.65rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'Account'}
                </span>
              </>
            ) : (
              <>
                <LogIn size={13} />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.35rem 0.75rem', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.3rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600'
            }}
          >
            <Plus size={14} />
            <span>New Link</span>
          </button>
        </div>
      </div>
    </header>
  );
}
