import React, { useState } from 'react';
import { X, BarChart3, Globe, Smartphone, Compass, ArrowUpRight, Zap, Play } from 'lucide-react';
import { recordSimulatedClick } from '../services/storageService';

export default function AnalyticsModal({ link, onClose, onRefreshData }) {
  const [activeRange, setActiveRange] = useState('7d');
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
        className="glass-panel modal-content" 
        style={{ width: '100%', maxWidth: '840px', padding: '1.75rem', position: 'relative' }}
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
          <span className="badge badge-indigo">
            <BarChart3 size={12} /> Live Link Intelligence
          </span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>
          {link.title || link.slug}
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <code>https://{link.domain}/{link.slug}</code> ➔ <span>{link.targetUrl}</span>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
              {totalClicks.toLocaleString()}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Unique Visitors</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
              {Math.round(totalClicks * 0.82).toLocaleString()}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Top Source</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '0.4rem', textTransform: 'capitalize' }}>
              {referrers[0] ? referrers[0][0] : 'Direct'}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Top Country</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#c084fc', marginTop: '0.4rem' }}>
              {countries[0] ? `${countries[0][0]} (${Math.round((countries[0][1] / (totalClicks || 1)) * 100)}%)` : 'US'}
            </div>
          </div>
        </div>

        {/* Click History Timeline Bar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="#6366f1" /> Clicks Over Time
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Zero-cookie privacy tracking</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px', paddingTop: '1.5rem' }}>
            {history.map((day, idx) => {
              const heightPct = Math.max(15, Math.round((day.clicks / maxHistoryClick) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{day.clicks}</div>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #6366f1 0%, #4338ca 100%)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
                  }} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                    {day.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdowns Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Top Referrers */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={14} color="#06b6d4" /> Top Referrers
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {referrers.map(([ref, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                    <span>{ref}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', background: '#06b6d4', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices / OS */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Smartphone size={14} color="#10b981" /> Devices & OS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {devices.map(([dev, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                    <span>{dev}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', background: '#10b981', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe size={14} color="#c084fc" /> Geographic Split
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {countries.map(([c, count], i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
                    <span>{c}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                    <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', background: '#c084fc', borderRadius: '2px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Click Simulator Box */}
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.07)', 
          border: '1px solid rgba(99, 102, 241, 0.25)', 
          borderRadius: '12px', 
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Play size={14} color="#818cf8" /> Test Real-time Ingestion
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Simulate a visitor clicking your short link from a mobile device or social feed.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleSimulateClick('iOS', 'twitter.com', 'US')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              + iOS / Twitter Click
            </button>
            <button
              onClick={() => handleSimulateClick('Android', 'linkedin.com', 'DE')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              + Android / LinkedIn Click
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
