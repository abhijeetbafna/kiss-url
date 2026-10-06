import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  Check, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  ExternalLink,
  Code2,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { getWorkspacePixelsSettings, saveWorkspacePixelsSettings } from '../services/storageService';
import confetti from 'canvas-confetti';

const PIXEL_PRESETS = [
  {
    id: 'meta',
    name: 'Meta (Facebook) Pixel',
    icon: '🔵',
    field: 'metaPixelId',
    placeholder: 'e.g. 123456789012345',
    description: 'Tracks pageviews, custom conversions, and builds custom audiences on Facebook & Instagram.'
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4 / GTM',
    icon: '📊',
    field: 'gaMeasurementId',
    placeholder: 'e.g. G-ABC123XYZ or GTM-XXXXXX',
    description: 'Sends real-time measurement events and UTM campaign attribution to GA4.'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads Pixel',
    icon: '🎵',
    field: 'tiktokPixelId',
    placeholder: 'e.g. C5L90G3Q6XXXXX',
    description: 'Optimizes TikTok ad delivery and measures visitor engagement across campaigns.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Insight Tag',
    icon: '💼',
    field: 'linkedinPartnerId',
    placeholder: 'e.g. 9876543',
    description: 'Enables B2B website demographics and conversion tracking on LinkedIn.'
  },
  {
    id: 'twitter',
    name: 'Twitter / X Ads Pixel',
    icon: '𝕏',
    field: 'twitterPixelId',
    placeholder: 'e.g. o7x9a',
    description: 'Tracks conversions and tailors audience segments on X Ads Manager.'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Tag',
    icon: '📌',
    field: 'pinterestTagId',
    placeholder: 'e.g. 2612345678901',
    description: 'Tracks conversions and builds high-intent audiences on Pinterest.'
  }
];

