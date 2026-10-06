import React from 'react';
import { Download, BookOpen, Sparkles, ShieldCheck, User, QrCode, Webhook, Target, Shuffle, Globe } from 'lucide-react';
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
        maxWidth: '1020px', 
        margin: '0 auto', 
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 1.25rem 4rem'
      }}
    >
      {/* Interactive User Manual Highlight Card */}
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
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border-default)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--primary-bg)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Interactive User Manual & Feature Guide
              </span>
              <span className="badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                10 Interactive Guides
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Learn how to configure A/B Split Testing, UTM Builder, Tracking Pixels, Webhooks, QR codes, and Passcode gates with working examples.
            </p>
          </div>
        </div>

        <button 
          onClick={onOpenUserManual}
          className="btn btn-primary"
          style={{ fontSize: '0.825rem', padding: '0.45rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <BookOpen size={14} /> Open User Manual
        </button>
      </div>

      {/* Feature Links & Resources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Brand Column */}
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            KissURL
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Enterprise-grade URL shortener with smart dynamic routing, retargeting pixels, webhooks, and bio pages.
          </p>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={exportLinksAsCSV} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <Download size={12} /> CSV
            </button>
            <button onClick={exportLinksAsJSON} className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              <Download size={12} /> JSON
            </button>
          </div>
        </div>

        {/* Growth & Routing */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Smart Routing & Ads
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🔀 A/B Split Testing
              </button>
            </li>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                🏷️ UTM Campaign Builder
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

        {/* Products & Creator Suite */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Creator & Domains
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
                🛡️ URL Safety & Malware Audit
              </button>
            </li>
            <li>
              <button onClick={onOpenWorkspaceAnalytics} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--text-secondary)' }}>
                📊 168h Matrix Heatmap
              </button>
            </li>
          </ul>
        </div>

        {/* Documentation & Help */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
            Documentation
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <li>
              <button onClick={onOpenUserManual} className="btn-ghost" style={{ padding: 0, textAlign: 'left', color: 'var(--primary-bg)', fontWeight: '600' }}>
                📖 Interactive User Manual
              </button>
            </li>
            <li>
              <a href="https://github.com/abhijeetbafna/kiss-url" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                GitHub Repository ↗
              </a>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)' }}>API Version: 2.0 (REST)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom status & copyright */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        fontSize: '0.775rem', 
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '1.25rem'
      }}>
        <div>
          © {new Date().getFullYear()} KissURL. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="status-dot" /> All Systems Operational
          </span>
          <span>•</span>
          <span>{totalLinks} links</span>
          <span>•</span>
          <span>{totalClicks.toLocaleString()} total clicks</span>
        </div>
      </div>
    </footer>
  );
}
