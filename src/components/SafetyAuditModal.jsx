import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  Lock,
  Globe,
  Radio
} from 'lucide-react';
import { auditUrlSafety } from '../services/storageService';

export default function SafetyAuditModal({ isOpen, onClose, initialUrl = '' }) {
  const [testUrl, setTestUrl] = useState(initialUrl || 'https://github.com');
  const [auditResult, setAuditResult] = useState(() => auditUrlSafety(initialUrl || 'https://github.com'));

  if (!isOpen) return null;

  const handleRunAudit = (e) => {
    e.preventDefault();
    if (!testUrl.trim()) return;
    const res = auditUrlSafety(testUrl);
    setAuditResult(res);
  };

  const getStatusIcon = (status) => {
    if (status === 'safe') return <ShieldCheck size={28} color="#10b981" />;
    if (status === 'warning') return <AlertTriangle size={28} color="#f59e0b" />;
    return <ShieldAlert size={28} color="#ef4444" />;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Pinned) */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} /> Link Safety & Malware Auditor
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Real-time heuristic threat detection for destination URLs.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Audit Search Bar */}
        <div style={{ padding: '1rem 1.4rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', flexShrink: 0 }}>
          <form onSubmit={handleRunAudit} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Enter destination URL to scan (e.g. https://yourbrand.com)"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="input"
                style={{ paddingRight: '2rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem' }}>
              <Search size={14} /> Scan URL
            </button>
          </form>
        </div>

        {/* Audit Report Content (Scrollable) */}
        <div className="modal-body">
          {/* Main Score Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getStatusIcon(auditResult.status)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {auditResult.label}
                  </span>
                  <span className="badge" style={{ backgroundColor: `${auditResult.color}15`, color: auditResult.color, border: `1px solid ${auditResult.color}40`, fontSize: '0.75rem' }}>
                    Score {auditResult.score}/100
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Hostname: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{auditResult.hostname || 'destination'}</code>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: auditResult.color }}>
                {auditResult.score}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Trust Rating
              </div>
            </div>
          </div>

          {/* Detailed Security Checklist */}
          <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Security & Threat Analysis Checklist
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {auditResult.checks.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: c.passed ? 'var(--bg-subtle)' : 'var(--error-bg)',
                  border: `1px solid ${c.passed ? 'var(--border-subtle)' : 'var(--error-border)'}`
                }}
              >
                {c.passed ? (
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                ) : (
                  <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: c.passed ? 'var(--text-muted)' : 'var(--error-text)' }}>
                    {c.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Advisory Notice */}
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)'
          }}>
            🛡️ <strong>Safety Guarantee</strong>: KissURL applies heuristic threat models to verify domain reputational integrity, preventing deceptive links, credential phishing attempts, and non-HTTPS vulnerabilities.
          </div>
        </div>

        {/* Footer (Pinned) */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
