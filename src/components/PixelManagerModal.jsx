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
  CheckCircle2,
  Layers,
  BarChart2,
  Music,
  Briefcase,
  Share2,
  Pin,
  Info,
  Terminal,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { getWorkspacePixelsSettings, saveWorkspacePixelsSettings } from '../services/storageService';
import confetti from 'canvas-confetti';

const PIXEL_PRESETS = [
  {
    id: 'meta',
    name: 'Meta (Facebook) Pixel',
    Icon: Target,
    iconColor: '#3b82f6',
    field: 'metaPixelId',
    placeholder: 'e.g. 123456789012345',
    description: 'Tracks pageviews, custom conversions, and builds custom audiences on Facebook & Instagram.'
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4 / GTM',
    Icon: BarChart2,
    iconColor: '#f59e0b',
    field: 'gaMeasurementId',
    placeholder: 'e.g. G-ABC123XYZ or GTM-XXXXXX',
    description: 'Sends real-time measurement events and UTM campaign attribution to GA4.'
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads Pixel',
    Icon: Music,
    iconColor: '#ec4899',
    field: 'tiktokPixelId',
    placeholder: 'e.g. C5L90G3Q6XXXXX',
    description: 'Optimizes TikTok ad delivery and measures visitor engagement across campaigns.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Insight Tag',
    Icon: Briefcase,
    iconColor: '#0ea5e9',
    field: 'linkedinPartnerId',
    placeholder: 'e.g. 9876543',
    description: 'Enables B2B website demographics and conversion tracking on LinkedIn.'
  },
  {
    id: 'twitter',
    name: 'Twitter / X Ads Pixel',
    Icon: Share2,
    iconColor: '#a855f7',
    field: 'twitterPixelId',
    placeholder: 'e.g. o7x9a',
    description: 'Tracks conversions and tailors audience segments on X Ads Manager.'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Tag',
    Icon: Pin,
    iconColor: '#ef4444',
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

    logs.push(`[${timestamp}] [INIT] Initializing KissURL Pixel Dispatcher for event: "${simulatedEvent}"`);

    let activeCount = 0;
    if (settings.metaPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [META] fbq('track', '${simulatedEvent}') fired (ID: ${settings.metaPixelId})`);
    }

    if (settings.gaMeasurementId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [GA4] gtag('event', '${simulatedEvent}') fired (ID: ${settings.gaMeasurementId})`);
    }

    if (settings.tiktokPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [TIKTOK] ttq.track('${simulatedEvent}') (ID: ${settings.tiktokPixelId})`);
    }

    if (settings.linkedinPartnerId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [LINKEDIN] lintrk('track', { conversion_id: '${simulatedEvent}' }) (ID: ${settings.linkedinPartnerId})`);
    }

    if (settings.twitterPixelId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [X/TWITTER] twq('event', '${simulatedEvent}') (ID: ${settings.twitterPixelId})`);
    }

    if (settings.pinterestTagId?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [PINTEREST] pintrk('track', '${simulatedEvent}') (ID: ${settings.pinterestTagId})`);
    }

    if (settings.customHeadScript?.trim()) {
      activeCount++;
      logs.push(`[${timestamp}] [CUSTOM] Head Script injected into DOM context.`);
    }

    if (activeCount === 0) {
      logs.push(`[${timestamp}] [WARN] No active pixels configured. Enter a Pixel ID in Tracking Pixels tab to begin.`);
    } else {
      logs.push(`[${timestamp}] [SUCCESS] Fired ${activeCount} tracking tags successfully.`);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Target size={18} /> Retargeting Pixels & Tracking Tags
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Manage ad retargeting pixels and conversion tags across all workspace links.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Clean Pill Segment Switcher */}
        <div style={{ 
          display: 'flex', 
          gap: '0.35rem', 
          padding: '0.55rem 1.4rem', 
          borderBottom: '1px solid var(--border-subtle)', 
          backgroundColor: 'var(--bg-subtle)',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('pixels')}
            className={`btn ${activeTab === 'pixels' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Target size={13} /> Tracking Pixels <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 5px', marginLeft: '3px' }}>{configuredCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`btn ${activeTab === 'custom' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Code2 size={13} /> Custom Script Tag
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('simulator');
              if (simulatorLogs.length === 0) handleRunSimulation();
            }}
            className={`btn ${activeTab === 'simulator' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            <Play size={13} /> Event Simulator
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto' }}>
          {/* TAB 1: PRESET TRACKING PIXELS */}
          {activeTab === 'pixels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Info size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span><strong>Global Workspace Defaults:</strong> Pixels configured here will automatically be injected into all shortened links in this workspace, enabling instant retargeting on ad platforms.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {PIXEL_PRESETS.map((preset) => {
                  const val = settings[preset.field] || '';
                  const isFilled = Boolean(val.trim());
                  const IconComp = preset.Icon;

                  return (
                    <div 
                      key={preset.id}
                      style={{ 
                        padding: '0.85rem 1rem', 
                        backgroundColor: 'var(--bg-surface)', 
                        border: isFilled ? '1px solid var(--border-default)' : '1px solid var(--border-subtle)', 
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <div style={{ 
                            width: '26px', 
                            height: '26px', 
                            borderRadius: 'var(--radius-sm)', 
                            backgroundColor: 'var(--bg-subtle)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: preset.iconColor,
                            border: '1px solid var(--border-subtle)'
                          }}>
                            <IconComp size={14} />
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {preset.name}
                          </span>
                        </div>
                        {isFilled && (
                          <span className="badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                            <Check size={10} /> Active
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {preset.description}
                      </p>

                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setSettings({ ...settings, [preset.field]: e.target.value })}
                        placeholder={preset.placeholder}
                        className="input"
                        style={{ fontSize: '0.825rem', fontFamily: 'var(--font-mono)', padding: '0.45rem 0.65rem' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM HEAD SCRIPT TAG */}
          {activeTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Code2 size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span><strong>Custom Tracking Scripts:</strong> Paste any JavaScript tag (Google Tag Manager snippet, Hotjar, Segment, Plausible, or custom web tracking code).</span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  Raw HTML / &lt;script&gt; Injection Block
                </label>
                <textarea
                  value={settings.customHeadScript || ''}
                  onChange={(e) => setSettings({ ...settings, customHeadScript: e.target.value })}
                  placeholder={`<!-- Global site tag or custom script -->\n<script>\n  window.dataLayer = window.dataLayer || [];\n  // your tracking code here\n</script>`}
                  rows={8}
                  className="input"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', resize: 'vertical', padding: '0.65rem' }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: EVENT SIMULATOR */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Activity size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span><strong>Live Tag Dispatcher:</strong> Simulate how tracking tags and retargeting pixels fire when a visitor visits your short links.</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={simulatedEvent}
                  onChange={(e) => setSimulatedEvent(e.target.value)}
                  className="input"
                  style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem' }}
                >
                  <option value="PageView">Event: PageView (Standard Visit)</option>
                  <option value="Lead">Event: Lead (Sign-up / Conversion)</option>
                  <option value="ViewContent">Event: ViewContent (Catalog / Product View)</option>
                  <option value="Purchase">Event: Purchase (Checkout / Payment)</option>
                </select>

                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={simulating}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <Play size={13} /> Fire Event
                </button>
              </div>

              {/* Console Logs */}
              <div style={{ backgroundColor: '#09090b', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--border-default)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minHeight: '160px', color: '#a1a1aa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '0.4rem', marginBottom: '0.65rem', color: '#71717a', fontSize: '0.7rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Terminal size={11} /> PIXEL CONSOLE DISPATCHER
                  </span>
                  <span>{simulatorLogs.length} events logged</span>
                </div>
                {simulatorLogs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '0.35rem', lineHeight: 1.4, color: log.includes('[SUCCESS]') || log.includes('fired') ? '#34d399' : (log.includes('[WARN]') ? '#fbbf24' : '#e4e4e7') }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {saved && (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                <CheckCircle2 size={13} /> Saved to workspace!
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ fontSize: '0.8rem' }}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
            >
              {isSaving ? 'Saving...' : 'Save Workspace Pixels'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
