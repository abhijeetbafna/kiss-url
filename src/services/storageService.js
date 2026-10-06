// Local Storage Service for Client-Side Database, Bio Pages, Domains & Link Analytics

const STORAGE_KEY = 'kissurl_links_v1';
const BIO_STORAGE_KEY = 'kissurl_bio_pages_v1';
const DOMAIN_STORAGE_KEY = 'kissurl_custom_domains_v1';

const INITIAL_SAMPLE_LINKS = [
  {
    id: 'lp_sample_1',
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
      referrers: {
        'twitter.com': 640,
        'linkedin.com': 320,
        'direct': 280,
        'github.com': 120,
        'reddit.com': 60,
      },
      devices: {
        'iOS': 680,
        'Android': 410,
        'macOS': 220,
        'Windows': 110,
      },
      countries: {
        'US': 610,
        'GB': 240,
        'DE': 190,
        'IN': 220,
        'CA': 160,
      },
      clickHistory: [
        { date: '2026-10-01', clicks: 180 },
        { date: '2026-10-02', clicks: 310 },
        { date: '2026-10-03', clicks: 450 },
        { date: '2026-10-04', clicks: 280 },
        { date: '2026-10-05', clicks: 200 },
      ]
    }
  },
  {
    id: 'lp_sample_2',
    slug: 'secret-deck',
    domain: 'kiss.url',
    targetUrl: 'https://pitch.com',
    title: 'Confidential Pitch Deck (Passcode: demo)',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 84,
    tags: ['Confidential'],
    
    socialOg: {
      enabled: false,
      title: '',
      description: '',
      imageUrl: '',
    },
    routing: {
      enabled: false,
      iosUrl: '',
      androidUrl: '',
      desktopUrl: '',
    },
    protection: {
      isPasswordProtected: true,
      password: 'demo',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      maxClicks: 150,
      fallbackUrl: 'https://kissurl.dev',
    },
    analytics: {
      referrers: { 'email': 54, 'direct': 25, 'slack': 5 },
      devices: { 'macOS': 60, 'Windows': 18, 'iOS': 6 },
      countries: { 'US': 50, 'GB': 20, 'SG': 14 },
      clickHistory: [
        { date: '2026-10-04', clicks: 38 },
        { date: '2026-10-05', clicks: 46 },
      ]
    }
  }
];

const INITIAL_SAMPLE_BIO_PAGES = [
  {
    id: 'bio_creator_1',
    handle: 'alexdev',
    name: 'Alex Rivera',
    tagline: 'Staff Product Engineer & Design Architect',
    bio: 'Building developer tools, open-source software, and minimal design systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    theme: 'minimal', // minimal | dark | cobalt | gradient | emerald
    views: 890,
    socials: {
      twitter: 'alexrivera_dev',
      github: 'alexrivera',
      linkedin: 'alexrivera',
      youtube: '',
      instagram: '',
      website: 'https://alexrivera.dev',
      email: 'alex@example.com'
    },
    links: [
      {
        id: 'bl_1',
        title: '⭐ GitHub Open Source Projects',
        subtitle: 'Star my latest tools & libraries',
        url: 'https://github.com',
        clicks: 340,
        highlight: true,
        icon: 'github'
      },
      {
        id: 'bl_2',
        title: '🎙️ Weekly Design Engineering Newsletter',
        subtitle: 'Read by 12,000+ front-end developers',
        url: 'https://substack.com',
        clicks: 215,
        highlight: false,
        icon: 'mail'
      },
      {
        id: 'bl_3',
        title: '📦 Latest Web Component System',
        subtitle: 'Free UI primitives & layout recipes',
        url: 'https://github.com/topics/design-system',
        clicks: 180,
        highlight: false,
        icon: 'code'
      },
      {
        id: 'bl_4',
        title: '☕ Schedule a 1:1 Architecture Consultation',
        subtitle: 'Book 30 mins for tech reviews',
        url: 'https://cal.com',
        clicks: 95,
        highlight: false,
        icon: 'calendar'
      }
    ],
    updatedAt: new Date().toISOString()
  }
];

