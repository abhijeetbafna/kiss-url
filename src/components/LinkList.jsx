import React, { useState } from 'react';
import { 
  Copy, Check, QrCode, BarChart3, ExternalLink, Play, Trash2, 
  Smartphone, Sparkles, Shield, Clock, Tag, Search, Filter, AlertCircle 
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
      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search links by alias, title, url, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Filter Badges */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveFilter('all')}
            className={`btn-ghost ${activeFilter === 'all' ? 'badge-indigo' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            All ({links.length})
          </button>
          <button
            onClick={() => setActiveFilter('social')}
            className={`btn-ghost ${activeFilter === 'social' ? 'badge-purple' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            <Sparkles size={12} /> Social Cards ({links.filter(l => l.socialOg?.enabled).length})
          </button>
          <button
            onClick={() => setActiveFilter('routing')}
            className={`btn-ghost ${activeFilter === 'routing' ? 'badge-cyan' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            <Smartphone size={12} /> Smart Routed ({links.filter(l => l.routing?.enabled).length})
          </button>
          <button
            onClick={() => setActiveFilter('protected')}
            className={`btn-ghost ${activeFilter === 'protected' ? 'badge-amber' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '6px' }}
          >
            <Shield size={12} /> Protected ({links.filter(l => l.protection?.isPasswordProtected || l.protection?.expiresAt || l.protection?.maxClicks > 0).length})
          </button>
        </div>
      </div>

      {/* Links List */}
      {filteredLinks.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <AlertCircle size={36} color="var(--text-dim)" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-muted)' }}>No matching links found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Try adjusting your search query or create a new smart link.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredLinks.map((link) => {
            const isProtected = link.protection?.isPasswordProtected;
            const hasExpiry = Boolean(link.protection?.expiresAt);
            const isSmartRouted = link.routing?.enabled;
            const hasSocialOg = link.socialOg?.enabled;
            const fullShortUrl = `https://${link.domain}/${link.slug}`;

            return (
              <div 
                key={link.id} 
                className="glass-panel-interactive"
                style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
              >
                {/* Left Info */}
                <div style={{ flex: '1 1 360px', minWidth: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                      {link.title || link.slug}
                    </h3>

                    {/* Feature Badges */}
                    {hasSocialOg && (
                      <span className="badge badge-purple" title="Custom OpenGraph Social Preview">
                        <Sparkles size={10} /> Social Card
                      </span>
                    )}
                    {isSmartRouted && (
                      <span className="badge badge-cyan" title="iOS & Android Smart Device Routing">
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

                  {/* Short Link & Target URL */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                    <code style={{ 
                      color: 'var(--accent-cyan)', 
                      fontWeight: '600', 
                      background: 'rgba(6, 182, 212, 0.08)', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}>
                      {fullShortUrl}
                    </code>
                    <span style={{ color: 'var(--text-dim)' }}>➔</span>
                    <span style={{ 
                      color: 'var(--text-muted)', 
                      maxWidth: '300px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {link.targetUrl}
                    </span>
                  </div>

                  {/* Tags */}
                  {link.tags && link.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {link.tags.map((tag, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.7rem', 
                          color: 'var(--text-dim)', 
                          background: 'rgba(255,255,255,0.04)', 
                          padding: '1px 6px', 
                          borderRadius: '4px' 
                        }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Tools & Clicks */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Click Counter Button */}
                  <button
                    onClick={() => onOpenAnalytics(link)}
                    className="btn-ghost"
                    style={{ 
                      background: 'rgba(99, 102, 241, 0.08)', 
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      textAlign: 'left'
                    }}
                    title="View Deep Analytics"
                  >
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>Clicks</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <BarChart3 size={15} color="#818cf8" /> {(link.clicks || 0).toLocaleString()}
                    </div>
                  </button>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleCopy(link)}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                      title="Copy Short URL"
                    >
                      {copiedId === link.id ? <><Check size={14} color="#10b981" /> Copied</> : <><Copy size={14} /> Copy</>}
                    </button>

                    <button
                      onClick={() => onOpenQR(link)}
                      className="btn-icon"
                      title="Generate Studio QR Code"
                    >
                      <QrCode size={16} />
                    </button>

                    <button
                      onClick={() => onOpenSimulator(link)}
                      className="btn-icon"
                      title="Test in Edge Routing Simulator"
                    >
                      <Play size={16} color="#38bdf8" />
                    </button>

                    <button
                      onClick={() => onDelete(link.id)}
                      className="btn-icon"
                      style={{ color: 'var(--accent-rose)' }}
                      title="Delete Link"
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
