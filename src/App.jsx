import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LinkList from './components/LinkList';
import LinkCreatorModal from './components/LinkCreatorModal';
import QRCodeModal from './components/QRCodeModal';
import AnalyticsModal from './components/AnalyticsModal';
import SimulatorModal from './components/SimulatorModal';
import ZeroCostDeployModal from './components/ZeroCostDeployModal';
import { getStoredLinks, createLink, deleteLink } from './services/storageService';
import { Sparkles, ArrowRight, Zap, Shield, Smartphone, QrCode, Layers } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState([]);
  const [quickUrl, setQuickUrl] = useState('');
  
  // Theme state (Default: Light Mode as requested)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('linkpulse_theme') || 'light';
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState(null);
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeSimulatorLink, setActiveSimulatorLink] = useState(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('linkpulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loadData = () => {
    const data = getStoredLinks();
    setLinks(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  // Quick Shorten on Hero
  const handleQuickShorten = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setCreateInitialData({
      targetUrl: quickUrl.trim(),
    });
    setIsCreateModalOpen(true);
    setQuickUrl('');
  };

  const handleLinkCreated = (newLinkData) => {
    createLink(newLinkData);
    loadData();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      deleteLink(id);
      loadData();
    }
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      {/* Top Header */}
      <Header
        totalLinks={links.length}
        totalClicks={totalClicks}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Hero Banner (60% Neutral Base, 30% Slate Structure, 10% Cobalt Accent) */}
      <section 
        className="card-surface" 
        style={{ 
          padding: '2.5rem 2rem', 
          marginBottom: '2rem', 
          position: 'relative', 
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-indigo">
              <Sparkles size={12} /> Next-Gen Link Intelligence
            </span>
          </div>
          
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Transform Simple Links into <span style={{ color: 'var(--accent-primary)' }}>Dynamic Assets</span>
          </h2>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            Real-time social previews, device-aware app routing, vector QR studio, and privacy analytics. 100% Free to host on modern edge infrastructure.
          </p>

          {/* Quick Input Bar */}
          <form 
            onSubmit={handleQuickShorten} 
            style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              backgroundColor: 'var(--bg-surface-muted)', 
              padding: '0.4rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-strong)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <input
              type="text"
              placeholder="Paste your long destination URL (e.g. https://github.com/my-project)..."
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="input-field"
              style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none', paddingLeft: '0.85rem', fontSize: '0.925rem' }}
              aria-label="Destination URL to shorten"
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: '0.65rem 1.35rem' }}>
              Shorten & Edit <ArrowRight size={15} />
            </button>
          </form>

          {/* Value Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.775rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
              <Zap size={14} color="#059669" /> Sub-15ms Edge Latency
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
              <Smartphone size={14} color="var(--accent-primary)" /> iOS & Android Deep Linking
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
              <Shield size={14} color="#d97706" /> Password & Auto-Burn
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
              <QrCode size={14} color="#7c3aed" /> Vector QR Studio
            </span>
          </div>
        </div>
      </section>

      {/* Main Link Hub */}
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-primary)" /> Link Management Hub
          </h2>
          <span className="tabular-nums" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {links.length} Active links
          </span>
        </div>

        <LinkList
          links={links}
          onDelete={handleDelete}
          onOpenQR={(link) => setActiveQRLink(link)}
          onOpenAnalytics={(link) => setActiveAnalyticsLink(link)}
          onOpenSimulator={(link) => setActiveSimulatorLink(link)}
        />
      </main>

      {/* Modals */}
      <LinkCreatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLinkCreated={handleLinkCreated}
        initialData={createInitialData}
      />

      {activeQRLink && (
        <QRCodeModal
          link={activeQRLink}
          onClose={() => setActiveQRLink(null)}
        />
      )}

      {activeAnalyticsLink && (
        <AnalyticsModal
          link={activeAnalyticsLink}
          onClose={() => setActiveAnalyticsLink(null)}
          onRefreshData={loadData}
        />
      )}

      {activeSimulatorLink && (
        <SimulatorModal
          link={activeSimulatorLink}
          onClose={() => setActiveSimulatorLink(null)}
        />
      )}

      <ZeroCostDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
