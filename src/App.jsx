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
import ZeroCostDeployModal from './components/ZeroCostDeployModal';

import { getStoredLinks, createLink, deleteLink } from './services/storageService';
import { Layers } from 'lucide-react';

export default function App() {
  const [links, setLinks] = useState([]);
  
  // Theme state: default 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kissurl_theme') || 'light';
  });

  // Modal states for deep specialized tools
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState(null);
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeSimulatorLink, setActiveSimulatorLink] = useState(null);
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

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  const handleLinkCreated = (newLinkData) => {
    const created = createLink(newLinkData);
    loadData();
    return created;
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this short link from your repository?')) {
      deleteLink(id);
      loadData();
    }
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '1rem 1.25rem 4rem' }}>
      {/* 1. Global Navigation Bar with feature jumps & theme toggle */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        totalLinks={links.length}
      />

      {/* 2. Primary Hero Shortener: Input -> Validate -> Shorten -> Prominent Result Card */}
      <LandingHero
        onLinkCreated={handleLinkCreated}
        onOpenQR={(link) => setActiveQRLink(link)}
        onOpenSimulator={(link) => setActiveSimulatorLink(link)}
        onOpenStudioModal={(link) => {
          setCreateInitialData(link);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 3. Live Capabilities & Interactive Demos (Social Card, Device Routing, Vector QR, Edge Speed) */}
      <ProductDemos
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 4. Complete End-to-End Workflow Section */}
      <WorkflowSection
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 5. Full Link Management Hub (Search, Filters, Tags, Tabular Clicks, QR, Analytics, Simulator) */}
      <main id="hub-section" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={20} color="var(--accent-primary)" /> Link Management Hub
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage, search, filter, analyze, and test your active short links.
            </p>
          </div>
          <span className="tabular-nums" style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '700' }}>
            {links.length} Links Active • {totalClicks.toLocaleString()} Total Clicks
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

      {/* 6. Authentic Value & Privacy Pillars */}
      <TrustFeatures />

      {/* 7. Comprehensive Footer with System Status & Data Portability */}
      <Footer
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        totalLinks={links.length}
        totalClicks={totalClicks}
      />

      {/* 8. Specialized Studio Modals (All intact and functional) */}
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
