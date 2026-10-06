import React, { useState, useRef } from 'react';
import { 
  ArrowRight, Copy, Check, ExternalLink, QrCode, 
  Sparkles, RefreshCw, Wand2, AlertCircle, Sliders, Shield, Smartphone 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_SLUGS = ['quick', 'drop', 'pass', 'boost', 'go', 'link', 'launch'];

export default function ShortenerHero({ onLinkCreated, onOpenQR, onOpenCustomizeModal }) {
  const [urlInput, setUrlInput] = useState('');
  const [domain, setDomain] = useState('kiss.url');
  const [customSlug, setCustomSlug] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // Advanced optional settings
  const [passwordValue, setPasswordValue] = useState('');
  const [iosTarget, setIosTarget] = useState('');
  const [androidTarget, setAndroidTarget] = useState('');

  // States: 'idle' | 'loading' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  const generateRandomSlug = () => {
    const word = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
    const num = Math.floor(100 + Math.random() * 900);
    setCustomSlug(`${word}-${num}`);
  };

  const handleShorten = (e) => {
    e.preventDefault();
    const rawUrl = urlInput.trim();

    if (!rawUrl) {
      setStatus('error');
      setErrorMessage('Please enter a destination URL to shorten.');
      inputRef.current?.focus();
      return;
    }

    // URL formatting & validation
    let validUrl = rawUrl;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }

    try {
      new URL(validUrl);
    } catch {
      setStatus('error');
      setErrorMessage('Please enter a valid website address (e.g. https://yourwebsite.com).');
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
        tags: ['Web'],
        socialOg: { enabled: false, title: '', description: '', imageUrl: '' },
        routing: {
          enabled: Boolean(iosTarget || androidTarget),
          iosUrl: iosTarget.trim(),
          androidUrl: androidTarget.trim(),
          desktopUrl: validUrl
        },
        protection: {
          isPasswordProtected: Boolean(passwordValue.trim()),
          password: passwordValue.trim(),
          expiresAt: '',
          maxClicks: 0
        }
      };

      const result = onLinkCreated(newLink);
      setCreatedLink(result || newLink);
      setStatus('success');

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 300);
  };

  const handleCopy = () => {
    if (!createdLink) return;
    const fullUrl = `https://${createdLink.domain}/${createdLink.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setUrlInput('');
    setCustomSlug('');
    setPasswordValue('');
    setIosTarget('');
    setAndroidTarget('');
    setShowOptions(false);
    setStatus('idle');
    setCreatedLink(null);
    inputRef.current?.focus();
  };

  return (
    <section 
      className="surface-card" 
      style={{ 
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.25rem, 3vw, 2.5rem)', 
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        {/* Typographic Header */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4vw, 2.75rem)', 
          fontWeight: '800', 
          lineHeight: '1.15', 
          letterSpacing: '-0.035em', 
          color: 'var(--text-primary)', 
          marginBottom: '0.65rem' 
        }}>
          Fast, clean short links.
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)', 
          lineHeight: '1.55', 
          marginBottom: '2rem',
          maxWidth: '540px',
          marginInline: 'auto'
        }}>
          Paste your long URL below to create a lightning-fast, privacy-first short link with custom alias options.
        </p>

        {/* PRIMARY SHORTENING WORKFLOW */}
        <div style={{ 
          backgroundColor: 'var(--bg-surface-subtle)', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid var(--border-strong)', 
          padding: '1.25rem',
          textAlign: 'left',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1.5rem'
        }}>
          {status !== 'success' ? (
            <form onSubmit={handleShorten}>
              {/* URL Input Row */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px', position: 'relative' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    required
                    placeholder="Paste a link to shorten (e.g. https://example.com/article)..."
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    className="input-field"
                    style={{ fontSize: '0.95rem', padding: '0.75rem 1rem' }}
                    disabled={status === 'loading'}
                    autoFocus
                    aria-label="Destination URL to shorten"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flexShrink: 0, padding: '0.75rem 1.4rem', fontSize: '0.925rem' }}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <><RefreshCw size={16} className="pulse-indicator" /> Shortening...</>
                  ) : (
                    <>Shorten <ArrowRight size={16} /></>
                  )}
                </button>
              </div>

              {/* Error Message Feedback */}
              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.65rem', color: 'var(--status-error-text)', fontSize: '0.85rem' }}>
                  <AlertCircle size={15} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Optional Custom Alias Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className="btn-ghost"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                >
                  <Sliders size={13} color="var(--accent-primary)" />
                  {showOptions ? 'Hide custom alias & rules' : 'Customize alias & options'}
                </button>
              </div>

              {/* Custom Slug & Options Drawer */}
              {showOptions && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Domain
                      </label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', minHeight: '38px' }}
                      >
                        <option value="kiss.url">kiss.url</option>
                        <option value="go.bio">go.bio</option>
                        <option value="click.to">click.to</option>
                      </select>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          Custom Slug
                        </label>
                        <button
                          type="button"
                          onClick={generateRandomSlug}
                          className="btn-ghost"
                          style={{ padding: '0 4px', fontSize: '0.725rem', color: 'var(--accent-primary)', fontWeight: '600' }}
                        >
                          <Wand2 size={11} /> Random
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. my-campaign"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', minHeight: '38px' }}
                      />
                    </div>
                  </div>

                  {/* Optional Passcode */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Optional Passcode Lock
                      </label>
                      <input
                        type="text"
                        placeholder="Leave blank for public link..."
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', minHeight: '38px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        iOS App Store URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Route iPhone users directly..."
                        value={iosTarget}
                        onChange={(e) => setIosTarget(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', minHeight: '38px' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* MAJOR RESULT EXPERIENCE */
            <div style={{ padding: '0.35rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                <span className="badge badge-success">
                  <Check size={12} /> Ready to Share
                </span>
              </div>

              {/* Large Result Box */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                backgroundColor: 'var(--bg-surface)', 
                border: '2px solid var(--accent-primary)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.85rem 1.15rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Your Short Link</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                    https://{createdLink.domain}/{createdLink.slug}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={handleCopy} className="btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
                    {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
                  </button>
                  <a
                    href={createdLink.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ textDecoration: 'none' }}
                  >
                    <ExternalLink size={15} /> Open
                  </a>
                </div>
              </div>

              {/* Secondary Context Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button onClick={() => onOpenQR(createdLink)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    <QrCode size={13} /> QR Code
                  </button>
                  <button onClick={() => onOpenCustomizeModal(createdLink)} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                    <Sparkles size={13} color="var(--accent-primary)" /> Edit Social Card
                  </button>
                </div>

                <button onClick={handleReset} className="btn-ghost" style={{ fontSize: '0.825rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
                  + Shorten another link
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quiet Trust Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', fontSize: '0.775rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Check size={12} style={{ color: '#10b981' }} /> Sub-15ms edge redirects</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Check size={12} style={{ color: '#10b981' }} /> Zero tracking cookies</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Check size={12} style={{ color: '#10b981' }} /> 100% Free forever</span>
        </div>
      </div>
    </section>
  );
}
