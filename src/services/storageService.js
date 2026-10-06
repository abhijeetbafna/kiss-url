// Storage Service & Backend API Bridge for KissURL
// Enforces Server-Authoritative Workspace Isolation & Local Sync Cache

import { 
  apiGetWorkspaces, 
  apiCreateWorkspace, 
  apiUpdateWorkspace as apiUpdateWs, 
  apiDeleteWorkspace as apiDeleteWs,
  apiGetWorkspaceLinks,
  apiCreateWorkspaceLink,
  apiUpdateWorkspaceLink,
  apiDeleteWorkspaceLink,
  apiGetWorkspaceAnalytics,
  apiGetWorkspaceBio,
  apiSaveWorkspaceBio,
  apiGetWorkspaceDomains,
  apiAddWorkspaceDomain,
  apiDeleteWorkspaceDomain,
  apiGetWorkspaceErrorBranding,
  apiSaveWorkspaceErrorBranding,
  apiResolvePublicLink,
  getAuthToken,
  setAuthToken,
  getSavedActiveWorkspaceId,
  setSavedActiveWorkspaceId
} from './api';

const STORAGE_KEY = 'kissurl_links_v1';
const WORKSPACE_STORAGE_KEY = 'kissurl_workspaces_v1';
const ACTIVE_WORKSPACE_KEY = 'kissurl_active_workspace_id_v1';
const BIO_STORAGE_KEY = 'kissurl_bio_pages_v1';
const DOMAIN_STORAGE_KEY = 'kissurl_custom_domains_v1';
const ERROR_BRANDING_KEY = 'kissurl_error_branding_v1';

// Initial fallback seeds
const INITIAL_WORKSPACES = [
  {
    id: 'ws_personal',
    name: 'Personal Space',
    slug: 'personal',
    icon: '👤',
    color: '#6366f1',
    description: 'Default workspace for personal projects and links',
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_SAMPLE_LINKS = [
  {
    id: 'lp_sample_1',
    workspaceId: 'ws_personal',
    slug: 'launch',
    domain: 'kiss.url',
    targetUrl: 'https://github.com/topics/modern-web',
    title: 'Modern Web Dev Topics',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 1420,
    tags: ['Launch', 'Dev'],
    socialOg: {
      enabled: true,
      title: 'Modern Web Development Tools & Libraries',
      description: 'Explore curated repositories and frameworks for high-performance web applications.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
    routing: {
      enabled: true,
      iosUrl: 'https://apps.apple.com',
      androidUrl: 'https://play.google.com',
      desktopUrl: 'https://github.com/topics/modern-web',
    },
    protection: {
      isPasswordProtected: false,
      password: '',
      expiresAt: '',
      maxClicks: 5000,
      fallbackUrl: '',
    },
    analytics: {
      referrers: { 'twitter.com': 640, 'linkedin.com': 320, 'direct': 280, 'github.com': 120, 'reddit.com': 60 },
      devices: { 'iOS': 680, 'Android': 410, 'macOS': 220, 'Windows': 110 },
      countries: { 'US': 610, 'GB': 240, 'DE': 190, 'IN': 220, 'CA': 160 },
      clickHistory: [
        { date: '2026-10-01', clicks: 180 },
        { date: '2026-10-02', clicks: 310 },
        { date: '2026-10-03', clicks: 450 },
        { date: '2026-10-04', clicks: 280 },
        { date: '2026-10-05', clicks: 200 },
      ]
    }
  }
];

// In-memory runtime cache for synchronous UI rendering
let cachedWorkspaces = [];
let cachedLinks = [];
let cachedActiveWorkspaceId = getSavedActiveWorkspaceId() || 'ws_personal';

// Listeners for reactive updates
const listeners = new Set();
export const subscribeToStore = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notifyListeners = () => {
  listeners.forEach(cb => {
    try { cb(); } catch (e) { console.error('Store listener error', e); }
  });
};

// ==========================================
// 1. INITIALIZATION & RE-SYNC FROM BACKEND
// ==========================================

export const syncFromBackend = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      // Offline/demo fallback
      const localWs = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (localWs) cachedWorkspaces = JSON.parse(localWs);
      else cachedWorkspaces = INITIAL_WORKSPACES;
      
      const localLinks = localStorage.getItem(STORAGE_KEY);
      if (localLinks) cachedLinks = JSON.parse(localLinks);
      else cachedLinks = INITIAL_SAMPLE_LINKS;
      
      notifyListeners();
      return { workspaces: cachedWorkspaces, links: cachedLinks };
    }

    // 1. Fetch Workspaces
    const workspaces = await apiGetWorkspaces().catch(() => []);
    if (workspaces && workspaces.length > 0) {
      cachedWorkspaces = workspaces;
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaces));

      let activeId = getSavedActiveWorkspaceId();
      if (!activeId || !workspaces.some(w => w.id === activeId)) {
        activeId = workspaces[0].id;
        setSavedActiveWorkspaceId(activeId);
      }
      cachedActiveWorkspaceId = activeId;

      // 2. Fetch Active Workspace Links
      const links = await apiGetWorkspaceLinks(activeId).catch(() => []);
      cachedLinks = links || [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedLinks));
    }

    notifyListeners();
    return { workspaces: cachedWorkspaces, links: cachedLinks };
  } catch (err) {
    console.warn('Backend sync failed, using local cache:', err.message);
    return { workspaces: cachedWorkspaces, links: cachedLinks };
  }
};