export default function PixelManagerModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('pixels'); // pixels | custom | simulator
  const [settings, setSettings] = useState(() => getWorkspacePixelsSettings());
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Simulator state
  const [simulatedEvent, setSimulatedEvent] = useState('PageView');
  const [simulatorLogs, setSimulatorLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getWorkspacePixelsSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    await saveWorkspacePixelsSettings(settings);
    setIsSaving(false);
    setSaved(true);
    confetti({ particleCount: 35, spread: 40, origin: { y: 0.6 } });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleRunSimulation = () => {
    setSimulating(true);
    const logs = [];
    const timestamp = new Date().toLocaleTimeString();

    logs.push(`[${timestamp}] 🚀 Initializing KissURL Tracking & Retargeting Engine...`);

    let activeCount = 0;

    if (settings.metaPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ Meta Pixel (${settings.metaPixelId}): fbq('track', '${simulatedEvent}', { source: 'kiss_url', url: window.location.href })`);
    }

    if (settings.gaMeasurementId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ Google Analytics 4 (${settings.gaMeasurementId}): gtag('event', '${simulatedEvent.toLowerCase()}', { send_to: '${settings.gaMeasurementId}' })`);
    }

    if (settings.tiktokPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ TikTok Pixel (${settings.tiktokPixelId}): ttq.track('${simulatedEvent}')`);
    }

    if (settings.linkedinPartnerId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ LinkedIn Insight Tag (Partner ID: ${settings.linkedinPartnerId}): lintrk('track', { conversion_id: '${simulatedEvent}' })`);
    }

    if (settings.twitterPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ X / Twitter Pixel (${settings.twitterPixelId}): twq('event', '${simulatedEvent}')`);
    }

    if (settings.pinterestTagId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ✅ Pinterest Tag (${settings.pinterestTagId}): pintrk('track', '${simulatedEvent}')`);
    }

    if (settings.customHeadScript?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] ⚡ Custom Head Script injected into DOM context.`);
    }

    if (activeCount === 0) {
      logs.push(`[${timestamp}] ⚠️ No active pixels configured. Enter a Pixel ID in the 'Tracking Pixels' tab to begin.`);
    } else {
      logs.push(`[${timestamp}] 🎉 Fired ${activeCount} tracking tags successfully!`);
    }

    setSimulatorLogs(logs);
    setSimulating(false);
  };

  const configuredCount = PIXEL_PRESETS.filter(p => !!settings[p.field]?.trim()).length + (settings.customHeadScript?.trim() ? 1 : 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Target size={18} /> Retargeting Pixels & Tracking Tags
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage ad retargeting pixels and conversion tags across all workspace links.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.4rem', backgroundColor: 'var(--bg-subtle)', flexShrink: 0 }}>
          <button
            onClick={() => setActiveTab('pixels')}
            className="tab-btn"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.825rem',
              fontWeight: '600',
              borderBottom: activeTab === 'pixels' ? '2px solid var(--primary-bg)' : '2px solid transparent',
              color: activeTab === 'pixels' ? 'var(--text-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Target size={13} /> Tracking Pixels <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 5px' }}>{configuredCount}</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className="tab-btn"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.825rem',
              fontWeight: '600',
              borderBottom: activeTab === 'custom' ? '2px solid var(--primary-bg)' : '2px solid transparent',
              color: activeTab === 'custom' ? 'var(--text-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Code2 size={13} /> Custom Script Tag
          </button>
          <button
            onClick={() => {
              setActiveTab('simulator');
              if (simulatorLogs.length === 0) handleRunSimulation();
            }}
            className="tab-btn"
            style={{
              padding: '0.75rem 1rem',
              fontSize: '0.825rem',
              fontWeight: '600',
              borderBottom: activeTab === 'simulator' ? '2px solid var(--primary-bg)' : '2px solid transparent',
              color: activeTab === 'simulator' ? 'var(--text-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Play size={13} /> Event Simulator
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'pixels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '0.75rem 0.9rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                💡 <strong>Global Workspace Defaults</strong>: Pixels configured here will automatically be injected into all shortened links in this workspace, enabling instant retargeting on ad platforms.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                {PIXEL_PRESETS.map((p) => {
                  const isConfigured = !!settings[p.field]?.trim();
                  return (
                    <div 
                      key={p.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: `1px solid ${isConfigured ? 'var(--border-strong)' : 'var(--border-default)'}`,
                        transition: 'border-color var(--duration-fast) var(--ease-out)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {p.name}
                          </span>
                        </div>
                        {isConfigured && (
                          <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            <CheckCircle2 size={11} /> Active
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {p.description}
                      </p>
                      <input
                        type="text"
                        placeholder={p.placeholder}
                        value={settings[p.field] || ''}
                        onChange={(e) => setSettings({ ...settings, [p.field]: e.target.value })}
                        className="input input-mono"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, padding: '0.75rem 0.9rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                ⚡ <strong>Custom Analytics Script</strong>: Inject raw tracking scripts (e.g. PostHog, Plausible, Mixpanel, Segment, or Hotjar) directly before redirection.
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Raw &lt;script&gt; Tag or JavaScript Snippet
                </label>
                <textarea
                  rows={8}
                  placeholder={`<script>\n  // Example: PostHog / Plausible custom event\n  window.analytics && window.analytics.track('Link Clicked');\n</script>`}
                  value={settings.customHeadScript || ''}
                  onChange={(e) => setSettings({ ...settings, customHeadScript: e.target.value })}
                  className="input input-mono"
                  style={{ fontSize: '0.8rem', lineHeight: 1.5 }}
                />
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Test Event:
                  </label>
                  <select 
                    value={simulatedEvent} 
                    onChange={(e) => setSimulatedEvent(e.target.value)}
                    className="input"
                    style={{ width: '140px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                  >
                    <option value="PageView">PageView</option>
                    <option value="Lead">Lead</option>
                    <option value="ViewContent">ViewContent</option>
                    <option value="InitiateCheckout">InitiateCheckout</option>
                    <option value="Purchase">Purchase</option>
                  </select>
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  <RefreshCw size={13} className={simulating ? 'pulse-indicator' : ''} /> Fire Test Event
                </button>
              </div>

              {/* Console Output Window */}
              <div style={{
                backgroundColor: '#09090b',
                color: '#22c55e',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.785rem',
                minHeight: '220px',
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #27272a'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid #27272a', paddingBottom: '0.4rem', marginBottom: '0.65rem', color: '#a1a1aa' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem' }}>Console Dispatcher Debugger</span>
                </div>

                {simulatorLogs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.4 }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
            Close
          </button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn btn-primary" 
            style={{ fontSize: '0.825rem', padding: '0.4rem 0.9rem' }}
          >
            {saved ? (
              <>
                <Check size={14} /> Pixels Saved!
              </>
            ) : (
              isSaving ? 'Saving...' : 'Save Workspace Pixels'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
