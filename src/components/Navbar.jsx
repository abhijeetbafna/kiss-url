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
  Shield,
  Sliders,
  CheckCircle2
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
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}>
              <Zap size={14} style={{ fill: '#ffffff' }} />
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

        {/* Center: Sleek, Uncluttered Navigation */}
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
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

          {/* Features 2-Column Compact Mega Menu */}
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
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 8px)', 
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '460px', 
                  backgroundColor: 'var(--bg-surface)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-lg)', 
                  boxShadow: 'var(--shadow-lg)', 
                  padding: '0.65rem', 
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                {/* 2-Column Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  {/* Item 1: Retargeting Pixels */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenPixelModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 }}>
                      <Target size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Retargeting Pixels</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Meta, GA4 & TikTok tags</div>
                    </div>
                  </button>

                  {/* Item 2: Webhooks */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenWebhookModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', flexShrink: 0 }}>
                      <Webhook size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Webhooks Hub</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Slack & Discord alerts</div>
                    </div>
                  </button>

                  {/* Item 3: Bio Page Studio */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenBioStudio();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                      <User size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Bio Link Studio</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Creator pages & leads</div>
                    </div>
                  </button>

                  {/* Item 4: Custom Domains */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenDomainModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
                      <Globe size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Custom Domains</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Branded CNAME setups</div>
                    </div>
                  </button>

                  {/* Item 5: Bulk Shortener */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenBulkModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', flexShrink: 0 }}>
                      <Layers size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Bulk CSV Engine</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Batch shortlink processor</div>
                    </div>
                  </button>

                  {/* Item 6: Safety Auditor */}
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      onOpenSafetyModal();
                    }}
                    className="btn-ghost"
                    style={{ justifyContent: 'flex-start', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-md)', gap: '0.55rem', textAlign: 'left' }}
                  >
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', flexShrink: 0 }}>
                      <ShieldCheck size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', lineHeight: 1.2 }}>Safety Auditor</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Malware & phishing scan</div>
                    </div>
                  </button>
                </div>

                {/* Bottom Strip: User Manual Link */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.45rem', marginTop: '0.15rem' }}>
                  <button
                    onClick={() => {
                      setIsFeaturesOpen(false);
                      if (onOpenUserManual) onOpenUserManual();
                    }}
                    className="btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-subtle)',
                      fontSize: '0.775rem',
                      fontWeight: '600',
                      color: 'var(--primary-bg)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={13} />
                      <span>Interactive User Manual & Working Examples</span>
                    </span>
                    <ArrowRight size={12} />
                  </button>
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
