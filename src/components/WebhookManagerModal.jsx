import React, { useState, useEffect } from 'react';
import { 
  X, 
  Webhook, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Activity, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw 
} from 'lucide-react';
import { 
  apiGetWorkspaceWebhooks, 
  apiCreateWorkspaceWebhook, 
  apiUpdateWorkspaceWebhook, 
  apiDeleteWorkspaceWebhook, 
  apiTestWorkspaceWebhook 
} from '../services/api';
import { getActiveWorkspace } from '../services/storageService';

const WEBHOOK_PRESETS = [
  {
    name: 'Slack Incoming Webhook',
    icon: '💬',
    urlTemplate: 'https://hooks.slack.com/services/WORKSPACE/CHANNEL/TOKEN',
    events: ['click.created', 'milestone.reached'],
    description: 'Post click notifications & link milestones directly to your Slack channel.'
  },
  {
    name: 'Discord Webhook Channel',
    icon: '🎮',
    urlTemplate: 'https://discord.com/api/webhooks/CHANNEL_ID/WEBHOOK_TOKEN',
    events: ['click.created', 'milestone.reached'],
    description: 'Stream live click alerts and traffic spike announcements to Discord.'
  },
  {
    name: 'Zapier Automation',
    icon: '⚡',
    urlTemplate: 'https://hooks.zapier.com/hooks/catch/123456/webhook/',
    events: ['click.created', 'milestone.reached', 'lead.captured'],
    description: 'Trigger multi-app Zaps in Airtable, Google Sheets, HubSpot, or CRM.'
  },
  {
    name: 'Custom HTTP Endpoint (HMAC)',
    icon: '🌐',
    urlTemplate: 'https://api.yourdomain.com/v1/webhooks/kissurl',
    events: ['click.created', 'milestone.reached'],
    description: 'Receive signed JSON webhooks with SHA-256 header validation.'
  }
];

