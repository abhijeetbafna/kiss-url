import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'kissurl.db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Structure
const INITIAL_DB = {
  users: [],
  workspaces: [],
  workspace_members: [],
  links: [],
  clicks: [],
  bio_pages: [],
  bio_leads: [],
  custom_domains: [],
  error_branding: [],
  pixels: [],
  webhooks: []
};

class PersistentDB {
  constructor() {
    this.db = this.load();
  }

  load() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
        return INITIAL_DB;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load database file, initializing default:', e);
      return INITIAL_DB;
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  }

  // ==================== USERS ====================

  getUserByEmail(email) {
    if (!email) return null;
    const clean = email.toLowerCase().trim();
    return this.db.users.find(u => u.email.toLowerCase() === clean) || null;
  }

  getUserById(id) {
    if (!id) return null;
    return this.db.users.find(u => u.id === id) || null;
  }

  createUser({ email, passwordHash, name = '' }) {
    const cleanEmail = email.toLowerCase().trim();
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      passwordHash,
      name: name.trim() || cleanEmail.split('@')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.users.push(newUser);
    this.save();
    return newUser;
  }

  // ==================== WORKSPACES ====================

  getWorkspacesForUser(userId) {
    if (!userId) return [];
    // Owned workspaces + membership workspaces
    const owned = this.db.workspaces.filter(w => w.ownerId === userId);
    const memberOf = this.db.workspace_members
      .filter(m => m.userId === userId)
      .map(m => this.db.workspaces.find(w => w.id === m.workspaceId))
      .filter(Boolean);

    const all = [...owned, ...memberOf];
    // Deduplicate
    const uniqueMap = new Map();
    all.forEach(w => uniqueMap.set(w.id, w));
    return Array.from(uniqueMap.values());
  }

  getWorkspaceById(workspaceId) {
    if (!workspaceId) return null;
    return this.db.workspaces.find(w => w.id === workspaceId) || null;
  }

  userHasWorkspaceAccess(userId, workspaceId) {
    if (!userId || !workspaceId) return false;
    const ws = this.getWorkspaceById(workspaceId);
    if (!ws) return false;
    if (ws.ownerId === userId) return true;
    return this.db.workspace_members.some(m => m.userId === userId && m.workspaceId === workspaceId);
  }

  createWorkspace({ name, ownerId, icon = 'user', color = '#6366f1', description = '' }) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'workspace';
    const newWs = {
      id: 'ws_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      slug,
      icon,
      color,
      description: description.trim(),
      ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.workspaces.push(newWs);

    // Add owner membership record
    this.db.workspace_members.push({
      id: 'mem_' + Date.now(),
      workspaceId: newWs.id,
      userId: ownerId,
      role: 'owner',
      createdAt: new Date().toISOString()
    });

    this.save();
    return newWs;
  }

  updateWorkspace(workspaceId, data) {
    const index = this.db.workspaces.findIndex(w => w.id === workspaceId);
    if (index === -1) return null;

    this.db.workspaces[index] = {
      ...this.db.workspaces[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.db.workspaces[index];
  }

  deleteWorkspace(workspaceId) {
    const index = this.db.workspaces.findIndex(w => w.id === workspaceId);
    if (index === -1) return false;

    // Delete workspace
    this.db.workspaces.splice(index, 1);
    // Delete memberships
    this.db.workspace_members = this.db.workspace_members.filter(m => m.workspaceId !== workspaceId);
    // Delete links belonging to this workspace
    this.db.links = this.db.links.filter(l => l.workspaceId !== workspaceId);
    // Delete bio pages
    this.db.bio_pages = this.db.bio_pages.filter(b => b.workspaceId !== workspaceId);
    // Delete domains
    this.db.custom_domains = this.db.custom_domains.filter(d => d.workspaceId !== workspaceId);

    this.save();
    return true;
  }

  // ==================== LINKS ====================

  getLinksByWorkspace(workspaceId) {
    if (!workspaceId) return [];
    return this.db.links.filter(l => l.workspaceId === workspaceId);
  }

  getLinkById(linkId) {
    return this.db.links.find(l => l.id === linkId) || null;
  }

  getLinkBySlug(slug) {
    if (!slug) return null;
    const clean = slug.toLowerCase().trim();
    return this.db.links.find(l => l.slug.toLowerCase() === clean) || null;
  }

  createLink({
    workspaceId,
    creatorId,
    targetUrl,
    slug,
    domain = 'kiss.url',
    title = '',
    tags = [],
    socialOg = { enabled: false },
    routing = { enabled: false },
    protection = { isPasswordProtected: false },
    splitTesting = { enabled: false, variants: [] },
    geoRouting = { enabled: false, rules: [] },
    pixels = {}
  }) {
    const newLink = {
      id: 'lp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      workspaceId,
      creatorId,
      targetUrl,
      slug: slug.toLowerCase().trim(),
      domain,
      title: title || targetUrl,
      tags: Array.isArray(tags) ? tags : [],
      clicks: 0,
      socialOg,
      routing,
      protection,
      splitTesting,
      geoRouting,
      pixels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.db.links.unshift(newLink);
    this.save();
    return newLink;
  }

  updateLink(linkId, data) {
    const index = this.db.links.findIndex(l => l.id === linkId);
    if (index === -1) return null;

    this.db.links[index] = {
      ...this.db.links[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.db.links[index];
  }

  deleteLink(linkId) {
    const index = this.db.links.findIndex(l => l.id === linkId);
    if (index === -1) return false;

    this.db.links.splice(index, 1);
    // Delete clicks for this link
    this.db.clicks = this.db.clicks.filter(c => c.linkId !== linkId);
    this.save();
    return true;
  }

  // ==================== CLICKS & ANALYTICS ====================

  recordClick({ linkId, workspaceId, referrer = 'direct', device = 'Desktop', country = 'US', userAgent = '' }) {
    const link = this.getLinkById(linkId);
    if (link) {
      link.clicks = (link.clicks || 0) + 1;
    }

    const clickEvent = {
      id: 'clk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      linkId,
      workspaceId: workspaceId || (link ? link.workspaceId : 'unknown'),
      referrer: referrer || 'direct',
      device: device || 'Desktop',
      country: country || 'US',
      userAgent,
      timestamp: new Date().toISOString()
    };

    this.db.clicks.push(clickEvent);
    this.save();
    return clickEvent;
  }

  getAnalyticsForWorkspace(workspaceId) {
    const links = this.getLinksByWorkspace(workspaceId);
    const linkIds = new Set(links.map(l => l.id));
    const clicks = this.db.clicks.filter(c => c.workspaceId === workspaceId || linkIds.has(c.linkId));

    const referrers = {};
    const devices = {};
    const countries = {};
    const historyMap = {};

    clicks.forEach(c => {
      referrers[c.referrer] = (referrers[c.referrer] || 0) + 1;
      devices[c.device] = (devices[c.device] || 0) + 1;
      countries[c.country] = (countries[c.country] || 0) + 1;
      const day = c.timestamp.split('T')[0];
      historyMap[day] = (historyMap[day] || 0) + 1;
    });

    const clickHistory = Object.keys(historyMap).sort().map(date => ({
      date,
      clicks: historyMap[date]
    }));

    return {
      totalClicks: clicks.length,
      totalLinks: links.length,
      referrers,
      devices,
      countries,
      clickHistory
    };
  }

  getAnalyticsForLink(linkId) {
    const link = this.getLinkById(linkId);
    if (!link) return null;

    const clicks = this.db.clicks.filter(c => c.linkId === linkId);
    const referrers = {};
    const devices = {};
    const countries = {};
    const historyMap = {};

    clicks.forEach(c => {
      referrers[c.referrer] = (referrers[c.referrer] || 0) + 1;
      devices[c.device] = (devices[c.device] || 0) + 1;
      countries[c.country] = (countries[c.country] || 0) + 1;
      const day = c.timestamp.split('T')[0];
      historyMap[day] = (historyMap[day] || 0) + 1;
    });

    return {
      link,
      totalClicks: clicks.length,
      referrers,
      devices,
      countries,
      clickHistory: Object.keys(historyMap).sort().map(d => ({ date: d, clicks: historyMap[d] }))
    };
  }

  // ==================== BIO PAGES ====================

  getBioPagesByWorkspace(workspaceId) {
    if (!workspaceId) return [];
    return this.db.bio_pages.filter(b => b.workspaceId === workspaceId);
  }

  getBioPageByHandle(handle) {
    if (!handle) return null;
    const clean = handle.toLowerCase().replace(/^@/, '').trim();
    return this.db.bio_pages.find(b => b.handle.toLowerCase() === clean) || null;
  }

  saveBioPage({ workspaceId, handle, name, tagline, bio, avatarUrl, theme, socials, links }) {
    const cleanHandle = handle.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const index = this.db.bio_pages.findIndex(b => b.handle.toLowerCase() === cleanHandle);

    const pageData = {
      workspaceId,
      handle: cleanHandle,
      name: name || cleanHandle,
      tagline: tagline || '',
      bio: bio || '',
      avatarUrl: avatarUrl || '',
      theme: theme || 'minimal',
      socials: socials || {},
      links: Array.isArray(links) ? links : [],
      updatedAt: new Date().toISOString()
    };

    if (index >= 0) {
      this.db.bio_pages[index] = { ...this.db.bio_pages[index], ...pageData };
    } else {
      pageData.id = 'bio_' + Date.now();
      pageData.views = 0;
      pageData.createdAt = new Date().toISOString();
      this.db.bio_pages.push(pageData);
    }

    this.save();
    return this.getBioPageByHandle(cleanHandle);
  }

  recordBioView(handle) {
    const page = this.getBioPageByHandle(handle);
    if (page) {
      page.views = (page.views || 0) + 1;
      this.save();
    }
  }

  recordBioLead({ workspaceId, handle, email }) {
    const lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      workspaceId,
      handle: handle.toLowerCase(),
      email: email.toLowerCase().trim(),
      createdAt: new Date().toISOString()
    };
    this.db.bio_leads.push(lead);
    this.save();
    return lead;
  }

  getBioLeads(handle) {
    if (!handle) return this.db.bio_leads;
    return this.db.bio_leads.filter(l => l.handle.toLowerCase() === handle.toLowerCase());
  }

  // ==================== DOMAINS ====================

  getCustomDomains(workspaceId) {
    if (!workspaceId) return [];
    return this.db.custom_domains.filter(d => d.workspaceId === workspaceId);
  }

  addCustomDomain({ workspaceId, domain }) {
    const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const newDomain = {
      id: 'dom_' + Date.now(),
      workspaceId,
      domain: clean,
      targetHost: 'cname.kissurl.dev',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.db.custom_domains.push(newDomain);
    this.save();
    return newDomain;
  }

  deleteCustomDomain(domainId) {
    this.db.custom_domains = this.db.custom_domains.filter(d => d.id !== domainId);
    this.save();
    return true;
  }

  // ==================== ERROR BRANDING ====================

  getErrorBranding(workspaceId) {
    const found = this.db.error_branding.find(e => e.workspaceId === workspaceId);
    if (found) return found;
    return {
      workspaceId,
      customTitle: 'Link Not Found or Inactive',
      customMessage: 'The link you are looking for has been moved, deleted, or is temporarily offline.',
      brandName: 'KissURL',
      logoIcon: 'zap',
      supportUrl: 'https://kiss.url/support'
    };
  }

  saveErrorBranding(workspaceId, settings) {
    const index = this.db.error_branding.findIndex(e => e.workspaceId === workspaceId);
    if (index >= 0) {
      this.db.error_branding[index] = { ...this.db.error_branding[index], ...settings };
    } else {
      this.db.error_branding.push({ workspaceId, ...settings });
    }
    this.save();
    return this.getErrorBranding(workspaceId);
  }

  // ==================== PIXELS & TRACKING TAGS ====================

  getWorkspacePixels(workspaceId) {
    if (!this.db.pixels) this.db.pixels = [];
    const found = this.db.pixels.find(p => p.workspaceId === workspaceId);
    if (found) return found;
    return {
      workspaceId,
      metaPixelId: '',
      gaMeasurementId: '',
      gtmId: '',
      tiktokPixelId: '',
      linkedinPartnerId: '',
      twitterPixelId: '',
      pinterestTagId: '',
      customHeadScript: '',
      updatedAt: new Date().toISOString()
    };
  }

  saveWorkspacePixels(workspaceId, settings) {
    if (!this.db.pixels) this.db.pixels = [];
    const index = this.db.pixels.findIndex(p => p.workspaceId === workspaceId);
    const updated = {
      workspaceId,
      ...settings,
      updatedAt: new Date().toISOString()
    };
    if (index >= 0) {
      this.db.pixels[index] = { ...this.db.pixels[index], ...updated };
    } else {
      this.db.pixels.push(updated);
    }
    this.save();
    return updated;
  }

  // ==================== WEBHOOKS & AUTOMATIONS ====================

  getWorkspaceWebhooks(workspaceId) {
    if (!this.db.webhooks) this.db.webhooks = [];
    return this.db.webhooks.filter(w => w.workspaceId === workspaceId);
  }

  createWorkspaceWebhook({ workspaceId, name, url, events = ['click.created', 'milestone.reached'], secret = '' }) {
    if (!this.db.webhooks) this.db.webhooks = [];
    const newHook = {
      id: 'wh_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      workspaceId,
      name: name || 'Custom Webhook',
      url: url.trim(),
      events: Array.isArray(events) ? events : ['click.created'],
      secret: secret || 'whsec_' + Math.random().toString(36).substring(2, 12),
      active: true,
      deliveriesCount: 0,
      lastDeliveryStatus: 'pending',
      lastDeliveryAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.db.webhooks.push(newHook);
    this.save();
    return newHook;
  }

  updateWorkspaceWebhook(webhookId, data) {
    if (!this.db.webhooks) this.db.webhooks = [];
    const index = this.db.webhooks.findIndex(w => w.id === webhookId);
    if (index === -1) return null;
    this.db.webhooks[index] = {
      ...this.db.webhooks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.db.webhooks[index];
  }

  deleteWorkspaceWebhook(webhookId) {
    if (!this.db.webhooks) this.db.webhooks = [];
    this.db.webhooks = this.db.webhooks.filter(w => w.id !== webhookId);
    this.save();
    return true;
  }

  recordWebhookDelivery(webhookId, success = true) {
    if (!this.db.webhooks) this.db.webhooks = [];
    const hook = this.db.webhooks.find(w => w.id === webhookId);
    if (hook) {
      hook.deliveriesCount = (hook.deliveriesCount || 0) + 1;
      hook.lastDeliveryStatus = success ? 'success' : 'failed';
      hook.lastDeliveryAt = new Date().toISOString();
      this.save();
    }
  }

  // ==================== DYNAMIC SMART ROUTING RESOLVER ====================

  resolveDynamicDestination(link, { device = 'Desktop', country = 'US' } = {}) {
    if (!link) return { targetUrl: '', ruleApplied: 'none' };

    // 1. Device Conditional Routing
    if (link.routing && link.routing.enabled) {
      if ((device === 'iOS' || device === 'iPhone' || device === 'iPad') && link.routing.iosUrl) {
        return { targetUrl: link.routing.iosUrl, ruleApplied: `Device: iOS (${device})` };
      }
      if (device === 'Android' && link.routing.androidUrl) {
        return { targetUrl: link.routing.androidUrl, ruleApplied: `Device: Android` };
      }
      if ((device === 'Desktop' || device === 'Windows' || device === 'macOS' || device === 'Linux') && link.routing.desktopUrl) {
        return { targetUrl: link.routing.desktopUrl, ruleApplied: `Device: Desktop (${device})` };
      }
    }

    // 2. Geo-Location Conditional Routing
    if (link.geoRouting && link.geoRouting.enabled && Array.isArray(link.geoRouting.rules)) {
      const matchedRule = link.geoRouting.rules.find(r => r.country && r.country.toUpperCase() === country.toUpperCase() && r.url);
      if (matchedRule) {
        return { targetUrl: matchedRule.url, ruleApplied: `Geo: ${country.toUpperCase()}` };
      }
    }

    // 3. A/B Split Testing
    if (link.splitTesting && link.splitTesting.enabled && Array.isArray(link.splitTesting.variants) && link.splitTesting.variants.length > 0) {
      const activeVariants = link.splitTesting.variants.filter(v => v.url && Number(v.weight) > 0);
      if (activeVariants.length > 0) {
        const totalWeight = activeVariants.reduce((sum, v) => sum + Number(v.weight), 0);
        let random = Math.random() * totalWeight;
        for (const variant of activeVariants) {
          if (random <= Number(variant.weight)) {
            return { targetUrl: variant.url, ruleApplied: `Split A/B: ${variant.name || 'Variant'} (${variant.weight}%)` };
          }
          random -= Number(variant.weight);
        }
        return { targetUrl: activeVariants[0].url, ruleApplied: `Split A/B: ${activeVariants[0].name || 'Variant'}` };
      }
    }

    // 4. Default Base Destination
    return { targetUrl: link.targetUrl, ruleApplied: 'Default Target' };
  }
}

export const db = new PersistentDB();