// Auto-trigger sync on module load
if (typeof window !== 'undefined') {
  syncFromBackend();
}

// ==========================================
// 2. WORKSPACE MANAGEMENT
// ==========================================

export const getStoredWorkspaces = () => {
  if (cachedWorkspaces.length > 0) return cachedWorkspaces;
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (raw) {
      cachedWorkspaces = JSON.parse(raw);
      return cachedWorkspaces;
    }
  } catch {}
  return INITIAL_WORKSPACES;
};

export const saveWorkspaces = (workspaces) => {
  cachedWorkspaces = workspaces;
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaces));
  notifyListeners();
};

export const getActiveWorkspaceId = () => {
  return getSavedActiveWorkspaceId() || cachedActiveWorkspaceId || 'ws_personal';
};

export const setActiveWorkspaceId = async (id) => {
  cachedActiveWorkspaceId = id;
  setSavedActiveWorkspaceId(id);
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);

  // Re-fetch links for this newly selected workspace from backend
  if (getAuthToken()) {
    try {
      const links = await apiGetWorkspaceLinks(id);
      cachedLinks = links || [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedLinks));
    } catch (e) {
      console.warn('Failed to fetch workspace links on switch:', e.message);
    }
  }
  notifyListeners();
};

export const getActiveWorkspace = () => {
  const workspaces = getStoredWorkspaces();
  const activeId = getActiveWorkspaceId();
  return workspaces.find(w => w.id === activeId) || workspaces[0] || INITIAL_WORKSPACES[0];
};

export const createWorkspace = async ({ name, icon = '📁', color = '#3b82f6', description = '' }) => {
  if (getAuthToken()) {
    try {
      const created = await apiCreateWorkspace({ name, icon, color, description });
      cachedWorkspaces = [created, ...cachedWorkspaces];
      saveWorkspaces(cachedWorkspaces);
      await setActiveWorkspaceId(created.id);
      return created;
    } catch (e) {
      console.error('Backend create workspace error, falling back:', e);
    }
  }

  // Fallback local creation
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newWs = {
    id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    slug,
    icon,
    color,
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };

  cachedWorkspaces = [...cachedWorkspaces, newWs];
  saveWorkspaces(cachedWorkspaces);
  setActiveWorkspaceId(newWs.id);
  return newWs;
};

export const deleteWorkspace = async (id) => {
  if (getAuthToken()) {
    try {
      await apiDeleteWs(id);
    } catch (e) {
      console.warn('Backend delete workspace error:', e.message);
    }
  }

  cachedWorkspaces = cachedWorkspaces.filter(w => w.id !== id);
  saveWorkspaces(cachedWorkspaces);

  if (getActiveWorkspaceId() === id) {
    const remaining = cachedWorkspaces[0]?.id || 'ws_personal';
    await setActiveWorkspaceId(remaining);
  }
  return true;
};

// ==========================================
// 3. LINK SHORTENER & ANALYTICS
// ==========================================

export const getStoredLinks = () => {
  if (cachedLinks.length > 0) return cachedLinks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cachedLinks = JSON.parse(raw);
      return cachedLinks;
    }
  } catch {}
  return INITIAL_SAMPLE_LINKS;
};

