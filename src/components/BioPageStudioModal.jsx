import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, ExternalLink, Copy, Check, Eye, Play, Music, Mail, Users, Download, Sparkles
} from 'lucide-react';
import { 
  getStoredBioPages, saveBioPage, buildBioUrl, getStoredBioLeads, exportBioLeadsCSV 
} from '../services/storageService';
import BioPageRenderer from './BioPageRenderer';

export default function BioPageStudioModal({ isOpen, onClose, onOpenLiveBio }) {
  const [bioPages, setBioPages] = useState([]);
  const [selectedHandle, setSelectedHandle] = useState('');
  const [studioTab, setStudioTab] = useState('editor'); // editor | leads
  
  // Editor state
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState('minimal');
  
  // Socials
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');

  // Links / Blocks List
  const [links, setLinks] = useState([]);
  const [copied, setCopied] = useState(false);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const pages = getStoredBioPages();
    setBioPages(pages);
    if (pages.length > 0) {
      loadPageIntoForm(pages[0]);
    } else {
      resetForm();
    }
  }, [isOpen]);

  const loadPageIntoForm = (page) => {
    setSelectedHandle(page.handle);
    setHandle(page.handle);
    setName(page.name || '');
    setTagline(page.tagline || '');
    setBio(page.bio || '');
    setAvatarUrl(page.avatarUrl || '');
    setTheme(page.theme || 'minimal');
    setTwitter(page.socials?.twitter || '');
    setGithub(page.socials?.github || '');
    setLinkedin(page.socials?.linkedin || '');
    setWebsite(page.socials?.website || '');
    setEmail(page.socials?.email || '');
    setLinks(page.links || []);
    setLeads(getStoredBioLeads(page.handle));
  };

  const resetForm = () => {
    const randomHandle = 'creator' + Math.floor(100 + Math.random() * 900);
    setSelectedHandle('');
    setHandle(randomHandle);
    setName('Your Name');
    setTagline('Creator & Builder');
    setBio('Welcome to my profile. Explore my latest projects, newsletters, and links below.');
    setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
    setTheme('minimal');
    setTwitter('');
    setGithub('');
    setLinkedin('');
    setWebsite('');
    setEmail('');
    setLinks([
      { id: 'l1', type: 'link', title: '🚀 My Primary Project / Store', subtitle: 'Check out our latest release', url: 'https://github.com', highlight: true },
      { id: 'l2', type: 'newsletter', title: '📰 Weekly Newsletter', subtitle: 'Subscribe for free insights straight to your inbox', url: '', highlight: false }
    ]);
    setLeads([]);
  };

  if (!isOpen) return null;

  const handleAddBlock = (type = 'link') => {
    let title = 'New Link';
    let subtitle = '';
    let url = 'https://';

    if (type === 'youtube') {
      title = 'Watch My Latest Video';
      url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    } else if (type === 'spotify') {
      title = 'Listen to Favorite Track';
      url = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';
    } else if (type === 'newsletter') {
      title = 'Join the Newsletter';
      subtitle = 'Get weekly updates directly to your inbox.';
      url = '';
    }

    const newBlock = {
      id: 'b_' + Math.random().toString(36).substring(2, 7),
      type,
      title,
      subtitle,
      url,
      highlight: false
    };
    setLinks([...links, newBlock]);
  };

  const handleUpdateLink = (id, field, value) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleRemoveLink = (id) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!handle.trim() || !name.trim()) {
      alert('Please provide a username handle and name.');
      return;
    }

    const payload = {
      handle: handle.trim(),
      name: name.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      theme,
      socials: { twitter, github, linkedin, website, email },
      links
    };

    const saved = saveBioPage(payload);
    const updatedList = getStoredBioPages();
    setBioPages(updatedList);
    setSelectedHandle(saved.handle);
    alert(`Bio Page @${saved.handle} saved successfully!`);
  };

  const currentPreviewData = {
    handle: handle || 'username',
    name: name || 'Your Name',
    tagline: tagline || '',
    bio: bio || '',
    avatarUrl: avatarUrl || '',
    theme,
    socials: { twitter, github, linkedin, website, email },
    links
  };

  const fullBioUrl = buildBioUrl(handle);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullBioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '980px', maxHeight: '92vh', position: 'relative', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Link in Bio Studio
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Create mobile-first profiles with media embeds, links, and lead capture forms.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <a 
              href={`/bio/${handle}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', display: 'inline-flex' }}
            >
              <Eye size={13} /> View Live Profile
            </a>
            <button onClick={onClose} className="btn-icon" aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)' }}>
          <button
            onClick={() => setStudioTab('editor')}
            className={`btn ${studioTab === 'editor' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
          >
            Profile Editor & Blocks
          </button>
          <button
            onClick={() => {
              setStudioTab('leads');
              setLeads(getStoredBioLeads(handle));
            }}
            className={`btn ${studioTab === 'leads' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.785rem', padding: '0.3rem 0.65rem' }}
          >
            <Users size={13} /> Subscribers ({getStoredBioLeads(handle).length})
          </button>
        </div>

        {/* Studio Body: Split View */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', flex: 1, overflow: 'hidden' }}>
          {/* LEFT: Editor Panel */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border-subtle)' }}>
            {studioTab === 'editor' ? (
              <form onSubmit={handleSave}>
                {/* Switch / New profile */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
                    {bioPages.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => loadPageIntoForm(p)}
                        className={`btn ${selectedHandle === p.handle ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                      >
                        @{p.handle}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={resetForm} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}>
                    <Plus size={11} /> New Profile
                  </button>
                </div>

                {/* Profile Identity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Username Handle (@)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. alexdev"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        className="input input-mono"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        Display Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                        style={{ fontSize: '0.85rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Tagline / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Design Engineer & Writer"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Bio Description
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Theme Picker */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Page Theme
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {[
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'dark', label: 'OLED Dark' },
                      { id: 'cobalt', label: 'Cobalt Blue' },
                      { id: 'emerald', label: 'Emerald' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id)}
                        className={`btn ${theme === t.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social Accounts */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Social Accounts
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <input
                      type="text"
                      placeholder="Twitter / X username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="GitHub username"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Personal Website URL"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* Interactive Blocks & Links Editor */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Interactive Blocks & Links ({links.length})
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <button type="button" onClick={() => handleAddBlock('link')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}>
                        + Link
                      </button>
                      <button type="button" onClick={() => handleAddBlock('youtube')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}>
                        <Play size={11} color="#ef4444" /> YouTube
                      </button>
                      <button type="button" onClick={() => handleAddBlock('spotify')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}>
                        <Music size={11} color="#10b981" /> Spotify
                      </button>
                      <button type="button" onClick={() => handleAddBlock('newsletter')} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem' }}>
                        <Mail size={11} /> Lead Form
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {links.map((item, idx) => (
                      <div 
                        key={item.id} 
                        style={{ 
                          backgroundColor: 'var(--bg-subtle)', 
                          border: '1px solid var(--border-default)', 
                          borderRadius: 'var(--radius-sm)', 
                          padding: '0.75rem' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span className="badge" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                            {item.type || 'link'} block #{idx + 1}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveLink(item.id)}
                            className="btn-icon" 
                            style={{ width: '22px', height: '22px', color: 'var(--error-text)' }}
                            title="Remove block"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          <input
                            type="text"
                            placeholder="Heading / Title"
                            value={item.title}
                            onChange={(e) => handleUpdateLink(item.id, 'title', e.target.value)}
                            className="input"
                            style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                          />
                          {item.type !== 'youtube' && item.type !== 'spotify' && (
                            <input
                              type="text"
                              placeholder="Subtitle / Description"
                              value={item.subtitle || ''}
                              onChange={(e) => handleUpdateLink(item.id, 'subtitle', e.target.value)}
                              className="input"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                            />
                          )}
                          {item.type !== 'newsletter' && (
                            <input
                              type="text"
                              placeholder={item.type === 'youtube' ? 'YouTube Video URL (https://youtube.com/watch?v=...)' : (item.type === 'spotify' ? 'Spotify Track/Album URL (https://open.spotify.com/...)' : 'Destination URL (https://...)')}
                              value={item.url}
                              onChange={(e) => handleUpdateLink(item.id, 'url', e.target.value)}
                              className="input"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Profile Changes
                  </button>
                  <button type="button" onClick={handleCopyUrl} className="btn btn-secondary">
                    {copied ? <><Check size={13} color="#10b981" /> Copied URL</> : <><Copy size={13} /> Copy Profile URL</>}
                  </button>
                </div>
              </form>
            ) : (
              /* LEADS & SUBSCRIBERS TAB */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Newsletter Subscribers (@{handle})
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {leads.length} total subscribers collected from your Bio Lead forms.
                    </p>
                  </div>
                  {leads.length > 0 && (
                    <button
                      onClick={() => exportBioLeadsCSV(handle)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <Download size={13} /> Export CSV
                    </button>
                  )}
                </div>

                {leads.length === 0 ? (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                    <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      No subscribers yet
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Add a <strong>Lead Form</strong> block to your Bio Page to start collecting email subscribers.
                    </p>
                  </div>
                ) : (
                  <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                          <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Email Address</th>
                          <th style={{ padding: '0.5rem 0.75rem', color: 'var(--text-secondary)' }}>Date Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((l) => (
                          <tr key={l.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.5rem 0.75rem', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                              {l.email}
                            </td>
                            <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(l.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Live Mobile Phone Frame Preview */}
          <div style={{ 
            backgroundColor: 'var(--bg-muted)', 
            padding: '1.5rem 1rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflowY: 'auto'
          }}>
            <div style={{
              width: '320px',
              height: '560px',
              borderRadius: '32px',
              border: '6px solid var(--border-strong)',
              backgroundColor: theme === 'dark' ? '#09090b' : (theme === 'cobalt' ? '#0f172a' : (theme === 'emerald' ? '#064e3b' : '#ffffff')),
              overflow: 'hidden',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              position: 'relative'
            }}>
              {/* Phone Speaker Notch */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(128,128,128,0.4)',
                zIndex: 20
              }} />

              {/* Inner preview frame content */}
              <div style={{ height: '100%', overflowY: 'auto', padding: '1.5rem 0.75rem', fontSize: '0.85rem' }}>
                <BioPageRenderer handle={handle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
