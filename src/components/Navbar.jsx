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
  Zap, 
  Compass,
  ArrowRight,
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
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const dropdownRef = useRef(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFeaturesOpen(false);
      }
    };
    if (isFeaturesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFeaturesOpen]);

  return (
    <header 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem',
        backdropFilter: 'blur(16px)',
        transition: 'background-color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)'
      }}
    >
      <div style={{ 
        maxWidth: '1060px', 
        margin: '0 auto', 
        padding: '0.65rem 1.25rem',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Left: Brand Identity & Workspace Switcher */}
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
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-bg)',
              color: 'var(--primary-fg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}>
              <Zap size={14} style={{ fill: 'currentColor' }} />
            </div>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: '800', 
              letterSpacing: '-0.03em', 
              color: 'var(--text-primary)' 
            }}>
              KissURL
            </span>
          </a>

          <div style={{ height: '14px', width: '1px', backgroundColor: 'var(--border-default)' }} />

          {/* Persistent Workspace Switcher */}
          <WorkspaceSwitcher 
            onWorkspaceChanged={onWorkspaceChanged} 
            onOpenSettings={onOpenErrorBrandingModal}
          />
        </div>

        {/* Center: Sleek Navigation */}
        <nav style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button 
            onClick={() => scrollToSection('hub-section')} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Links</span>
            <span className="badge" style={{ fontSize: '0.675rem', padding: '0px 5px', fontWeight: '700' }}>
              {totalLinks}
            </span>
          </button>

          <button 
            onClick={onOpenWorkspaceAnalytics} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Visual Heatmap & Analytics Suite"
          >
            <BarChart3 size={13} style={{ color: 'var(--text-muted)' }} />
            <span>Analytics</span>
          </button>

          {/* Features 2-Column Mega Menu */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setIsFeaturesOpen(!isFeaturesOpen)} 
              className={`btn ${isFeaturesOpen ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Compass size={13} style={{ color: 'var(--text-muted)' }} />
              <span>Features</span>
              <ChevronDown size={11} style={{ transform: isFeaturesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', color: 'var(--text-muted)' }} />
            </button>

            {isFeaturesOpen && (
              <div className="menu-popover">
                {/* 2-Column Grid */}
                <div className="menu-grid">
                  {/* Item 1: Retargeting Pixels */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenPixelModal();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#3b82f6' }}>
                      <Target size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Retargeting Pixels</div>
                      <div className="menu-item-desc">Meta, GA4 & TikTok tags</div>
                    </div>
                  </div>

                  {/* Item 2: Webhooks Hub */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenWebhookModal();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#a855f7' }}>
                      <Webhook size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Webhooks Hub</div>
                      <div className="menu-item-desc">Slack & Discord alerts</div>
                    </div>
                  </div>

                  {/* Item 3: Bio Link Studio */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenBioStudio();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#10b981' }}>
                      <User size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Bio Link Studio</div>
                      <div className="menu-item-desc">Creator pages & leads</div>
                    </div>
                  </div>

                  {/* Item 4: Custom Domains */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenDomainModal();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#f59e0b' }}>
                      <Globe size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Custom Domains</div>
                      <div className="menu-item-desc">Branded CNAME setups</div>
                    </div>
                  </div>

                  {/* Item 5: Bulk Shortener */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenBulkModal();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#06b6d4' }}>
                      <Layers size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Bulk CSV Engine</div>
                      <div className="menu-item-desc">Batch shortlink processor</div>
                    </div>
                  </div>

                  {/* Item 6: Safety Auditor */}
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenSafetyModal();
                    }}
                    className="menu-item"
                  >
                    <div className="menu-item-icon" style={{ color: '#ec4899' }}>
                      <ShieldCheck size={15} />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-title">Safety Auditor</div>
                      <div className="menu-item-desc">Malware & phishing scan</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip: User Manual Link */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.15rem' }}>
                  <div
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      if (onOpenUserManual) onOpenUserManual();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      cursor: 'pointer',
                      transition: 'background-color var(--duration-fast) var(--ease-out)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.785rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      <BookOpen size={14} style={{ color: 'var(--text-muted)' }} />
                      <span>Interactive User Manual & Working Examples</span>
                    </div>
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onOpenUserManual} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Interactive User Manual & Working Examples"
          >
            <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
            <span>Guide</span>
          </button>
        </nav>

        {/* Right: Theme & Account & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          <button
            onClick={onToggleTheme}
            className="btn-icon"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>

          {/* Account Profile Button */}
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
            title={user ? `Signed in as ${user.email}` : 'Sign In or Switch Account'}
          >
            {user ? (
              <>
                <span style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-bg)', 
                  color: 'var(--primary-fg)', 
                  fontSize: '0.65rem', 
                  fontWeight: '700', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
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

          {/* + New Link Primary CTA */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary"
            style={{ 
              fontSize: '0.8rem', 
              padding: '0.35rem 0.85rem', 
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
