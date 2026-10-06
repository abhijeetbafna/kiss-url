import React, { useState, useEffect } from 'react';
import { X, Sparkles, Smartphone, Shield, Link as LinkIcon, Wand2, BarChart2 } from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';
import confetti from 'canvas-confetti';

const SAMPLE_SLUGS = ['launch', 'special', 'early-access', 'promo', 'newsletter', 'event'];

export default function LinkCreatorModal({ isOpen, onClose, onLinkCreated, initialData }) {
  const [activeTab, setActiveTab] = useState('general'); // general | social | routing | protection | utm

  // Form states
  const [targetUrl, setTargetUrl] = useState(initialData?.targetUrl || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [domain, setDomain] = useState(initialData?.domain || 'kiss.url');
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      alert('Please enter a valid URL in General tab first.');
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

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '680px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {initialData ? 'Edit Short Link' : 'Create Custom Short Link'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure destination, custom social previews, and routing rules.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.25rem', 
          padding: '0.5rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          overflowX: 'auto'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <LinkIcon size={13} /> General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`btn ${activeTab === 'social' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Sparkles size={13} /> Social Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`btn ${activeTab === 'routing' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Smartphone size={13} /> Device Routing
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protection')}
            className={`btn ${activeTab === 'protection' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Shield size={13} /> Protection
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('utm')}
            className={`btn ${activeTab === 'utm' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <BarChart2 size={13} /> UTM Builder
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Destination URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://yourbrand.com/special-page"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.4fr)', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                      Domain
                    </label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="input"
                    >
                      <option value="kiss.url">kiss.url</option>
                      <option value="go.bio">go.bio</option>
                      <option value="click.to">click.to</option>
                      <option value="link.page">link.page</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                        Custom Alias
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomSlug}
                        className="btn-ghost"
                        style={{ padding: '0 4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      >
                        <Wand2 size={11} /> Auto-slug
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. vip-2026"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="input input-mono"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Title / Note (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 Marketing Campaign Link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="marketing, twitter, promo"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* SOCIAL TAB */}
            {activeTab === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={ogEnabled}
                    onChange={(e) => setOgEnabled(e.target.checked)}
                  />
                  <span>Enable Custom Social Preview (OpenGraph)</span>
                </label>

                {ogEnabled && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Preview Card Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Exclusive Early Access"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Preview Card Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Join the waitlist and get direct access."
                        value={ogDesc}
                        onChange={(e) => setOgDesc(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Preview Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://yourbrand.com/banner.png"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Live Card Preview
                      </div>
                      <SocialCardPreview
                        title={ogTitle || 'Your Title'}
                        description={ogDesc || 'Your Description'}
                        imageUrl={ogImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
                        destinationUrl={targetUrl || 'https://yourbrand.com'}
                        slug={slug || 'link'}
                        domain={domain}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ROUTING TAB */}
            {activeTab === 'routing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={routingEnabled}
                    onChange={(e) => setRoutingEnabled(e.target.checked)}
                  />
                  <span>Enable Smart Device Routing</span>
                </label>

                {routingEnabled && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Apple iPhone (iOS) App Store URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://apps.apple.com/app/id12345"
                        value={iosUrl}
                        onChange={(e) => setIosUrl(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Android Google Play Store URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://play.google.com/store/apps/details?id=com.app"
                        value={androidUrl}
                        onChange={(e) => setAndroidUrl(e.target.value)}
                        className="input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Desktop Web Fallback URL (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Leave empty to use main Destination URL"
                        value={desktopUrl}
                        onChange={(e) => setDesktopUrl(e.target.value)}
                        className="input"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* PROTECTION TAB */}
            {activeTab === 'protection' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', marginBottom: '0.3rem' }}>
                    <input
                      type="checkbox"
                      checked={isPasswordProtected}
                      onChange={(e) => setIsPasswordProtected(e.target.checked)}
                    />
                    <span>Passcode Gate</span>
                  </label>
                  {isPasswordProtected && (
                    <input
                      type="text"
                      placeholder="Enter secret passcode..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input input-mono"
                    />
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Expiration Date & Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Maximum Click Limit (Burn after N clicks)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 for unlimited"
                    value={maxClicks || ''}
                    onChange={(e) => setMaxClicks(e.target.value)}
                    className="input tabular-nums"
                  />
                </div>
              </div>
            )}

            {/* UTM TAB */}
            {activeTab === 'utm' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Attach UTM marketing tags to your destination URL.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Campaign Source (utm_source)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. twitter, newsletter, linkedin"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Campaign Medium (utm_medium)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. social, email, banner"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Campaign Name (utm_campaign)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. summer_launch_2026"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="input"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleApplyUTM}
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Apply to Destination URL
                </button>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem'
          }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Create Short Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
