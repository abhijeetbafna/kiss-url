import React, { useState } from 'react';
import { X, Smartphone, Monitor, Shield, AlertTriangle, CheckCircle, Bot, ExternalLink, RefreshCw } from 'lucide-react';

export default function SimulatorModal({ link, onClose }) {
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop | ios | android | bot
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);

  const fullShortUrl = `https://${link.domain}/${link.slug}`;

  // Check expiration
  const isExpired = link.protection?.expiresAt && new Date(link.protection.expiresAt) < new Date();
  const isCapReached = link.protection?.maxClicks && (link.clicks || 0) >= link.protection.maxClicks;

  // Determine destination
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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close Simulator"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">
            <RefreshCw size={12} /> Edge Routing Simulator
          </span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Test Link Resolution
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Simulate how this short link resolves across devices, robots, and security gates at the edge.
        </p>

        {/* Device Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', backgroundColor: 'var(--bg-surface-muted)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`btn-ghost ${deviceMode === 'desktop' ? 'badge-indigo' : ''}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          >
            <Monitor size={15} /> Desktop
          </button>
          <button
            onClick={() => setDeviceMode('ios')}
            className={`btn-ghost ${deviceMode === 'ios' ? 'badge-indigo' : ''}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          >
            <Smartphone size={15} /> Apple iOS
          </button>
          <button
            onClick={() => setDeviceMode('android')}
            className={`btn-ghost ${deviceMode === 'android' ? 'badge-indigo' : ''}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          >
            <Smartphone size={15} /> Android
          </button>
          <button
            onClick={() => setDeviceMode('bot')}
            className={`btn-ghost ${deviceMode === 'bot' ? 'badge-indigo' : ''}`}
            style={{ flex: 1, justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          >
            <Bot size={15} /> Crawler Bot
          </button>
        </div>

        {/* Simulation Output Box */}
        <div style={{
          backgroundColor: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {isExpired || isCapReached ? (
            <div>
              <AlertTriangle size={42} color="#e11d48" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ color: '#be123c', fontSize: '1.1rem', fontWeight: '700' }}>410 - Link Expired / Burned</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {isExpired ? `Expired on ${new Date(link.protection.expiresAt).toLocaleString()}` : `Max clicks reached (${link.protection.maxClicks}).`}
              </p>
            </div>
          ) : link.protection?.isPasswordProtected && !passwordUnlocked ? (
            <form onSubmit={handlePasswordSubmit} style={{ maxWidth: '340px', width: '100%' }}>
              <Shield size={36} color="#d97706" style={{ margin: '0 auto 0.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Password Protected</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                Enter the passcode to unlock this destination.
              </p>
              <input
                type="password"
                placeholder="Enter passcode..."
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                className="input-field"
                style={{ textAlign: 'center', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Unlock Link
              </button>
            </form>
          ) : deviceMode === 'bot' ? (
            <div style={{ textAlign: 'left', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#7c3aed', fontSize: '0.85rem', fontWeight: '700' }}>
                <Bot size={16} /> Edge Crawler Intercept Response (OG Metadata):
              </div>
              <pre style={{
                backgroundColor: 'var(--bg-surface-muted)',
                border: '1px solid var(--border-subtle)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.775rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                overflowX: 'auto',
                lineHeight: '1.5'
              }}>
{`<meta property="og:title" content="${link.socialOg?.title || link.title || 'LinkPulse'}" />
<meta property="og:description" content="${link.socialOg?.description || 'Smart link powered by LinkPulse'}" />
<meta property="og:image" content="${link.socialOg?.imageUrl || 'https://linkpulse.dev/og-default.png'}" />
<meta property="og:url" content="${fullShortUrl}" />
<meta name="twitter:card" content="summary_large_image" />`}
              </pre>
            </div>
          ) : (
            <div>
              <CheckCircle size={40} color="#059669" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '0.775rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                HTTP 302 Found (Sub-15ms Edge Redirect)
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.25rem', wordBreak: 'break-all' }}>
                {resolvedDestination}
              </h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Simulated Mode:</span>
                <span className="badge badge-indigo">{deviceMode.toUpperCase()}</span>
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <a
                  href={resolvedDestination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: 'none', display: 'inline-flex' }}
                >
                  <ExternalLink size={15} /> Open Target Directly
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
