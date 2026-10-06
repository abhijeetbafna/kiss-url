import React from 'react';
import { Sparkles, Plus, Download, Upload, Server, Zap, Shield, Globe } from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Header({ onOpenCreateModal, onOpenDeployModal, totalLinks, totalClicks }) {
  return (
    <header className="glass-panel" style={{ padding: '1rem 1.75rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <Zap size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LinkPulse
            </h1>
            <span className="badge badge-emerald" style={{ padding: '0.15rem 0.5rem', fontSize: '0.65rem' }}>
              <span className="pulse-indicator" /> v1 Live
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Next-Gen Smart Link Intelligence • $0/mo Edge Architecture
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Active Links</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{totalLinks}</div>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</div>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{totalClicks.toLocaleString()}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenDeployModal}
          className="btn-secondary"
          style={{ fontSize: '0.825rem', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          title="Free Deployment Guide"
        >
          <Server size={14} color="#34d399" /> $0 Production Stack
        </button>

        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            onClick={exportLinksAsCSV}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.7rem' }}
            title="Export CSV"
          >
            <Download size={14} /> CSV
          </button>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="btn-primary"
        >
          <Plus size={16} /> Create Smart Link
        </button>
      </div>
    </header>
  );
}
