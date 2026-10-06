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
  Clock, 
  Activity, 
  Sparkles, 
  ExternalLink,
  Copy,
  Check
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
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleEvent = (evt) => {
    setEvents(prev => prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header flex items-center justify-between border-b border-border/40 p-5 bg-card/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Webhook size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground tracking-tight">Webhooks & Real-Time Automations</h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {activeWorkspace?.name || 'Workspace'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Dispatch instant HTTP JSON webhooks to Slack, Discord, Zapier, or your API when links get clicked.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Presets */}
          {!isCreating && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Integration Presets</span>
                <button
                  onClick={() => {
                    setName('Custom Webhook');
                    setUrl('');
                    setSecret('whsec_' + Math.random().toString(36).substring(2, 12));
                    setIsCreating(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                >
                  <Plus size={13} /> Custom Endpoint
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WEBHOOK_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border/40 bg-card/40 hover:bg-card hover:border-purple-500/40 text-left transition-all group"
                  >
                    <span className="text-2xl select-none group-hover:scale-110 transition-transform">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground group-hover:text-purple-400 transition-colors">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{p.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Webhook Form */}
          {isCreating && (
            <form onSubmit={handleCreateWebhook} className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/30">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Sparkles size={13} /> Configure New Webhook
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">Webhook Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Slack Ops Alert"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">Signing Secret (HMAC-SHA256)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      placeholder="whsec_..."
                      className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg pl-3 pr-8 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setSecret('whsec_' + Math.random().toString(36).substring(2, 14))}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground text-[10px] px-1 bg-muted/40 rounded"
                      title="Generate new secret"
                    >
                      ↻
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">Payload URL (POST)</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Subscribed Events</label>
                <div className="flex flex-wrap gap-2">
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
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        events.includes(e.key)
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 font-medium'
                          : 'bg-card/40 border-border/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {events.includes(e.key) ? '✓ ' : '+ '}{e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-lg border border-border/40 hover:bg-card"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !url}
                  className="px-4 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Enable Webhook'}
                </button>
              </div>
            </form>
          )}

          {/* Webhooks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Configured Webhooks ({webhooks.length})
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">Loading workspace webhooks...</div>
            ) : webhooks.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border/40 rounded-xl bg-card/20">
                <Webhook size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-xs font-medium text-muted-foreground">No active webhooks in this workspace.</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">Pick a preset above to stream live click events to Slack, Discord, or Zapier.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {webhooks.map((hook) => (
                  <div 
                    key={hook.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      hook.active 
                        ? 'border-border/60 bg-card/50' 
                        : 'border-border/30 bg-muted/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">{hook.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            hook.active 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                          }`}>
                            {hook.active ? 'Active' : 'Paused'}
                          </span>
                          {hook.lastDeliveryStatus === 'success' && (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={11} /> 200 OK
                            </span>
                          )}
                          {hook.lastDeliveryStatus === 'failed' && (
                            <span className="text-[10px] text-rose-400 flex items-center gap-1">
                              <AlertCircle size={11} /> Delivery Failed
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-mono text-muted-foreground truncate mt-1 bg-background/50 px-2.5 py-1 rounded border border-border/30">
                          {hook.url}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {hook.events?.map(e => (
                            <span key={e} className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border/30">
                              {e}
                            </span>
                          ))}
                          {hook.deliveriesCount > 0 && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                              <Activity size={10} /> {hook.deliveriesCount} deliveries
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTestDispatch(hook)}
                          disabled={testingId === hook.id}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Send test ping payload"
                        >
                          <Send size={11} />
                          {testingId === hook.id ? 'Sending...' : 'Test Ping'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleActive(hook)}
                          className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                            hook.active 
                              ? 'border-border/40 text-muted-foreground hover:bg-card' 
                              : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                          }`}
                        >
                          {hook.active ? 'Pause' : 'Resume'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(hook.id)}
                          className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete webhook"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Test result output */}
                    {testResult && testResult.hookId === hook.id && (
                      <div className="mt-3 p-3 rounded-lg border border-border/40 bg-background/90 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                            {testResult.success ? (
                              <CheckCircle2 size={13} className="text-emerald-400" />
                            ) : (
                              <AlertCircle size={13} className="text-rose-400" />
                            )}
                            Test Dispatch Result (HTTP {testResult.status})
                          </span>
                          <button
                            onClick={() => setTestResult(null)}
                            className="text-[10px] text-muted-foreground hover:text-foreground"
                          >
                            Dismiss
                          </button>
                        </div>
                        <pre className="p-2 rounded bg-black/40 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-32">
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
        <div className="modal-footer p-4 border-t border-border/40 bg-card/40 flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Key size={12} className="text-purple-400" />
            Payloads include signature header <code className="font-mono text-[10px] text-purple-300">X-KissURL-Signature</code>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-card border border-border/40 hover:bg-muted/40 text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
