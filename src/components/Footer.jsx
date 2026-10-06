import React from 'react';
import { Zap, Server } from 'lucide-react';

export default function Footer({ onOpenDeployModal }) {
  return (
    <footer 
      style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        paddingTop: '2rem', 
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Zap size={15} color="var(--accent-primary)" />
        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>KissURL</span>
        <span>•</span>
        <span>Keep It Simple Short URL</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onOpenDeployModal}
          className="btn-ghost"
          style={{ padding: '0', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          <Server size={13} /> $0 Self-Host Blueprint
        </button>
        <span>•</span>
        <span>© {new Date().getFullYear()} KissURL</span>
      </div>
    </footer>
  );
}
