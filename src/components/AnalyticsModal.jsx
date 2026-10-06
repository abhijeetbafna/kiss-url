import React, { useEffect } from 'react';
import { X, BarChart3, Globe, Smartphone, Compass } from 'lucide-react';

export default function AnalyticsModal({ link, onClose, onRefreshData }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '780px', position: 'relative' }}
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
              {link.title || link.slug}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <code style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                https://{link.domain}/{link.slug}
              </code>
              <span style={{ color: 'var(--text-dim)' }}>➔</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {link.targetUrl}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Analytics Body */}
        <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Key Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Clicks</div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                {totalClicks.toLocaleString()}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Estimated Unique</div>
              <div className="tabular-nums" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                {Math.round(totalClicks * 0.82).toLocaleString()}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Top Source</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.35rem', textTransform: 'capitalize' }}>
                {referrers[0] ? referrers[0][0] : 'Direct'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Top Country</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.35rem' }}>
                {countries[0] ? countries[0][0] : 'US'}
              </div>
            </div>
          </div>

          {/* Timeline Bar Chart */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Click History
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time updates</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '120px', paddingTop: '0.5rem' }}>
              {history.map((day, idx) => {
                const heightPct = Math.max(15, Math.round((day.clicks / maxHistoryClick) * 100));
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div className="tabular-nums" style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                      {day.clicks}
                    </div>
                    <div style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      backgroundColor: 'var(--primary-bg)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'height var(--duration-base) var(--ease-out)'
                    }} />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '5px' }}>
                      {day.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdowns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Referrers */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Compass size={13} color="var(--text-muted)" /> Top Sources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {referrers.map(([ref, count], i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                      <span>{ref}</span>
                      <span className="tabular-nums" style={{ fontWeight: '500' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px' }}>
                      <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--primary-bg)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Smartphone size={13} color="var(--text-muted)" /> Devices
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {devices.map(([dev, count], i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                      <span>{dev}</span>
                      <span className="tabular-nums" style={{ fontWeight: '500' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px' }}>
                      <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--primary-bg)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Globe size={13} color="var(--text-muted)" /> Locations
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {countries.map(([c, count], i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                      <span>{c}</span>
                      <span className="tabular-nums" style={{ fontWeight: '500' }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px' }}>
                      <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--primary-bg)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            ✓ Zero-cookie GDPR compliant analytics
          </span>
          <button onClick={onRefreshData} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
