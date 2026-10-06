import React, { useState } from 'react';
import { MessageSquare, Hash } from 'lucide-react';

const TwitterIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z"/>
  </svg>
);

export default function SocialCardPreview({ title, description, imageUrl, destinationUrl, slug, domain }) {
  const [activePlatform, setActivePlatform] = useState('twitter');

  const displayTitle = title || 'Your Page Title';
  const displayDesc = description || 'A short description of your link that displays when shared on social networks.';
  const displayImage = imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
  const displayUrl = `${domain || 'kiss.url'}/${slug || 'custom-alias'}`;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Platform Switcher */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActivePlatform('twitter')}
          className={`btn ${activePlatform === 'twitter' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.775rem', padding: '0.25rem 0.55rem' }}
        >
          <TwitterIcon size={13} /> Twitter / X
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('linkedin')}
          className={`btn ${activePlatform === 'linkedin' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.775rem', padding: '0.25rem 0.55rem' }}
        >
          <LinkedInIcon size={13} /> LinkedIn
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('whatsapp')}
          className={`btn ${activePlatform === 'whatsapp' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.775rem', padding: '0.25rem 0.55rem' }}
        >
          <MessageSquare size={13} /> WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActivePlatform('slack')}
          className={`btn ${activePlatform === 'slack' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.775rem', padding: '0.25rem 0.55rem' }}
        >
          <Hash size={13} /> Slack
        </button>
      </div>

      {/* Platform Previews */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
      }}>
        {activePlatform === 'twitter' && (
          <div style={{
            border: '1px solid #e1e8ed',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#f5f8fa' }}>
              <img
                src={displayImage}
                alt="OG Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '11px',
                color: '#ffffff',
                fontWeight: '500'
              }}>
                {domain || 'kiss.url'}
              </div>
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f1419', lineHeight: '1.3' }}>{displayTitle}</div>
              <div style={{ fontSize: '12px', color: '#536471', marginTop: '3px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {displayDesc}
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'linkedin' && (
          <div style={{
            border: '1px solid #e0e2e6',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <div style={{ height: '170px', width: '100%', overflow: 'hidden', backgroundColor: '#eef3f8' }}>
              <img
                src={displayImage}
                alt="LinkedIn Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
            <div style={{ padding: '8px 12px', backgroundColor: '#f3f6f8' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#191919', lineHeight: '1.3' }}>{displayTitle}</div>
              <div style={{ fontSize: '11px', color: '#56687a', marginTop: '2px' }}>{displayUrl}</div>
            </div>
          </div>
        )}

        {activePlatform === 'whatsapp' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            padding: '6px',
            maxWidth: '340px',
            border: '1px solid #d1d7db',
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
              <img
                src={displayImage}
                alt="WhatsApp Preview"
                style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111b21' }}>{displayTitle}</div>
            <div style={{ fontSize: '11px', color: '#667781', marginTop: '2px' }}>{displayDesc}</div>
            <div style={{ fontSize: '11px', color: '#00a884', marginTop: '4px', fontWeight: '500' }}>{displayUrl}</div>
          </div>
        )}

        {activePlatform === 'slack' && (
          <div style={{
            border: '1px solid #e2e8f0',
            borderLeft: '3px solid #0070f3',
            backgroundColor: '#ffffff',
            padding: '8px 12px',
            borderRadius: '0 6px 6px 0',
            fontFamily: 'sans-serif'
          }}>
            <div style={{ fontSize: '11px', color: '#616061', fontWeight: '600' }}>KissURL • {domain || 'kiss.url'}</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1264a3', marginTop: '2px' }}>{displayTitle}</div>
            <div style={{ fontSize: '12px', color: '#1d1c1d', marginTop: '2px' }}>{displayDesc}</div>
            <div style={{ marginTop: '6px', borderRadius: '4px', overflow: 'hidden', maxWidth: '280px' }}>
              <img
                src={displayImage}
                alt="Slack Preview"
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'; }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
