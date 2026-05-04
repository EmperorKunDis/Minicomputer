#!/usr/bin/env node
/**
 * update-blog-bodies.mjs
 * Re-fetches RSS feeds and updates only the `body` field in blog-data.json
 * from plain text → Markdown with images.
 * Preserves all existing translations, IDs, and dates.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

const TARGETS = [
  'Asset-Manager/client/public/blog-data.json',
  'Attached-Assets/client/public/blog-data.json',
  'Mini-Computer-Shop-2/client/public/blog-data.json',
  'Modern-Eshop/client/public/blog-data.json',
];

const FEEDS = [
  { name: 'TinkerTry',           url: 'https://tinkertry.com/feed'                            },
  { name: 'WilliamLam.com',      url: 'https://williamlam.com/feed'                           },
  { name: 'b3n.org',             url: 'https://b3n.org/feed/'                                 },
  { name: 'Chrisdooks.com',      url: 'https://chrisdooks.com/category/homelab/feed/'          },
  { name: 'Cavelab Blog',        url: 'https://blog.cavelab.dev/index.xml'                    },
  { name: 'Domalab',             url: 'https://domalab.com/feed/'                             },
  { name: 'mpoore.io',           url: 'https://mpoore.io/index.xml'                           },
  { name: "Spencer's Blog",      url: 'https://blog.filegarden.net/feed/'                     },
  { name: 'Zuthof.nl Blog',      url: 'https://blog.zuthof.nl/category/homelab/feed/'         },
  { name: 'dlford.io',           url: 'https://www.dlford.io/blog/index.xml'                  },
  { name: 'NetworkProfile.org',  url: 'https://blog.networkprofile.org/rss/'                  },
  { name: 'TheOrangeOne',        url: 'https://theorangeone.net/feed/'                        },
  { name: "Chris Bergeron's",    url: 'https://chrisbergeron.com/rss2.xml'                    },
  { name: 'DBplatz Blog',        url: 'https://blog.dbplatz.com/tag/homelab/rss/'             },
  { name: "Apalrd's Adventures", url: 'https://www.apalrd.net/tags/homelab/index.xml'         },
];

// ── HTML → Markdown (keeps images as ![alt](url)) ────────────────────────

function htmlToMarkdown(html = '') {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<figure[^>]*>\s*(<img[^>]*>)\s*(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/gi,
      (_, imgTag, caption) => '\n' + imgTag + (caption ? `\n*${caption.replace(/<[^>]+>/g, '').trim()}*\n` : '\n'))
    .replace(/<img([^>]+)>/gi, (_, attrs) => {
      const src = (attrs.match(/\bdata-lazy-src="([^"]+)"/i) || attrs.match(/\bdata-src="([^"]+)"/i) || attrs.match(/\bsrc="([^"]+)"/i) || [])[1] || '';
      const alt = (attrs.match(/\balt="([^"]*)"/i) || [])[1] || '';
      if (!src || src.startsWith('data:') || src.includes('/wp-includes/') || src.includes('s.w.org')) return '';
      return `\n\n![${alt}](${src.replace(/&amp;/g, '&')})\n\n`;
    })
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n## $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n### $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n#### $1\n\n')
    .replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, '\n\n##### $1\n\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
      inner.split('\n').map(l => `> ${l.trim()}`).join('\n') + '\n')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<(p|div|section)[^>]*>([\s\S]*?)<\/\1>/gi, '\n\n$2')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&#8230;/g, '…').replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—').replace(/&#8216;/g, '\u2018').replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// ── RSS parsing ───────────────────────────────────────────────────────────

function parseRss(xml) {
  const map = new Map(); // link → markdownBody

  for (const m of xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)) {
    const c = m[1];
    const link = ((c.match(/<link>([^<]+)<\/link>/) || c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '').trim().replace(/&amp;/g, '&');
    const raw = (c.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/) || [])[1]
             || (c.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1]
             || '';
    if (link) map.set(link, htmlToMarkdown(raw));
  }

  for (const m of xml.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/g)) {
    const c = m[1];
    const link = ((c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '').trim();
    const raw = (c.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/) || [])[1]
             || (c.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) || [])[1]
             || '';
    if (link) map.set(link, htmlToMarkdown(raw));
  }

  return map;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // Load existing blog-data.json
  const sourcePath = resolve(ROOT, TARGETS[0]);
  const data = JSON.parse(readFileSync(sourcePath, 'utf8'));
  console.log(`📖 Loaded ${data.articles.length} articles from existing blog-data.json`);

  // Fetch all RSS feeds → build url→markdownBody map
  console.log('📡 Re-fetching RSS feeds for Markdown bodies...\n');
  const bodyMap = new Map();

  for (const feed of FEEDS) {
    try {
      const resp = await fetch(feed.url, {
        headers: { 'User-Agent': 'MinicomputerBlog/1.0', 'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*' },
        signal: AbortSignal.timeout(12000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const xml = await resp.text();
      const feedMap = parseRss(xml);
      for (const [url, body] of feedMap) bodyMap.set(url, body);
      console.log(`   ✓ ${feed.name.padEnd(25)} — ${feedMap.size} items`);
    } catch (e) {
      console.warn(`   ⚠ ${feed.name}: ${e.message}`);
    }
  }

  console.log(`\n🔄 Updating body fields...`);
  let updated = 0, notFound = 0;

  for (const article of data.articles) {
    const newBody = bodyMap.get(article.originalUrl);
    if (newBody && newBody.length > 50) {
      article.body = newBody;
      updated++;
    } else {
      notFound++;
    }
  }

  console.log(`   ✓ Updated: ${updated}  |  Not in current RSS (kept old): ${notFound}`);

  // Write to all 4 variants
  const output = JSON.stringify(data, null, 2);
  for (const target of TARGETS) {
    writeFileSync(resolve(ROOT, target), output);
  }
  console.log(`\n✅ blog-data.json updated in all 4 variants`);
}

main().catch(e => { console.error(e); process.exit(1); });
