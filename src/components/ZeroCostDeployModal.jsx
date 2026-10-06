import React, { useState } from 'react';
import { X, Server, Copy, Check, ExternalLink, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { CLOUDFLARE_WORKER_CODE } from '../services/cloudflareWorkerTemplate';

export default function ZeroCostDeployModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const handleCopyWorker = () => {
    navigator.clipboard.writeText(CLOUDFLARE_WORKER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        style={{ width: '100%', maxWidth: '760px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">
            <Zap size={12} /> $0/Month Production Stack
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          Zero-Cost Production Deployment
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Deploy your own high-scale LinkPulse instance globally with 0 ongoing server bills.
        </p>

        {/* 3 Pillars of $0 Stack */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}>1. Frontend Hosting</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Cloudflare Pages / Vercel</div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '4px' }}>✓ 100% Free & Unlimited Bandwidth</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ color: '#c084fc', fontWeight: '700', fontSize: '0.85rem' }}>2. Global Edge Redirects</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Cloudflare Workers + KV</div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '4px' }}>✓ 100,000 req/day free, &lt;15ms</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem' }}>
            <div style={{ color: '#fbbf24', fontWeight: '700', fontSize: '0.85rem' }}>3. Database & Auth</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Supabase / Upstash</div>
            <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '4px' }}>✓ Free 500MB PostgreSQL</div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#e2e8f0' }}>
              Cloudflare Edge Worker Script (<code style={{ color: '#38bdf8' }}>worker.js</code>)
            </div>
            <button onClick={handleCopyWorker} className="btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
              {copied ? <><Check size={14} /> Copied Script</> : <><Copy size={14} /> Copy 100% Free Worker Code</>}
            </button>
          </div>

          <pre style={{
            background: 'rgba(15,23,42,0.8)',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: '#94a3b8',
            fontFamily: 'var(--font-mono)',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {CLOUDFLARE_WORKER_CODE}
          </pre>
        </div>

        {/* Deployment Steps Guide */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>1</span>
            <span>Push this repository to GitHub and connect to <strong>Cloudflare Pages</strong> or <strong>Vercel</strong> (Select Vite build, output: <code style={{ color: '#fff' }}>dist</code>).</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>2</span>
            <span>Go to Cloudflare Dashboard ➔ <strong>Workers & Pages</strong> ➔ <strong>Create Worker</strong> ➔ Paste the copied code above.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }}>3</span>
            <span>Attach your custom domain (e.g. <code style={{ color: '#fff' }}>link.yourbrand.com</code>) with free 1-click Cloudflare SSL.</span>
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
