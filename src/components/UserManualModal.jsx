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
      'Open the "Pixels" tab in the navigation bar to configure workspace-level tracking tags.',
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
      'Open the "Webhooks" modal from the navigation bar.',
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
      'Click "Safety" in the navigation bar or use the scanner in the Link Hub.',
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
      'Click "Bio" in the navigation bar to launch the visual Bio Studio.',
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
        className="modal-panel max-w-4xl" 
        style={{ height: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header flex items-center justify-between border-b border-border/40 p-5 bg-card/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">KissURL Interactive User Manual & Feature Guide</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.0 Complete
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete walkthrough of every capability, best practices, and interactive working examples.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3.5 border-b border-border/40 bg-card/20 shrink-0 flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g., A/B Split, UTM tags, Webhooks, Pixels, QR, Passcode)..."
              className="w-full text-xs bg-card/60 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-muted-foreground hover:text-foreground px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Content Split Pane */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Navigation Index */}
          <div className="w-72 border-r border-border/40 bg-card/10 overflow-y-auto p-3 space-y-1 shrink-0">
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
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
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                  <span className="truncate flex-1">{s.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              );
            })}
          </div>

          {/* Right Chapter Content & Interactive Example */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Chapter Title & Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {currentSection.badge}
                </span>
                <span className="text-xs font-mono text-muted-foreground">Chapter {currentSection.title.split('.')[0]}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <CurrentIcon size={22} className="text-primary" />
                {currentSection.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {currentSection.summary}
              </p>
            </div>

            {/* Step-by-Step Walkthrough */}
            <div className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> How It Works & Setup Steps
              </h4>
              <div className="space-y-2">
                {currentSection.howItWorks.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5 border border-primary/20">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-foreground/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Alert */}
            <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 text-xs text-foreground/90 flex items-start gap-3">
              <span className="text-base select-none">💡</span>
              <div className="flex-1 leading-relaxed">
                <strong className="text-primary font-semibold">Pro Tip: </strong>
                {currentSection.proTip}
              </div>
            </div>

            {/* Interactive Working Example Box */}
            <div className="p-4 rounded-xl border border-border/60 bg-card/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Play size={13} className="text-emerald-400" /> {currentSection.example.title}
                </span>
                <button
                  type="button"
                  onClick={() => handleRunWorkingExample(currentSection)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm transition-all"
                >
                  <Sparkles size={12} /> {currentSection.example.actionLabel || 'Try Working Example'}
                </button>
              </div>

              {/* Working Example Details */}
              <div className="p-3 rounded-lg bg-background/80 border border-border/40 text-xs font-mono space-y-2">
                {currentSection.example.inputUrl && (
                  <div>
                    <span className="text-muted-foreground text-[10px] block font-sans">Source Destination:</span>
                    <div className="text-foreground truncate">{currentSection.example.inputUrl}</div>
                  </div>
                )}
                {currentSection.example.shortUrl && (
                  <div>
                    <span className="text-muted-foreground text-[10px] block font-sans">Resulting Branded Link:</span>
                    <div className="text-primary font-bold flex items-center justify-between">
                      <span>{currentSection.example.shortUrl}</span>
                      <button
                        onClick={() => handleCopy(currentSection.example.shortUrl, 'short')}
                        className="text-[10px] text-muted-foreground hover:text-foreground font-sans flex items-center gap-1"
                      >
                        {copiedKey === 'short' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        {copiedKey === 'short' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
                {currentSection.example.generatedUrl && (
                  <div>
                    <span className="text-muted-foreground text-[10px] block font-sans">Campaign Appended URL:</span>
                    <div className="text-primary break-all">{currentSection.example.generatedUrl}</div>
                  </div>
                )}
                {currentSection.example.rules && (
                  <div className="space-y-1 pt-1">
                    <span className="text-muted-foreground text-[10px] block font-sans">Dynamic Routing Condition Matrix:</span>
                    {currentSection.example.rules.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] bg-card/40 p-1.5 rounded">
                        <span className="text-primary font-semibold">{r.condition}</span>
                        <span className="text-muted-foreground truncate max-w-[240px]">{r.target}</span>
                      </div>
                    ))}
                  </div>
                )}
                {currentSection.example.payload && (
                  <div>
                    <span className="text-muted-foreground text-[10px] block font-sans">Sample JSON Payload:</span>
                    <pre className="p-2 rounded bg-black/40 text-[10px] text-emerald-300 overflow-x-auto">
                      {JSON.stringify(currentSection.example.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {currentSection.example.metrics && (
                  <div className="text-emerald-400 font-bold">
                    {currentSection.example.metrics}
                  </div>
                )}
              </div>

              {sandboxResult && sandboxResult.sectionId === currentSection.id && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>{sandboxResult.message} ({sandboxResult.timestamp})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer p-4 border-t border-border/40 bg-card/40 flex items-center justify-between shrink-0">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>📖 Press <kbd className="font-mono text-[10px] bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">ESC</kbd> to exit manual</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