export default function WebhookManagerModal({ isOpen, onClose }) {
  const activeWorkspace = getActiveWorkspace();
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState(['click.created', 'milestone.reached']);
  const [secret, setSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingId, setTestingId] = useState(null);

  useEffect(() => {
    if (isOpen && activeWorkspace?.id) {
      loadWebhooks();
    }
  }, [isOpen, activeWorkspace?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const list = await apiGetWorkspaceWebhooks(activeWorkspace.id);
      setWebhooks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load webhooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setName(preset.name);
    setUrl(preset.urlTemplate);
    setEvents(preset.events);
    setSecret('whsec_' + Math.random().toString(36).substring(2, 12));
    setIsCreating(true);
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSaving(true);
    try {
      const created = await apiCreateWorkspaceWebhook(activeWorkspace.id, {
        name: name.trim() || 'Custom Webhook',
        url: url.trim(),
        events,
        secret: secret || 'whsec_' + Math.random().toString(36).substring(2, 12)
      });
      setWebhooks(prev => [created, ...prev]);
      setIsCreating(false);
      setName('');
      setUrl('');
      setSecret('');
    } catch (err) {
      alert('Failed to save webhook: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (hook) => {
    try {
      const updated = await apiUpdateWorkspaceWebhook(activeWorkspace.id, hook.id, { active: !hook.active });
      if (updated) {
        setWebhooks(prev => prev.map(h => h.id === hook.id ? { ...h, active: !h.active } : h));
      }
    } catch (err) {
      console.error('Failed to toggle webhook:', err);
    }
  };

  const handleDelete = async (hookId) => {
    if (!confirm('Are you sure you want to remove this webhook?')) return;
    try {
      await apiDeleteWorkspaceWebhook(activeWorkspace.id, hookId);
      setWebhooks(prev => prev.filter(h => h.id !== hookId));
    } catch (err) {
      console.error('Failed to delete webhook:', err);
    }
  };

  const handleTestDispatch = async (hook) => {
    setTestingId(hook.id);
    setTestResult(null);
    try {
      const res = await apiTestWorkspaceWebhook(activeWorkspace.id, hook.id);
      setTestResult({
        hookId: hook.id,
        success: res.success,
        status: res.status,
        payload: res.payload
      });
      loadWebhooks();
    } catch (err) {
      setTestResult({
        hookId: hook.id,
        success: false,
        status: 500,
        payload: { error: err.message }
      });
    } finally {
      setTestingId(null);
    }
  };

  const toggleEvent = (evt) => {
    setEvents(prev => prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Webhook size={18} /> Webhooks & Real-Time Automations
              </h2>
              <span className="badge" style={{ fontSize: '0.7rem', padding: '1px 6px', color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                {activeWorkspace?.name || 'Workspace'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Dispatch instant HTTP JSON webhooks to Slack, Discord, Zapier, or your API when links get clicked.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '68vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Presets Grid */}
          {!isCreating && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  Quick Integration Presets
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setName('Custom Webhook');
                    setUrl('');
                    setSecret('whsec_' + Math.random().toString(36).substring(2, 12));
                    setIsCreating(true);
                  }}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--primary-bg)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}
                >
                  <Plus size={12} /> Custom Endpoint
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.65rem' }}>
                {WEBHOOK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      backgroundColor: 'var(--bg-surface)',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>{p.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Webhook Form */}
          {isCreating && (
            <form onSubmit={handleCreateWebhook} style={{ padding: '1rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(168, 85, 247, 0.4)', backgroundColor: 'var(--bg-subtle)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} style={{ color: '#a855f7' }} /> Configure New Webhook
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                    Webhook Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Slack Ops Channel"
                    className="input"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.45rem 0.65rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                    Signing Secret (HMAC-SHA256)
                  </label>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <input
                      type="text"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="whsec_..."
                      className="input"
                      style={{ flex: 1, fontSize: '0.775rem', fontFamily: 'var(--font-mono)', padding: '0.45rem 0.65rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setSecret('whsec_' + Math.random().toString(36).substring(2, 14))}
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem', fontSize: '0.75rem' }}
                      title="Generate new secret"
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  Payload Destination URL (POST)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="input"
                  style={{ width: '100%', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', padding: '0.45rem 0.65rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                  Subscribed Events
                </label>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'click.created', label: 'Every Click (Live)' },
                    { key: 'milestone.reached', label: 'Milestones (100th, 1k clicks)' },
                    { key: 'health.alert', label: 'Destination 404 Health Alert' },
                    { key: 'lead.captured', label: 'Bio Page Lead Captured' }
                  ].map(e => (
                    <button
                      type="button"
                      key={e.key}
                      onClick={() => toggleEvent(e.key)}
                      className={`btn ${events.includes(e.key) ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                    >
                      {events.includes(e.key) ? '✓ ' : '+ '}{e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', paddingTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !url}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
                >
                  {saving ? 'Saving...' : 'Save & Enable Webhook'}
                </button>
              </div>
            </form>
          )}

          {/* Webhooks List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Configured Webhooks ({webhooks.length})
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Loading workspace webhooks...
              </div>
            ) : webhooks.length === 0 ? (
              <div style={{ padding: '2rem 1.5rem', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-default)', backgroundColor: 'var(--bg-subtle)' }}>
                <Webhook size={24} style={{ margin: '0 auto 0.45rem', color: 'var(--text-muted)' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>No active webhooks in this workspace.</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Pick an integration preset above to stream live click events to Slack, Discord, or Zapier.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {webhooks.map((hook) => (
                  <div 
                    key={hook.id} 
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-default)',
                      backgroundColor: hook.active ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                      opacity: hook.active ? 1 : 0.7,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.65rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{hook.name}</span>
                          <span className="badge" style={{ 
                            fontSize: '0.675rem', 
                            padding: '1px 5px', 
                            color: hook.active ? '#10b981' : 'var(--text-muted)',
                            borderColor: hook.active ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)' 
                          }}>
                            {hook.active ? 'Active' : 'Paused'}
                          </span>
                          {hook.lastDeliveryStatus === 'success' && (
                            <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <CheckCircle2 size={11} /> 200 OK
                            </span>
                          )}
                          {hook.lastDeliveryStatus === 'failed' && (
                            <span style={{ fontSize: '0.7rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <AlertCircle size={11} /> Failed
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-subtle)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)', wordBreak: 'break-all' }}>
                          {hook.url}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          {hook.events?.map(e => (
                            <span key={e} className="badge" style={{ fontSize: '0.675rem', padding: '1px 5px', fontFamily: 'var(--font-mono)' }}>
                              {e}
                            </span>
                          ))}
                          {hook.deliveriesCount > 0 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Activity size={10} /> {hook.deliveriesCount} deliveries
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => handleTestDispatch(hook)}
                          disabled={testingId === hook.id}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', color: '#a855f7', borderColor: 'rgba(168, 85, 247, 0.3)' }}
                          title="Send test ping payload"
                        >
                          <Send size={11} />
                          {testingId === hook.id ? 'Sending...' : 'Test Ping'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(hook)}
                          className="btn btn-ghost"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                        >
                          {hook.active ? 'Pause' : 'Resume'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(hook.id)}
                          className="btn-icon"
                          style={{ color: 'var(--text-muted)' }}
                          title="Delete webhook"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Test result output */}
                    {testResult && testResult.hookId === hook.id && (
                      <div style={{ padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', backgroundColor: '#09090b', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#a1a1aa', marginBottom: '0.35rem', fontSize: '0.7rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: testResult.success ? '#34d399' : '#f87171' }}>
                            {testResult.success ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                            HTTP {testResult.status} Test Dispatch Result
                          </span>
                          <button onClick={() => setTestResult(null)} className="btn-ghost" style={{ padding: '0 4px', color: '#71717a' }}>
                            Dismiss
                          </button>
                        </div>
                        <pre style={{ margin: 0, color: '#34d399', overflowX: 'auto', maxHeight: '110px' }}>
                          {JSON.stringify(testResult.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Key size={12} style={{ color: '#a855f7' }} />
            Payloads include signature header <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-primary)' }}>X-KissURL-Signature</code>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
