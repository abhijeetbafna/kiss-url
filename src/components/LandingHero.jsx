import React, { useState } from 'react';
import { 
  ArrowRight, Copy, Check, ExternalLink, QrCode, 
  Sparkles, Shield, Smartphone, AlertCircle, ChevronDown, ChevronUp, Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_SLUGS = ['launch', 'promo', 'drop', 'access', 'newsletter', 'vip'];

export default function LandingHero({ onLinkCreated, onOpenQR, onOpenSimulator, onOpenStudioModal }) {
  const [urlInput, setUrlInput] = useState('');
  const [domain, setDomain] = useState('kiss.url');
  const [customSlug, setCustomSlug] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  // Optional features
  const [enablePassword, setEnablePassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [enableDeviceRouting, setEnableDeviceRouting] = useState(false);
  const [iosTarget, setIosTarget] = useState('');
  const [androidTarget, setAndroidTarget] = useState('');

  // Interaction states
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [lastCreatedLink, setLastCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateRandomSlug = () => {
    const word = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setCustomSlug(`${word}-${num}`);
  };

  const handleShortenSubmit = (e) => {
    e.preventDefault();
    const trimmedUrl = urlInput.trim();

    if (!trimmedUrl) {
      setStatus('error');
      setErrorMessage('Please enter a destination URL.');
      return;
    }

    let validUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
    } catch {
      setStatus('error');
      setErrorMessage('Please enter a valid website address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    setTimeout(() => {
      let finalSlug = customSlug.trim() || Math.random().toString(36).substring(2, 8);
      finalSlug = finalSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

      const newLink = {
        targetUrl: validUrl,
        slug: finalSlug,
        domain: domain,
        title: validUrl.replace(/^https?:\/\//, '').split('/')[0] || 'Short Link',
        tags: ['QuickShorten'],
        socialOg: {
          enabled: false,
          title: '',
          description: '',
          imageUrl: ''
        },
        routing: {
          enabled: enableDeviceRouting,
          iosUrl: iosTarget.trim(),
          androidUrl: androidTarget.trim(),
          desktopUrl: validUrl
        },
        protection: {
          isPasswordProtected: enablePassword,
          password: passwordValue.trim(),
          expiresAt: '',
          maxClicks: 0
        }
      };

      const created = onLinkCreated(newLink);
      setLastCreatedLink(created || newLink);
      setStatus('success');

      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    }, 200);
  };

  const handleCopy = () => {
    if (!lastCreatedLink) return;
    const fullUrl = `https://${lastCreatedLink.domain}/${lastCreatedLink.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUrlInput('');
    setCustomSlug('');
    setStatus('idle');
    setLastCreatedLink(null);
  };

  return (
    <section 
      id="hero-section"
      style={{ 
        maxWidth: '780px', 
        margin: '0 auto 3.5rem', 
        textAlign: 'center' 
      }}
    >
      {/* Editorial Headline */}
      <h1 style={{ 
        fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', 
        fontWeight: '700', 
        letterSpacing: '-0.04em', 
        lineHeight: '1.15',
        color: 'var(--text-primary)', 
        marginBottom: '0.75rem' 
      }}>
        Shorten and route your links.
      </h1>

      {/* Subtitle */}
      <p style={{ 
        color: 'var(--text-secondary)', 
        fontSize: '1.05rem', 
        lineHeight: '1.5', 
        marginBottom: '2rem',
        maxWidth: '560px',
        marginInline: 'auto'
      }}>
        Fast, clean URL shortener with custom social previews, QR codes, and device routing.
      </p>

      {/* Monolithic Shortener Widget */}
      <div style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-default)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '1.25rem',
        textAlign: 'left',
        boxShadow: 'var(--shadow-subtle)',
        marginBottom: '1rem'
      }}>
        {status !== 'success' ? (
          <form onSubmit={handleShortenSubmit}>
            {/* Primary Input Row */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 340px' }}>
                <input
                  type="text"
                  required
                  placeholder="Paste your link here (e.g. https://yourbrand.com)..."
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  className="input"
                  style={{ padding: '0.65rem 0.85rem', fontSize: '0.95rem' }}
                  disabled={status === 'loading'}
                  autoFocus
                  aria-label="Destination URL"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Shortening...' : <>Shorten Link <ArrowRight size={14} /></>}
              </button>
            </div>

            {/* Error Message */}
            {status === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', color: 'var(--error-text)', fontSize: '0.85rem' }}>
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inline Custom Alias & Domain Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '0.65rem', marginTop: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Domain
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="input"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value="kiss.url">kiss.url</option>
                  <option value="go.bio">go.bio</option>
                  <option value="click.to">click.to</option>
                  <option value="link.page">link.page</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                    Custom Alias (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomSlug}
                    className="btn-ghost"
                    style={{ padding: '0 4px', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Random
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. summer-launch"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="input input-mono"
                  style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="btn btn-ghost"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                <Sliders size={13} />
                <span>Password & Mobile App Routing</span>
                {showOptions ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {showOptions && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.65rem', backgroundColor: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={enablePassword} 
                        onChange={(e) => setEnablePassword(e.target.checked)} 
                      />
                      <span>Passcode Protection</span>
                    </label>
                    {enablePassword && (
                      <input
                        type="text"
                        placeholder="Enter passcode..."
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="input input-mono"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                      />
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={enableDeviceRouting} 
                        onChange={(e) => setEnableDeviceRouting(e.target.checked)} 
                      />
                      <span>iOS & Android Routing</span>
                    </label>
                    {enableDeviceRouting && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <input
                          type="text"
                          placeholder="App Store URL for iPhone..."
                          value={iosTarget}
                          onChange={(e) => setIosTarget(e.target.value)}
                          className="input"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Play Store URL for Android..."
                          value={androidTarget}
                          onChange={(e) => setAndroidTarget(e.target.value)}
                          className="input"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        ) : (
          /* Inline Result State (Seamless Continuity) */
          <div style={{ padding: '0.25rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-green">
                <Check size={12} /> Ready
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Your short link is live and ready to share.
              </span>
            </div>

            {/* Generated Link Box */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              backgroundColor: 'var(--bg-subtle)', 
              border: '1px solid var(--border-default)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.75rem 1rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '0.85rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Short Link</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  https://{lastCreatedLink.domain}/{lastCreatedLink.slug}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={handleCopy} className="btn btn-primary" style={{ padding: '0.45rem 1rem' }}>
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
                <a
                  href={lastCreatedLink.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  <ExternalLink size={14} /> Open
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <button onClick={() => onOpenQR(lastCreatedLink)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                  <QrCode size={13} /> QR Code
                </button>
                <button onClick={() => onOpenSimulator(lastCreatedLink)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                  <Smartphone size={13} /> Test Routing
                </button>
                <button onClick={() => onOpenStudioModal(lastCreatedLink)} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                  <Sparkles size={13} /> Social Preview
                </button>
              </div>

              <button onClick={handleReset} className="btn btn-ghost" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                + Shorten another link
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust guarantees in simple text */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span>✓ Instant redirection</span>
        <span>✓ Custom social previews</span>
        <span>✓ Smart device routing</span>
        <span>✓ 100% Free</span>
      </div>
    </section>
  );
}