export const saveLinks = (links) => {
  cachedLinks = links;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  notifyListeners();
};

export const buildShortUrl = (slug, domain = null) => {
  const cleanSlug = slug.toLowerCase().trim();
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/r/${cleanSlug}`;
  }
  return `https://${domain || 'kiss.url'}/r/${cleanSlug}`;
};

export const createLink = async (linkData) => {
  const activeWsId = getActiveWorkspaceId();
  
  if (getAuthToken()) {
    try {
      const created = await apiCreateWorkspaceLink(activeWsId, linkData);
      cachedLinks = [created, ...cachedLinks.filter(l => l.id !== created.id)];
      saveLinks(cachedLinks);
      return created;
    } catch (e) {
      console.error('Backend create link error, falling back:', e);
    }
  }

  // Fallback local link creation
  const newLink = {
    id: 'lp_' + Math.random().toString(36).substring(2, 9),
    workspaceId: linkData.workspaceId || activeWsId || 'ws_personal',
    createdAt: new Date().toISOString(),
    clicks: 0,
    analytics: {
      referrers: { direct: 1 },
      devices: { Desktop: 1 },
      countries: { US: 1 },
      clickHistory: [{ date: new Date().toISOString().split('T')[0], clicks: 1 }]
    },
    ...linkData,
  };

  cachedLinks = [newLink, ...cachedLinks];
  saveLinks(cachedLinks);
  return newLink;
};

export const updateLink = async (id, updatedFields) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      const updated = await apiUpdateWorkspaceLink(activeWsId, id, updatedFields);
      cachedLinks = cachedLinks.map(l => l.id === id ? updated : l);
      saveLinks(cachedLinks);
      return updated;
    } catch (e) {
      console.warn('Backend update link error:', e);
    }
  }

  cachedLinks = cachedLinks.map(l => l.id === id ? { ...l, ...updatedFields } : l);
  saveLinks(cachedLinks);
  return cachedLinks.find(l => l.id === id);
};

export const deleteLink = async (id) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      await apiDeleteWorkspaceLink(activeWsId, id);
    } catch (e) {
      console.warn('Backend delete link error:', e);
    }
  }

  cachedLinks = cachedLinks.filter(l => l.id !== id);
  saveLinks(cachedLinks);
  return cachedLinks;
};

export const recordRealClick = async (linkId, meta = {}) => {
  const links = getStoredLinks();
  const link = links.find(l => l.id === linkId);
  if (!link) return;

  const today = new Date().toISOString().split('T')[0];
  let device = 'Desktop';
  const ua = meta.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';
  else if (/Android/i.test(ua)) device = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'macOS';
  else if (/Windows/i.test(ua)) device = 'Windows';
  else if (/Linux/i.test(ua)) device = 'Linux';

  let referrer = meta.referrer || (typeof document !== 'undefined' ? document.referrer : '') || 'direct';
  if (referrer && referrer !== 'direct') {
    try {
      referrer = new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      referrer = 'direct';
    }
  }

  link.clicks = (link.clicks || 0) + 1;
  if (!link.analytics) {
    link.analytics = { referrers: {}, devices: {}, countries: {}, clickHistory: [] };
  }

  link.analytics.referrers[referrer] = (link.analytics.referrers[referrer] || 0) + 1;
  link.analytics.devices[device] = (link.analytics.devices[device] || 0) + 1;
  link.analytics.countries['US'] = (link.analytics.countries['US'] || 0) + 1;

  const hist = link.analytics.clickHistory || [];
  const existingDay = hist.find(h => h.date === today);
  if (existingDay) existingDay.clicks += 1;
  else hist.push({ date: today, clicks: 1 });
  link.analytics.clickHistory = hist;

  saveLinks(links);
  return link;
};

// ==========================================
// 4. LINK IN BIO PAGES
// ==========================================

