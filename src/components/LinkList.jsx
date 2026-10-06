import React, { useState } from 'react';
import { 
  Copy, Check, QrCode, BarChart3, Play, Trash2, 
  Smartphone, Sparkles, Shield, Clock, Search, AlertCircle 
} from 'lucide-react';

export default function LinkList({ links, onDelete, onOpenQR, onOpenAnalytics, onOpenSimulator }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all | social | routing | protected
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (link) => {
    const fullUrl = `https://${link.domain}/${link.slug}`;
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
    <div>
      {/* Search & Filter Toolbar */}
      <div 
        className="card-surface" 
        style={{ 
          padding: '0.875rem 1.25rem', 
          marginBottom: '1rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '0.75rem' 
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search links by alias, title, url, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Filter Badges with Real Counts */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`btn-ghost ${activeFilter === 'all' ? 'badge-indigo' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            All <span className="tabular-nums" style={{ fontWeight: '700', marginLeft: '2px' }}>({links.length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('social')}
            className={`btn-ghost ${activeFilter === 'social' ? 'badge-purple' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Sparkles size={12} /> Social Cards <span className="tabular-nums" style={{ fontWeight: '700', marginLeft: '2px' }}>({links.filter(l => l.socialOg?.enabled).length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('routing')}
            className={`btn-ghost ${activeFilter === 'routing' ? 'badge-emerald' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Smartphone size={12} /> Smart Routed <span className="tabular-nums" style={{ fontWeight: '700', marginLeft: '2px' }}>({links.filter(l => l.routing?.enabled).length})</span>
          </button>
          <button
            onClick={() => setActiveFilter('protected')}
            className={`btn-ghost ${activeFilter === 'protected' ? 'badge-amber' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
          >
            <Shield size={12} /> Protected <span className="tabular-nums" style={{ fontWeight: '700', marginLeft: '2px' }}>({links.filter(l => l.protection?.isPasswordProtected || l.protection?.expiresAt || l.protection?.maxClicks > 0).length})</span>
          </button>
        </div>
      </div>

      {/* Links List */}
      {filteredLinks.length === 0 ? (
        <div className="card-surface" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>No links match your criteria</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Adjust your search filter or create a new smart link.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredLinks.map((link) => {
            const isProtected = link.protection?.isPasswordProtected;
            const hasExpiry = Boolean(link.protection?.expiresAt);
            const isSmartRouted = link.routing?.enabled;
            const hasSocialOg = link.socialOg?.enabled;
            const fullShortUrl = `https://${link.domain}/${link.slug}`;

            return (
              <div 
                key={link.id} 
                className="card-interactive"
                style={{ 
                  padding: '1.15rem 1.35rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '1rem' 
                }}
              >
                {/* Left Meta & URL Details */}
                <div style={{ flex: '1 1 360px', minWidth: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {link.title || link.slug}
                    </h3>

                    {/* Semantic Badges */}
                    {hasSocialOg && (
                      <span className="badge badge-purple" title="Custom OpenGraph Social Preview">
                        <Sparkles size={10} /> Social Card
                      </span>
                    )}
                    {isSmartRouted && (
                      <span className="badge badge-emerald" title="iOS & Android Smart Device Routing">
                        <Smartphone size={10} /> Smart Routed
                      </span>
                    )}
                    {isProtected && (
                      <span className="badge badge-amber" title="Passcode Protected">
                        <Shield size={10} /> Password
                      </span>
                    )}
                    {hasExpiry && (
                      <span className="badge badge-rose" title={`Expires on ${link.protection.expiresAt}`}>
                        <Clock size={10} /> Expiring
                      </span>
                    )}
                  </div>

                  {/* Short Link & Target */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <code style={{ 
                      color: 'var(--accent-primary)', 
                      fontWeight: '700', 
                      backgroundColor: 'var(--accent-subtle)', 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--accent-border)',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {fullShortUrl}
                    </code>
                    <span style={{ color: 'var(--text-muted)' }}>➔</span>
                    <span style={{ 
                      color: 'var(--text-secondary)', 
                      maxWidth: '320px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {link.targetUrl}
                    </span>
                  </div>

                  {/* Tag Pills */}
                  {link.tags && link.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
                      {link.tags.map((tag, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '500',
                          color: 'var(--text-muted)', 
                          backgroundColor: 'var(--bg-surface-muted)', 
                          padding: '1px 6px', 
                          borderRadius: 'var(--radius-xs)' 
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Tools & Tabular Clicks */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {/* Click Badge with Tabular Numeral */}
                  <button
                    onClick={() => onOpenAnalytics(link)}
                    className="btn-ghost"
                    style={{ 
                      backgroundColor: 'var(--accent-subtle)', 
                      border: '1px solid var(--accent-border)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left'
                    }}
                    title="View Deep Analytics"
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: '700' }}>Clicks</div>
                    <div className="tabular-nums" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BarChart3 size={14} color="var(--accent-primary)" /> {(link.clicks || 0).toLocaleString()}
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleCopy(link)}
                      className="btn-secondary"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      title="Copy Short URL"
                    >
                      {copiedId === link.id ? <><Check size={14} color="#059669" /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>

                    <button
                      onClick={() => onOpenQR(link)}
                      className="btn-icon"
                      title="Generate Studio QR Code"
                      aria-label="Generate QR Code"
                    >
                      <QrCode size={16} />
                    </button>

                    <button
                      onClick={() => onOpenSimulator(link)}
                      className="btn-icon"
                      title="Preview Link & Device Routing"
                      aria-label="Preview Routing"
                    >
                      <Play size={16} color="var(--accent-primary)" />
                    </button>

                    <button
                      onClick={() => onDelete(link.id)}
                      className="btn-icon"
                      style={{ color: 'var(--badge-rose-text)' }}
                      title="Delete Link"
                      aria-label="Delete Link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
