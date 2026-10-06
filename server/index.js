import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';
import { requireAuth, requireWorkspaceAccess, JWT_SECRET } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5189;

app.use(cors());
app.use(express.json());

// Seed initial default demo data if database is empty
const seedInitialDataIfNeeded = () => {
  const existingUsers = db.db.users;
  if (existingUsers.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('demo1234', salt);
    const user = db.createUser({
      email: 'demo@kissurl.dev',
      passwordHash: demoPasswordHash,
      name: 'Alex Rivera'
    });

    const wsPersonal = db.createWorkspace({
      name: 'Personal Space',
      ownerId: user.id,
      icon: '👤',
      color: '#6366f1',
      description: 'Default personal projects and short links'
    });

    const wsMarketing = db.createWorkspace({
      name: 'Growth & Marketing',
      ownerId: user.id,
      icon: '🚀',
      color: '#10b981',
      description: 'Campaign, social media, and ad tracking links'
    });

    // Add initial links
    db.createLink({
      workspaceId: wsPersonal.id,
      creatorId: user.id,
      slug: 'launch',
      domain: 'kiss.url',
      targetUrl: 'https://github.com/topics/modern-web',
      title: 'Modern Web Dev Topics',
      tags: ['Launch', 'Dev']
    });

    db.createLink({
      workspaceId: wsMarketing.id,
      creatorId: user.id,
      slug: 'promo-2026',
      domain: 'kiss.url',
      targetUrl: 'https://kissurl.dev',
      title: 'Summer Launch Campaign',
      tags: ['Marketing', 'Promo']
    });

    // Add initial bio page
    db.saveBioPage({
      workspaceId: wsPersonal.id,
      handle: 'alexdev',
      name: 'Alex Rivera',
      tagline: 'Staff Product Engineer & Design Architect',
      bio: 'Building developer tools, open-source software, and minimal design systems.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      theme: 'minimal',
      socials: {
        twitter: 'alexrivera_dev',
        github: 'alexrivera',
        linkedin: 'alexrivera',
        website: 'https://alexrivera.dev',
        email: 'alex@example.com'
      },
      links: [
        { id: 'bl_1', type: 'link', title: '⭐ GitHub Open Source Projects', subtitle: 'Star my latest tools & libraries', url: 'https://github.com', highlight: true },
        { id: 'bl_2', type: 'newsletter', title: '🎙️ Weekly Design Engineering Newsletter', subtitle: 'Read by 12,000+ front-end developers', url: '' }
      ]
    });
  }
};

seedInitialDataIfNeeded();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = db.createUser({ email, passwordHash, name });

  // First-time user flow: create default workspace server-side
  const defaultWs = db.createWorkspace({
    name: 'Personal Space',
    ownerId: newUser.id,
    icon: '👤',
    color: '#6366f1',
    description: 'Personal projects and short links'
  });

  const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });

  return res.status(201).json({
    user: { id: newUser.id, email: newUser.email, name: newUser.name },
    token,
    workspaces: [defaultWs],
    activeWorkspaceId: defaultWs.id
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  let workspaces = db.getWorkspacesForUser(user.id);
  // If user has no workspaces, create default
  if (workspaces.length === 0) {
    const defaultWs = db.createWorkspace({
      name: 'Personal Space',
      ownerId: user.id,
      icon: '👤',
      color: '#6366f1'
    });
    workspaces = [defaultWs];
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

  return res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token,
    workspaces,
    activeWorkspaceId: workspaces[0].id
  });
});

// Current User (Me)
app.get('/api/auth/me', requireAuth, (req, res) => {
  let workspaces = db.getWorkspacesForUser(req.user.id);
  if (workspaces.length === 0) {
    const defaultWs = db.createWorkspace({
      name: 'Personal Space',
      ownerId: req.user.id,
      icon: '👤',
      color: '#6366f1'
    });
    workspaces = [defaultWs];
  }

  return res.json({
    user: req.user,
    workspaces,
    activeWorkspaceId: workspaces[0].id
  });
});

// ==========================================
// 2. WORKSPACE MANAGEMENT ROUTES
// ==========================================

