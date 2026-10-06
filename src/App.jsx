import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LinkList from './components/LinkList';
import LinkCreatorModal from './components/LinkCreatorModal';
import QRCodeModal from './components/QRCodeModal';
import AnalyticsModal from './components/AnalyticsModal';
import SimulatorModal from './components/SimulatorModal';
import ZeroCostDeployModal from './components/ZeroCostDeployModal';
import { getStoredLinks, createLink, deleteLink } from './services/storageService';
import { Sparkles, ArrowRight, Zap, Shield, Smartphone, QrCode, Globe2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [links, setLinks] = useState([]);
  const [quickUrl, setQuickUrl] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState(null);
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeSimulatorLink, setActiveSimulatorLink] = useState(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const loadData = () => {
    const data = getStoredLinks();
    setLinks(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  // Quick 1-click Shorten on Homepage Hero
  const handleQuickShorten = (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    // Open full studio modal pre-filled with the entered URL
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
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      {/* Top Header */}
      <Header
        totalLinks={links.length}
        totalClicks={totalClicks}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Hero Quick Shorten Banner */}
      <section className="glass-panel" style={{ 
        padding: '2.25rem 2rem', 
        marginBottom: '2rem', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 27, 75, 0.4) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-purple">
              <Sparkles size={12} /> Beat Bitly with Zero Server Costs
            </span>
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '0.6rem' }}>
            Supercharge Your Links with <span style={{ color: 'var(--accent-cyan)' }}>OpenGraph Cards</span> & <span style={{ color: '#c084fc' }}>Smart Routing</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Instant sub-15ms edge redirects, device-aware deep linking, vector QR studio, and privacy analytics. 100% Free to host forever.
          </p>

          {/* Quick Input Bar */}
          <form onSubmit={handleQuickShorten} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.4rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
            <input
              type="text"
              placeholder="Paste your long destination URL (e.g. https://github.com/my-project)..."
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="input-field"
              style={{ border: 'none', background: 'transparent', boxShadow: 'none', paddingLeft: '1rem', fontSize: '0.95rem' }}
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: '0.65rem 1.4rem' }}>
              Shorten & Customize <ArrowRight size={16} />
            </button>
          </form>

          {/* Key Value Highlights */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Zap size={13} color="#34d399" /> Sub-15ms Edge Latency</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Smartphone size={13} color="#22d3ee" /> iOS & Android Deep Linking</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Shield size={13} color="#fbbf24" /> Password & Auto-Burn</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><QrCode size={13} color="#c084fc" /> Vector QR Studio</span>
          </div>
        </div>
      </section>

      {/* Main Link Hub */}
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe2 size={18} color="#818cf8" /> Link Management Hub
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {links.length} active links managed
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
