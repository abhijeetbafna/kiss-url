// Local Storage Service for Client-Side Database & Real Link Resolution

const STORAGE_KEY = 'kissurl_links_v1';

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
    // If running on localhost or a real host, route to /r/:slug so it resolves immediately in any tab
    return `${currentOrigin}/r/${cleanSlug}`;
  }
  return `https://${domain || 'kiss.url'}/r/${cleanSlug}`;
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

export const recordRealClick = (linkId, meta = {}) => {
  const links = getStoredLinks();
  const link = links.find(l => l.id === linkId);
  if (!link) return;

  const today = new Date().toISOString().split('T')[0];
  
  // Detect device
  let device = 'Desktop';
  const ua = meta.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';
  else if (/Android/i.test(ua)) device = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'macOS';
  else if (/Windows/i.test(ua)) device = 'Windows';
  else if (/Linux/i.test(ua)) device = 'Linux';

  // Detect referrer
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
