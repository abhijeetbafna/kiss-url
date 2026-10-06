import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, ExternalLink, Copy, Check, Eye
} from 'lucide-react';
import { 
  getStoredBioPages, saveBioPage, buildBioUrl 
} from '../services/storageService';
import BioPageRenderer from './BioPageRenderer';

export default function BioPageStudioModal({ isOpen, onClose, onOpenLiveBio }) {
  const [bioPages, setBioPages] = useState([]);
  const [selectedHandle, setSelectedHandle] = useState('');
  
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

  // Links List
  const [links, setLinks] = useState([]);
  const [copied, setCopied] = useState(false);

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
      { id: 'l1', title: '🚀 My Primary Project / Store', subtitle: 'Check out our latest release', url: 'https://github.com', highlight: true },
      { id: 'l2', title: '📰 Weekly Newsletter', subtitle: 'Subscribe for free insights', url: 'https://substack.com', highlight: false }
    ]);
  };

  if (!isOpen) return null;

  const handleAddLink = () => {
    const newLink = {
      id: 'l_' + Math.random().toString(36).substring(2, 7),
      title: 'New Link Title',
      subtitle: 'Optional description',
      url: 'https://yourwebsite.com',
      highlight: false
    };
    setLinks([...links, newLink]);
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
        style={{ maxWidth: '940px', maxHeight: '90vh', position: 'relative', display: 'flex', flexDirection: 'column' }}
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
              Create and customize your mobile-first profile page with multiple links and social handles.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button onClick={() => onOpenLiveBio(handle)} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              <Eye size={13} /> View Live Profile
            </button>
            <button onClick={onClose} className="btn-icon" aria-label="Close modal">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Studio Body: Split View (Editor Left, Live Preview Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', flex: 1, overflow: 'hidden' }}>
          
          {/* LEFT: Configuration Forms */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', borderRight: '1px solid var(--border-subtle)' }}>
            <form onSubmit={handleSave}>
              {/* Profile selector pill bar */}
              {bioPages.length > 1 && (
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {bioPages.map(p => (
                    <button
                      key={p.handle}
                      type="button"
                      onClick={() => loadPageIntoForm(p)}
                      className={`btn ${selectedHandle === p.handle ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                    >
                      @{p.handle}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                  >
                    + New Profile
                  </button>
                </div>
              )}

              {/* Basic Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Profile Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Username Handle *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '0.5rem 0.6rem', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-default)', borderRight: 'none', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>@</span>
                      <input
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                        className="input"
                        style={{ borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Tagline
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

              {/* Links List Editor */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    Links Stack ({links.length})
                  </div>
                  <button type="button" onClick={handleAddLink} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}>
                    <Plus size={12} /> Add Link
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {links.map((linkItem, idx) => (
                    <div 
                      key={linkItem.id} 
                      style={{ 
                        backgroundColor: 'var(--bg-subtle)', 
                        border: '1px solid var(--border-default)', 
                        borderRadius: 'var(--radius-sm)', 
                        padding: '0.75rem' 
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                          Link #{idx + 1}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveLink(linkItem.id)}
                          className="btn-icon" 
                          style={{ width: '22px', height: '22px', color: 'var(--error-text)' }}
                          title="Remove link"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <input
                          type="text"
                          placeholder="Title (e.g. My Portfolio Website)"
                          value={linkItem.title}
                          onChange={(e) => handleUpdateLink(linkItem.id, 'title', e.target.value)}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Subtitle (Optional description)"
                          value={linkItem.subtitle || ''}
                          onChange={(e) => handleUpdateLink(linkItem.id, 'subtitle', e.target.value)}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                        />
                        <input
                          type="text"
                          placeholder="Destination URL (https://...)"
                          value={linkItem.url}
                          onChange={(e) => handleUpdateLink(linkItem.id, 'url', e.target.value)}
                          className="input"
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
                        />
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
                  {copied ? <><Check size={13} color="#15803d" /> Copied URL</> : <><Copy size={13} /> Copy Profile URL</>}
                </button>
              </div>
            </form>
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
              borderRadius: '36px',
              border: '6px solid var(--border-strong)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-page)',
              position: 'relative'
            }}>
              {/* Phone Camera Notch */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '14px',
                backgroundColor: 'var(--border-strong)',
                borderRadius: '10px',
                zIndex: 20
              }} />

              {/* Render Preview */}
              <div style={{ width: '100%', height: '100%', overflowY: 'auto', paddingTop: '1.25rem' }}>
                <BioPageRenderer handle={currentPreviewData.handle} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
