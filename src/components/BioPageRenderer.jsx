import React, { useEffect, useState } from 'react';
import { 
  getBioPageByHandle, recordBioClick, buildBioUrl 
} from '../services/storageService';
import { 
  Check, Share2, Globe, Mail, ExternalLink, ArrowLeft,
  Sparkles, ShieldCheck
} from 'lucide-react';

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GitHubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedInIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
  </svg>
);

export default function BioPageRenderer({ handle, onBack }) {
  const [page, setPage] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!handle) return;
    const found = getBioPageByHandle(handle);
    setPage(found || null);

    if (found) {
      recordBioClick(handle, null); // Record profile view
    }
  }, [handle]);

  if (!page) {
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
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
          404
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem' }}>
          Bio profile not found
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The profile @{handle} does not exist or has been removed.
        </p>
        <a href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={14} /> Back to KissURL
        </a>
      </div>
    );
  }

  const handleLinkClick = (linkId, url) => {
    recordBioClick(page.handle, linkId);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const profileUrl = buildBioUrl(page.handle);
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme-specific styles
  const isDarkTheme = page.theme === 'dark';
  const isCobaltTheme = page.theme === 'cobalt';
  const isEmeraldTheme = page.theme === 'emerald';

  let bgStyle = {
    backgroundColor: 'var(--bg-page)',
    color: 'var(--text-primary)'
  };

  let cardStyle = {
    backgroundColor: 'var(--bg-surface)',
    borderColor: 'var(--border-default)',
    color: 'var(--text-primary)'
  };

  if (isDarkTheme) {
    bgStyle = { backgroundColor: '#09090b', color: '#f4f4f5' };
    cardStyle = { backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' };
  } else if (isCobaltTheme) {
    bgStyle = { backgroundColor: '#0f172a', color: '#f8fafc' };
    cardStyle = { backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' };
  } else if (isEmeraldTheme) {
    bgStyle = { backgroundColor: '#064e3b', color: '#ecfdf5' };
    cardStyle = { backgroundColor: '#065f46', borderColor: '#047857', color: '#ecfdf5' };
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '3rem 1.25rem 4rem',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.3s ease',
      ...bgStyle
    }}>
      {/* Top Floating Share Button */}
      <div style={{ maxWidth: '440px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        {onBack ? (
          <button onClick={onBack} className="btn-icon" style={{ color: 'inherit' }} title="Back to dashboard">
            <ArrowLeft size={16} />
          </button>
        ) : <div />}

        <button 
          onClick={handleShare} 
          className="btn-secondary" 
          style={{ 
            fontSize: '0.75rem', 
            padding: '0.35rem 0.75rem', 
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: isDarkTheme || isCobaltTheme || isEmeraldTheme ? 'rgba(255,255,255,0.1)' : 'var(--bg-surface)',
            color: 'inherit',
            borderColor: isDarkTheme || isCobaltTheme || isEmeraldTheme ? 'rgba(255,255,255,0.15)' : 'var(--border-default)'
          }}
        >
          {copied ? <><Check size={12} color="#15803d" /> Copied Profile Link</> : <><Share2 size={12} /> Share Profile</>}
        </button>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        {/* Avatar */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          overflow: 'hidden',
          margin: '0 auto 1rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <img 
            src={page.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'} 
            alt={page.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Profile Header */}
        <h1 style={{ fontSize: '1.35rem', fontWeight: '700', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
          {page.name}
          <ShieldCheck size={16} color="#0070f3" fill="#0070f3" style={{ color: '#ffffff' }} />
        </h1>

        <div style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: '500', marginBottom: '0.5rem' }}>
          @{page.handle} {page.tagline ? `• ${page.tagline}` : ''}
        </div>

        {page.bio && (
          <p style={{ fontSize: '0.85rem', opacity: 0.85, lineHeight: '1.5', maxWidth: '380px', margin: '0 auto 1.25rem' }}>
            {page.bio}
          </p>
        )}

        {/* Social Icons Bar */}
        {page.socials && Object.values(page.socials).some(Boolean) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
            {page.socials.twitter && (
              <a 
                href={`https://twitter.com/${page.socials.twitter}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', textDecoration: 'none' }}
                title="Twitter / X"
              >
                <TwitterIcon size={14} />
              </a>
            )}
            {page.socials.github && (
              <a 
                href={`https://github.com/${page.socials.github}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', textDecoration: 'none' }}
                title="GitHub"
              >
                <GitHubIcon size={14} />
              </a>
            )}
            {page.socials.linkedin && (
              <a 
                href={`https://linkedin.com/in/${page.socials.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', textDecoration: 'none' }}
                title="LinkedIn"
              >
                <LinkedInIcon size={14} />
              </a>
            )}
            {page.socials.website && (
              <a 
                href={page.socials.website} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', textDecoration: 'none' }}
                title="Website"
              >
                <Globe size={14} />
              </a>
            )}
            {page.socials.email && (
              <a 
                href={`mailto:${page.socials.email}`} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(128,128,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit', textDecoration: 'none' }}
                title="Email"
              >
                <Mail size={14} />
              </a>
            )}
          </div>
        )}

        {/* Links Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {page.links?.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id, item.url)}
              style={{
                width: '100%',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: item.highlight ? '0 0 0 2px var(--accent)' : 'none',
                ...cardStyle
              }}
              className="btn-interactive"
            >
              <div>
                <div style={{ fontSize: '0.925rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '2px' }}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <ExternalLink size={14} style={{ opacity: 0.6, flexShrink: 0 }} />
            </button>
          ))}
        </div>

        {/* Footer */}
        <a 
          href="/" 
          style={{ 
            fontSize: '0.75rem', 
            opacity: 0.6, 
            textDecoration: 'none', 
            color: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Sparkles size={11} /> Created with KissURL
        </a>
      </div>
    </div>
  );
}
