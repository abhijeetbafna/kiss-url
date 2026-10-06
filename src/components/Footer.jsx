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
  Smartphone,
  Shield,
  Terminal,
  Activity,
  ArrowRight
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
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border-default)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary-bg)'
          }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Interactive User Manual & Feature Guide
              </span>
              <span className="badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)', fontSize: '0.675rem' }}>
                10 Working Examples
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Step-by-step documentation for A/B Split Testing, UTM Matrix, Retargeting Pixels, Webhooks, QR Codes, and Passcode Protection.
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenUserManual}
          className="btn btn-primary"
          style={{ fontSize: '0.825rem', padding: '0.45rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}
        >
          <BookOpen size={13} />
          <span>Open User Manual</span>
        </button>
      </div>

      {/* 2. Structured Sitemap & Directory with Clean Vector Icons */}
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

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
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
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Routing & Growth
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button 
                onClick={onOpenUserManual} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Shuffle size={13} style={{ color: '#a855f7' }} />
                <span>A/B Split Testing</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenUserManual} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Smartphone size={13} style={{ color: '#3b82f6' }} />
                <span>Device-Aware Redirects</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenPixelModal} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Target size={13} style={{ color: '#10b981' }} />
                <span>Retargeting Pixels</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenWebhookModal} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Webhook size={13} style={{ color: '#f59e0b' }} />
                <span>Webhook Automations</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Creator & Brand */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Creator & Branding
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button 
                onClick={onOpenBioStudio} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <User size={13} style={{ color: '#10b981' }} />
                <span>Bio Link Tree Studio</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenDomainModal} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Globe size={13} style={{ color: '#06b6d4' }} />
                <span>Custom CNAME Domains</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenSafetyModal} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <ShieldCheck size={13} style={{ color: '#ec4899' }} />
                <span>Link Safety Auditor</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenWorkspaceAnalytics} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <BarChart3 size={13} style={{ color: '#8b5cf6' }} />
                <span>168h Matrix Heatmap</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform & Docs */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
            Platform & Support
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.825rem' }}>
            <li>
              <button 
                onClick={onOpenUserManual} 
                className="btn-ghost" 
                style={{ padding: 0, textAlign: 'left', color: 'var(--primary-bg)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <BookOpen size={13} />
                <span>Interactive Manual</span>
              </button>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Shield size={13} style={{ color: 'var(--text-muted)' }} />
                <span>GDPR Compliant</span>
              </span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Terminal size={13} style={{ color: 'var(--text-muted)' }} />
                <span>REST API v2.0</span>
              </span>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <Lock size={13} style={{ color: 'var(--text-muted)' }} />
                <span>SSL Edge Encryption</span>
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
