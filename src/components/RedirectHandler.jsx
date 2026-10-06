import React, { useState, useEffect } from 'react';
import { getStoredLinks, recordRealClick, getErrorBrandingSettings } from '../services/storageService';
import { apiResolvePublicLink } from '../services/api';
import { Shield, AlertCircle, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';

export default function RedirectHandler({ slug }) {
  const [status, setStatus] = useState('resolving'); // resolving | redirecting | password_required | expired | not_found
  const [link, setLink] = useState(null);
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorBranding, setErrorBranding] = useState(() => getErrorBrandingSettings());

  useEffect(() => {
    if (!slug) {
      setStatus('not_found');
      return;
    }

    const resolveLink = async () => {
      let matched = null;
      let branding = getErrorBrandingSettings();

      // 1. Try server-authoritative public resolution first
      try {
        const res = await apiResolvePublicLink(slug);
        if (res && res.link) {
          matched = res.link;
          if (res.errorBranding) {
            branding = res.errorBranding;
            setErrorBranding(res.errorBranding);
          }
        }
      } catch (err) {
        if (err.data?.branding) {
          setErrorBranding(err.data.branding);
        }
      }

      // 2. Fallback to client cache if offline or standalone
      if (!matched) {
        const links = getStoredLinks();
        const cleanSlug = slug.toLowerCase().trim();
        matched = links.find(l => l.slug?.toLowerCase() === cleanSlug);
      }

      if (!matched) {
        setStatus('not_found');
        return;
      }

      setLink(matched);

      // Check expiration and max clicks
      const isTimeExpired = matched.protection?.expiresAt && new Date(matched.protection.expiresAt) < new Date();
      const isClicksExceeded = matched.protection?.maxClicks > 0 && (matched.clicks || 0) >= matched.protection.maxClicks;

      if (isTimeExpired || isClicksExceeded) {
        if (matched.protection?.fallbackUrl) {
          let fallback = matched.protection.fallbackUrl;
          if (!fallback.startsWith('http://') && !fallback.startsWith('https://')) {
            fallback = 'https://' + fallback;
          }
          window.location.replace(fallback);
          return;
        }
        setStatus('expired');
        return;
      }

      // Check password protection
      if (matched.protection?.isPasswordProtected && matched.protection.password) {
        setStatus('password_required');
        return;
      }

      // Proceed to redirect
      executeRedirect(matched);
    };

    resolveLink();
  }, [slug]);

  const executeRedirect = (targetLink) => {
    let destination = targetLink.targetUrl;
    const ua = navigator.userAgent || '';
    const lang = (navigator.language || navigator.userLanguage || '').toUpperCase();

    // 1. Check Geo Routing rules
    if (targetLink.geoRouting?.enabled && targetLink.geoRouting.rules?.length > 0) {
      const matchedRule = targetLink.geoRouting.rules.find(r => lang.includes(r.country));
      if (matchedRule && matchedRule.url) {
        destination = matchedRule.url;
      }
    }

    // 2. Check A/B Split Testing
    if (targetLink.splitTesting?.enabled && targetLink.splitTesting.variants?.length > 0) {
      const validVariants = targetLink.splitTesting.variants.filter(v => v.url);
      if (validVariants.length > 0) {
        const totalWeight = validVariants.reduce((sum, v) => sum + (Number(v.weight) || 1), 0);
        let randomRoll = Math.random() * totalWeight;
        for (const variant of validVariants) {
          const w = Number(variant.weight) || 1;
          if (randomRoll <= w) {
            destination = variant.url;
            break;
          }
          randomRoll -= w;
        }
      }
    }

    // 3. Check Device Routing overrides
    if (targetLink.routing?.enabled) {
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const isAndroid = /Android/i.test(ua);

      if (isIOS && targetLink.routing.iosUrl) {
        destination = targetLink.routing.iosUrl;
      } else if (isAndroid && targetLink.routing.androidUrl) {
        destination = targetLink.routing.androidUrl;
      } else if (targetLink.routing.desktopUrl) {
        destination = targetLink.routing.desktopUrl;
      }
    }

    // Ensure protocol
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
      destination = 'https://' + destination;
    }

    // Record local click cache
    recordRealClick(targetLink.id, {
      referrer: document.referrer || 'direct',
      userAgent: ua,
    });

    setResolvedUrl(destination);
    setStatus('redirecting');

    // Immediate browser redirect
    try {
      window.location.replace(destination);
    } catch {
      window.location.href = destination;
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (enteredPassword === link.protection.password) {
      setPasswordError('');
      executeRedirect(link);
    } else {
      setPasswordError('Incorrect passcode. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.25rem',
      backgroundColor: 'var(--bg-page)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      textAlign: 'center'
    }}>
      {/* 1. REDIRECTING / RESOLVING STATE */}
      {(status === 'resolving' || status === 'redirecting') && (
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            border: '3px solid var(--border-default)', 
            borderTopColor: 'var(--primary-bg)', 
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1.25rem' 
          }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            Redirecting you now...
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Taking you to destination: <span style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{resolvedUrl || 'destination'}</span>
          </p>
          {resolvedUrl && (
            <a 
              href={resolvedUrl} 
              className="btn btn-secondary" 
              style={{ fontSize: '0.85rem', display: 'inline-flex' }}
            >
              <ExternalLink size={14} /> Click here if not redirected automatically
            </a>
          )}
        </div>
      )}

      {/* 2. PASSWORD REQUIRED STATE */}
      {status === 'password_required' && (
        <div style={{ 
          maxWidth: '380px', 
          width: '100%', 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem 1.5rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-primary)' }}>
            <Shield size={20} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Protected Link
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            This short link is passcode protected. Enter the passcode to continue.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter passcode..."
              value={enteredPassword}
              onChange={(e) => {
                setEnteredPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className="input input-mono"
              style={{ textAlign: 'center', marginBottom: '0.65rem' }}
              autoFocus
            />

            {passwordError && (
              <div style={{ fontSize: '0.8rem', color: 'var(--error-text)', marginBottom: '0.65rem' }}>
                {passwordError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
              Unlock & Open Link
            </button>

            <a href="/" className="btn btn-ghost" style={{ width: '100%', fontSize: '0.8rem' }}>
              <ArrowLeft size={13} /> Back to KissURL
            </a>
          </form>
        </div>
      )}

      {/* 3. EXPIRED STATE */}
      {status === 'expired' && (
        <div style={{ 
          maxWidth: '400px', 
          width: '100%', 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem 1.5rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <AlertCircle size={36} color="var(--error-text)" style={{ margin: '0 auto 0.75rem' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
            Link Expired
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            This short link has expired or reached its maximum allowed click limit.
          </p>
          <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={14} /> Go to KissURL Homepage
          </a>
        </div>
      )}

      {/* 4. NOT FOUND STATE (CUSTOM BRANDED 404) */}
      {status === 'not_found' && (
        <div style={{ 
          maxWidth: '440px', 
          width: '100%', 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2.5rem 1.75rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>
            {errorBranding.logoEmoji || '⚡'}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            404
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
            {errorBranding.customTitle || 'Short link not found'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            {errorBranding.customMessage || `The requested short URL /${slug} does not exist or may have been deleted.`}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', justifyContent: 'center' }}>
              <ArrowLeft size={14} /> Go to {errorBranding.brandName || 'KissURL'}
            </a>
            {errorBranding.supportUrl && (
              <a 
                href={errorBranding.supportUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-secondary" 
                style={{ display: 'inline-flex', justifyContent: 'center', fontSize: '0.825rem' }}
              >
                <HelpCircle size={14} /> Contact Support
              </a>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

