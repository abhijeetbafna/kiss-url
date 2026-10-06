import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import ProductDemos from './components/ProductDemos';
import WorkflowSection from './components/WorkflowSection';
import LinkList from './components/LinkList';
import TrustFeatures from './components/TrustFeatures';
import Footer from './components/Footer';
import RedirectHandler from './components/RedirectHandler';

import LinkCreatorModal from './components/LinkCreatorModal';
import QRCodeModal from './components/QRCodeModal';
import AnalyticsModal from './components/AnalyticsModal';
import SimulatorModal from './components/SimulatorModal';
import BioPageRenderer from './components/BioPageRenderer';
import BioPageStudioModal from './components/BioPageStudioModal';
import CustomDomainModal from './components/CustomDomainModal';
import SafetyAuditModal from './components/SafetyAuditModal';
import ErrorBrandingModal from './components/ErrorBrandingModal';
import BulkShortenerModal from './components/BulkShortenerModal';
import AuthModal from './components/AuthModal';
import PixelManagerModal from './components/PixelManagerModal';
import WebhookManagerModal from './components/WebhookManagerModal';
import UserManualModal from './components/UserManualModal';

import { 
  getStoredLinks, 
  createLink, 
  deleteLink, 
  getActiveWorkspaceId, 
  setActiveWorkspaceId,
  syncFromBackend,
  subscribeToStore
} from './services/storageService';
import { apiGetMe, getAuthToken, apiGetWorkspaceLinks } from './services/api';

