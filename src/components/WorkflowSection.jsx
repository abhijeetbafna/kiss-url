import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function WorkflowSection({ onOpenCreateModal }) {
  return (
    <section 
      id="workflow-section" 
      style={{ 
        maxWidth: '1020px', 
        margin: '0 auto 4rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '3rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            How it works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Simple, three-step workflow from creation to analytics.
          </p>
        </div>

        <button onClick={onOpenCreateModal} className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
          Create Custom Link <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            01
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Create & customize
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Paste any destination URL. Add an alias, customize social preview metadata, set passcode protection, or add device routing rules.
          </p>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            02
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Share anywhere
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Distribute your clean short link on social media, bios, emails, or download high-resolution vector QR codes for physical print.
          </p>
        </div>

        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            03
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Monitor engagement
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Access real-time click volume, top referrers, and device distribution directly from your private link hub.
          </p>
        </div>
      </div>
    </section>
  );
}
