import React, { useState } from 'react';
import { Sparkles, Smartphone, QrCode, BarChart2, ArrowRight } from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';

export default function ProductDemos({ onOpenCreateModal }) {
  const [activeTab, setActiveTab] = useState('social'); // social | routing | qr | analytics

  // Interactive demo states
  const [demoTitle, setDemoTitle] = useState('New Product Launch & Early Access');
  const [demoDesc, setDemoDesc] = useState('Get instant access to our modern link management tools.');
  const [demoImage, setDemoImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80');
  const [demoDevice, setDemoDevice] = useState('ios');

  return (
    <section 
      id="demos-section" 
      style={{ 
        maxWidth: '1020px', 
        margin: '0 auto 4rem',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '3rem'
      }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Explore built-in capabilities
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Interactive tools included with every short link.
        </p>
      </div>

      {/* Segmented Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '0.35rem', 
        marginBottom: '1.75rem', 
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '0.5rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('social')}
          className={`btn ${activeTab === 'social' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
        >
          <Sparkles size={14} /> Social Media Previews
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`btn ${activeTab === 'routing' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
        >
          <Smartphone size={14} /> Smart Device Routing
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`btn ${activeTab === 'qr' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
        >
          <QrCode size={14} /> QR Code Generator
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
        >
          <BarChart2 size={14} /> Private Analytics
        </button>
      </div>

      {/* Tab 1: Social Media Preview */}
      {activeTab === 'social' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Customize how your link appears on Twitter, LinkedIn & Slack
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Set custom preview titles, descriptions, and banner images so your links stand out when shared on social networks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Preview Title
                </label>
                <input
                  type="text"
                  value={demoTitle}
                  onChange={(e) => setDemoTitle(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Preview Description
                </label>
                <input
                  type="text"
                  value={demoDesc}
                  onChange={(e) => setDemoDesc(e.target.value)}
                  className="input"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button onClick={onOpenCreateModal} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Create Custom Link <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <SocialCardPreview
              title={demoTitle}
              description={demoDesc}
              imageUrl={demoImage}
              destinationUrl="https://github.com/topics/web-development"
              slug="launch"
              domain="kiss.url"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Smart Device Routing */}
      {activeTab === 'routing' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Send mobile visitors directly to your app
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              One single link automatically detects whether the visitor is on an iPhone, Android, or PC, routing them to the right destination.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge">iPhone</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><ArrowRight size={12} style={{ color: 'var(--text-muted)' }} /> Opens Apple App Store</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge">Android</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><ArrowRight size={12} style={{ color: 'var(--text-muted)' }} /> Opens Google Play Store</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge">Desktop</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><ArrowRight size={12} style={{ color: 'var(--text-muted)' }} /> Opens your web homepage</span>
              </div>
            </div>

            <button onClick={onOpenCreateModal} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Configure Smart Link <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '500' }}>
              Test Visitor Device Resolution:
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setDemoDevice('ios')}
                className={`btn ${demoDevice === 'ios' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', flex: 1 }}
              >
                iPhone (iOS)
              </button>
              <button
                onClick={() => setDemoDevice('android')}
                className={`btn ${demoDevice === 'android' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', flex: 1 }}
              >
                Android
              </button>
              <button
                onClick={() => setDemoDevice('desktop')}
                className={`btn ${demoDevice === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', flex: 1 }}
              >
                Desktop
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Resolved Destination:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {demoDevice === 'ios' && 'https://apps.apple.com/app/kissurl/id123456789'}
                {demoDevice === 'android' && 'https://play.google.com/store/apps/details?id=dev.kissurl'}
                {demoDevice === 'desktop' && 'https://kissurl.dev/download'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: QR Code Generator */}
      {activeTab === 'qr' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              High-resolution vector QR codes
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Generate crisp QR codes for packaging, posters, conference presentations, and merchandise. Export as infinite-resolution SVG or high-res PNG.
            </p>

            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span className="badge">SVG Vector</span>
              <span className="badge">High Error Correction</span>
              <span className="badge">Custom Colors</span>
            </div>

            <button onClick={onOpenCreateModal} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
              Create Branded QR Code <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-subtle)', marginBottom: '0.75rem' }}>
              <div style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#09090b' }}>
                <QrCode size={130} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Crisp vector format ready for print & digital media
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Click Analytics */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Real-Time Click Tracking
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              See live click totals, top referrers (Twitter, LinkedIn, Direct), device breakdowns, and countries without tracking delays.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Privacy-First & Cookie-Free
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Track engagement without invasive cookies, GDPR banners, or user fingerprinting. Your visitors' privacy is preserved.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