// List user's workspaces
app.get('/api/workspaces', requireAuth, (req, res) => {
  const workspaces = db.getWorkspacesForUser(req.user.id);
  return res.json(workspaces);
});

// Create workspace
app.post('/api/workspaces', requireAuth, (req, res) => {
  const { name, icon, color, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Workspace name is required' });
  }

  const created = db.createWorkspace({
    name,
    ownerId: req.user.id,
    icon: icon || '📁',
    color: color || '#3b82f6',
    description: description || ''
  });

  return res.status(201).json(created);
});

// Get single workspace details
app.get('/api/workspaces/:workspaceId', requireAuth, requireWorkspaceAccess, (req, res) => {
  const ws = db.getWorkspaceById(req.params.workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  return res.json(ws);
});

// Update workspace
app.patch('/api/workspaces/:workspaceId', requireAuth, requireWorkspaceAccess, (req, res) => {
  const ws = db.getWorkspaceById(req.params.workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  if (ws.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Only the workspace owner can update workspace details' });
  }

  const updated = db.updateWorkspace(req.params.workspaceId, req.body);
  return res.json(updated);
});

// Delete workspace
app.delete('/api/workspaces/:workspaceId', requireAuth, requireWorkspaceAccess, (req, res) => {
  const ws = db.getWorkspaceById(req.params.workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  if (ws.ownerId !== req.user.id) {
    return res.status(403).json({ error: 'Only the workspace owner can delete this workspace' });
  }

  const userWorkspaces = db.getWorkspacesForUser(req.user.id);
  if (userWorkspaces.length <= 1) {
    return res.status(400).json({ error: 'Cannot delete your only workspace' });
  }

  db.deleteWorkspace(req.params.workspaceId);
  return res.json({ success: true, message: 'Workspace deleted' });
});

// ==========================================
// 3. WORKSPACE LINKS ROUTES (DATA ISOLATED)
// ==========================================

// Get links for workspace
app.get('/api/workspaces/:workspaceId/links', requireAuth, requireWorkspaceAccess, (req, res) => {
  const links = db.getLinksByWorkspace(req.params.workspaceId);
  return res.json(links);
});

// Create link in workspace
app.post('/api/workspaces/:workspaceId/links', requireAuth, requireWorkspaceAccess, (req, res) => {
  const { targetUrl, slug, domain, title, tags, socialOg, routing, protection, splitTesting, geoRouting, pixels } = req.body;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  let finalSlug = slug ? slug.trim().toLowerCase() : Math.random().toString(36).substring(2, 8);
  const existingLink = db.getLinkBySlug(finalSlug);
  if (existingLink) {
    finalSlug = `${finalSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const newLink = db.createLink({
    workspaceId: req.params.workspaceId,
    creatorId: req.user.id,
    targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
    slug: finalSlug,
    domain: domain || 'kiss.url',
    title: title || targetUrl,
    tags: tags || [],
    socialOg,
    routing,
    protection,
    splitTesting,
    geoRouting,
    pixels
  });

  return res.status(201).json(newLink);
});

// Update link
app.patch('/api/workspaces/:workspaceId/links/:linkId', requireAuth, requireWorkspaceAccess, (req, res) => {
  const link = db.getLinkById(req.params.linkId);
  if (!link || link.workspaceId !== req.params.workspaceId) {
    return res.status(404).json({ error: 'Link not found in this workspace' });
  }

  const updated = db.updateLink(req.params.linkId, req.body);
  return res.json(updated);
});

// Delete link
app.delete('/api/workspaces/:workspaceId/links/:linkId', requireAuth, requireWorkspaceAccess, (req, res) => {
  const link = db.getLinkById(req.params.linkId);
  if (!link || link.workspaceId !== req.params.workspaceId) {
    return res.status(404).json({ error: 'Link not found in this workspace' });
  }

  db.deleteLink(req.params.linkId);
  return res.json({ success: true });
});

// Workspace Analytics
app.get('/api/workspaces/:workspaceId/analytics', requireAuth, requireWorkspaceAccess, (req, res) => {
  const analytics = db.getAnalyticsForWorkspace(req.params.workspaceId);
  return res.json(analytics);
});

// Link specific analytics
app.get('/api/workspaces/:workspaceId/links/:linkId/analytics', requireAuth, requireWorkspaceAccess, (req, res) => {
  const link = db.getLinkById(req.params.linkId);
  if (!link || link.workspaceId !== req.params.workspaceId) {
    return res.status(404).json({ error: 'Link not found in this workspace' });
  }

  const analytics = db.getAnalyticsForLink(req.params.linkId);
  return res.json(analytics);
});

// ==========================================
// 4. WORKSPACE BIO & DOMAINS ROUTES
// ==========================================

// Bio pages for workspace
app.get('/api/workspaces/:workspaceId/bio', requireAuth, requireWorkspaceAccess, (req, res) => {
  const pages = db.getBioPagesByWorkspace(req.params.workspaceId);
  return res.json(pages);
});

// Save bio page
app.post('/api/workspaces/:workspaceId/bio', requireAuth, requireWorkspaceAccess, (req, res) => {
  const page = db.saveBioPage({ workspaceId: req.params.workspaceId, ...req.body });
  return res.json(page);
});

// Bio leads
app.get('/api/workspaces/:workspaceId/bio/leads', requireAuth, requireWorkspaceAccess, (req, res) => {
  const { handle } = req.query;
  const leads = db.getBioLeads(handle);
  return res.json(leads);
});

// Custom Domains
app.get('/api/workspaces/:workspaceId/domains', requireAuth, requireWorkspaceAccess, (req, res) => {
  const domains = db.getCustomDomains(req.params.workspaceId);
  return res.json(domains);
});

app.post('/api/workspaces/:workspaceId/domains', requireAuth, requireWorkspaceAccess, (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: 'Domain is required' });
  const created = db.addCustomDomain({ workspaceId: req.params.workspaceId, domain });
  return res.status(201).json(created);
});

app.delete('/api/workspaces/:workspaceId/domains/:domainId', requireAuth, requireWorkspaceAccess, (req, res) => {
  db.deleteCustomDomain(req.params.domainId);
  return res.json({ success: true });
});

// Error Branding
app.get('/api/workspaces/:workspaceId/error-branding', (req, res) => {
  const branding = db.getErrorBranding(req.params.workspaceId);
  return res.json(branding);
});

app.post('/api/workspaces/:workspaceId/error-branding', requireAuth, requireWorkspaceAccess, (req, res) => {
  const branding = db.saveErrorBranding(req.params.workspaceId, req.body);
  return res.json(branding);
});

// ==========================================
// 5. PUBLIC REDIRECT & RESOLUTION ROUTES
// ==========================================

// Public link resolution
app.get('/api/public/resolve/:slug', (req, res) => {
  const slug = req.params.slug;
  const link = db.getLinkBySlug(slug);
  if (!link) {
    const defaultBranding = db.getErrorBranding('default');
    return res.status(404).json({ error: 'not_found', branding: defaultBranding });
  }

  // Record click
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers['referer'] || req.headers['referrer'] || 'direct';

  let device = 'Desktop';
  if (/iPhone|iPad|iPod/i.test(userAgent)) device = 'iOS';
  else if (/Android/i.test(userAgent)) device = 'Android';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) device = 'macOS';
  else if (/Windows/i.test(userAgent)) device = 'Windows';

  db.recordClick({
    linkId: link.id,
    workspaceId: link.workspaceId,
    referrer,
    device,
    country: 'US',
    userAgent
  });

  const errorBranding = db.getErrorBranding(link.workspaceId);
  return res.json({ link, errorBranding });
});

// Public Bio page
app.get('/api/public/bio/:handle', (req, res) => {
  const handle = req.params.handle;
  const page = db.getBioPageByHandle(handle);
  if (!page) {
    return res.status(404).json({ error: 'Bio page not found' });
  }
  db.recordBioView(handle);
  return res.json(page);
});

// Public Bio Lead subscription
app.post('/api/public/bio/:handle/leads', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  const page = db.getBioPageByHandle(req.params.handle);
  const lead = db.recordBioLead({
    workspaceId: page ? page.workspaceId : 'unknown',
    handle: req.params.handle,
    email
  });
  return res.status(201).json(lead);
});

app.listen(PORT, () => {
  console.log(`⚡ KissURL Backend API Server running on port ${PORT}`);
});
