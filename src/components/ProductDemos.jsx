import React, { useState } from 'react';
import { Sparkles, Smartphone, QrCode, BarChart2, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';

export default function ProductDemos({ onOpenCreateModal }) {
  const [activeTab, setActiveTab] = useState('social'); // social | routing | qr | analytics

  // Demo Social States
  const [demoTitle, setDemoTitle] = useState('Exclusive Product Launch & Early Access');
  const [demoDesc, setDemoDesc] = useState('Get early access to our lightning-fast, zero-cost developer tools.');
  const [demoImage, setDemoImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80');

  // Demo Routing State
  const [demoDevice, setDemoDevice] = useState('ios');

  return (
    <section 
      id="demos-section" 
      className="card-surface" 
      style={{ 
        padding: '2.5rem 2rem', 
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--color-bg-surface)'
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={12} /> Interactive Capabilities
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Features Legacy Shorteners Charge $35/Mo For
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '580px', marginInline: 'auto' }}>
            Test drive our built-in tools right in your browser. All included out of the box with zero subscriptions.
          </p>
        </div>

        {/* Demo Selector Tabs */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginBottom: '1.75rem', 
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem'
        }}>
          <button
            onClick={() => setActiveTab('social')}
            className={`btn-ghost ${activeTab === 'social' ? 'badge-purple' : ''}`}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
          >
            <Sparkles size={15} /> 1. Dynamic Social Card Studio
          </button>
          <button
            onClick={() => setActiveTab('routing')}
            className={`btn-ghost ${activeTab === 'routing' ? 'badge-emerald' : ''}`}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
          >
            <Smartphone size={15} /> 2. Smart Device Routing
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`btn-ghost ${activeTab === 'qr' ? 'badge-indigo' : ''}`}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
          >
            <QrCode size={15} /> 3. Studio Vector QR Designer
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn-ghost ${activeTab === 'analytics' ? 'badge-amber' : ''}`}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
          >
            <BarChart2 size={15} /> 4. Edge Speed & Privacy
          </button>
        </div>

        {/* TAB 1: SOCIAL CARD STUDIO DEMO */}
        {activeTab === 'social' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)', gap: '1.75rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Total Control Over Social Link Previews
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Stop settling for broken or generic social thumbnails. KissURL intercepts crawler bots (TwitterBot, SlackBot, LinkedInBot) and renders custom OpenGraph meta tags on the fly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={demoTitle}
                    onChange={(e) => setDemoTitle(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    Card Description
                  </label>
                  <input
                    type="text"
                    value={demoDesc}
                    onChange={(e) => setDemoDesc(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <button onClick={onOpenCreateModal} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Create Custom Card Link <ArrowRight size={14} />
              </button>
            </div>

            {/* Live Social Preview Container */}
            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <SocialCardPreview
                title={demoTitle}
                description={demoDesc}
                imageUrl={demoImage}
                destinationUrl="https://github.com/topics/modern-web"
                slug="launch-pass"
                domain="kiss.url"
              />
            </div>
          </div>
        )}

        {/* TAB 2: SMART DEVICE ROUTING DEMO */}
        {activeTab === 'routing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)', gap: '1.75rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                1 Link. 3 Automatic Destinations.
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Don't make mobile visitors hunt for App Store or Google Play buttons. Our edge worker detects the visitor's User-Agent in under 5ms and sends them straight into the native app.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-indigo">🍎 Apple iOS</span>
                  <span>➔ Redirects directly to Apple App Store</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-emerald">🤖 Android</span>
                  <span>➔ Redirects directly to Google Play Store</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-amber">💻 Desktop</span>
                  <span>➔ Renders your full web application</span>
                </div>
              </div>

              <button onClick={onOpenCreateModal} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Set Up Smart Route <ArrowRight size={14} />
              </button>
            </div>

            {/* Interactive Device Selector Simulator */}
            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Select Visitor Device to Test Resolution:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => setDemoDevice('ios')}
                  className={`btn-ghost ${demoDevice === 'ios' ? 'badge-indigo' : ''}`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  iPhone (iOS)
                </button>
                <button
                  onClick={() => setDemoDevice('android')}
                  className={`btn-ghost ${demoDevice === 'android' ? 'badge-emerald' : ''}`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Android Phone
                </button>
                <button
                  onClick={() => setDemoDevice('desktop')}
                  className={`btn-ghost ${demoDevice === 'desktop' ? 'badge-amber' : ''}`}
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Mac / Windows PC
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--color-bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-strong)' }}>
                <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase' }}>
                  HTTP 302 Edge Decision (&lt;12ms):
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-text-primary)', marginTop: '0.35rem', wordBreak: 'break-all' }}>
                  {demoDevice === 'ios' && 'https://apps.apple.com/app/kissurl/id123456789'}
                  {demoDevice === 'android' && 'https://play.google.com/store/apps/details?id=dev.kissurl'}
                  {demoDevice === 'desktop' && 'https://kissurl.dev/download'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QR STUDIO DEMO */}
        {activeTab === 'qr' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.2fr)', gap: '1.75rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Studio-Grade Vector QR Codes (SVG & PNG)
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Generate high-resolution, branded QR codes for physical merchandise, conference slides, packaging, and print media. Export infinitely scalable vector SVGs with 30% error correction.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">✓ Vector SVG Export</span>
                <span className="badge badge-indigo">✓ 30% Error Correction (High)</span>
                <span className="badge badge-purple">✓ Custom Brand Palettes</span>
              </div>

              <button onClick={onOpenCreateModal} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Generate Branded QR Code <ArrowRight size={14} />
              </button>
            </div>

            {/* Static QR illustration preview */}
            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-md)', marginBottom: '0.75rem' }}>
                <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', borderRadius: '8px', color: 'var(--color-accent)' }}>
                  <QrCode size={130} />
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Vector SVG ready for billboards, merchandise & print
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EDGE SPEED & PRIVACY */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <Zap size={28} color="#059669" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Sub-15ms Global Edge Latency
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Redirects happen directly on Cloudflare’s 300+ global edge locations before touching a central server. Zero tracking delay, 0ms cold starts, and 100,000 requests/day 100% free.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
              <ShieldCheck size={28} color="var(--color-accent)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.35rem' }}>
                Zero-Cookie GDPR Compliant Analytics
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Track real-time click volumes, geographic heatmaps, top referrers, and device types without invasive cookie banners or privacy compliance friction.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