export default function App() {
  const [links, setLinks] = useState(getStoredLinks());
  const [activeWsId, setActiveWsId] = useState(getActiveWorkspaceId());
  const [user, setUser] = useState(null);
  
  // Theme state: default 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('kissurl_theme') || 'light';
  });

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPixelModalOpen, setIsPixelModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isWorkspaceAnalyticsOpen, setIsWorkspaceAnalyticsOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [isBioStudioOpen, setIsBioStudioOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isErrorBrandingModalOpen, setIsErrorBrandingModalOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState(null);
  const [activeQRLink, setActiveQRLink] = useState(null);
  const [activeAnalyticsLink, setActiveAnalyticsLink] = useState(null);
  const [activeSimulatorLink, setActiveSimulatorLink] = useState(null);

  // Check if current URL path is a bio page route (e.g. /bio/:handle or ?bio=:handle)
  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  const queryBio = searchParams.get('bio');
  const querySlug = searchParams.get('r');

  let bioHandle = null;
  if (queryBio) {
    bioHandle = queryBio;
  } else if (pathname.startsWith('/bio/')) {
    bioHandle = pathname.replace(/^\/bio\//, '').split('/')[0];
  }

  // Check if current URL path is a short redirect route (e.g. /r/:slug or /:slug)
  let redirectSlug = null;
  if (!bioHandle) {
    if (querySlug) {
      redirectSlug = querySlug;
    } else if (pathname.startsWith('/r/')) {
      redirectSlug = pathname.replace(/^\/r\//, '').split('/')[0];
    } else if (pathname.length > 1 && !pathname.includes('.') && pathname !== '/' && !pathname.startsWith('/bio')) {
      // Check if path matches a known slug or is a direct shortcode
      redirectSlug = pathname.substring(1).split('/')[0];
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kissurl_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Re-fetch current workspace links
  const loadData = async (wsId = null) => {
    const currentId = wsId || getActiveWorkspaceId();
    if (getAuthToken()) {
      try {
        const backendLinks = await apiGetWorkspaceLinks(currentId);
        if (Array.isArray(backendLinks)) {
          setLinks(backendLinks);
          return;
        }
      } catch (err) {
        console.warn('Could not load workspace links from backend:', err.message);
      }
    }
    const data = getStoredLinks();
    setLinks(data);
  };

  // Initial mount: check auth session & subscribe to store changes
  useEffect(() => {
    const checkAuth = async () => {
      if (getAuthToken()) {
        try {
          const res = await apiGetMe();
          if (res.user) {
            setUser(res.user);
            await syncFromBackend();
          }
        } catch {
          console.warn('Session expired or unauthorized');
        }
      } else {
        // Run initial sync for unauthenticated/demo
        await syncFromBackend();
      }
      loadData();
    };

    checkAuth();

    const unsubscribe = subscribeToStore(() => {
      setLinks(getStoredLinks());
      setActiveWsId(getActiveWorkspaceId());
    });

    return () => unsubscribe();
  }, []);

  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  const handleLinkCreated = async (newLinkData) => {
    const created = await createLink(newLinkData);
    await loadData();
    return created;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this short link?')) {
      await deleteLink(id);
      await loadData();
    }
  };

  const handleAuthSuccess = async (authUser, workspaces, activeWsId) => {
    setUser(authUser);
    if (activeWsId) {
      setActiveWsId(activeWsId);
      await setActiveWorkspaceId(activeWsId);
    }
    await syncFromBackend();
    await loadData(activeWsId);
  };

  // If visiting a Link-in-Bio profile route, render the BioPageRenderer
  if (bioHandle) {
    return <BioPageRenderer handle={bioHandle} />;
  }

  // If visiting a short redirect URL, render the RedirectHandler
  if (redirectSlug) {
    return <RedirectHandler slug={redirectSlug} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      {/* 1. Global Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        onOpenPixelModal={() => setIsPixelModalOpen(true)}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        onOpenWorkspaceAnalytics={() => setIsWorkspaceAnalyticsOpen(true)}
        onOpenBioStudio={() => setIsBioStudioOpen(true)}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenErrorBrandingModal={() => setIsErrorBrandingModalOpen(true)}
        onOpenUserManual={() => setIsUserManualOpen(true)}
        onWorkspaceChanged={async (wsId) => {
          setActiveWsId(wsId);
          await setActiveWorkspaceId(wsId);
          await loadData(wsId);
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
        onOpenUserManual={() => setIsUserManualOpen(true)}
        onOpenBioStudio={() => setIsBioStudioOpen(true)}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        onOpenPixelModal={() => setIsPixelModalOpen(true)}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        onOpenWorkspaceAnalytics={() => setIsWorkspaceAnalyticsOpen(true)}
      />

      {/* 8. Specialized Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onAuthSuccess={handleAuthSuccess}
      />

      <LinkCreatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onLinkCreated={handleLinkCreated}
        initialData={createInitialData}
      />

      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
        onOpenCreateModal={() => {
          setCreateInitialData(null);
          setIsCreateModalOpen(true);
        }}
        onOpenBioStudio={() => setIsBioStudioOpen(true)}
        onOpenPixelModal={() => setIsPixelModalOpen(true)}
        onOpenWebhookModal={() => setIsWebhookModalOpen(true)}
        onOpenWorkspaceAnalytics={() => setIsWorkspaceAnalyticsOpen(true)}
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

      {isWorkspaceAnalyticsOpen && (
        <AnalyticsModal
          isWorkspaceMode={true}
          onClose={() => setIsWorkspaceAnalyticsOpen(false)}
          onRefreshData={loadData}
        />
      )}

      {activeSimulatorLink && (
        <SimulatorModal
          link={activeSimulatorLink}
          onClose={() => setActiveSimulatorLink(null)}
        />
      )}

      <PixelManagerModal
        isOpen={isPixelModalOpen}
        onClose={() => setIsPixelModalOpen(false)}
      />

      <WebhookManagerModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
      />

      <BioPageStudioModal
        isOpen={isBioStudioOpen}
        onClose={() => setIsBioStudioOpen(false)}
      />

      <CustomDomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />

      <BulkShortenerModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onLinksCreated={loadData}
      />

      <SafetyAuditModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      <ErrorBrandingModal
        isOpen={isErrorBrandingModalOpen}
        onClose={() => setIsErrorBrandingModalOpen(false)}
      />
    </div>
  );
}

