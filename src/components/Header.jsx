import React from 'react';
import { Zap, Plus, Download, Server, Sun, Moon } from 'lucide-react';
import { exportLinksAsCSV, exportLinksAsJSON } from '../services/storageService';

export default function Header({ onOpenCreateModal, onOpenDeployModal, totalLinks, totalClicks, theme, onToggleTheme }) {
  return (
    <header 
      className="card-surface" 
      style={{ 
        padding: '1rem 1.5rem', 
        marginBottom: '1.75rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        borderBottom: '2px solid var(--border-subtle)'
      }}
    >
      {/* Brand & Value Statement */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-accent)',
          color: '#ffffff'
        }}>
          <Zap size={22} fill="currentColor" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              KissURL
            </h1>
            <span className="badge badge-emerald">
              <span className="pulse-indicator" /> Live v1
            </span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)' }}>
            Keep It Simple Short URL & Intelligence • $0/mo Edge Architecture
          </p>
        </div>
      </div>

      {/* KPI Counters (Tabular Numbers) */}
      <div style={{ 
        display: 'flex', 
        gap: '1.25rem', 
        alignItems: 'center', 
        backgroundColor: 'var(--color-bg-subtle)', 
        padding: '0.45rem 1.15rem', 
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
            Active Links
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            {totalLinks}
          </div>
        </div>
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-strong)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.675rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>
            Total Clicks
          </div>
          <div className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-accent)' }}>
            {totalClicks.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Controls & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="btn-icon"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={onOpenDeployModal}
          className="btn-secondary"
          style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}
          title="100% Free Production Deployment Blueprint"
        >
          <Server size={14} color="#059669" /> $0 Production Stack
        </button>

        <button
          onClick={exportLinksAsCSV}
          className="btn-ghost"
          style={{ fontSize: '0.825rem', padding: '0.5rem 0.75rem' }}
          title="Export CSV data"
        >
          <Download size={14} /> Export CSV
        </button>

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
