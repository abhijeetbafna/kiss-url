import React, { useState, useEffect } from 'react';
import { X, Smartphone, Monitor, Shield, AlertTriangle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export default function SimulatorModal({ link, onClose }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop | ios | android
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const fullShortUrl = `https://${link.domain}/${link.slug}`;

  // Expiration and click cap
  const isExpired = link.protection?.expiresAt && new Date(link.protection.expiresAt) < new Date();
  const isCapReached = link.protection?.maxClicks && (link.clicks || 0) >= link.protection.maxClicks;

  // Determine resolved destination based on device
  let resolvedDestination = link.targetUrl;
  if (link.routing?.enabled) {
    if (deviceMode === 'ios' && link.routing.iosUrl) {
      resolvedDestination = link.routing.iosUrl;
    } else if (deviceMode === 'android' && link.routing.androidUrl) {
      resolvedDestination = link.routing.androidUrl;
    } else if (link.routing.desktopUrl) {
      resolvedDestination = link.routing.desktopUrl;
    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === link.protection.password) {
      setPasswordUnlocked(true);
    } else {
      alert('Incorrect passcode!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '580px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Test Destination & Device Routing
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Preview how visitors on desktop, iPhone, and Android are redirected.
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Device Switcher */}
          <div style={{ 
            display: 'flex', 
            gap: '0.35rem', 
            marginBottom: '1.25rem', 
            backgroundColor: 'var(--bg-subtle)', 
            padding: '0.25rem', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)'
          }}>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`btn ${deviceMode === 'desktop' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setDeviceMode('ios')}
              className={`btn ${deviceMode === 'ios' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
            >
              <Smartphone size={14} /> iPhone (iOS)
            </button>
            <button
              onClick={() => setDeviceMode('android')}
              className={`btn ${deviceMode === 'android' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1, fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
            >
              <Smartphone size={14} /> Android
            </button>
          </div>

          {/* Resolution Result Box */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {isExpired || isCapReached ? (
              <div>
                <AlertTriangle size={36} color="var(--error-text)" style={{ margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--error-text)' }}>
                  Link Inactive / Limit Reached
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {isExpired ? `Expired on ${new Date(link.protection.expiresAt).toLocaleString()}` : `Max clicks reached (${link.protection.maxClicks}).`}
                </p>
              </div>
            ) : link.protection?.isPasswordProtected && !passwordUnlocked ? (
              <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '300px', width: '100%' }}>
                <Shield size={32} color="var(--warning-text)" style={{ margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Password Protected
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  Enter the passcode to test unlocking this link.
                </p>
                <input
                  type="password"
                  placeholder="Enter passcode..."
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  className="input input-mono"
                  style={{ textAlign: 'center', marginBottom: '0.5rem' }}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Unlock Link
                </button>
              </form>
            ) : (
              <div>
                <CheckCircle size={36} color="#15803d" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Destination Confirmed
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.35rem', wordBreak: 'break-all' }}>
                  {resolvedDestination}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={resolvedDestination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex' }}
                  >
                    <ExternalLink size={14} /> Open Target
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
