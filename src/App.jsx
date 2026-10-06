import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import ProductDemos from './components/ProductDemos';
import WorkflowSection from './components/WorkflowSection';
import LinkList from './components/LinkList';
import TrustFeatures from './components/TrustFeatures';
import Footer from './components/Footer';

import LinkCreatorModal from './components/LinkCreatorModal';
import QRCodeModal from './components/QRCodeModal';
import AnalyticsModal from './components/AnalyticsModal';
import SimulatorModal from './components/SimulatorModal';

import { getStoredLinks, createLink, deleteLink } from './services/storageService';

export default function App() {
  const [links, setLinks] = useState([]);
  
  // Theme state: default 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kissurl_theme') || 'light';
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState(null);
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeSimulatorLink, setActiveSimulatorLink] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kissurl_theme', theme);
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

  const handleLinkCreated = (newLinkData) => {
    const created = createLink(newLinkData);
    loadData();
    return created;
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this short link?')) {
      deleteLink(id);
      loadData();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* 1. Global Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        totalLinks={links.length}
      />

      {/* Main Content Area */}
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* 2. Primary Hero Shortener */}
        <LandingHero
          onLinkCreated={handleLinkCreated}
          onOpenQR={(link) => setActiveQRLink(link)}
          onOpenSimulator={(link) => setActiveSimulatorLink(link)}
          onOpenStudioModal={(link) => {
            setCreateInitialData(link);
            setIsCreateModalOpen(true);
          }}
        />

        {/* 3. Link Management Hub */}
        <main id="hub-section" style={{ margin: '0 auto 4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                Your short links
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Manage, search, and analyze your active links.
              </p>
            </div>
            <div className="tabular-nums" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {links.length} links • {totalClicks.toLocaleString()} total clicks
            </div>
          </div>

          <LinkList
            links={links}
            onDelete={handleDelete}
            onOpenQR={(link) => setActiveQRLink(link)}
            onOpenAnalytics={(link) => setActiveAnalyticsLink(link)}
            onOpenSimulator={(link) => setActiveSimulatorLink(link)}
          />
        </main>

        {/* 4. Interactive Capabilities Demos */}
        <ProductDemos
          onOpenCreateModal={() => {
            setCreateInitialData(null);
            setIsCreateModalOpen(true);
          }}
        />

        {/* 5. How It Works */}
        <WorkflowSection
          onOpenCreateModal={() => {
            setCreateInitialData(null);
            setIsCreateModalOpen(true);
          }}
        />

        {/* 6. Core Pillars */}
        <TrustFeatures />
      </div>

      {/* 7. Footer */}
      <Footer
        totalLinks={links.length}
        totalClicks={totalClicks}
      />

      {/* 8. Specialized Modals */}
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
    </div>
  );
}
