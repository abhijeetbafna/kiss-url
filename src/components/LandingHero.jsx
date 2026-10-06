import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, Copy, Check, ExternalLink, QrCode, 
  Share2, RefreshCw, Wand2, Shield, Smartphone, AlertCircle, Play, ChevronDown, ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_SLUGS = ['pulse', 'launch', 'drop', 'vip-pass', 'beta-access', 'grow'];

export default function LandingHero({ onLinkCreated, onOpenQR, onOpenSimulator, onOpenStudioModal }) {
  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [domain, setDomain] = useState('kiss.url');
  const [customSlug, setCustomSlug] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced flags
  const [enablePassword, setEnablePassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [enableDeviceRouting, setEnableDeviceRouting] = useState(false);
  const [iosTarget, setIosTarget] = useState('');
  const [androidTarget, setAndroidTarget] = useState('');

  // Workflow states: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
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
      setErrorMessage('Please enter a destination URL to shorten.');
      return;
    }

    // Basic URL validation
    let validUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
    } catch {
      setStatus('error');
      setErrorMessage('Please enter a valid URL (e.g., https://yourbrand.com/campaign).');
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 350);
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
      className="card-surface" 
      style={{ 
        padding: '2.75rem 2rem', 
        marginBottom: '2.5rem', 
        position: 'relative', 
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--color-bg-surface)'
      }}
    >
      <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
        {/* Value Proposition Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <span className="badge badge-indigo">
            <Sparkles size={12} /> The High-Performance Link Engine
          </span>
        </div>

        {/* Display Headline */}
        <h1 style={{ 
          fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)', 
          fontWeight: '800', 
          lineHeight: '1.18', 
          letterSpacing: '-0.035em', 
          color: 'var(--color-text-primary)', 
          marginBottom: '0.85rem' 
        }}>
          Shorten, Supercharge & Route <span style={{ color: 'var(--color-accent)' }}>Your Links</span>
        </h1>

        {/* Subtitle */}
        <p style={{ 
          color: 'var(--color-text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          maxWidth: '640px',
          marginInline: 'auto'
        }}>
          Sub-15ms edge redirects, dynamic social card previews, device-aware app routing, and privacy analytics. 100% Free on modern edge infrastructure.
        </p>

        {/* PRIMARY SHORTENING WORKFLOW HUB */}
        <div style={{ 
          backgroundColor: 'var(--color-bg-subtle)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-strong)', 
          padding: '1.25rem',
          textAlign: 'left',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '1.5rem'
        }}>
          {status !== 'success' ? (
            <form onSubmit={handleShortenSubmit}>
              {/* Main Input Row */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 320px', position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Paste your long URL (e.g. https://github.com/my-project/repo)..."
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    className="input-field"
                    style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                    disabled={status === 'loading'}
                    autoFocus
                    aria-label="Destination URL"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flexShrink: 0, padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <><RefreshCw size={16} className="pulse-indicator" /> Shortening...</>
                  ) : (
                    <>Shorten URL <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              {/* Error Banner if validation fails */}
              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: 'var(--badge-rose-text)', fontSize: '0.85rem' }}>
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Slug & Domain Customization Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Branded Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="input-field"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="kiss.url">kiss.url (Fast Edge)</option>
                    <option value="go.bio">go.bio (Creator Bio)</option>
                    <option value="click.to">click.to (Instant)</option>
                    <option value="custom.domain">custom.domain (CNAME)</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Custom Alias (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomSlug}
                      className="btn-ghost"
                      style={{ padding: '0 4px', fontSize: '0.725rem', color: 'var(--color-accent)', fontWeight: '600' }}
                    >
                      <Wand2 size={11} /> Auto-slug
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. launch-2026"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="input-field"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              {/* Advanced Smart Rule Toggle */}
              <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="btn-ghost"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Shield size={13} color="var(--color-accent)" />
                  <span>Optional Smart Protection & Device Rules</span>
                  {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showAdvanced && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.65rem', backgroundColor: 'var(--color-bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                        <input 
                          type="checkbox" 
                          id="pass-check"
                          checked={enablePassword} 
                          onChange={(e) => setEnablePassword(e.target.checked)} 
                        />
                        <label htmlFor="pass-check" style={{ fontSize: '0.775rem', fontWeight: '700', cursor: 'pointer' }}>Passcode Protection</label>
                      </div>
                      {enablePassword && (
                        <input
                          type="text"
                          placeholder="Enter passcode..."
                          value={passwordValue}
                          onChange={(e) => setPasswordValue(e.target.value)}
                          className="input-field"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}
                        />
                      )}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                        <input 
                          type="checkbox" 
                          id="dev-check"
                          checked={enableDeviceRouting} 
                          onChange={(e) => setEnableDeviceRouting(e.target.checked)} 
                        />
                        <label htmlFor="dev-check" style={{ fontSize: '0.775rem', fontWeight: '700', cursor: 'pointer' }}>iOS & Android App Deep-Linking</label>
                      </div>
                      {enableDeviceRouting && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <input
                            type="text"
                            placeholder="iOS App Store URL..."
                            value={iosTarget}
                            onChange={(e) => setIosTarget(e.target.value)}
                            className="input-field"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          />
                          <input
                            type="text"
                            placeholder="Android Play Store URL..."
                            value={androidTarget}
                            onChange={(e) => setAndroidTarget(e.target.value)}
                            className="input-field"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* MAJOR RESULT EXPERIENCE */
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-emerald">
                  <Check size={12} /> Link Successfully Generated & Edge-Deployed
                </span>
              </div>

              {/* Large Result Bar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: 'var(--color-bg-surface)', 
                border: '2px solid var(--color-accent)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.85rem 1.25rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Your Short Link</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
                    https://{lastCreatedLink.domain}/{lastCreatedLink.slug}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleCopy} className="btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
                    {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                  </button>
                  <a
                    href={lastCreatedLink.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    <ExternalLink size={15} /> Test Target
                  </a>
                </div>
              </div>

              {/* Quick Actions & Next Steps */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button onClick={() => onOpenQR(lastCreatedLink)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <QrCode size={13} /> Studio QR Code
                  </button>
                  <button onClick={() => onOpenSimulator(lastCreatedLink)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <Play size={13} color="var(--color-accent)" /> Simulate Edge Redirect
                  </button>
                  <button onClick={() => onOpenStudioModal(lastCreatedLink)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    <Sparkles size={13} color="#7c3aed" /> Customize Social Preview
                  </button>
                </div>

                <button onClick={handleReset} className="btn-ghost" style={{ fontSize: '0.825rem', color: 'var(--color-accent)', fontWeight: '600' }}>
                  + Shorten Another URL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Feature Checkmarks */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> 0ms Cold Starts (<span style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>&lt;15ms Globally</span>)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> OpenGraph Card Overrides
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> Device & Geo Smart Routing
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> Zero Monthly Hosting Bills
          </span>
        </div>
      </div>
    </section>
  );
}
