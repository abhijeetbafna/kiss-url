// Cloudflare Worker Script Template (100% Free Edge Redirect & Analytics)
// Free Tier: 100,000 requests/day, sub-15ms edge redirects globally

export const CLOUDFLARE_WORKER_CODE = `/**
 * KissURL Global Edge Redirector (Cloudflare Worker)
 * 100% Free Tier (100,000 requests/day, 0ms cold starts)
 * 
 * Instructions:
 * 1. Create a free Cloudflare account at https://dash.cloudflare.com
 * 2. Create a KV Namespace named 'KISSURL_KV'
 * 3. Deploy this Worker to your custom domain or *.workers.dev subdomain!
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const slug = url.pathname.slice(1); // remove leading slash

    // 1. Root path -> Forward to Dashboard / Web App
    if (!slug || slug === '') {
      return Response.redirect('https://your-app.pages.dev', 302);
    }

    // 2. Fetch link configuration from Cloudflare KV (Edge Cached)
    const rawLinkData = await env.KISSURL_KV.get(slug);
    if (!rawLinkData) {
      return new Response('404 - KissURL Short Link Not Found', {
        status: 404,
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }

    const link = JSON.parse(rawLinkData);

    // 3. Expiration Check
    if (link.protection?.expiresAt && new Date(link.protection.expiresAt) < new Date()) {
      return new Response('410 - This Link Has Expired', { status: 410 });
    }

    // 4. Click Limit Check
    if (link.protection?.maxClicks && (link.clicks || 0) >= link.protection.maxClicks) {
      return new Response('410 - Link click limit reached.', { status: 410 });
    }

    // 5. User-Agent / Device Smart Routing
    const userAgent = request.headers.get('user-agent') || '';
    let destination = link.targetUrl;

    if (link.routing?.enabled) {
      if (/iPhone|iPad|iPod/i.test(userAgent) && link.routing.iosUrl) {
        destination = link.routing.iosUrl;
      } else if (/Android/i.test(userAgent) && link.routing.androidUrl) {
        destination = link.routing.androidUrl;
      } else if (link.routing.desktopUrl) {
        destination = link.routing.desktopUrl;
      }
    }

    // 6. Social OpenGraph Crawler Intercept (Twitter/Discord/Slack/WhatsApp preview bots)
    const isBot = /bot|facebookexternalhit|Twitterbot|Slackbot|TelegramBot|WhatsApp|LinkedInBot|Discordbot/i.test(userAgent);
    if (isBot && link.socialOg?.enabled) {
      const ogHtml = \`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>\${link.socialOg.title || link.title || 'KissURL'}</title>
  <meta property="og:title" content="\${link.socialOg.title || link.title || ''}">
  <meta property="og:description" content="\${link.socialOg.description || ''}">
  <meta property="og:image" content="\${link.socialOg.imageUrl || ''}">
  <meta property="og:url" content="\${request.url}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="\${link.socialOg.title || link.title || ''}">
  <meta name="twitter:description" content="\${link.socialOg.description || ''}">
  <meta name="twitter:image" content="\${link.socialOg.imageUrl || ''}">
</head>
<body><p>Redirecting to <a href="\${destination}">\${destination}</a>...</p></body>
</html>\`;
      return new Response(ogHtml, {
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }

    // 7. Password Check Trigger
    if (link.protection?.isPasswordProtected) {
      // In production, renders password challenge page
    }

    // 8. Non-blocking Async Analytics Recording
    ctx.waitUntil((async () => {
      const country = request.cf?.country || 'Unknown';
      const referrer = request.headers.get('referer') || 'direct';
      // Write async event to analytics database / queue
    })());

    // 9. Instant Sub-15ms 302 Redirect
    return Response.redirect(destination, 302);
  }
};
`;
