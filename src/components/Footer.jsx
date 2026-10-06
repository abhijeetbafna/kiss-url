import React from 'react';
import { Download } from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Footer({ totalLinks, totalClicks }) {
  return (
    <footer 
      style={{ 
        maxWidth: '1020px', 
        margin: '0 auto', 
        borderTop: '1px solid var(--border-subtle)',
        padding: '2.5rem 1.25rem 3.5rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Brand & Mission */}
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            KissURL
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Fast, private URL shortener with smart routing and custom previews.
          </div>
        </div>

        {/* Data Export Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={exportLinksAsCSV} className="btn btn-secondary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Download size={13} /> Export CSV
          </button>
          <button onClick={exportLinksAsJSON} className="btn btn-secondary" style={{ fontSize: '0.775rem', padding: '0.35rem 0.65rem' }}>
            <Download size={13} /> Export JSON
          </button>
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
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
