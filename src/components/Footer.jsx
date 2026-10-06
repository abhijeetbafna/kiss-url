import React from 'react';
import { Zap, Download } from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Footer({ totalLinks, totalClicks }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      className="surface-card" 
      style={{ 
        padding: '2rem 2rem 1.5rem', 
        marginTop: '3rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.75rem' }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={scrollToTop}>
              <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Zap size={16} fill="currentColor" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>KissURL</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              The modern, privacy-first URL shortener with custom social previews, device routing, and branded QR codes.
            </p>
          </div>

          {/* Quick Metrics */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Your Session Stats
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>Active Links: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{totalLinks}</strong></div>
              <div>•</div>
              <div>Total Clicks: <strong className="tabular-nums" style={{ color: 'var(--accent-primary)' }}>{totalClicks.toLocaleString()}</strong></div>
            </div>
          </div>

          {/* Data Portability */}
          <div>
            <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Data Backup
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
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} KissURL • Fast, clean, and reliable link shortening
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span className="pulse-indicator" /> All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
