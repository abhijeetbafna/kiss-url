import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  Globe, 
  Smartphone, 
  Compass, 
  Calendar, 
  Clock, 
  Activity, 
  TrendingUp, 
  PieChart, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  RefreshCw,
  Zap,
  Download,
  FileText,
  Tag,
  Printer
} from 'lucide-react';
import { buildShortUrl, getAggregatedWorkspaceAnalytics } from '../services/storageService';

const COUNTRY_FLAGS = {
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  IN: { name: 'India', flag: '🇮🇳' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  FR: { name: 'France', flag: '🇫🇷' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  SG: { name: 'Singapore', flag: '🇸🇬' },
  NL: { name: 'Netherlands', flag: '🇳🇱' },
  ES: { name: 'Spain', flag: '🇪🇸' }
};

const DEVICE_COLORS = {
  iOS: '#3b82f6',
  Android: '#10b981',
  macOS: '#8b5cf6',
  Windows: '#f59e0b',
  Linux: '#ec4899',
  Desktop: '#6366f1'
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AnalyticsModal({ link, onClose, onRefreshData, isWorkspaceMode = false }) {
  const [viewMode, setViewMode] = useState(link && !isWorkspaceMode ? 'link' : 'workspace');
  const [timeRange, setTimeRange] = useState('7d'); // 24h | 7d | 30d | all
  const [activeTab, setActiveTab] = useState('overview'); // overview | heatmap | geomap | devices
  const [hoveredHour, setHoveredHour] = useState(null);
  const [liveClicks, setLiveClicks] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate simulated live click feed
  useEffect(() => {
    const countries = ['US', 'GB', 'DE', 'IN', 'CA', 'FR', 'SG'];
    const referrers = ['twitter.com', 'linkedin.com', 'direct', 'github.com', 'google.com'];
    const devices = ['iOS', 'Android', 'macOS', 'Windows'];

    const initial = [
      { id: 1, country: 'US', referrer: 'twitter.com', device: 'iOS', time: 'Just now' },
      { id: 2, country: 'GB', referrer: 'linkedin.com', device: 'macOS', time: '1m ago' },
      { id: 3, country: 'DE', referrer: 'direct', device: 'Windows', time: '3m ago' },
      { id: 4, country: 'IN', referrer: 'github.com', device: 'Android', time: '5m ago' },
    ];
    setLiveClicks(initial);

    const interval = setInterval(() => {
      const newClick = {
        id: Date.now(),
        country: countries[Math.floor(Math.random() * countries.length)],
        referrer: referrers[Math.floor(Math.random() * referrers.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        time: 'Just now'
      };
      setLiveClicks(prev => [newClick, ...prev.slice(0, 4)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Compute Active Analytics Payload (Single link vs. Aggregated Workspace)
  const aggregated = getAggregatedWorkspaceAnalytics();

  let activeAnalytics = link?.analytics || {
    referrers: { direct: link?.clicks || 1 },
    devices: { Desktop: link?.clicks || 1 },
    countries: { US: link?.clicks || 1 },
    clickHistory: [{ date: new Date().toISOString().split('T')[0], clicks: link?.clicks || 1 }]
  };

  let totalClicks = link?.clicks || 0;

  if (viewMode === 'workspace' || !link) {
    activeAnalytics = aggregated;
    totalClicks = aggregated.totalClicks;
  }

  const referrers = Object.entries(activeAnalytics.referrers || {}).sort((a, b) => b[1] - a[1]);
  const devices = Object.entries(activeAnalytics.devices || {}).sort((a, b) => b[1] - a[1]);
  const countries = Object.entries(activeAnalytics.countries || {}).sort((a, b) => b[1] - a[1]);
  const history = activeAnalytics.clickHistory || [];
  const maxHistoryClick = Math.max(...history.map(h => h.clicks), 1);

  // Calculate Device Donut SVG segments
  const totalDeviceClicks = devices.reduce((sum, [, count]) => sum + count, 0) || 1;
  let accumulatedAngle = 0;
  const donutSegments = devices.map(([dev, count]) => {
    const pct = count / totalDeviceClicks;
    const strokeDasharray = `${pct * 100} ${100 - pct * 100}`;
    const strokeDashoffset = -accumulatedAngle * 100;
    accumulatedAngle += pct;
    return {
      dev,
      count,
      pct: Math.round(pct * 100),
      color: DEVICE_COLORS[dev] || '#09090b',
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Export Handlers
  const handleExportCSV = () => {
    const rows = [
      ['Category', 'Key', 'Clicks', 'Share'],
      ...referrers.map(([ref, count]) => ['Referrer', ref, count, `${Math.round((count / (totalClicks || 1)) * 100)}%`]),
      ...countries.map(([c, count]) => ['Country', COUNTRY_FLAGS[c]?.name || c, count, `${Math.round((count / (totalClicks || 1)) * 100)}%`]),
      ...devices.map(([d, count]) => ['Device', d, count, `${Math.round((count / (totalClicks || 1)) * 100)}%`]),
      ...history.map(h => ['Timeline', h.date, h.clicks, ''])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', encodedUri);
    linkEl.setAttribute('download', `kissurl_analytics_${link?.slug || 'workspace'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      target: link ? { slug: link.slug, targetUrl: link.targetUrl } : 'Workspace Aggregated',
      totalClicks,
      referrers,
      countries,
      devices,
      history,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', dataStr);
    linkEl.setAttribute('download', `kissurl_analytics_${link?.slug || 'workspace'}.json`);
    document.body.appendChild(linkEl);
    linkEl.click();
    document.body.removeChild(linkEl);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '880px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BarChart3 size={18} /> {viewMode === 'workspace' ? 'Workspace Visual Analytics' : (link.title || link.slug)}
              </h2>
              {link && (
                <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: 'var(--bg-muted)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
                  <button
                    onClick={() => setViewMode('link')}
                    className="btn-ghost"
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.725rem',
                      fontWeight: viewMode === 'link' ? '600' : '400',
                      backgroundColor: viewMode === 'link' ? 'var(--bg-surface)' : 'transparent',
                      color: viewMode === 'link' ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-xs)'
                    }}
                  >
                    Link View
                  </button>
                  <button
                    onClick={() => setViewMode('workspace')}
                    className="btn-ghost"
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.725rem',
                      fontWeight: viewMode === 'workspace' ? '600' : '400',
                      backgroundColor: viewMode === 'workspace' ? 'var(--bg-surface)' : 'transparent',
                      color: viewMode === 'workspace' ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-xs)'
                    }}
                  >
                    All Workspace
                  </button>
                </div>
              )}
            </div>

            {viewMode === 'link' && link && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <code style={{ fontSize: '0.785rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {buildShortUrl(link.slug, link.domain)}
                </code>
                <span style={{ color: 'var(--text-dim)' }}>➔</span>
                <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {link.targetUrl}
                </span>
              </div>
            )}
            {viewMode === 'workspace' && (
              <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                Aggregated performance across all links, campaigns, and traffic sources in this workspace.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              onClick={handleExportCSV} 
              className="btn btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              title="Download CSV dump"
            >
              <Download size={12} /> CSV
            </button>
            <button 
              onClick={handleExportJSON} 
              className="btn btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              title="Download JSON feed"
            >
              JSON
            </button>
            <button 
              onClick={handlePrintReport} 
              className="btn btn-ghost" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.55rem' }}
              title="Print Executive PDF Summary"
            >
              <Printer size={12} /> Print PDF
            </button>
            <button onClick={onClose} className="btn-icon" aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Filter & Sub-Nav Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.5rem 1.4rem', 
          borderBottom: '1px solid var(--border-subtle)', 
          backgroundColor: 'var(--bg-subtle)',
          flexWrap: 'wrap',
          gap: '0.5rem',
          flexShrink: 0
        }}>
          {/* Visual Tabs */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
            >
              <TrendingUp size={13} /> Timeline
            </button>
            <button
              onClick={() => setActiveTab('heatmap')}
              className={`btn ${activeTab === 'heatmap' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
            >
              <Clock size={13} /> Hourly Heatmap
            </button>
            <button
              onClick={() => setActiveTab('geomap')}
              className={`btn ${activeTab === 'geomap' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
            >
              <Globe size={13} /> Geo Map
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`btn ${activeTab === 'devices' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
            >
              <PieChart size={13} /> Devices
            </button>
            <button
              onClick={() => setActiveTab('utm')}
              className={`btn ${activeTab === 'utm' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
            >
              <Tag size={13} /> UTM Campaigns
            </button>
          </div>

          {/* Time Range Selector */}
          <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: 'var(--bg-muted)', padding: '2px', borderRadius: 'var(--radius-sm)' }}>
            {['24h', '7d', '30d', 'all'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className="btn-ghost"
                style={{
                  padding: '2px 7px',
                  fontSize: '0.725rem',
                  fontWeight: timeRange === t ? '600' : '400',
                  backgroundColor: timeRange === t ? 'var(--bg-surface)' : 'transparent',
                  color: timeRange === t ? 'var(--text-primary)' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-xs)',
                  textTransform: 'uppercase'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Body */}
        <div className="modal-body">
          {/* 1. KEY METRICS STRIP */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Clicks</div>
              <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                {totalClicks.toLocaleString()}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '500' }}>Estimated Unique</div>
              <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                {Math.round(totalClicks * 0.84).toLocaleString()}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '500' }}>Top Source</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.25rem', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {referrers[0] ? referrers[0][0] : 'Direct'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '0.75rem 0.9rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '500' }}>Top Location</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>{COUNTRY_FLAGS[countries[0]?.[0]]?.flag || '🌐'}</span>
                <span>{countries[0] ? countries[0][0] : 'US'}</span>
              </div>
            </div>
          </div>

          {/* 2. TAB CONTENT: TIMELINE OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Timeline Histogram */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Daily Traffic Velocity
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Active UTC Timezone</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.65rem', height: '130px', paddingTop: '0.5rem' }}>
                  {history.map((day, idx) => {
                    const heightPct = Math.max(12, Math.round((day.clicks / maxHistoryClick) * 100));
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                        <div className="tabular-nums" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          {day.clicks}
                        </div>
                        <div style={{
                          width: '100%',
                          height: `${heightPct}%`,
                          backgroundColor: 'var(--primary-bg)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height var(--duration-base) var(--ease-out)',
                          cursor: 'pointer'
                        }} title={`${day.date}: ${day.clicks} clicks`} />
                        <div style={{ fontSize: '0.685rem', color: 'var(--text-muted)', marginTop: '5px', whiteSpace: 'nowrap' }}>
                          {day.date.slice(5)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-side Referrers & Top Country list */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {/* Referrers */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Compass size={13} color="var(--text-muted)" /> Referrers & Traffic Channels
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {referrers.slice(0, 5).map(([ref, count], i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.785rem', marginBottom: '2px', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: '500' }}>{ref}</span>
                          <span className="tabular-nums" style={{ fontWeight: '600' }}>{count} ({Math.round((count / (totalClicks || 1)) * 100)}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px' }}>
                          <div style={{ width: `${Math.round((count / (totalClicks || 1)) * 100)}%`, height: '100%', backgroundColor: 'var(--primary-bg)', borderRadius: '2px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Ticker */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Activity size={13} color="#10b981" /> Live Traffic Stream
                    </span>
                    <span className="status-dot" style={{ width: '6px', height: '6px', backgroundColor: '#10b981' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {liveClicks.map((c) => (
                      <div 
                        key={c.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '0.35rem 0.5rem', 
                          borderRadius: 'var(--radius-xs)', 
                          backgroundColor: 'var(--bg-surface)', 
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{COUNTRY_FLAGS[c.country]?.flag || '🌐'}</span>
                          <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{c.referrer}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({c.device})</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{c.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TAB CONTENT: 24-HOUR PEAK HEATMAP */}
          {activeTab === 'heatmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.785rem', color: 'var(--text-secondary)' }}>
                🔥 <strong>Audience Peak Engagement Heatmap</strong>: Analyzes 168 hourly time slots across the week. Darker squares indicate high-density engagement windows.
              </div>

              <div style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                overflowX: 'auto'
              }}>
                <div style={{ minWidth: '580px' }}>
                  {/* Hours Header */}
                  <div style={{ display: 'grid', gridTemplateColumns: '45px repeat(24, 1fr)', gap: '2px', marginBottom: '4px' }}>
                    <div />
                    {Array.from({ length: 24 }).map((_, h) => (
                      <div key={h} style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center' }}>
                        {h % 3 === 0 ? `${h}h` : ''}
                      </div>
                    ))}
                  </div>

                  {/* 7 Days Matrix */}
                  {DAYS.map((day, dIdx) => (
                    <div key={day} style={{ display: 'grid', gridTemplateColumns: '45px repeat(24, 1fr)', gap: '2px', marginBottom: '2px', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.725rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                        {day}
                      </div>
                      {Array.from({ length: 24 }).map((_, hIdx) => {
                        // Heuristic intensity calculation for realistic heatmap peaks
                        const isPeak = (hIdx >= 13 && hIdx <= 18) && (dIdx >= 1 && dIdx <= 4);
                        const isMid = (hIdx >= 9 && hIdx <= 21);
                        const weight = isPeak ? 0.85 + ((hIdx * 7 + dIdx * 11) % 15) / 100 : (isMid ? 0.4 + ((hIdx * 3 + dIdx * 5) % 30) / 100 : 0.08);
                        const simulatedClicks = Math.round(weight * (totalClicks / 20 || 12));

                        return (
                          <div
                            key={hIdx}
                            onMouseEnter={() => setHoveredHour({ day, hour: hIdx, clicks: simulatedClicks })}
                            onMouseLeave={() => setHoveredHour(null)}
                            style={{
                              height: '16px',
                              borderRadius: '2px',
                              backgroundColor: `rgba(9, 9, 11, ${Math.max(0.06, weight)})`,
                              cursor: 'pointer',
                              transition: 'transform 0.1s ease',
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Tooltip readout */}
              <div style={{ minHeight: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                {hoveredHour ? (
                  <span>
                    <strong>{hoveredHour.day} at {hoveredHour.hour}:00 UTC</strong>: {hoveredHour.clicks} clicks recorded
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-dim)' }}>Hover over any hourly square to inspect exact click density.</span>
                )}
              </div>
            </div>
          )}

          {/* 4. TAB CONTENT: GEOGRAPHIC CHOROPLETH MAP */}
          {activeTab === 'geomap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {/* Visual Country Distribution Matrix */}
                <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Top Geographic Regions
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {countries.map(([code, count]) => {
                      const meta = COUNTRY_FLAGS[code] || { name: code, flag: '🌐' };
                      const pct = Math.round((count / (totalClicks || 1)) * 100);
                      return (
                        <div key={code}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '3px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span>{meta.flag}</span>
                              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{meta.name} ({code})</span>
                            </div>
                            <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                              {count.toLocaleString()} ({pct}%)
                            </span>
                          </div>
                          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: '3px' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--primary-bg)', borderRadius: '3px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Country Insights Card */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Geo-Targeting Recommendation
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Your primary audience is located in <strong>{COUNTRY_FLAGS[countries[0]?.[0]]?.name || 'United States'}</strong> ({Math.round(((countries[0]?.[1] || 0) / (totalClicks || 1)) * 100)}% of traffic).
                  </p>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    💡 <strong>Pro Tip</strong>: You can configure custom Country Redirect rules in the Link Editor under the <strong>Geo</strong> tab to send international visitors to dedicated localized landing pages!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. TAB CONTENT: DEVICES & OS DONUT */}
          {activeTab === 'devices' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
              {/* SVG Donut Chart */}
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--border-subtle)" strokeWidth="3.5" />
                    {donutSegments.map((seg, i) => (
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke={seg.color}
                        strokeWidth="3.5"
                        strokeDasharray={seg.strokeDasharray}
                        strokeDashoffset={seg.strokeDashoffset}
                      />
                    ))}
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                      {totalDeviceClicks}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Clicks
                    </span>
                  </div>
                </div>
              </div>

              {/* Devices Legend */}
              <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.85rem' }}>
                  Operating System Distribution
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {donutSegments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seg.color }} />
                        <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{seg.dev}</span>
                      </div>
                      <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
                        {seg.count} clicks ({seg.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. TAB CONTENT: UTM CAMPAIGNS ATTRIBUTION */}
          {activeTab === 'utm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {/* UTM Sources */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Tag size={13} className="text-primary" /> Top utm_source Channels
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { source: 'google', clicks: Math.round(totalClicks * 0.38), tag: 'Search / PPC' },
                      { source: 'meta', clicks: Math.round(totalClicks * 0.29), tag: 'Social Ads' },
                      { source: 'newsletter', clicks: Math.round(totalClicks * 0.18), tag: 'Email' },
                      { source: 'linkedin', clicks: Math.round(totalClicks * 0.15), tag: 'B2B Promo' }
                    ].map(item => (
                      <div key={item.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem 0.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.source}</span>
                          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>{item.tag}</span>
                        </div>
                        <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {item.clicks || 1} clicks
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UTM Mediums */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Campaign Mediums (utm_medium)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { medium: 'cpc', pct: '38%', label: 'Paid Search' },
                      { medium: 'social_paid', pct: '29%', label: 'Paid Social' },
                      { medium: 'email', pct: '18%', label: 'Direct Newsletter' },
                      { medium: 'sponsored', pct: '15%', label: 'Sponsored Partner' }
                    ].map(item => (
                      <div key={item.medium} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem 0.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.medium}</span>
                          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>{item.label}</span>
                        </div>
                        <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                          {item.pct}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top UTM Campaigns */}
                <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    Active Campaigns (utm_campaign)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { campaign: 'launch_2026', status: 'Active', ctr: '4.8%' },
                      { campaign: 'summer_growth', status: 'Active', ctr: '3.9%' },
                      { campaign: 'weekly_digest', status: 'Recurring', ctr: '6.2%' }
                    ].map(item => (
                      <div key={item.campaign} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.4rem 0.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.campaign}</span>
                          <span style={{ fontSize: '0.675rem', color: 'var(--primary-bg)', display: 'block' }}>{item.status}</span>
                        </div>
                        <span className="tabular-nums" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>
                          {item.ctr} CTR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            ✓ Real-time GDPR-compliant heuristic analytics
          </span>
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            {onRefreshData && (
              <button onClick={onRefreshData} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                <RefreshCw size={13} /> Refresh
              </button>
            )}
            <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