export const getStoredBioPages = () => {
  try {
    const raw = localStorage.getItem(BIO_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveBioPages = (pages) => {
  localStorage.setItem(BIO_STORAGE_KEY, JSON.stringify(pages));
};

export const getBioPageByHandle = (handle) => {
  const pages = getStoredBioPages();
  const clean = handle.toLowerCase().replace(/^@/, '').trim();
  return pages.find(p => p.handle.toLowerCase() === clean);
};

export const buildBioUrl = (handle) => {
  const clean = handle.toLowerCase().replace(/^@/, '').trim();
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.origin}/bio/${clean}`;
  }
  return `https://kiss.url/bio/${clean}`;
};

export const saveBioPage = async (bioData) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      const saved = await apiSaveWorkspaceBio(activeWsId, bioData);
      const pages = getStoredBioPages();
      const idx = pages.findIndex(p => p.handle.toLowerCase() === bioData.handle.toLowerCase());
      const updated = idx >= 0 ? pages.map((p, i) => i === idx ? saved : p) : [saved, ...pages];
      saveBioPages(updated);
      return saved;
    } catch (e) {
      console.warn('Backend save bio error:', e);
    }
  }

  const pages = getStoredBioPages();
  const cleanHandle = bioData.handle.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const existingIndex = pages.findIndex(p => p.handle.toLowerCase() === cleanHandle);
  const pageRecord = { ...bioData, handle: cleanHandle, updatedAt: new Date().toISOString() };

  let updated;
  if (existingIndex >= 0) {
    updated = [...pages];
    updated[existingIndex] = { ...pages[existingIndex], ...pageRecord };
  } else {
    pageRecord.id = 'bio_' + Math.random().toString(36).substring(2, 9);
    pageRecord.views = pageRecord.views || 0;
    updated = [pageRecord, ...pages];
  }

  saveBioPages(updated);
  return pageRecord;
};

export const recordBioClick = (handle, linkId) => {
  const pages = getStoredBioPages();
  const page = pages.find(p => p.handle.toLowerCase() === handle.toLowerCase());
  if (!page) return;

  if (linkId) {
    const targetLink = page.links?.find(l => l.id === linkId);
    if (targetLink) targetLink.clicks = (targetLink.clicks || 0) + 1;
  } else {
    page.views = (page.views || 0) + 1;
  }
  saveBioPages(pages);
};

// ==========================================
// 5. CUSTOM DOMAINS (CNAME)
// ==========================================

export const getStoredDomains = () => {
  try {
    const raw = localStorage.getItem(DOMAIN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

export const saveDomains = (domains) => {
  localStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domains));
};

export const addDomain = async (domainName) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      const created = await apiAddWorkspaceDomain(activeWsId, domainName);
      const domains = getStoredDomains();
      saveDomains([created, ...domains]);
      return created;
    } catch (e) {
      console.warn('Backend add domain error:', e);
    }
  }

  const domains = getStoredDomains();
  const clean = domainName.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const newDomain = {
    id: 'dom_' + Math.random().toString(36).substring(2, 9),
    domain: clean,
    targetHost: 'cname.kissurl.dev',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastChecked: new Date().toISOString()
  };

  saveDomains([newDomain, ...domains]);
  return newDomain;
};

export const deleteDomain = async (id) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      await apiDeleteWorkspaceDomain(activeWsId, id);
    } catch (e) {
      console.warn('Backend delete domain error:', e);
    }
  }
  const domains = getStoredDomains();
  const filtered = domains.filter(d => d.id !== id);
  saveDomains(filtered);
  return filtered;
};

// ==========================================
// 6. BRANDED ERROR & 404 PAGES
// ==========================================

const DEFAULT_ERROR_BRANDING = {
  customTitle: 'Link Not Found or Inactive',
  customMessage: 'The link you are looking for has been moved, deleted, or is temporarily offline.',
  brandName: 'KissURL',
  logoEmoji: '⚡',
  supportUrl: 'https://github.com/abhijeetbafna/kiss-url',
  showHomeButton: true,
  themeColor: '#000000',
};

