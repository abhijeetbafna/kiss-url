import React, { useState } from 'react';
import { Copy, Check, QrCode, BarChart2, ExternalLink, Trash2, Search, Download } from 'lucide-react';
import { exportLinksAsCSV } from '../services/storageService';

export default function RecentLinks({ links, onDelete, onOpenQR, onOpenAnalytics }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (link) => {
    const fullUrl = `https://${link.domain}/${link.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(l => 
    l.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section 
      id="recent-links-section" 
      className="surface-card" 
      style={{ 
        padding: '1.75rem', 
        marginBottom: '2.5rem',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Your Recent Links
          </h2>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Saved locally in your browser session.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {links.length > 2 && (
            <div style={{ position: 'relative' }}>
              <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '1.75rem', fontSize: '0.8rem', minHeight: '34px', paddingBlock: '0.35rem' }}
              />
            </div>
          )}

          {links.length > 0 && (
            <button onClick={exportLinksAsCSV} className="btn-ghost" style={{ fontSize: '0.775rem', padding: '0.35rem 0.6rem' }} title="Export CSV">
              <Download size={13} /> CSV
            </button>
          )}
        </div>
      </div>

      {/* Links List */}
      {filteredLinks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {links.length === 0 ? 'Shorten your first link above to see it listed here.' : 'No links match your search filter.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filteredLinks.map((link) => {
            const fullShortUrl = `https://${link.domain}/${link.slug}`;

            return (
              <div
                key={link.id}
                className="surface-card-interactive"
                style={{
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                {/* Left URL Info */}
                <div style={{ minWidth: 0, flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                    <code style={{ 
                      color: 'var(--accent-primary)', 
                      fontWeight: '700', 
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {fullShortUrl}
                    </code>
                    {link.clicks > 0 && (
                      <span className="tabular-nums badge badge-info" style={{ fontSize: '0.675rem', padding: '0.1rem 0.4rem' }}>
                        {link.clicks.toLocaleString()} clicks
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    color: 'var(--text-muted)', 
                    fontSize: '0.775rem', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    maxWidth: '450px'
                  }}>
                    {link.targetUrl}
                  </div>
                </div>

                {/* Right Action Tools */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleCopy(link)}
                    className="btn-secondary"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem', minHeight: '32px' }}
                  >
                    {copiedId === link.id ? <><Check size={13} color="#059669" /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>

                  <button
                    onClick={() => onOpenQR(link)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="QR Code"
                    aria-label="QR Code"
                  >
                    <QrCode size={14} />
                  </button>

                  <button
                    onClick={() => onOpenAnalytics(link)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Analytics"
                    aria-label="Analytics"
                  >
                    <BarChart2 size={14} color="var(--accent-primary)" />
                  </button>

                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    title="Open destination"
                    aria-label="Open destination"
                  >
                    <ExternalLink size={14} />
                  </a>

                  <button
                    onClick={() => onDelete(link.id)}
                    className="btn-icon"
                    style={{ width: '32px', height: '32px', color: 'var(--status-error-text)' }}
                    title="Delete link"
                    aria-label="Delete link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
