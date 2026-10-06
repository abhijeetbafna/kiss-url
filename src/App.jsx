import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShortenerHero from './components/ShortenerHero';
import RecentLinks from './components/RecentLinks';
import TrustFeatures from './components/TrustFeatures';
import Footer from './components/Footer';

import QRCodeModal from './components/QRCodeModal';
import AnalyticsModal from './components/AnalyticsModal';
import LinkCreatorModal from './components/LinkCreatorModal';
import ZeroCostDeployModal from './components/ZeroCostDeployModal';

import { getStoredLinks, createLink, deleteLink } from './services/storageService';

export default function App() {
  const [links, setLinks] = useState([]);
  
  // Theme state: default 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kissurl_theme') || 'light';
  });

  // Modal controllers
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [customizeModalLink, setCustomizeModalLink] = useState(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

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

  const handleLinkCreated = (newLinkData) => {
    const created = createLink(newLinkData);
    loadData();
    return created;
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this short link from your history?')) {
      deleteLink(id);
      loadData();
    }
  };

  const scrollToHistory = () => {
    const el = document.getElementById('recent-links-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '1rem 1.25rem 3rem' }}>
      {/* 1. Minimal Public Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        recentCount={links.length}
        onScrollToHistory={scrollToHistory}
      />

      {/* 2. Primary Hero Shortening Interaction */}
      <ShortenerHero
        onLinkCreated={handleLinkCreated}
        onOpenQR={(link) => setActiveQRLink(link)}
        onOpenCustomizeModal={(link) => setCustomizeModalLink(link)}
      />

      {/* 3. Subordinated Recent Links (History) */}
      <RecentLinks
        links={links}
        onDelete={handleDelete}
        onOpenQR={(link) => setActiveQRLink(link)}
        onOpenAnalytics={(link) => setActiveAnalyticsLink(link)}
      />

      {/* 4. Quiet Trust & Capability Highlights */}
      <TrustFeatures />

      {/* 5. Clean Footer */}
      <Footer
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Specialized Modals (Contextual) */}
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

      {customizeModalLink && (
        <LinkCreatorModal
          isOpen={Boolean(customizeModalLink)}
          onClose={() => setCustomizeModalLink(null)}
          onLinkCreated={handleLinkCreated}
          initialData={customizeModalLink}
        />
      )}

      <ZeroCostDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
