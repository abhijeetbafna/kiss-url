import React, { useState } from 'react';
import { X, Sparkles, Globe, Smartphone, Shield, Tag, Link as LinkIcon, RefreshCw, Wand2, BarChart2 } from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';
import confetti from 'canvas-confetti';

const SAMPLE_SLUGS = ['boost', 'vip-pass', 'summer-drop', 'dev-beta', 'growth', 'special-offer'];

export default function LinkCreatorModal({ isOpen, onClose, onLinkCreated, initialData }) {
  const [activeTab, setActiveTab] = useState('general'); // general | social | routing | protection | utm

  // Form states
  const [targetUrl, setTargetUrl] = useState(initialData?.targetUrl || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [domain, setDomain] = useState(initialData?.domain || 'pulse.link');
  const [title, setTitle] = useState(initialData?.title || '');
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(', ') : '');

  // Social OG
  const [ogEnabled, setOgEnabled] = useState(initialData?.socialOg?.enabled ?? false);
  const [ogTitle, setOgTitle] = useState(initialData?.socialOg?.title || '');
  const [ogDesc, setOgDesc] = useState(initialData?.socialOg?.description || '');
  const [ogImage, setOgImage] = useState(initialData?.socialOg?.imageUrl || '');

  // Device Routing
  const [routingEnabled, setRoutingEnabled] = useState(initialData?.routing?.enabled ?? false);
  const [iosUrl, setIosUrl] = useState(initialData?.routing?.iosUrl || '');
  const [androidUrl, setAndroidUrl] = useState(initialData?.routing?.androidUrl || '');
  const [desktopUrl, setDesktopUrl] = useState(initialData?.routing?.desktopUrl || '');

  // Protection & Expiration
  const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.protection?.isPasswordProtected ?? false);
  const [password, setPassword] = useState(initialData?.protection?.password || '');
  const [expiresAt, setExpiresAt] = useState(initialData?.protection?.expiresAt || '');
  const [maxClicks, setMaxClicks] = useState(initialData?.protection?.maxClicks || 0);

  // UTM parameters
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  if (!isOpen) return null;

  const generateRandomSlug = () => {
    const randomWord = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSlug(`${randomWord}-${randomNum}`);
  };

  const handleApplyUTM = () => {
    if (!targetUrl) return;
    try {
      const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      if (utmSource) parsed.searchParams.set('utm_source', utmSource);
      if (utmMedium) parsed.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) parsed.searchParams.set('utm_campaign', utmCampaign);
      setTargetUrl(parsed.toString());
      setActiveTab('general');
    } catch (e) {
      alert('Please enter a valid URL in General settings first.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = Math.random().toString(36).substring(2, 8);
    }

    const newLinkData = {
      targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
      slug: finalSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      domain,
      title: title.trim() || targetUrl,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      socialOg: {
        enabled: ogEnabled,
        title: ogTitle,
        description: ogDesc,
        imageUrl: ogImage,
      },
      routing: {
        enabled: routingEnabled,
        iosUrl: iosUrl.trim(),
        androidUrl: androidUrl.trim(),
        desktopUrl: desktopUrl.trim(),
      },
      protection: {
        isPasswordProtected,
        password: password.trim(),
        expiresAt,
        maxClicks: Number(maxClicks) || 0,
      }
    };

    onLinkCreated(newLinkData);
    
    // Celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel modal-content" 
        style={{ width: '100%', maxWidth: '780px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">
            <Sparkles size={12} /> Studio Link Creator
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
          Create Next-Gen Smart Link
        </h2>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`btn-ghost ${activeTab === 'general' ? 'badge-indigo' : ''}`}
            style={{ borderRadius: '6px', fontSize: '0.875rem' }}
          >
            <LinkIcon size={15} /> General Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`btn-ghost ${activeTab === 'social' ? 'badge-purple' : ''}`}
            style={{ borderRadius: '6px', fontSize: '0.875rem' }}
          >
            <Sparkles size={15} /> Social Card Studio {ogEnabled && '●'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`btn-ghost ${activeTab === 'routing' ? 'badge-cyan' : ''}`}
            style={{ borderRadius: '6px', fontSize: '0.875rem' }}
          >
            <Smartphone size={15} /> Device Routing {routingEnabled && '●'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protection')}
            className={`btn-ghost ${activeTab === 'protection' ? 'badge-amber' : ''}`}
            style={{ borderRadius: '6px', fontSize: '0.875rem' }}
          >
            <Shield size={15} /> Security & Expiry {(isPasswordProtected || expiresAt || maxClicks > 0) && '●'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('utm')}
            className={`btn-ghost ${activeTab === 'utm' ? 'badge-emerald' : ''}`}
            style={{ borderRadius: '6px', fontSize: '0.875rem' }}
          >
            <BarChart2 size={15} /> UTM Builder
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Destination URL <span style={{ color: 'var(--accent-rose)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/your-long-url-campaign"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="input-field"
                  autoFocus
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                    Branded Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="input-field"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="pulse.link">pulse.link (Default)</option>
                    <option value="go.bio">go.bio (Creator bio)</option>
                    <option value="click.to">click.to (Speed shortener)</option>
                    <option value="app.custom.io">app.custom.io (Custom CNAME)</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      Custom Alias (Slug)
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomSlug}
                      className="btn-ghost"
                      style={{ padding: '0 4px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}
                    >
                      <Wand2 size={12} /> Auto-generate
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="e.g. secret-beta"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="input-field"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                    Internal Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Product Hunt Launch Q3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Launch, Marketing, Mobile"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL CARD STUDIO */}
          {activeTab === 'social' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: 'rgba(168, 85, 247, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#c084fc' }}>Enable Custom Social Preview (OG Tags)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Control exactly how Twitter, LinkedIn, WhatsApp & Slack display this link.</div>
                </div>
                <input
                  type="checkbox"
                  checked={ogEnabled}
                  onChange={(e) => setOgEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#a855f7', cursor: 'pointer' }}
                />
              </div>

              {ogEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                        Social Card Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Exclusive 50% Off Early Access"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                        Social Image URL (1200x630 recommended)
                      </label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      Social Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Catchy teaser to boost click-through rate when shared on social channels."
                      value={ogDesc}
                      onChange={(e) => setOgDesc(e.target.value)}
                      className="input-field"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  {/* Live Multi-Platform Card Preview */}
                  <SocialCardPreview
                    title={ogTitle || title}
                    description={ogDesc}
                    imageUrl={ogImage}
                    destinationUrl={targetUrl}
                    slug={slug}
                    domain={domain}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SMART ROUTING */}
          {activeTab === 'routing' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', background: 'rgba(6, 182, 212, 0.08)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#22d3ee' }}>Smart Device Deep-Linking</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Route mobile visitors straight to their native App Store or deep link.</div>
                </div>
                <input
                  type="checkbox"
                  checked={routingEnabled}
                  onChange={(e) => setRoutingEnabled(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#06b6d4', cursor: 'pointer' }}
                />
              </div>

              {routingEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      🍎 iOS Destination (Apple App Store / TestFlight URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://apps.apple.com/app/your-app/id123456789"
                      value={iosUrl}
                      onChange={(e) => setIosUrl(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      🤖 Android Destination (Google Play Store URL)
                    </label>
                    <input
                      type="text"
                      placeholder="https://play.google.com/store/apps/details?id=com.yourapp"
                      value={androidUrl}
                      onChange={(e) => setAndroidUrl(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                      💻 Desktop & Fallback URL
                    </label>
                    <input
                      type="text"
                      placeholder={targetUrl || 'https://yourwebsite.com/download'}
                      value={desktopUrl}
                      onChange={(e) => setDesktopUrl(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SECURITY & EXPIRATION */}
          {activeTab === 'protection' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Password Protection */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>🔒 Password Protection Gate</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visitors must enter a passcode to access the destination.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPasswordProtected}
                    onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#f59e0b', cursor: 'pointer' }}
                  />
                </div>
                {isPasswordProtected && (
                  <input
                    type="text"
                    placeholder="Enter secret passcode..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                )}
              </div>

              {/* Expiration Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    ⏳ Expire by Date & Time
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Link self-destructs after deadline.</p>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input-field"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                    🔥 Burn-After-Clicks Limit
                  </label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Expire after N total visits (0 = unlimited).</p>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    value={maxClicks || ''}
                    onChange={(e) => setMaxClicks(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: UTM BUILDER */}
          {activeTab === 'utm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Attach industry standard UTM tags to track conversion campaigns in Google Analytics, Mixpanel, and PostHog.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                    UTM Source (e.g. twitter, newsletter, youtube)
                  </label>
                  <input
                    type="text"
                    placeholder="twitter"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                    UTM Medium (e.g. social, cpc, email, qr)
                  </label>
                  <input
                    type="text"
                    placeholder="social"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem', color: 'var(--text-muted)' }}>
                  UTM Campaign Name (e.g. black_friday_2026, product_launch)
                </label>
                <input
                  type="text"
                  placeholder="launch_promo"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="input-field"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyUTM}
                className="btn-secondary"
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
              >
                Apply UTM Parameters to Target URL
              </button>
            </div>
          )}

          {/* Footer Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Create Smart Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