const INITIAL_SAMPLE_DOMAINS = [
  {
    id: 'dom_1',
    domain: 'link.yourbrand.com',
    targetHost: 'cname.kissurl.dev',
    status: 'active', // active | pending | error
    createdAt: new Date().toISOString(),
    lastChecked: new Date().toISOString()
  }
];

// ==========================================
// 1. LINK SHORTENER STORAGE & ANALYTICS
// ==========================================

export const getStoredLinks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LINKS));
      return INITIAL_SAMPLE_LINKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored links:', e);
    return INITIAL_SAMPLE_LINKS;
  }
};

export const saveLinks = (links) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (e) {
    console.error('Error saving links to localStorage:', e);
  }
};

export const getLinkBySlug = (slug) => {
  const links = getStoredLinks();
  const clean = slug.toLowerCase().trim();
  return links.find(l => l.slug.toLowerCase() === clean);
};

export const buildShortUrl = (slug, domain = null) => {
  const cleanSlug = slug.toLowerCase().trim();
  if (typeof window !== 'undefined' && window.location) {
    const currentOrigin = window.location.origin;
    return `${currentOrigin}/r/${cleanSlug}`;
  }
  return `https://${domain || 'kiss.url'}/r/${cleanSlug}`;
};

export const createLink = (linkData) => {
  const links = getStoredLinks();
  const activeWsId = getActiveWorkspaceId();
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
  
  const updated = [newLink, ...links];
  saveLinks(updated);
  return newLink;
};

export const updateLink = (id, updatedFields) => {
  const links = getStoredLinks();
  const updated = links.map(l => l.id === id ? { ...l, ...updatedFields } : l);
  saveLinks(updated);
  return updated.find(l => l.id === id);
};

export const deleteLink = (id) => {
  const links = getStoredLinks();
  const filtered = links.filter(l => l.id !== id);
  saveLinks(filtered);
  return filtered;
};

export const recordRealClick = (linkId, meta = {}) => {
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
  } else {
    referrer = 'direct';
  }

  const country = meta.country || 'US';

  link.clicks = (link.clicks || 0) + 1;
  
  if (!link.analytics) {
    link.analytics = { referrers: {}, devices: {}, countries: {}, clickHistory: [] };
  }

  link.analytics.referrers[referrer] = (link.analytics.referrers[referrer] || 0) + 1;
  link.analytics.devices[device] = (link.analytics.devices[device] || 0) + 1;
  link.analytics.countries[country] = (link.analytics.countries[country] || 0) + 1;

  const hist = link.analytics.clickHistory || [];
  const existingDay = hist.find(h => h.date === today);
  if (existingDay) {
    existingDay.clicks += 1;
  } else {
    hist.push({ date: today, clicks: 1 });
  }
  link.analytics.clickHistory = hist;

  saveLinks(links);
  return link;
};

// ==========================================
// 2. LINK IN BIO PAGES STORAGE
// ==========================================

export const getStoredBioPages = () => {
  try {
    const raw = localStorage.getItem(BIO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BIO_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_BIO_PAGES));
      return INITIAL_SAMPLE_BIO_PAGES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading bio pages:', e);
    return INITIAL_SAMPLE_BIO_PAGES;
  }
};

export const saveBioPages = (pages) => {
  try {
    localStorage.setItem(BIO_STORAGE_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Error saving bio pages:', e);
  }
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

export const saveBioPage = (bioData) => {
  const pages = getStoredBioPages();
  const cleanHandle = bioData.handle.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const existingIndex = pages.findIndex(p => p.handle.toLowerCase() === cleanHandle);

  const pageRecord = {
    ...bioData,
    handle: cleanHandle,
    updatedAt: new Date().toISOString()
  };

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
    if (targetLink) {
      targetLink.clicks = (targetLink.clicks || 0) + 1;
    }
  } else {
    page.views = (page.views || 0) + 1;
  }

  saveBioPages(pages);
};

// ==========================================
// 3. CUSTOM DOMAINS (CNAME) STORAGE
// ==========================================

export const getStoredDomains = () => {
  try {
    const raw = localStorage.getItem(DOMAIN_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DOMAINS));
      return INITIAL_SAMPLE_DOMAINS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SAMPLE_DOMAINS;
  }
};

