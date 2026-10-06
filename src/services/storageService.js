// Local Storage Service for 100% Free / Zero-Cost Client-Side Database & Cloudflare Sync

const STORAGE_KEY = 'kissurl_links_v1';
const SETTINGS_KEY = 'kissurl_settings_v1';

const INITIAL_SAMPLE_LINKS = [
  {
    id: 'lp_sample_1',
    slug: 'launch-app',
    domain: 'kiss.url',
    targetUrl: 'https://github.com/topics/modern-web',
    title: 'Mobile App Launch Campaign',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 1420,
    tags: ['Launch', 'Mobile', 'Q3'],
    
    // Feature 1: Social OpenGraph Override
    socialOg: {
      enabled: true,
      title: 'Get 50% Off Lifetime Pro Access | KissURL',
      description: 'The ultra-fast, modern link management platform built for creators & developers.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
    
    // Feature 2: Smart Device Routing
    routing: {
      enabled: true,
      iosUrl: 'https://apps.apple.com/app/example-app',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.example.app',
      desktopUrl: 'https://github.com/topics/modern-web',
    },
    
    // Feature 3: Security & Lifespan
    protection: {
      isPasswordProtected: false,
      password: '',
      expiresAt: '',
      maxClicks: 5000,
    },
    
    // Feature 4: Analytics data
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
    domain: 'go.bio',
    targetUrl: 'https://pitch.com',
    title: 'Investor Pitch Deck (Protected)',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 84,
    tags: ['Fundraising', 'Confidential'],
    
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
  },
  {
    id: 'lp_sample_3',
    slug: 'dev-summit-qr',
    domain: 'kiss.url',
    targetUrl: 'https://youtube.com',
    title: 'Conference Keynote QR Pass',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 395,
    tags: ['Event', 'QR', 'Keynote'],
    
    socialOg: {
      enabled: true,
      title: 'Dev Summit 2026 Live Stream & Slides',
      description: 'Access the exclusive slides and live keynote recording.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    },
    routing: {
      enabled: false,
      iosUrl: '',
      androidUrl: '',
      desktopUrl: '',
    },
    protection: {
      isPasswordProtected: false,
      password: '',
      expiresAt: '',
      maxClicks: 0,
    },
    analytics: {
      referrers: { 'qr_scan': 340, 'direct': 55 },
      devices: { 'iOS': 240, 'Android': 155 },
      countries: { 'US': 210, 'DE': 80, 'FR': 65, 'JP': 40 },
      clickHistory: [
        { date: '2026-10-05', clicks: 395 },
      ]
    }
  }
];

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

export const createLink = (linkData) => {
  const links = getStoredLinks();
  const newLink = {
    id: 'lp_' + Math.random().toString(36).substring(2, 9),
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

export const recordSimulatedClick = (linkId, meta = {}) => {
  const links = getStoredLinks();
  const link = links.find(l => l.id === linkId);
  if (!link) return;

  const today = new Date().toISOString().split('T')[0];
  const device = meta.device || 'Desktop';
  const referrer = meta.referrer || 'direct';
  const country = meta.country || 'US';

  link.clicks = (link.clicks || 0) + 1;
  
  if (!link.analytics) {
    link.analytics = { referrers: {}, devices: {}, countries: {}, clickHistory: [] };
  }

  // Update referrers
  link.analytics.referrers[referrer] = (link.analytics.referrers[referrer] || 0) + 1;
  // Update devices
  link.analytics.devices[device] = (link.analytics.devices[device] || 0) + 1;
  // Update countries
  link.analytics.countries[country] = (link.analytics.countries[country] || 0) + 1;

  // Update history
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

export const exportLinksAsJSON = () => {
  const links = getStoredLinks();
  const blob = new Blob([JSON.stringify(links, null, 2)], { type: 'application/json' });
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
    `"https://${l.domain}/${l.slug}"`,
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
