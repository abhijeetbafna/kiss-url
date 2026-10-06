import { db } from './db.js';

console.log('🧪 Starting End-to-End Suite for Kiss URL Platform...\n');

const runTests = async () => {
  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`  ✅ PASS: ${title}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${title}`);
      failed++;
    }
  };

  try {
    // 1. Database sanity & structures
    console.log('📦 Step 1: Database and Health Check');
    assert(typeof db.load === 'function', 'Database interface exposes load function');
    assert(Array.isArray(db.db.links), 'Database links repository is an array');
    assert(Array.isArray(db.db.workspaces), 'Database workspaces repository is an array');

    // 2. User Creation & Authentication
    console.log('\n🔐 Step 2: Authentication & User Management');
    const testEmail = `e2e_user_${Date.now()}@example.com`;
    const user = db.createUser({
      email: testEmail,
      passwordHash: 'hash_12345',
      name: 'EndToEnd Tester'
    });
    assert(user && user.id && user.email === testEmail, 'User creation produces valid user record with ID');

    const fetchedUser = db.getUserByEmail(testEmail);
    assert(fetchedUser && fetchedUser.id === user.id, 'User can be retrieved by email');

    // 3. Workspace Management
    console.log('\n🏢 Step 3: Workspace Lifecycle & Isolation');
    const ws1 = db.createWorkspace({
      name: 'Production Workspace',
      ownerId: user.id,
      icon: 'briefcase',
      color: '#3b82f6',
      description: 'Production links and campaigns'
    });
    assert(ws1 && ws1.id && ws1.name === 'Production Workspace', 'Workspace created successfully');
    assert(ws1.icon === 'briefcase', 'Workspace uses vector icon identifier without emojis');

    const userWorkspaces = db.getWorkspacesForUser(user.id);
    assert(userWorkspaces.some(w => w.id === ws1.id), 'Workspace shows in user workspace list');

    // 4. Short Link Creation & Smart Slugs
    console.log('\n🔗 Step 4: Link Creation & Analytics');
    const slug = `promo-${Date.now()}`;
    const link = db.createLink({
      workspaceId: ws1.id,
      creatorId: user.id,
      slug,
      domain: 'kiss.url',
      targetUrl: 'https://example.com/summer-sale?src=kissurl',
      title: 'Summer Sale 2026',
      tags: ['Summer', 'Sale', 'Marketing'],
      utmSource: 'newsletter',
      utmMedium: 'email',
      utmCampaign: 'summer_promo'
    });
    assert(link && link.id && link.slug === slug, 'Short link created with custom slug and UTM metadata');

    const retrievedLink = db.getLinkBySlug(slug);
    assert(retrievedLink && retrievedLink.targetUrl.includes('example.com'), 'Link resolved by slug');

    // 5. Click Tracking & Redirection Simulation
    console.log('\n📊 Step 5: Click Event Logging & Geo/Device Analytics');
    const clickEvent = db.recordClick({
      linkId: link.id,
      slug: link.slug,
      workspaceId: ws1.id,
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      referrer: 'https://twitter.com',
      country: 'United States',
      city: 'San Francisco',
      device: 'Desktop',
      browser: 'Chrome',
      os: 'Windows'
    });
    assert(clickEvent && clickEvent.id, 'Click logged with device, browser, and location metadata');

    const updatedLink = db.getLinkById(link.id);
    assert(updatedLink.clicks >= 1, 'Link aggregate click counter incremented');

    const analytics = db.getAnalyticsForLink(link.id);
    assert(analytics && analytics.totalClicks >= 1, 'Analytics aggregation returns recorded click details');

    // 6. Bio Page Studio Operations
    console.log('\n🎨 Step 6: Bio Page Profile & Leads');
    const handle = `tester_${Date.now()}`;
    const bioPage = db.saveBioPage({
      workspaceId: ws1.id,
      handle,
      name: 'Tester Bio Profile',
      tagline: 'Engineering & Product',
      bio: 'All my favorite tools in one curated link in bio.',
      theme: 'midnight',
      links: [
        { id: 'b1', title: 'Main Documentation', url: 'https://developer.mozilla.org', type: 'link' }
      ]
    });
    assert(bioPage && bioPage.handle === handle, 'Bio page saved successfully');

    const fetchedBio = db.getBioPageByHandle(handle);
    assert(fetchedBio && fetchedBio.name === 'Tester Bio Profile', 'Bio page retrieved by public handle');

    // 7. Pixels and Webhooks
    console.log('\n🎯 Step 7: Retargeting Pixels & Webhooks');
    const pixel = db.saveWorkspacePixels(ws1.id, {
      metaPixelId: 'META_99887766',
      gaMeasurementId: 'G-12345678'
    });
    assert(pixel && pixel.metaPixelId === 'META_99887766', 'Pixel configuration saved');

    const pixels = db.getWorkspacePixels(ws1.id);
    assert(pixels.metaPixelId === 'META_99887766', 'Pixels retrieved for workspace');

    const webhook = db.createWorkspaceWebhook({
      workspaceId: ws1.id,
      name: 'Zapier Slack Alert',
      url: 'https://hooks.zapier.com/hooks/catch/12345/abcde',
      events: ['click.created', 'milestone.reached']
    });
    assert(webhook && webhook.id, 'Webhook endpoint configured');

    // 8. Custom Domains & Error Branding
    console.log('\n🌐 Step 8: Custom Domains & 404 Error Branding');
    const domain = db.addCustomDomain({
      workspaceId: ws1.id,
      domain: 'go.mybrand.io'
    });
    assert(domain && domain.domain === 'go.mybrand.io', 'Custom domain created');

    const errorBranding = db.saveErrorBranding(ws1.id, {
      brandName: 'MyBrand Portal',
      logoIcon: 'zap',
      supportUrl: 'https://mybrand.io/support',
      customMessage: 'This link has expired or reached maximum clicks.'
    });
    assert(errorBranding && errorBranding.brandName === 'MyBrand Portal', 'Custom 404 branding saved');

    // 9. Smart Dynamic Routing Verification
    console.log('\n🔀 Step 9: Smart Routing Resolver');
    const dynamicLink = {
      routing: { enabled: true, iosUrl: 'https://apps.apple.com/app', androidUrl: 'https://play.google.com/store' },
      geoRouting: { enabled: true, rules: [{ country: 'GB', url: 'https://uk.example.com' }] },
      splitTesting: { enabled: false }
    };
    const iosDest = db.resolveDynamicDestination(dynamicLink, { device: 'iOS', country: 'US' });
    assert(iosDest.targetUrl === 'https://apps.apple.com/app', 'Dynamic resolver routes iOS traffic to iOS URL');

    const geoDest = db.resolveDynamicDestination(dynamicLink, { device: 'Desktop', country: 'GB' });
    assert(geoDest.targetUrl === 'https://uk.example.com', 'Dynamic resolver routes UK traffic to UK URL');

    console.log('\n=============================================');
    console.log(`🏁 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log('=============================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Test encountered fatal exception:', err);
    process.exit(1);
  }
};

runTests();
