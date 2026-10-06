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
  Sparkles,
  Zap,
  Shuffle,
  Tag,
  QrCode,
  Shield,
  Compass
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
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              backgroundColor: 'var(--primary-bg)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}>
              <Zap size={15} style={{ fill: '#ffffff' }} />
            </div>
            <span style={{ 
              fontSize: '1.05rem', 
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

        {/* Center: Sleek, Uncluttered Navigation */}
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button 
            onClick={() => scrollToSection('hub-section')} 
            className="btn btn-ghost" 
            style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <span>Links</span>
            <span className="badge" style={{ fontSize: '0.7rem', padding: '0px 5px', fontWeight: '700' }}>
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

          {/* Features Mega Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setIsFeaturesOpen(!isFeaturesOpen)} 
              className={`btn ${isFeaturesOpen ? 'btn-secondary' : 'btn-ghost'}`}
              style={{ fontSize: '0.825rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Compass size={13} style={{ color: 'var(--text-muted)' }} />
              <span>Features</span>
              <ChevronDown size={12} style={{ transform: isFeaturesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease', color: 'var(--text-muted)' }} />
            </button>

            {isFeaturesOpen && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 8px)', 
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '320px', 
                  backgroundColor: 'var(--bg-surface)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-lg)', 
                  boxShadow: 'var(--shadow-lg)', 
                  padding: '0.65rem', 
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                {/* Growth & Ads Group */}
                <div style={{ fontSize: '0.675rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0.2rem 0.5rem 0.1rem' }}>
                  Traffic & Ad Retargeting
                </div>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenPixelModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Target size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Retargeting Pixels</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Meta, GA4, TikTok & LinkedIn Tags</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenWebhookModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Webhook size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Webhooks & Automation</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Stream clicks to Slack, Discord & Zapier</div>
                  </div>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '0.2rem 0' }} />

                {/* Creator & Branding Group */}
                <div style={{ fontSize: '0.675rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', padding: '0.2rem 0.5rem 0.1rem' }}>
                  Creator & Brand Suite
                </div>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenBioStudio();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <User size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Bio Link Tree Studio</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mobile landing pages & lead capture</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenDomainModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Globe size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Custom CNAME Domains</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Connect your own brand domain</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenBulkModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Layers size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>Bulk CSV Shortener</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Shorten hundreds of links in batch</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsFeaturesOpen(false);
                    onOpenSafetyModal();
                  }}
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.6rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', gap: '0.65rem' }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={13} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem' }}>URL Safety Auditor</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Malware & phishing heuristic scanner</div>
                  </div>
                </button>
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
                  color: '#fff', 
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
