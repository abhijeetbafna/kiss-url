import React, { useState } from 'react';
import { MessageSquare, Hash } from 'lucide-react';

const TwitterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
  </svg>
);

export default function SocialCardPreview({ title, description, imageUrl, destinationUrl, slug, domain }) {
  const [activePlatform, setActivePlatform] = useState('twitter');

  const displayTitle = title || 'Your Engaging Page Title Here';
  const displayDesc = description || 'A short, persuasive summary that maximizes social media click-through rates.';
  const displayImage = imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
  const displayUrl = `${domain || 'pulse.link'}/${slug || 'custom-alias'}`;

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Platform Switcher */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActivePlatform('twitter')}
          className={`btn-ghost ${activePlatform === 'twitter' ? 'badge-indigo' : ''}`}
          style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
        >
          <TwitterIcon size={14} /> Twitter / X
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('linkedin')}
          className={`btn-ghost ${activePlatform === 'linkedin' ? 'badge-indigo' : ''}`}
          style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
        >
          <LinkedInIcon size={14} /> LinkedIn
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('whatsapp')}
          className={`btn-ghost ${activePlatform === 'whatsapp' ? 'badge-indigo' : ''}`}
          style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
        >
          <MessageSquare size={14} /> WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('slack')}
          className={`btn-ghost ${activePlatform === 'slack' ? 'badge-indigo' : ''}`}
          style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
        >
          <Hash size={14} /> Slack
        </button>
      </div>

      {/* Platform Previews */}
      <div style={{
        backgroundColor: 'var(--bg-surface-muted)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        maxWidth: '520px',
        margin: '0 auto',
      }}>
        {activePlatform === 'twitter' && (
          <div style={{
            border: '1px solid #cfd9de',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#f7f9f9' }}>
              <img
                src={displayImage}
                alt="OG Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
              <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#ffffff',
                fontWeight: '600'
              }}>
                {domain || 'pulse.link'}
              </div>
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontSize: '13px', color: '#536471', marginBottom: '2px' }}>{domain || 'pulse.link'}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f1419', lineHeight: '1.3' }}>{displayTitle}</div>
              <div style={{ fontSize: '13px', color: '#536471', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {displayDesc}
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'linkedin' && (
          <div style={{
            border: '1px solid #e0e2e6',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <div style={{ height: '190px', width: '100%', overflow: 'hidden', backgroundColor: '#eef3f8' }}>
              <img
                src={displayImage}
                alt="LinkedIn Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
            <div style={{ padding: '10px 14px', backgroundColor: '#f3f6f8' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191919', lineHeight: '1.3' }}>{displayTitle}</div>
              <div style={{ fontSize: '12px', color: '#56687a', marginTop: '4px' }}>{displayUrl}</div>
            </div>
          </div>
        )}

        {activePlatform === 'whatsapp' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '8px',
            maxWidth: '380px',
            border: '1px solid #d1d7db',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            fontFamily: 'system-ui, sans-serif'
          }}>
            <div style={{ borderRadius: '6px', overflow: 'hidden', marginBottom: '6px' }}>
              <img
                src={displayImage}
                alt="WhatsApp Preview"
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111b21' }}>{displayTitle}</div>
            <div style={{ fontSize: '12px', color: '#667781', marginTop: '2px' }}>{displayDesc}</div>
            <div style={{ fontSize: '11px', color: '#00a884', marginTop: '6px', fontWeight: '600' }}>{displayUrl}</div>
          </div>
        )}

        {activePlatform === 'slack' && (
          <div style={{
            borderLeft: '4px solid #2563eb',
            paddingLeft: '12px',
            backgroundColor: '#ffffff',
            padding: '10px 12px',
            borderRadius: '0 8px 8px 0',
            border: '1px solid #e2e8f0',
            borderLeftWidth: '4px',
            borderLeftColor: '#2563eb',
            fontFamily: 'system-ui, sans-serif'
          }}>
            <div style={{ fontSize: '12px', color: '#616061', fontWeight: 'bold' }}>LinkPulse • {domain || 'pulse.link'}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1264a3', marginTop: '2px' }}>{displayTitle}</div>
            <div style={{ fontSize: '13px', color: '#1d1c1d', marginTop: '4px' }}>{displayDesc}</div>
            <div style={{ marginTop: '8px', borderRadius: '4px', overflow: 'hidden', maxWidth: '320px' }}>
              <img
                src={displayImage}
                alt="Slack Preview"
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
        ✨ Dynamically overrides open graph metadata when crawlers (TwitterBot, SlackBot, DiscordBot) fetch your short URL.
      </p>
    </div>
  );
}
