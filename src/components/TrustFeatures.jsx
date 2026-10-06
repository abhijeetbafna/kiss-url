import React from 'react';
import { Zap, ShieldCheck, QrCode } from 'lucide-react';

export default function TrustFeatures() {
  return (
    <section 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.25rem', 
        marginBottom: '3rem' 
      }}
    >
      <div className="surface-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <Zap size={20} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Sub-15ms Edge Speed
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
          Every redirect is executed globally on the edge before touching a central server. Zero latency and 0ms cold starts.
        </p>
      </div>

      <div className="surface-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-info-bg)', color: 'var(--status-info-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <ShieldCheck size={20} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Privacy First & No Ads
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
          No tracking cookies, no interstitial ad countdowns, and no selling your visitor data. Straight to the destination.
        </p>
      </div>

      <div className="surface-card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-warning-bg)', color: 'var(--status-warning-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <QrCode size={20} />
        </div>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Branded Slugs & QR Codes
        </h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
          Choose custom aliases for your campaigns and export vector SVG or high-res PNG QR codes for print and media.
        </p>
      </div>
    </section>
  );
}