export const saveDomains = (domains) => {
  try {
    localStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domains));
  } catch (e) {
    console.error('Error saving domains:', e);
  }
};

export const addDomain = (domainName) => {
  const domains = getStoredDomains();
  const clean = domainName.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  if (domains.some(d => d.domain === clean)) {
    return domains.find(d => d.domain === clean);
  }

  const newDomain = {
    id: 'dom_' + Math.random().toString(36).substring(2, 9),
    domain: clean,
    targetHost: 'cname.kissurl.dev',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastChecked: new Date().toISOString()
  };

  const updated = [newDomain, ...domains];
  saveDomains(updated);
  return newDomain;
};

export const deleteDomain = (id) => {
  const domains = getStoredDomains();
  const filtered = domains.filter(d => d.id !== id);
  saveDomains(filtered);
  return filtered;
};

// ==========================================
// 4. EXPORT UTILITIES
// ==========================================

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

// ==========================================
// 5. WORKSPACES & TEAM ISOLATION
// ==========================================

const WORKSPACE_STORAGE_KEY = 'kissurl_workspaces_v1';
const ACTIVE_WORKSPACE_KEY = 'kissurl_active_workspace_id_v1';
const ERROR_BRANDING_KEY = 'kissurl_error_branding_v1';

const INITIAL_WORKSPACES = [
  {
    id: 'ws_personal',
    name: 'Personal Space',
    slug: 'personal',
    icon: '👤',
    color: '#6366f1',
    description: 'Default workspace for personal projects and links',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ws_marketing',
    name: 'Growth & Marketing',
    slug: 'marketing',
    icon: '🚀',
    color: '#10b981',
    description: 'Campaign, social media, and ad tracking links',
    createdAt: new Date().toISOString(),
  },
];

export const getStoredWorkspaces = () => {
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(INITIAL_WORKSPACES));
      return INITIAL_WORKSPACES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse workspaces', e);
    return INITIAL_WORKSPACES;
  }
};

export const saveWorkspaces = (workspaces) => {
  localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaces));
};

export const getActiveWorkspaceId = () => {
  const saved = localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  if (saved) return saved;
  return 'ws_personal';
};

export const setActiveWorkspaceId = (id) => {
  localStorage.setItem(ACTIVE_WORKSPACE_KEY, id);
};

export const getActiveWorkspace = () => {
  const workspaces = getStoredWorkspaces();
  const activeId = getActiveWorkspaceId();
  return workspaces.find(w => w.id === activeId) || workspaces[0] || INITIAL_WORKSPACES[0];
};

