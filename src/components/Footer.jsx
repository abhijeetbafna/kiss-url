import React from 'react';
import { Zap, Download } from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Footer({ onOpenDeployModal, totalLinks, totalClicks }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="card-surface" 
      style={{ 
        padding: '2rem 2rem 1.5rem', 
        marginTop: '3rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--color-bg-surface)'
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={scrollToTop}>
              <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Zap size={16} fill="currentColor" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>LinkPulse</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              The modern, privacy-first alternative to Bitly & TinyURL with dynamic social previews, device routing, and $0/mo edge deployment.
            </p>
          </div>

          {/* Quick Metrics */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              System Statistics
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              <div>Active Links: <strong className="tabular-nums" style={{ color: 'var(--color-text-primary)' }}>{totalLinks}</strong></div>
              <div>•</div>
              <div>Total Clicks: <strong className="tabular-nums" style={{ color: 'var(--color-accent)' }}>{totalClicks.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* Data Portability */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              Data Portability
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={exportLinksAsCSV} className="btn-secondary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
                <Download size={13} /> Export CSV
              </button>
              <button onClick={exportLinksAsJSON} className="btn-secondary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
                <Download size={13} /> Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
          <div>
            © {new Date().getFullYear()} LinkPulse Engine • Built with Kigen tokens & Typographer scales
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className="pulse-indicator" /> Global Edge Online
            </span>
            <button onClick={onOpenDeployModal} className="btn-ghost" style={{ padding: '0', fontSize: '0.775rem', color: 'var(--color-accent)' }}>
              $0 Deploy Guide
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
