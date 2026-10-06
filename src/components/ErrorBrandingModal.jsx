import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Sparkles, 
  Check, 
  ExternalLink,
  HelpCircle,
  Eye
} from 'lucide-react';
import { getErrorBrandingSettings, saveErrorBrandingSettings } from '../services/storageService';

export default function ErrorBrandingModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(getErrorBrandingSettings());
  const [copied, setCopied] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveErrorBrandingSettings(settings);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Settings size={18} /> Custom 404 & Error Page Studio
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Customize how broken, expired, or deleted short links appear to visitors.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Brand Logo & Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Icon Emoji
                </label>
                <input
                  type="text"
                  value={settings.logoEmoji}
                  onChange={(e) => setSettings({ ...settings, logoEmoji: e.target.value })}
                  className="input"
                  style={{ textAlign: 'center', fontSize: '1.25rem' }}
                  maxLength={4}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Brand Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={settings.brandName}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Custom 404 Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                404 Heading Title
              </label>
              <input
                type="text"
                placeholder="e.g. Link Not Found or Inactive"
                value={settings.customTitle}
                onChange={(e) => setSettings({ ...settings, customTitle: e.target.value })}
                className="input"
                required
              />
            </div>

            {/* Custom 404 Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Explanation Message
              </label>
              <textarea
                rows={3}
                placeholder="Explain why the link is missing or provide next steps..."
                value={settings.customMessage}
                onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
                className="input"
                required
              />
            </div>

            {/* Support / Contact URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Support / Help Center URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://yourbrand.com/help"
                value={settings.supportUrl}
                onChange={(e) => setSettings({ ...settings, supportUrl: e.target.value })}
                className="input"
              />
            </div>

            {/* Live Interactive Preview Box */}
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Live Visitor 404 Preview
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Interactive preview
                </span>
              </div>

              <div style={{
                padding: '2rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-page)',
                border: '1px solid var(--border-default)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {settings.logoEmoji || '⚡'}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                  404
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {settings.customTitle || 'Link Not Found'}
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
                  {settings.customMessage || 'The requested link does not exist or may have been deleted.'}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <span className="btn btn-primary" style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem' }}>
                    Go to {settings.brandName || 'Homepage'}
                  </span>
                  {settings.supportUrl && (
                    <span className="btn btn-secondary" style={{ fontSize: '0.785rem', padding: '0.35rem 0.75rem' }}>
                      Contact Support
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '0.4rem 0.9rem' }}>
              {copied ? (
                <>
                  <Check size={14} /> Saved!
                </>
              ) : (
                'Save 404 Branding'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