export const createWorkspace = ({ name, icon = '📁', color = '#3b82f6', description = '' }) => {
  const workspaces = getStoredWorkspaces();
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newWorkspace = {
    id: `ws_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    slug,
    icon,
    color,
    description: description.trim(),
    createdAt: new Date().toISOString(),
  };

  const updated = [...workspaces, newWorkspace];
  saveWorkspaces(updated);
  setActiveWorkspaceId(newWorkspace.id);
  return newWorkspace;
};

export const updateWorkspace = (id, data) => {
  const workspaces = getStoredWorkspaces();
  const updated = workspaces.map(w => w.id === id ? { ...w, ...data } : w);
  saveWorkspaces(updated);
  return updated;
};

export const deleteWorkspace = (id) => {
  if (id === 'ws_personal') return false; // Prevent deleting default
  const workspaces = getStoredWorkspaces();
  const updated = workspaces.filter(w => w.id !== id);
  saveWorkspaces(updated);
  if (getActiveWorkspaceId() === id) {
    setActiveWorkspaceId('ws_personal');
  }
  return true;
};

// ==========================================
// 6. CUSTOM 404 & BRANDED ERROR PAGES
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
    if (!raw) return DEFAULT_ERROR_BRANDING;
    return { ...DEFAULT_ERROR_BRANDING, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_ERROR_BRANDING;
  }
};

export const saveErrorBrandingSettings = (settings) => {
  localStorage.setItem(ERROR_BRANDING_KEY, JSON.stringify(settings));
};

// ==========================================
// 7. URL SAFETY & MALWARE/PHISHING SCANNER
// ==========================================

export const auditUrlSafety = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      score: 100,
      status: 'safe',
      label: 'Safe URL',
      color: '#10b981',
      checks: []
    };
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

  // Check 1: HTTPS Encryption
  const isHttps = parsed.protocol === 'https:';
  if (isHttps) {
    checks.push({ label: 'HTTPS SSL Encrypted Connection', passed: true, detail: 'Destination uses secure transport' });
  } else {
    score -= 25;
    checks.push({ label: 'Unencrypted HTTP Connection', passed: false, detail: 'Data sent to this destination is not encrypted' });
  }

  // Check 2: Raw IP Address detection
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
  if (isIp) {
    score -= 40;
    checks.push({ label: 'Raw IP Address Target', passed: false, detail: 'Destination points directly to an IP address instead of a domain' });
  } else {
    checks.push({ label: 'Verified DNS Hostname', passed: true, detail: 'Valid fully qualified domain name' });
  }

  // Check 3: Suspicious TLD check
  const riskyTLDs = ['.xyz', '.top', '.zip', '.click', '.fit', '.gq', '.tk', '.ml', '.cf', '.work', '.casa'];
  const hasRiskyTld = riskyTLDs.some(tld => parsed.hostname.toLowerCase().endsWith(tld));
  if (hasRiskyTld) {
    score -= 15;
    checks.push({ label: 'High-Risk Top-Level Domain', passed: false, detail: `Domain uses a frequently abused TLD (${parsed.hostname.split('.').pop()})` });
  } else {
    checks.push({ label: 'Standard Domain Extension', passed: true, detail: 'Standard trusted domain namespace' });
  }

  // Check 4: Phishing & Deceptive Keywords
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

  // Check 5: Excessive Subdomains / Dot Flood
  const dotCount = (parsed.hostname.match(/\./g) || []).length;
  if (dotCount > 3) {
    score -= 15;
    checks.push({ label: 'Excessive Subdomain Stacking', passed: false, detail: 'Unusual number of subdomain levels' });
  }

  // Determine final status
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
// 8. PHASE 2: BULK SHORTENER & CSV IMPORT
// ==========================================

export const createBulkLinks = (urlList, options = {}) => {
  const domain = options.domain || 'kiss.url';
  const tags = options.tags || ['Bulk'];
  const activeWsId = getActiveWorkspaceId();
  const links = getStoredLinks();

  const createdLinks = [];
  urlList.forEach((rawUrl) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return;
    
    let targetUrl = trimmed;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    const autoSlug = Math.random().toString(36).substring(2, 8);
    const newLink = {
      id: 'lp_' + Math.random().toString(36).substring(2, 9),
      workspaceId: activeWsId,
      targetUrl,
      slug: autoSlug,
      domain,
      title: trimmed.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || targetUrl,
      tags,
      createdAt: new Date().toISOString(),
      clicks: 0,
      analytics: {
        referrers: { direct: 1 },
        devices: { Desktop: 1 },
        countries: { US: 1 },
        clickHistory: [{ date: new Date().toISOString().split('T')[0], clicks: 1 }]
      },
      socialOg: { enabled: false },
      routing: { enabled: false },
      protection: { isPasswordProtected: false, maxClicks: 0 },
      splitTesting: { enabled: false, variants: [] },
      geoRouting: { enabled: false, rules: [] },
      pixels: { metaPixelId: '', gaMeasurementId: '', tiktokPixelId: '', linkedinTagId: '' }
    };

    createdLinks.push(newLink);
  });

  const updated = [...createdLinks, ...links];
  saveLinks(updated);
  return createdLinks;
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


