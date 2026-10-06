import React from 'react';
import { 
  Download, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  User, 
  QrCode, 
  Webhook, 
  Target, 
  Shuffle, 
  Globe, 
  Zap, 
  Layers, 
  BarChart3,
  Lock,
  FileText
} from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Footer({ 
  totalLinks, 
  totalClicks, 
  onOpenUserManual, 
  onOpenBioStudio, 
  onOpenDomainModal, 
  onOpenSafetyModal,
  onOpenPixelModal,
  onOpenWebhookModal,
  onOpenWorkspaceAnalytics
}) {
  return (
    <footer 
      style={{ 
        maxWidth: '1060px', 
        margin: '0 auto', 
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 1.25rem 4.5rem'
      }}
    >
      {/* 1. Featured Interactive User Manual Highlight Card */}
      <div 
        style={{
          padding: '1.4rem 1.6rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border-default)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary-bg)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Interactive User Manual & Feature Guide
              </span>
              <span className="badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                10 Working Examples
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Step-by-step documentation for A/B Split Testing, UTM Matrix, Retargeting Pixels, Webhooks, QR Codes, and Passcode Protection.
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenUserManual}
          className="btn btn-primary"
          style={{ fontSize: '0.825rem', padding: '0.5rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: '600' }}
        >
          <BookOpen size={14} /> Open User Manual
        </button>
      </div>

      {/* 2. Structured Sitemap & Directory */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* Brand Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary-bg)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={13} style={{ fill: '#ffffff' }} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              KissURL
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            Modern URL management engine with dynamic smart routing, retargeting tags, webhooks, and bio pages.
          </p>

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
            <button onClick={exportLinksAsCSV} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Download size={12} /> CSV
            </button>
            <button onClick={exportLinksAsJSON} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Download size={12} /> JSON
            </button>
          </div>
        </div>

        {/* Column 1: Routing & Growth */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Routing & Growth
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🔀 A/B Split Testing
              </button>
            </li>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                📱 Device-Aware Redirects
              </button>
            </li>
            <li>
              <button onClick={onOpenPixelModal} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🎯 Retargeting Pixels
              </button>
            </li>
            <li>
              <button onClick={onOpenWebhookModal} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                ⚡ Webhook Automations
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Creator & Brand */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Creator & Branding
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button onClick={onOpenBioStudio} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                👤 Bio Link Tree Studio
              </button>
            </li>
            <li>
              <button onClick={onOpenDomainModal} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🌐 Custom CNAME Domains
              </button>
            </li>
            <li>
              <button onClick={onOpenSafetyModal} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🛡️ Link Safety Auditor
              </button>
            </li>
            <li>
              <button onClick={onOpenWorkspaceAnalytics} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                📊 168h Matrix Heatmap
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform & Docs */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Platform & Support
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--primary-bg)', fontWeight: '600' }}>
                📖 Interactive Manual
              </button>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={12} /> GDPR Compliant
              </span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>
                REST API v2.0
              </span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>
                SSL Edge Encryption
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. Bottom Status Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '0.85rem', 
        fontSize: '0.775rem', 
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '1.4rem'
      }}>
        <div>
          © {new Date().getFullYear()} KissURL. Enterprise link infrastructure.
        </div>
        <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="status-dot" /> 99.99% Systems Operational
          </span>
          <span>•</span>
          <span className="tabular-nums font-mono">{totalLinks} links configured</span>
          <span>•</span>
          <span className="tabular-nums font-mono">{totalClicks.toLocaleString()} total impressions</span>
        </div>
      </div>
    </footer>
  );
}
