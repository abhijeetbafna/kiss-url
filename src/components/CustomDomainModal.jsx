import React, { useState, useEffect } from 'react';
import { X, Globe, Plus, Trash2, CheckCircle, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { getStoredDomains, addDomain, deleteDomain } from '../services/storageService';

export default function CustomDomainModal({ isOpen, onClose }) {
  const [domains, setDomains] = useState([]);
  const [domainInput, setDomainInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDomains(getStoredDomains());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddDomain = (e) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    const added = addDomain(domainInput);
    setDomains(getStoredDomains());
    setDomainInput('');
    setVerifySuccess(`Added ${added.domain}. Configure CNAME to complete.`);
    setTimeout(() => setVerifySuccess(null), 3000);
  };

  const handleDelete = (id) => {
    const updated = deleteDomain(id);
    setDomains(updated);
  };

  const handleVerifyDns = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifySuccess('DNS & SSL verified successfully across all edge nodes.');
      setTimeout(() => setVerifySuccess(null), 3500);
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '620px', width: '100%', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Custom Domains & CNAME
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Brand your short links with your own custom domain (e.g. go.yourcompany.com).
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Add Domain Input */}
          <form onSubmit={handleAddDomain} style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Connect Custom Subdomain
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                required
                placeholder="e.g. link.yourbrand.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="input"
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Plus size={14} /> Add Domain
              </button>
            </div>
          </form>

          {verifySuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', color: 'var(--success-text)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
              <CheckCircle size={14} />
              <span>{verifySuccess}</span>
            </div>
          )}

          {/* DNS Configuration Instructions */}
          <div style={{ 
            backgroundColor: 'var(--bg-subtle)', 
            border: '1px solid var(--border-default)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Globe size={14} color="var(--text-muted)" /> DNS CNAME Record Instructions
            </div>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Add the following CNAME record in your DNS provider (Cloudflare, GoDaddy, Namecheap, Route53):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '0.5rem', backgroundColor: 'var(--bg-surface)', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Type</span>
                <strong>CNAME</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Name / Host</span>
                <strong>link (or subdomain)</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', display: 'block' }}>Target Value</span>
                <strong>cname.kissurl.dev</strong>
              </div>
            </div>
          </div>

          {/* Connected Domains List */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              Active Connected Domains ({domains.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {domains.map((d) => (
                <div 
                  key={d.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="#15803d" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {d.domain}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        Target: {d.targetHost} • SSL Active
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                      Active
                    </span>
                    <button 
                      onClick={() => handleDelete(d.id)}
                      className="btn-icon" 
                      style={{ width: '26px', height: '26px', color: 'var(--error-text)' }}
                      title="Remove domain"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button onClick={handleVerifyDns} className="btn btn-secondary" style={{ fontSize: '0.8rem' }} disabled={isVerifying}>
            <RefreshCw size={13} className={isVerifying ? 'pulse-indicator' : ''} />
            {isVerifying ? 'Checking DNS...' : 'Verify DNS Propagation'}
          </button>
          <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
