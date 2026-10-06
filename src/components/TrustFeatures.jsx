import React from 'react';
import { Zap, ShieldCheck, Download } from 'lucide-react';

export default function TrustFeatures() {
  return (
    <section 
      style={{ 
        maxWidth: '1020px', 
        margin: '0 auto 4rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '3rem'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <Zap size={16} color="var(--text-primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Instant Redirection
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Links resolve instantly across global edge locations with zero intermediate latency or loading delays.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--text-primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Private Analytics
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Track real-time click volume, top referrers, and device types with zero cookies and no user tracking.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <Download size={16} color="var(--text-primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Data Portability
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Your links and analytics remain in your control. Download backups in CSV or JSON format anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
