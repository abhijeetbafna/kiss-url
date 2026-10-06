import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Upload, 
  Download, 
  Check, 
  FileText, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { createBulkLinks, importLinksFromCSV, buildShortUrl } from '../services/storageService';
import confetti from 'canvas-confetti';

export default function BulkShortenerModal({ isOpen, onClose, onLinksCreated }) {
  const [activeTab, setActiveTab] = useState('paste'); // paste | csv
  const [urlsText, setUrlsText] = useState('');
  const [domain, setDomain] = useState('kiss.url');
  const [tags, setTags] = useState('Campaign, Bulk');
  const [createdResults, setCreatedResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePasteSubmit = (e) => {
    e.preventDefault();
    const list = urlsText.split(/\r?\n/).map(u => u.trim()).filter(Boolean);
    if (list.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const created = createBulkLinks(list, {
        domain,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setCreatedResults(created);
      setIsProcessing(false);
      if (onLinksCreated) onLinksCreated();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 400);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const imported = importLinksFromCSV(text);
      if (imported.length > 0) {
        setCreatedResults(imported);
        if (onLinksCreated) onLinksCreated();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        alert('Could not parse any valid URLs from this CSV file. Please ensure there is a URL column.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBatchCSV = () => {
    if (createdResults.length === 0) return;
    const headers = ['Slug', 'Short URL', 'Destination URL', 'Title'];
    const rows = createdResults.map(l => [
      `"${l.slug}"`,
      `"${buildShortUrl(l.slug, l.domain)}"`,
      `"${l.targetUrl}"`,
      `"${(l.title || '').replace(/"/g, '""')}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kissurl_bulk_batch_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} /> Bulk Shortener & CSV Batch Engine
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Shorten up to 50 URLs at once or import directly from spreadsheets.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Navigation Tabs */}
        {createdResults.length === 0 && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem', backgroundColor: 'var(--bg-subtle)', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('paste')}
              className="tab-btn"
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                borderBottom: activeTab === 'paste' ? '2px solid var(--primary-bg)' : '2px solid transparent',
                color: activeTab === 'paste' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              Paste URL List
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className="tab-btn"
              style={{
                padding: '0.75rem 1rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                borderBottom: activeTab === 'csv' ? '2px solid var(--primary-bg)' : '2px solid transparent',
                color: activeTab === 'csv' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              Upload CSV File
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="modal-body">
          {createdResults.length === 0 ? (
            <>
              {activeTab === 'paste' && (
                <form onSubmit={handlePasteSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Enter URLs (One URL per line, max 50)
                    </label>
                    <textarea
                      rows={6}
                      placeholder={`https://example.com/product-1\nhttps://example.com/product-2\nhttps://example.com/promo-landing`}
                      value={urlsText}
                      onChange={(e) => setUrlsText(e.target.value)}
                      className="input input-mono"
                      style={{ fontSize: '0.825rem', lineHeight: '1.5' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Domain
                      </label>
                      <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="input"
                      >
                        <option value="kiss.url">kiss.url</option>
                        <option value="go.bio">go.bio</option>
                        <option value="click.to">click.to</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                        Batch Tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isProcessing}>
                      {isProcessing ? 'Generating Links...' : 'Generate Short Links Batch'}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'csv' && (
                <div>
                  <div style={{
                    border: '2px dashed var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    marginBottom: '1rem'
                  }}>
                    <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      Choose or Drag & Drop a CSV File
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      CSV should contain columns like: <code style={{ fontFamily: 'var(--font-mono)' }}>url</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>title</code>, <code style={{ fontFamily: 'var(--font-mono)' }}>slug</code>
                    </p>

                    <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={handleCSVUpload}
                        style={{ display: 'none' }}
                      />
                      Select CSV File
                    </label>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results View */
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#10b981', fontWeight: '600', fontSize: '0.85rem' }}>
                  <Check size={16} /> Successfully generated {createdResults.length} short links!
                </div>
                <button
                  onClick={handleDownloadBatchCSV}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.785rem', padding: '0.35rem 0.65rem' }}
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>

              {/* Links Table */}
              <div style={{
                maxHeight: '260px',
                overflowY: 'auto',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Short Link</th>
                      <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdResults.map((link) => (
                      <tr key={link.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                          <a href={buildShortUrl(link.slug, link.domain)} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-bg)' }}>
                            /{link.slug}
                          </a>
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                          {link.targetUrl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setCreatedResults([]);
                    setUrlsText('');
                  }}
                  className="btn btn-secondary"
                >
                  Shorten Another Batch
                </button>
                <button onClick={onClose} className="btn btn-primary">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
