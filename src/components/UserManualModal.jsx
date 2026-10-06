import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Sparkles, 
  Shuffle, 
  Smartphone, 
  Globe, 
  Tag, 
  Target, 
  Webhook, 
  ShieldCheck, 
  User, 
  QrCode, 
  Layers, 
  BarChart3, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Play, 
  ArrowRight,
  Code,
  Shield,
  Clock,
  Key
} from 'lucide-react';

const MANUAL_SECTIONS = [
  {
    id: 'link-shortening',
    title: '1. Link Shortening & Custom Slugs',
    icon: Sparkles,
    badge: 'Core Feature',
    summary: 'Turn long URLs into branded, memorable, high-converting short links.',
    howItWorks: [
      'Enter any valid destination URL (e.g., https://yourbrand.com/special-product-launch).',
      'Choose a domain (default kiss.url or your custom CNAME domain).',
      'Set a memorable alias (e.g., /launch-2026) or click the dice icon for an auto-generated high-CTR slug.',
      'Add organizational tags (e.g., promo, q3, campaign) for instant dashboard filtering.'
    ],
    proTip: 'Use our AI Slug & Tag Generator by clicking "AI Generate Slugs & Tags" to automatically analyze your destination page and generate relevant slugs and tags!',
    example: {
      title: 'Working Example: Product Launch',
      inputUrl: 'https://acme-analytics.io/enterprise/product-suite-v2?ref=press_release',
      shortUrl: 'https://kiss.url/acme-launch-26',
      tags: ['enterprise', 'launch', 'q3-press'],
      actionLabel: 'Preview Shortening Flow'
    }
  },
  {
    id: 'smart-routing',
    title: '2. Smart Dynamic Routing & A/B Split Testing',
    icon: Shuffle,
    badge: 'Growth Engine',
    summary: 'Distribute traffic across multiple landing pages or redirect based on visitor device and country.',
    howItWorks: [
      'A/B Split Testing: Add 2 or more target variants (e.g., Variant A 50%, Variant B 50%) to test which landing page converts best.',
      'Device-Aware Routing: Set dedicated destinations for Apple iOS (App Store), Android (Google Play), and Desktop Web.',
      'Geo-Location Rules: Route visitors from specific countries (US, UK, Germany, India, Japan) to localized currency or language pages.',
      'Fallback: If a visitor doesn\'t match any specific rule, they automatically receive the primary target URL.'
    ],
    proTip: 'Use the built-in "Live Routing Simulator" to test how your rules evaluate for different phones and countries in real-time before going live.',
    example: {
      title: 'Working Example: Multi-Platform App Store Router',
      rules: [
        { condition: 'iOS / iPhone', target: 'https://apps.apple.com/app/id987654321' },
        { condition: 'Android', target: 'https://play.google.com/store/apps/details?id=io.acme.app' },
        { condition: 'Desktop Web', target: 'https://acme.io/download' }
      ],
      actionLabel: 'Test Device Resolver'
    }
  },
  {
    id: 'utm-builder',
    title: '3. Visual UTM Campaign Builder & Attribution',
    icon: Tag,
    badge: 'Marketing Pro',
    summary: 'Build clean, standardized campaign tracking tags to track ROI in Google Analytics & Mixpanel.',
    howItWorks: [
      'utm_source: The platform sending traffic (e.g., google, meta, newsletter, linkedin).',
      'utm_medium: The marketing channel (e.g., cpc, social_paid, email, sponsored).',
      'utm_campaign: The campaign name (e.g., launch_2026, black_friday).',
      'utm_term & utm_content: Keyword targeting and specific ad creative variations.',
      '1-Click Presets: Instantly load pre-configured parameters for Google PPC, Meta Ads, and Email Newsletters.'
    ],
    proTip: 'KissURL automatically URL-encodes your UTM query parameters and updates the live analytics attribution matrix when visitors click!',
    example: {
      title: 'Working Example: Meta Ad Campaign URL',
      generatedUrl: 'https://mybrand.com/pricing?utm_source=meta&utm_medium=social_paid&utm_campaign=q3_growth&utm_content=video_ad_b',
      actionLabel: 'Copy UTM Template'
    }
  },
  {
    id: 'retargeting-pixels',
    title: '4. Retargeting Pixels & Tracking Tag Manager',
    icon: Target,
    badge: 'Audience Builder',
    summary: 'Fire Meta, GA4, TikTok, LinkedIn, and custom tracking pixels when visitors click your short links.',
    howItWorks: [
      'Open Tools ➔ Retargeting Pixels to configure workspace-level tracking tags.',
      'Enter your Meta Pixel ID, Google Tag Manager / GA4 Measurement ID, TikTok Pixel ID, or LinkedIn Partner ID.',
      'Inject Custom Scripts for advanced tools like Hotjar, Segment, or Plausible.',
      'When any link in your workspace is clicked, the tag firing simulator triggers and registers the PageView event for retargeting audiences.'
    ],
    proTip: 'Retarget visitors who clicked your link on social media even if the final destination belongs to an external website (like an Amazon product page or Substack post)!',
    example: {
      title: 'Working Example: Pixel Config Payload',
      pixels: {
        metaPixelId: '128492049182394',
        gaMeasurementId: 'G-7X982KJ4L9',
        tiktokPixelId: 'C894K29LJ891',
        linkedinPartnerId: '5092831'
      },
      actionLabel: 'View Pixel Presets'
    }
  },
  {
    id: 'webhooks',
    title: '5. Webhook Automations (Slack, Discord & Zapier)',
    icon: Webhook,
    badge: 'Real-Time Data',
    summary: 'Deliver instant JSON payloads to your team channels or APIs when links get clicked.',
    howItWorks: [
      'Open Tools ➔ Webhooks & Automations from the navigation bar.',
      'Pick a preset (Slack Incoming Webhook, Discord Webhook, Zapier, or Custom POST URL).',
      'Choose trigger events: Every Click (Live), Click Milestones (100th, 1,000th clicks), or 404 Health Alerts.',
      'Each webhook payload includes SHA-256 HMAC signature verification via the X-KissURL-Signature header.'
    ],
    proTip: 'Click "Test Ping" next to any webhook to dispatch a real test payload and inspect the HTTP response code and JSON body right in the app.',
    example: {
      title: 'Sample Webhook Payload JSON',
      payload: {
        event: 'click.created',
        workspaceId: 'ws_marketing',
        link: { slug: 'summer-sale', targetUrl: 'https://store.brand.com' },
        click: { device: 'iOS', country: 'US', referrer: 'twitter.com' }
      },
      actionLabel: 'Inspect JSON Payload'
    }
  },
  {
    id: 'safety-auditor',
    title: '6. Link Safety Auditor & Threat Scanner',
    icon: ShieldCheck,
    badge: 'Security & Trust',
    summary: 'Evaluate link safety, phishing probability, and destination reputation before sharing.',
    howItWorks: [
      'Click Tools ➔ URL Safety Auditor in the navigation bar.',
      'The scanner runs heuristic inspections across SSL encryption, suspicious TLDs, domain age, canonical structure, and known blocklists.',
      'Outputs a 0-100 Trust Score with clean breakdown: 🟢 Clean / Verified, 🟡 Moderate Risk, or 🔴 Critical Threat.'
    ],
    proTip: 'Protect your brand reputation by verifying shortened links created by external team members before sharing them in public campaigns.',
    example: {
      title: 'Working Example: Security Audit Report',
      score: '98 / 100 — High Trust',
      checks: ['HTTPS Encryption Valid', 'No Malware Blacklist Flag', 'Valid TLS Certificate', 'Canonical Host Match'],
      actionLabel: 'Run Sample Scan'
    }
  },
  {
    id: 'bio-page-studio',
    title: '7. Bio Link Tree Studio & Lead Capture',
    icon: User,
    badge: 'Creator Suite',
    summary: 'Build customized link-in-bio landing pages with blocks, avatars, social icons, and newsletter capture.',
    howItWorks: [
      'Click Tools ➔ Bio Link Tree Studio to launch the visual studio.',
      'Choose a unique handle (e.g., kiss.url/bio/alex).',
      'Add multi-format blocks: clickable buttons, text highlights, social media icons, and email subscription forms.',
      'Choose between sleek Dark, Minimalist, Glassmorphism, and Cyber Neon themes.'
    ],
    proTip: 'Leads captured via your Bio newsletter forms are stored securely in your workspace and can be exported as CSV at any time.',
    example: {
      title: 'Working Example: Bio Page Structure',
      handle: 'alex-rivera',
      blocks: ['YouTube Channel', 'Latest Podcast Ep #42', 'Join Weekly Newsletter', 'Book 1-on-1 Call'],
      actionLabel: 'Open Bio Studio'
    }
  },
  {
    id: 'qr-studio',
    title: '8. Dynamic QR Code Studio & Export',
    icon: QrCode,
    badge: 'Print & Mobile',
    summary: 'Generate high-resolution QR codes with customizable dot styles, custom colors, and SVG/PNG downloads.',
    howItWorks: [
      'Click the QR icon on any short link in your dashboard.',
      'Customize foreground/background colors with live contrast validation.',
      'Choose Error Correction level: L (7%), M (15%), Q (25%), or H (30% - ideal for logo embedding).',
      'Download as vector SVG (for billboard print) or PNG image (for digital flyers).'
    ],
    proTip: 'Because your QR code points to a dynamic short link, you can change the final destination URL anytime without having to re-print your physical QR codes!',
    example: {
      title: 'Working Example: High-Res Dynamic QR',
      specs: 'Level H (30% ECC) • Hex #6366f1 • 1024x1024px SVG',
      actionLabel: 'Generate Sample QR'
    }
  },
  {
    id: 'passcode-protection',
    title: '9. Passcode Protection & Expiration Gates',
    icon: Shield,
    badge: 'Access Control',
    summary: 'Gate confidential links behind passwords, click limits, or timed expiration dates.',
    howItWorks: [
      'Passcode Gate: Require visitors to enter a secret password before revealing the destination.',
      'Brute-Force Lockout: Protects gated links with 5-attempt brute-force protection and lockout timers.',
      'Expiration Date: Automatically deactivate links after an event or sale concludes.',
      'Max Click Cap: Deactivate the link once it reaches a designated traffic threshold (e.g., first 500 visitors).'
    ],
    proTip: 'Set a custom Fallback URL so that expired or capped visitors are politely redirected to an informative landing page instead of seeing an error.',
    example: {
      title: 'Working Example: VIP Passcode Gate',
      settings: 'Passcode: •••••••• • Expiry: 72 Hours • Max Clicks: 250',
      actionLabel: 'Preview Protection Gate'
    }
  },
  {
    id: 'analytics-suite',
    title: '10. Executive Analytics & 168h Matrix Heatmap',
    icon: BarChart3,
    badge: 'Deep Intelligence',
    summary: 'Real-time velocity timeline, peak hourly heatmap, country geo-distribution, and executive PDF reports.',
    howItWorks: [
      'Timeline Velocity: Tracks hourly and daily click trends to measure campaign momentum.',
      '168-Hour Matrix Heatmap: 7-day x 24-hour matrix showing exact peak traffic hours.',
      'Geo-Distribution: Country-by-country breakdown with interactive flag badges and percentages.',
      'OS & Devices SVG Donut: Breakdown of mobile vs desktop (iOS, Android, macOS, Windows).',
      'Executive Export: One-click export to print-ready PDF, raw CSV dump, or JSON data feed.'
    ],
    proTip: 'Toggle between "Link View" and "All Workspace" in the Analytics modal to analyze a single campaign or your entire business link portfolio!',
    example: {
      title: 'Working Example: Executive Analytics',
      metrics: 'Total Clicks: 1,420 • Peak Hour: Tue 14:00 • Top Geo: US (44%)',
      actionLabel: 'Open Analytics Suite'
    }
  }
];