export const getErrorBrandingSettings = () => {
  try {
    const raw = localStorage.getItem(ERROR_BRANDING_KEY);
    if (raw) return { ...DEFAULT_ERROR_BRANDING, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_ERROR_BRANDING;
};

export const saveErrorBrandingSettings = async (settings) => {
  const activeWsId = getActiveWorkspaceId();
  if (getAuthToken()) {
    try {
      await apiSaveWorkspaceErrorBranding(activeWsId, settings);
    } catch (e) {
      console.warn('Backend save error branding error:', e);
    }
  }
  localStorage.setItem(ERROR_BRANDING_KEY, JSON.stringify(settings));
};

// ==========================================
// 7. URL SAFETY & MALWARE SCANNER
// ==========================================

export const auditUrlSafety = (url) => {
  if (!url || typeof url !== 'string') {
    return { score: 100, status: 'safe', label: 'Safe URL', color: '#10b981', checks: [] };
  }

  const cleanUrl = url.trim();
  let parsed = null;
  try {
    parsed = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
  } catch (e) {
    return {
      score: 50,
      status: 'warning',
      label: 'Malformed URL',
      color: '#f59e0b',
      checks: [{ label: 'URL format is invalid', passed: false, type: 'format' }]
    };
  }

  const checks = [];
  let score = 100;

  const isHttps = parsed.protocol === 'https:';
  if (isHttps) {
    checks.push({ label: 'HTTPS SSL Encrypted Connection', passed: true, detail: 'Destination uses secure transport' });
  } else {
    score -= 25;
    checks.push({ label: 'Unencrypted HTTP Connection', passed: false, detail: 'Data sent to this destination is not encrypted' });
  }

  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
  if (isIp) {
    score -= 40;
    checks.push({ label: 'Raw IP Address Target', passed: false, detail: 'Destination points directly to an IP address instead of a domain' });
  } else {
    checks.push({ label: 'Verified DNS Hostname', passed: true, detail: 'Valid fully qualified domain name' });
  }

  const riskyTLDs = ['.xyz', '.top', '.zip', '.click', '.fit', '.gq', '.tk', '.ml', '.cf', '.work', '.casa'];
  const hasRiskyTld = riskyTLDs.some(tld => parsed.hostname.toLowerCase().endsWith(tld));
  if (hasRiskyTld) {
    score -= 15;
    checks.push({ label: 'High-Risk Top-Level Domain', passed: false, detail: `Domain uses a frequently abused TLD (${parsed.hostname.split('.').pop()})` });
  } else {
    checks.push({ label: 'Standard Domain Extension', passed: true, detail: 'Standard trusted domain namespace' });
  }

  const suspiciousKeywords = [
    'login-verification', 'verify-account', 'security-update', 'paypal-secure', 
    'wallet-connect', 'airdrop-claim', 'free-crypto', 'urgent-alert', 'bank-login',
    'support-portal', 'auth-check'
  ];
  const urlLower = cleanUrl.toLowerCase();
  const matchedKeyword = suspiciousKeywords.find(k => urlLower.includes(k));
  if (matchedKeyword) {
    score -= 35;
    checks.push({ label: `Potential Credential / Phishing Pattern ("${matchedKeyword}")`, passed: false, detail: 'Contains keywords commonly used in social engineering traps' });
  } else {
    checks.push({ label: 'No Phishing Keywords Detected', passed: true, detail: 'Clean destination path structure' });
  }

  const dotCount = (parsed.hostname.match(/\./g) || []).length;
  if (dotCount > 3) {
    score -= 15;
    checks.push({ label: 'Excessive Subdomain Stacking', passed: false, detail: 'Unusual number of subdomain levels' });
  }

  let status = 'safe';
  let label = 'Clean & Safe';
  let color = '#10b981';

  if (score < 50) {
    status = 'critical';
    label = 'High Risk / Suspicious';
    color = '#ef4444';
  } else if (score < 85) {
    status = 'warning';
    label = 'Caution Advised';
    color = '#f59e0b';
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    status,
    label,
    color,
    checks,
    protocol: parsed.protocol,
    hostname: parsed.hostname
  };
};

// ==========================================
// 8. BULK SHORTENER & CSV UTILITIES
// ==========================================

export const createBulkLinks = async (urlList, options = {}) => {
  const domain = options.domain || 'kiss.url';
  const tags = options.tags || ['Bulk'];
  const activeWsId = getActiveWorkspaceId();
  const createdLinks = [];

  for (const rawUrl of urlList) {
    const trimmed = rawUrl.trim();
    if (!trimmed) continue;
    
    let targetUrl = trimmed;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const autoSlug = Math.random().toString(36).substring(2, 8);
    const linkPayload = {
      targetUrl,
      slug: autoSlug,
      domain,
      title: trimmed.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || targetUrl,
      tags,
    };

    const link = await createLink(linkPayload);
    createdLinks.push(link);
  }

  return createdLinks;
};

export const exportLinksAsJSON = () => {
  const links = getStoredLinks();
  const bioPages = getStoredBioPages();
  const domains = getStoredDomains();
  
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    links,
    bioPages,
    domains
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kissurl_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportLinksAsCSV = () => {
  const links = getStoredLinks();
  const headers = ['Slug', 'Domain', 'Full Short URL', 'Target URL', 'Title', 'Clicks', 'Created At'];
  const rows = links.map(l => [
    `"${l.slug}"`,
    `"${l.domain}"`,
    `"${buildShortUrl(l.slug, l.domain)}"`,
    `"${l.targetUrl}"`,
    `"${(l.title || '').replace(/"/g, '""')}"`,
    l.clicks || 0,
    `"${l.createdAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kissurl_export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};


export const importLinksFromCSV = (csvText) => {
  if (!csvText) return [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
  const urlIdx = headers.findIndex(h => h.includes('target') || h.includes('url') || h.includes('destination'));
  const slugIdx = headers.findIndex(h => h.includes('slug') || h.includes('alias'));
  const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('name'));

  if (urlIdx === -1) {
    // Treat column 0 as URL if header not identified
    return createBulkLinks(lines.slice(1).map(l => l.split(',')[0].replace(/^"|"$/g, '')));
  }

  const newLinks = [];
  const activeWsId = getActiveWorkspaceId();
  const existingLinks = getStoredLinks();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const rawUrl = cols[urlIdx];
    if (!rawUrl) continue;

    let targetUrl = rawUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const slug = (slugIdx !== -1 && cols[slugIdx]) ? cols[slugIdx].toLowerCase().replace(/[^a-z0-9-_]/g, '-') : Math.random().toString(36).substring(2, 8);
    const title = (titleIdx !== -1 && cols[titleIdx]) ? cols[titleIdx] : targetUrl;

    newLinks.push({
      id: 'lp_' + Math.random().toString(36).substring(2, 9),
      workspaceId: activeWsId,
      targetUrl,
      slug,
      domain: 'kiss.url',
      title,
      tags: ['Imported'],
      createdAt: new Date().toISOString(),
      clicks: 0,
      analytics: {
        referrers: { direct: 1 },
        devices: { Desktop: 1 },
        countries: { US: 1 },
        clickHistory: [{ date: new Date().toISOString().split('T')[0], clicks: 1 }]
      }
    });
  }

  const updated = [...newLinks, ...existingLinks];
  saveLinks(updated);
  return newLinks;
};

// ==========================================
// 9. PHASE 4: BIO LEADS & EMBED EXTRACTORS
// ==========================================

const BIO_LEADS_STORAGE_KEY = 'kissurl_bio_leads_v1';

export const getStoredBioLeads = (handle) => {
  try {
    const raw = localStorage.getItem(BIO_LEADS_STORAGE_KEY);
    const allLeads = raw ? JSON.parse(raw) : [];
    if (!handle) return allLeads;
    return allLeads.filter(l => l.handle.toLowerCase() === handle.toLowerCase());
  } catch (e) {
    return [];
  }
};

export const recordBioLead = (handle, email) => {
  try {
    const raw = localStorage.getItem(BIO_LEADS_STORAGE_KEY);
    const allLeads = raw ? JSON.parse(raw) : [];
    const newLead = {
      id: 'lead_' + Math.random().toString(36).substring(2, 9),
      handle: handle.toLowerCase(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };
    allLeads.push(newLead);
    localStorage.setItem(BIO_LEADS_STORAGE_KEY, JSON.stringify(allLeads));
    return newLead;
  } catch (e) {
    console.error('Failed to record lead', e);
    return null;
  }
};

export const exportBioLeadsCSV = (handle) => {
  const leads = getStoredBioLeads(handle);
  const headers = ['Handle', 'Subscriber Email', 'Subscribed At'];
  const rows = leads.map(l => [
    `"${l.handle}"`,
    `"${l.email}"`,
    `"${l.createdAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kissurl_subscribers_${handle || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const clean = url.trim();
    // match youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = clean.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}`;
    }
  } catch (e) {}
  return null;
};

export const getSpotifyEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const clean = url.trim();
    // match open.spotify.com/(track|album|playlist|artist)/ID
    const match = clean.match(/open\.spotify\.com\/(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+)/);
    if (match && match[1] && match[2]) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    }
  } catch (e) {}
  return null;
};


