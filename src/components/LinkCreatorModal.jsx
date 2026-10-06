import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  Shield, 
  Link as LinkIcon, 
  Wand2, 
  BarChart2, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Shuffle, 
  Globe, 
  Target, 
  Plus, 
  Trash2 
} from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';
import confetti from 'canvas-confetti';
import { auditUrlSafety } from '../services/storageService';

const SAMPLE_SLUGS = ['launch', 'special', 'early-access', 'promo', 'newsletter', 'event'];

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States (US)' },
  { code: 'GB', name: 'United Kingdom (UK)' },
  { code: 'DE', name: 'Germany (DE)' },
  { code: 'IN', name: 'India (IN)' },
  { code: 'CA', name: 'Canada (CA)' },
  { code: 'AU', name: 'Australia (AU)' },
  { code: 'FR', name: 'France (FR)' },
  { code: 'JP', name: 'Japan (JP)' },
  { code: 'BR', name: 'Brazil (BR)' },
  { code: 'SG', name: 'Singapore (SG)' }
];

export default function LinkCreatorModal({ isOpen, onClose, onLinkCreated, initialData }) {
  const [activeTab, setActiveTab] = useState('general'); // general | social | routing | split | geo | pixels | protection | utm

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

  // Phase 2: A/B Split Testing
  const [splitEnabled, setSplitEnabled] = useState(initialData?.splitTesting?.enabled ?? false);
  const [variants, setVariants] = useState(initialData?.splitTesting?.variants || [
    { id: 'v_1', name: 'Variant A', url: '', weight: 50 },
    { id: 'v_2', name: 'Variant B', url: '', weight: 50 },
  ]);

  // Phase 2: Geo Routing
  const [geoEnabled, setGeoEnabled] = useState(initialData?.geoRouting?.enabled ?? false);
  const [geoRules, setGeoRules] = useState(initialData?.geoRouting?.rules || [
    { id: 'g_1', country: 'US', url: '' }
  ]);

  // Phase 2: Retargeting Pixels
  const [metaPixelId, setMetaPixelId] = useState(initialData?.pixels?.metaPixelId || '');
  const [gaMeasurementId, setGaMeasurementId] = useState(initialData?.pixels?.gaMeasurementId || '');
  const [tiktokPixelId, setTiktokPixelId] = useState(initialData?.pixels?.tiktokPixelId || '');
  const [linkedinTagId, setLinkedinTagId] = useState(initialData?.pixels?.linkedinTagId || '');

  // Protection & Expiration
  const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.protection?.isPasswordProtected ?? false);
  const [password, setPassword] = useState(initialData?.protection?.password || '');
  const [expiresAt, setExpiresAt] = useState(initialData?.protection?.expiresAt || '');
  const [maxClicks, setMaxClicks] = useState(initialData?.protection?.maxClicks || 0);
  const [fallbackUrl, setFallbackUrl] = useState(initialData?.protection?.fallbackUrl || '');

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
      splitTesting: {
        enabled: splitEnabled,
        variants: variants.map(v => ({
          ...v,
          url: v.url.trim().startsWith('http') ? v.url.trim() : (v.url.trim() ? `https://${v.url.trim()}` : ''),
          weight: Number(v.weight) || 0,
          clicks: v.clicks || 0
        })).filter(v => v.url)
      },
      geoRouting: {
        enabled: geoEnabled,
        rules: geoRules.map(r => ({
          ...r,
          url: r.url.trim().startsWith('http') ? r.url.trim() : (r.url.trim() ? `https://${r.url.trim()}` : '')
        })).filter(r => r.url)
      },
      pixels: {
        metaPixelId: metaPixelId.trim(),
        gaMeasurementId: gaMeasurementId.trim(),
        tiktokPixelId: tiktokPixelId.trim(),
        linkedinTagId: linkedinTagId.trim(),
      },
      protection: {
        isPasswordProtected,
        password: password.trim(),
        expiresAt,
        maxClicks: Number(maxClicks) || 0,
        fallbackUrl: fallbackUrl.trim(),
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
            <Sparkles size={13} /> Social
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`btn ${activeTab === 'routing' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Smartphone size={13} /> Devices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`btn ${activeTab === 'split' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Shuffle size={13} /> A/B Split
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('geo')}
            className={`btn ${activeTab === 'geo' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Globe size={13} /> Geo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pixels')}
            className={`btn ${activeTab === 'pixels' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            <Target size={13} /> Pixels
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
            <BarChart2 size={13} /> UTM
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
                      Destination URL *
                    </label>
                    {targetUrl && (
                      <span 
                        style={{ 
                          fontSize: '0.725rem', 
                          fontWeight: '600', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          color: auditUrlSafety(targetUrl).color 
                        }}
                      >
                        {auditUrlSafety(targetUrl).status === 'safe' && <ShieldCheck size={13} />}
                        {auditUrlSafety(targetUrl).status === 'warning' && <AlertTriangle size={13} />}
                        {auditUrlSafety(targetUrl).status === 'critical' && <ShieldAlert size={13} />}
                        {auditUrlSafety(targetUrl).label} ({auditUrlSafety(targetUrl).score}/100)
                      </span>
                    )}
                  </div>
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

            {/* A/B SPLIT TESTING TAB */}
            {activeTab === 'split' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={splitEnabled}
                    onChange={(e) => setSplitEnabled(e.target.checked)}
                  />
                  <span>Enable A/B Split Traffic Testing</span>
                </label>

                {splitEnabled && (
                  <>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Distribute visitor traffic across multiple landing page variants based on weight percentages.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {variants.map((v, index) => (
                        <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 80px 32px', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <input
                            type="text"
                            placeholder="Variant Name"
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[index].name = e.target.value;
                              setVariants(updated);
                            }}
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                          />
                          <input
                            type="url"
                            placeholder="https://variant-destination.com"
                            value={v.url}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[index].url = e.target.value;
                              setVariants(updated);
                            }}
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={v.weight}
                              onChange={(e) => {
                                const updated = [...variants];
                                updated[index].weight = Number(e.target.value);
                                setVariants(updated);
                              }}
                              className="input tabular-nums"
                              style={{ fontSize: '0.8rem', textAlign: 'center', padding: '0.35rem 0.2rem' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>%</span>
                          </div>
                          {variants.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                              className="btn-icon"
                              style={{ width: '28px', height: '28px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {variants.length < 5 && (
                      <button
                        type="button"
                        onClick={() => setVariants([...variants, { id: 'v_' + Date.now(), name: `Variant ${String.fromCharCode(65 + variants.length)}`, url: '', weight: 25 }])}
                        className="btn btn-secondary"
                        style={{ alignSelf: 'flex-start', fontSize: '0.785rem' }}
                      >
                        <Plus size={13} /> Add Variant
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* GEO ROUTING TAB */}
            {activeTab === 'geo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={geoEnabled}
                    onChange={(e) => setGeoEnabled(e.target.checked)}
                  />
                  <span>Enable Location (Geo-Targeted) Redirects</span>
                </label>

                {geoEnabled && (
                  <>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Route visitors to dedicated country URLs based on their geographic region.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {geoRules.map((rule, idx) => (
                        <div key={rule.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 32px', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          <select
                            value={rule.country}
                            onChange={(e) => {
                              const updated = [...geoRules];
                              updated[idx].country = e.target.value;
                              setGeoRules(updated);
                            }}
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                          >
                            {COUNTRY_OPTIONS.map(c => (
                              <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                          </select>

                          <input
                            type="url"
                            placeholder="https://country-specific-page.com"
                            value={rule.url}
                            onChange={(e) => {
                              const updated = [...geoRules];
                              updated[idx].url = e.target.value;
                              setGeoRules(updated);
                            }}
                            className="input"
                            style={{ fontSize: '0.8rem' }}
                          />

                          <button
                            type="button"
                            onClick={() => setGeoRules(geoRules.filter((_, i) => i !== idx))}
                            className="btn-icon"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setGeoRules([...geoRules, { id: 'g_' + Date.now(), country: 'GB', url: '' }])}
                      className="btn btn-secondary"
                      style={{ alignSelf: 'flex-start', fontSize: '0.785rem' }}
                    >
                      <Plus size={13} /> Add Country Rule
                    </button>
                  </>
                )}
              </div>
            )}

            {/* RETARGETING PIXELS TAB */}
            {activeTab === 'pixels' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  Attach advertising tracking pixels to fire retargeting events when visitors click this short link.
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Meta (Facebook & Instagram) Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123456789012345"
                    value={metaPixelId}
                    onChange={(e) => setMetaPixelId(e.target.value)}
                    className="input input-mono"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. G-XXXXXXXXXX"
                    value={gaMeasurementId}
                    onChange={(e) => setGaMeasurementId(e.target.value)}
                    className="input input-mono"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    TikTok Pixel ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. C5XXXXXXXXXXXX"
                    value={tiktokPixelId}
                    onChange={(e) => setTiktokPixelId(e.target.value)}
                    className="input input-mono"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    LinkedIn Insight Tag Partner ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567"
                    value={linkedinTagId}
                    onChange={(e) => setLinkedinTagId(e.target.value)}
                    className="input input-mono"
                  />
                </div>
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Custom Expired / Inactive Fallback URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourbrand.com/expired-campaign"
                    value={fallbackUrl}
                    onChange={(e) => setFallbackUrl(e.target.value)}
                    className="input"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Visitors will be automatically routed here instead of seeing the default expired error page.
                  </p>
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
