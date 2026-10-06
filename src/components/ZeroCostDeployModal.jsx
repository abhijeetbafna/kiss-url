import React, { useState } from 'react';
import { X, Copy, Check, Zap } from 'lucide-react';
import { CLOUDFLARE_WORKER_CODE } from '../services/cloudflareWorkerTemplate';

export default function ZeroCostDeployModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyWorker = () => {
    navigator.clipboard.writeText(CLOUDFLARE_WORKER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ width: '100%', maxWidth: '760px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close Deploy Guide"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">
            <Zap size={12} /> $0/Month Production Architecture
          </span>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Zero-Cost Production Deployment
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Deploy your KissURL instance globally with 0 ongoing server bills.
        </p>

        {/* 3 Pillars of $0 Stack */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.85rem' }}>1. Frontend Hosting</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Cloudflare Pages / Vercel</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={11} /> 100% Free & Unlimited Bandwidth
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ color: '#7c3aed', fontWeight: '700', fontSize: '0.85rem' }}>2. Global Edge Redirects</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Cloudflare Workers + KV</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={11} /> 100,000 req/day free, &lt;15ms
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ color: '#b45309', fontWeight: '700', fontSize: '0.85rem' }}>3. Database & Auth</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Supabase / Upstash</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Check size={11} /> Free 500MB PostgreSQL
            </div>
          </div>
        </div>

        {/* Code Box */}
        <div style={{ backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '1.15rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
              Cloudflare Edge Worker Script (<code style={{ color: 'var(--accent-primary)' }}>worker.js</code>)
            </div>
            <button onClick={handleCopyWorker} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              {copied ? <><Check size={14} /> Copied Script</> : <><Copy size={14} /> Copy 100% Free Worker Code</>}
            </button>
          </div>

          <pre style={{
            backgroundColor: 'var(--bg-surface-muted)',
            border: '1px solid var(--border-subtle)',
            padding: '0.875rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            maxHeight: '170px',
            overflowY: 'auto'
          }}>
            {CLOUDFLARE_WORKER_CODE}
          </pre>
        </div>

        {/* Deployment Steps Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>1</span>
            <span>Deploy to your Git hosting platform and connect to <strong>Cloudflare Pages</strong> or <strong>Vercel</strong> (Select Vite build, output directory: <code style={{ color: 'var(--accent-primary)' }}>dist</code>).</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>2</span>
            <span>Go to Cloudflare Dashboard &gt; <strong>Workers & Pages</strong> &gt; <strong>Create Worker</strong> &gt; Paste the copied code above.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <span style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>3</span>
            <span>Attach your custom domain (e.g. <code style={{ color: 'var(--accent-primary)' }}>link.yourbrand.com</code>) with free 1-click Cloudflare SSL.</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button onClick={onClose} className="btn-secondary">
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