export default function UserManualModal({ isOpen, onClose, onOpenCreateModal, onOpenBioStudio, onOpenPixelModal, onOpenWebhookModal, onOpenWorkspaceAnalytics }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('link-shortening');
  const [copiedKey, setCopiedKey] = useState(null);
  const [sandboxResult, setSandboxResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredSections = MANUAL_SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.howItWorks.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentSection = MANUAL_SECTIONS.find(s => s.id === activeSectionId) || MANUAL_SECTIONS[0];
  const CurrentIcon = currentSection.icon;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunWorkingExample = (section) => {
    if (section.id === 'link-shortening' && onOpenCreateModal) {
      onClose();
      onOpenCreateModal();
    } else if (section.id === 'bio-page-studio' && onOpenBioStudio) {
      onClose();
      onOpenBioStudio();
    } else if (section.id === 'retargeting-pixels' && onOpenPixelModal) {
      onClose();
      onOpenPixelModal();
    } else if (section.id === 'webhooks' && onOpenWebhookModal) {
      onClose();
      onOpenWebhookModal();
    } else if (section.id === 'analytics-suite' && onOpenWorkspaceAnalytics) {
      onClose();
      onOpenWorkspaceAnalytics();
    } else {
      setSandboxResult({
        sectionId: section.id,
        timestamp: new Date().toLocaleTimeString(),
        message: `⚡ Live Working Demonstration for "${section.title}" loaded successfully!`
      });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '880px', height: '86vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-bg)' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>KissURL Interactive User Manual</h2>
                <span className="badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>v2.0 Complete</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                Complete walkthrough of every capability, best practices, and interactive working examples.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '0.6rem 1.4rem', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g., A/B Split, UTM tags, Webhooks, Pixels, QR, Passcode)..."
              className="input"
              style={{ width: '100%', paddingLeft: '2.2rem', fontSize: '0.825rem' }}
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.55rem' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Content Split Pane */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Navigation Index */}
          <div style={{ width: '260px', borderRight: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-subtle)', overflowY: 'auto', padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', flexShrink: 0 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', padding: '0.25rem 0.5rem' }}>
              Chapters ({filteredSections.length})
            </div>
            {filteredSections.map(s => {
              const Icon = s.icon;
              const isActive = activeSectionId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSectionId(s.id);
                    setSandboxResult(null);
                  }}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    fontSize: '0.8rem',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    gap: '0.45rem',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.title.replace(/^\d+\.\s*/, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Chapter Content & Interactive Example */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Chapter Title & Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <span className="badge" style={{ borderColor: 'rgba(99, 102, 241, 0.3)', color: 'var(--primary-bg)', backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>
                  {currentSection.badge}
                </span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Chapter {currentSection.title.split('.')[0]}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CurrentIcon size={20} style={{ color: 'var(--primary-bg)' }} />
                {currentSection.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {currentSection.summary}
              </p>
            </div>

            {/* Step-by-Step Walkthrough */}
            <div style={{ padding: '1rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.775rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={13} style={{ color: '#10b981' }} /> How It Works & Setup Steps
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentSection.howItWorks.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-default)', color: 'var(--primary-bg)', fontSize: '0.7rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {idx + 1}
                    </span>
                    <span style={{ flex: 1 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Alert */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(99, 102, 241, 0.05)', fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', lineHeight: 1.5 }}>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>💡</span>
              <div>
                <strong style={{ color: 'var(--primary-bg)' }}>Pro Tip: </strong>
                {currentSection.proTip}
              </div>
            </div>

            {/* Interactive Working Example Box */}
            <div style={{ padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Play size={13} style={{ color: '#10b981' }} /> {currentSection.example.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRunWorkingExample(currentSection)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Sparkles size={12} /> {currentSection.example.actionLabel || 'Try Working Example'}
                </button>
              </div>

              {/* Working Example Details */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentSection.example.inputUrl && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>Source Destination:</span>
                    <div style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSection.example.inputUrl}</div>
                  </div>
                )}
                {currentSection.example.shortUrl && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>Resulting Branded Link:</span>
                    <div style={{ color: 'var(--primary-bg)', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{currentSection.example.shortUrl}</span>
                      <button
                        onClick={() => handleCopy(currentSection.example.shortUrl, 'short')}
                        className="btn-ghost"
                        style={{ fontSize: '0.7rem', padding: '1px 6px', fontFamily: 'var(--font-sans)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {copiedKey === 'short' ? <Check size={11} style={{ color: '#10b981' }} /> : <Copy size={11} />}
                        {copiedKey === 'short' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
                {currentSection.example.generatedUrl && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>Campaign Appended URL:</span>
                    <div style={{ color: 'var(--primary-bg)', wordBreak: 'break-all' }}>{currentSection.example.generatedUrl}</div>
                  </div>
                )}
                {currentSection.example.rules && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block' }}>Dynamic Routing Condition Matrix:</span>
                    {currentSection.example.rules.map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', backgroundColor: 'var(--bg-surface)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ color: 'var(--primary-bg)', fontWeight: '600' }}>{r.condition}</span>
                        <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{r.target}</span>
                      </div>
                    ))}
                  </div>
                )}
                {currentSection.example.payload && (
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '0.25rem' }}>Sample JSON Payload:</span>
                    <pre style={{ margin: 0, padding: '0.5rem', borderRadius: 'var(--radius-xs)', backgroundColor: '#09090b', color: '#34d399', fontSize: '0.725rem', overflowX: 'auto' }}>
                      {JSON.stringify(currentSection.example.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {currentSection.example.metrics && (
                  <div style={{ color: '#10b981', fontWeight: '700' }}>
                    {currentSection.example.metrics}
                  </div>
                )}
              </div>

              {sandboxResult && sandboxResult.sectionId === currentSection.id && (
                <div style={{ padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span>{sandboxResult.message} ({sandboxResult.timestamp})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            📖 Press <kbd style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', backgroundColor: 'var(--bg-subtle)', padding: '1px 5px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-default)' }}>ESC</kbd> to exit manual
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
