import React, { useState } from 'react';
import { 
  Copy, Check, QrCode, BarChart3, Play, Trash2, 
  Search, Shield, Clock, Smartphone, Sparkles, Inbox,
  Shuffle, Globe
} from 'lucide-react';
import { buildShortUrl } from '../services/storageService';

export default function LinkList({ links, onDelete, onOpenQR, onOpenAnalytics, onOpenSimulator }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | social | routing | protected
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (link) => {
    const fullUrl = buildShortUrl(link.slug, link.domain);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter((link) => {
    const matchesSearch = 
      link.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.tags && link.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (activeFilter === 'social') return link.socialOg?.enabled;
    if (activeFilter === 'routing') return link.routing?.enabled;
    if (activeFilter === 'protected') return link.protection?.isPasswordProtected || link.protection?.expiresAt || link.protection?.maxClicks > 0;
    return true;
  });

  return (
    <div style={{ width: '100%' }}>
      {/* Search & Filter Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.75rem',
          marginBottom: '1rem'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '380px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search links by name, alias, or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ paddingLeft: '2rem', fontSize: '0.85rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
          >
            All <span className="tabular-nums">({links.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('social')}
            className={`btn ${activeFilter === 'social' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
          >
            Social Cards ({links.filter(l => l.socialOg?.enabled).length})
          </button>
          <button
            onClick={() => setActiveFilter('routing')}
            className={`btn ${activeFilter === 'routing' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
          >
            Device Routed ({links.filter(l => l.routing?.enabled).length})
          </button>
          <button
            onClick={() => setActiveFilter('protected')}
            className={`btn ${activeFilter === 'protected' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
          >
            Protected ({links.filter(l => l.protection?.isPasswordProtected || l.protection?.expiresAt || l.protection?.maxClicks > 0).length})
          </button>
        </div>
      </div>

      {/* Links List / Table */}
      {filteredLinks.length === 0 ? (
        <div style={{ 
          padding: '3rem 1.5rem', 
          textAlign: 'center', 
          backgroundColor: 'var(--bg-subtle)', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-default)' 
        }}>
          <Inbox size={28} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
          <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>No links found</div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Try adjusting your search query or create a new short link above.
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden'
        }}>
          {filteredLinks.map((link, idx) => {
            const isProtected = link.protection?.isPasswordProtected;
            const hasExpiry = Boolean(link.protection?.expiresAt);
            const isSmartRouted = link.routing?.enabled;
            const hasSocialOg = link.socialOg?.enabled;
            const fullShortUrl = buildShortUrl(link.slug, link.domain);

            return (
              <div 
                key={link.id}
                style={{ 
                  padding: '0.85rem 1.15rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '0.85rem',
                  borderBottom: idx < filteredLinks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  transition: 'background-color var(--duration-fast) var(--ease-out)'
                }}
              >
                {/* Left: Link Details */}
                <div style={{ flex: '1 1 340px', minWidth: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {link.title || link.slug}
                    </span>

                    {hasSocialOg && (
                      <span className="badge" title="Custom Social Preview">
                        <Sparkles size={10} /> Social
                      </span>
                    )}
                    {isSmartRouted && (
                      <span className="badge" title="Smart Device Routing">
                        <Smartphone size={10} /> Devices
                      </span>
                    )}
                    {link.splitTesting?.enabled && (
                      <span className="badge" style={{ borderColor: 'rgba(168, 85, 247, 0.4)', color: '#c084fc' }} title="A/B Split Testing Active">
                        <Shuffle size={10} /> Split A/B
                      </span>
                    )}
                    {link.geoRouting?.enabled && (
                      <span className="badge" style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#60a5fa' }} title="Geo-Location Targeted">
                        <Globe size={10} /> Geo Rules
                      </span>
                    )}
                    {isProtected && (
                      <span className="badge" title="Password Protected">
                        <Shield size={10} /> Password
                      </span>
                    )}
                    {hasExpiry && (
                      <span className="badge" title={`Expires: ${link.protection.expiresAt}`}>
                        <Clock size={10} /> Expiring
                      </span>
                    )}
                  </div>

                  {/* URLs & Health Sentinel */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
                    <span 
                      style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}
                      title="Sentinel: Target 200 OK Healthy"
                    />
                    <code style={{ 
                      color: 'var(--text-primary)', 
                      fontWeight: '600', 
                      fontFamily: 'var(--font-mono)',
                      backgroundColor: 'var(--bg-muted)',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)'
                    }}>
                      {fullShortUrl}
                    </code>
                    <span style={{ color: 'var(--text-dim)' }}>➔</span>
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      maxWidth: '280px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {link.targetUrl}
                    </span>
                  </div>
                </div>

                {/* Right: Clicks & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Click Badge Button */}
                  <button
                    onClick={() => onOpenAnalytics(link)}
                    className="btn btn-ghost"
                    style={{ 
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                    title="View Analytics"
                  >
                    <BarChart3 size={13} color="var(--text-muted)" />
                    <span className="tabular-nums" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {(link.clicks || 0).toLocaleString()}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>clicks</span>
                  </button>

                  {/* Actions */}
                  <button
                    onClick={() => handleCopy(link)}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                    title="Copy Short URL"
                  >
                    {copiedId === link.id ? <><Check size={12} color="#15803d" /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>

                  <button
                    onClick={() => onOpenQR(link)}
                    className="btn-icon"
                    title="QR Code"
                    aria-label="QR Code"
                  >
                    <QrCode size={14} />
                  </button>

                  <button
                    onClick={() => onOpenSimulator(link)}
                    className="btn-icon"
                    title="Preview Destination"
                    aria-label="Preview Destination"
                  >
                    <Play size={14} />
                  </button>

                  <button
                    onClick={() => onDelete(link.id)}
                    className="btn-icon"
                    title="Delete Link"
                    aria-label="Delete Link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
