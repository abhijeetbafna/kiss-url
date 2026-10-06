import React, { useState } from 'react';
import { X, BarChart3, Globe, Smartphone, Compass, Zap, Play } from 'lucide-react';
import { recordSimulatedClick } from '../services/storageService';

export default function AnalyticsModal({ link, onClose, onRefreshData }) {
  const [clickSimulated, setClickSimulated] = useState(false);

  const analytics = link.analytics || {
    referrers: { direct: link.clicks || 1 },
    devices: { Desktop: link.clicks || 1 },
    countries: { US: link.clicks || 1 },
    clickHistory: [{ date: new Date().toISOString().split('T')[0], clicks: link.clicks || 1 }]
  };

  const totalClicks = link.clicks || 0;
  const referrers = Object.entries(analytics.referrers || {}).sort((a, b) => b[1] - a[1]);
  const devices = Object.entries(analytics.devices || {}).sort((a, b) => b[1] - a[1]);
  const countries = Object.entries(analytics.countries || {}).sort((a, b) => b[1] - a[1]);
  const history = analytics.clickHistory || [];

  const maxHistoryClick = Math.max(...history.map(h => h.clicks), 1);

  const handleSimulateClick = (device = 'iOS', referrer = 'twitter.com', country = 'US') => {
    recordSimulatedClick(link.id, { device, referrer, country });
    setClickSimulated(true);
    onRefreshData();
    setTimeout(() => setClickSimulated(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ width: '100%', maxWidth: '840px', padding: '1.75rem', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
          aria-label="Close Analytics"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-indigo">
            <BarChart3 size={12} /> Live Link Intelligence
          </span>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          {link.title || link.slug}
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <code style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>https://{link.domain}/{link.slug}</code> ➔ <span>{link.targetUrl}</span>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Total Clicks</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
              {totalClicks.toLocaleString()}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Unique Visitors</div>
            <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: '800', color: '#059669', marginTop: '0.2rem' }}>
              {Math.round(totalClicks * 0.82).toLocaleString()}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Top Source</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.4rem', textTransform: 'capitalize' }}>
              {referrers[0] ? referrers[0][0] : 'Direct'}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.04em' }}>Top Country</div>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#7c3aed', marginTop: '0.4rem' }}>
              {countries[0] ? `${countries[0][0]} (${Math.round((countries[0][1] / (totalClicks || 1)) * 100)}%)` : 'US'}
            </div>
          </div>
        </div>

        {/* Click History Timeline Bar Chart */}
        <div style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="var(--accent-primary)" /> Clicks Over Time
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero-cookie privacy tracking</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px', paddingTop: '1rem' }}>
            {history.map((day, idx) => {
              const heightPct = Math.max(15, Math.round((day.clicks / maxHistoryClick) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div className="tabular-nums" style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>{day.clicks}</div>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    backgroundColor: 'var(--accent-primary)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: 'var(--shadow-accent)'
                  }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {day.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdowns Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
          {/* Top Referrers */}
          <div style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={14} color="var(--accent-primary)" /> Top Referrers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {referrers.map(([ref, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                    <span>{ref}</span>
                    <span className="tabular-nums" style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--accent-primary)', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices / OS */}
          <div style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={14} color="#059669" /> Devices & OS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {devices.map(([dev, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                    <span>{dev}</span>
                    <span className="tabular-nums" style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: '#059669', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div style={{ backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe size={14} color="#7c3aed" /> Geographic Split
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {countries.map(([c, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                    <span>{c}</span>
                    <span className="tabular-nums" style={{ fontWeight: '600' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: '#7c3aed', borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Click Simulator Box */}
        <div style={{ 
          backgroundColor: 'var(--accent-subtle)', 
          border: '1px solid var(--accent-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Play size={14} color="var(--accent-primary)" /> Test Real-Time Event Ingestion
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Simulate visitor clicks from different platforms and countries.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleSimulateClick('iOS', 'twitter.com', 'US')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              + iOS / Twitter Click
            </button>
            <button
              onClick={() => handleSimulateClick('Android', 'linkedin.com', 'DE')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              + Android / LinkedIn Click
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
