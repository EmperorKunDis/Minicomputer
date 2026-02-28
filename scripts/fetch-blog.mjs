#!/usr/bin/env node
/**
 * fetch-blog.mjs — Fetches RSS feeds, picks 60 articles (30 past + 30 future),
 * extracts full body text from content:encoded / description,
 * translates title + summary to 6 languages,
 * outputs blog-data.json with rich content for detail pages.
 *
 * Usage:  node scripts/fetch-blog.mjs
 * Output: client/public/blog-data.json  (copied to all 4 variants)
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

const FEEDS = [
  { name: 'TinkerTry',           url: 'https://tinkertry.com/feed',                             tag: 'homelab'    },
  { name: 'WilliamLam.com',      url: 'https://williamlam.com/feed',                            tag: 'vmware'     },
  { name: 'b3n.org',             url: 'https://b3n.org/feed/',                                  tag: 'homelab'    },
  { name: 'Chrisdooks.com',      url: 'https://chrisdooks.com/category/homelab/feed/',           tag: 'vmware'     },
  { name: 'Cavelab Blog',        url: 'https://blog.cavelab.dev/index.xml',                     tag: 'homelab'    },
  { name: 'Domalab',             url: 'https://domalab.com/feed/',                              tag: 'vmware'     },
  { name: 'mpoore.io',           url: 'https://mpoore.io/index.xml',                            tag: 'vmware'     },
  { name: "Spencer's Blog",      url: 'https://blog.filegarden.net/feed/',                      tag: 'selfhosted' },
  { name: 'Zuthof.nl Blog',      url: 'https://blog.zuthof.nl/category/homelab/feed/',          tag: 'vmware'     },
  { name: 'dlford.io',           url: 'https://www.dlford.io/blog/index.xml',                   tag: 'homelab'    },
  { name: 'NetworkProfile.org',  url: 'https://blog.networkprofile.org/rss/',                   tag: 'networking' },
  { name: 'TheOrangeOne',        url: 'https://theorangeone.net/feed/',                         tag: 'selfhosted' },
  { name: "Chris Bergeron's",    url: 'https://chrisbergeron.com/rss2.xml',                     tag: 'homelab'    },
  { name: 'DBplatz Blog',        url: 'https://blog.dbplatz.com/tag/homelab/rss/',              tag: 'homelab'    },
  { name: "Apalrd's Adventures", url: 'https://www.apalrd.net/tags/homelab/index.xml',          tag: 'homelab'    },
];

const LANGS = ['cs', 'de', 'pl', 'fr', 'es'];

// ── helpers ──────────────────────────────────────────────────────────────────

function stripHtml(str = '') {
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&#8230;/g, '…')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Convert HTML → Markdown, keeping images as ![alt](url) for rich rendering */
function htmlToMarkdown(html = '') {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    // Figures with optional captions
    .replace(/<figure[^>]*>\s*(<img[^>]*>)\s*(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/gi,
      (_, imgTag, caption) => '\n' + imgTag + (caption ? `\n*${caption.replace(/<[^>]+>/g, '').trim()}*\n` : '\n'))
    // Images — keep as markdown, resolve src/data-src/data-lazy-src
    .replace(/<img([^>]+)>/gi, (_, attrs) => {
      const src = (attrs.match(/\bdata-lazy-src="([^"]+)"/i) || attrs.match(/\bdata-src="([^"]+)"/i) || attrs.match(/\bsrc="([^"]+)"/i) || [])[1] || '';
      const alt = (attrs.match(/\balt="([^"]*)"/i) || [])[1] || '';
      if (!src || src.startsWith('data:') || src.includes('/wp-includes/') || src.includes('s.w.org')) return '';
      const cleanSrc = src.replace(/&amp;/g, '&');
      return cleanSrc ? `\n\n![${alt}](${cleanSrc})\n\n` : '';
    })
    // Links
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // Headings
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n## $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n### $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n#### $1\n\n')
    .replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, '\n\n##### $1\n\n')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) =>
      inner.split('\n').map(l => `> ${l.trim()}`).join('\n') + '\n')
    // Code blocks before inline code
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    // Lists
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    // Paragraphs / divs
    .replace(/<(p|div|section)[^>]*>([\s\S]*?)<\/\1>/gi, '\n\n$2')
    .replace(/<br\s*\/?>/gi, '\n')
    // Emphasis
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&#8230;/g, '…').replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—').replace(/&#8216;/g, '\u2018').replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    // Clean whitespace
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** Extract the richest body from an RSS item/entry XML chunk */
function extractBody(c) {
  const contentEncoded = (c.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/) || [])[1] || '';
  const atomContent    = (c.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/) || [])[1] || '';
  const description    = (c.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1] || '';
  const summary        = (c.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) || [])[1] || '';
  const raw = contentEncoded || atomContent || description || summary;
  return {
    markdown: htmlToMarkdown(raw),               // rich Markdown with images for rendering
    plain:    stripHtml(raw).slice(0, 300),      // plain text for translation API
  };
}

function parseRss(xml) {
  const items = [];
  // RSS 2.0
  for (const m of xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)) {
    const c = m[1];
    const title    = stripHtml((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)   || [])[1] || '');
    const link     = stripHtml((c.match(/<link>([^<]+)<\/link>/)   || c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '');
    const { markdown: body, plain: excerpt } = extractBody(c);
    const pubDate  = ((c.match(/<pubDate[^>]*>(.*?)<\/pubDate>/)   || [])[1] || '').trim();
    const image    = ((c.match(/<media:thumbnail[^>]*url="([^"]+)"/)  ||
                       c.match(/<media:content[^>]*url="([^"]+)"[^>]*type="image/)  ||
                       c.match(/<enclosure[^>]*url="([^"]+)[^"]*"[^>]*type="image/) || [])[1] || null);
    if (title && link) items.push({ title, link, body, excerpt, pubDate, image });
  }
  // Atom
  if (!items.length) {
    for (const m of xml.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/g)) {
      const c = m[1];
      const title   = stripHtml((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || '');
      const link    = ((c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '').trim();
      const { markdown: body, plain: excerpt } = extractBody(c);
      const pubDate = ((c.match(/<published[^>]*>(.*?)<\/published>/) || c.match(/<updated[^>]*>(.*?)<\/updated>/) || [])[1] || '').trim();
      if (title && link) items.push({ title, link, body, excerpt, pubDate, image: null });
    }
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { 'User-Agent': 'MinicomputerBlog/1.0', 'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*' },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) { console.warn(`  ⚠ ${feed.name}: HTTP ${resp.status}`); return []; }
    const xml = await resp.text();
    const arts = parseRss(xml).slice(0, 5);
    const origin = new URL(feed.url).origin;
    return arts.map(a => ({ ...a, source: feed.name, sourceUrl: origin, tag: feed.tag }));
  } catch(e) {
    console.warn(`  ⚠ ${feed.name}: ${e.message}`);
    return [];
  }
}

/** Translate a short text using Google Translate (unofficial API, no key needed) */
async function translateSingle(text, targetLang, retries = 3) {
  if (!text) return '';
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.slice(0, 480))}`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlogTranslator/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const translated = data[0].map(chunk => chunk[0] ?? '').join('');
      return translated
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
    } catch (e) {
      if (attempt < retries) {
        await sleep(500 * (attempt + 1));
      }
    }
  }
  return text; // fallback: keep original
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

function slugify(str, idx) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 55) + '-' + idx;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📡 Fetching RSS feeds...');
  const all = [];
  for (const feed of FEEDS) {
    const arts = await fetchFeed(feed);
    const avgBody = arts.length ? Math.round(arts.reduce((s, a) => s + a.body.length, 0) / arts.length) : 0;
    console.log(`   ${feed.name}: ${arts.length} articles (avg body: ${avgBody} chars)`);
    all.push(...arts);
  }
  console.log(`\n📦 Total: ${all.length} articles, selecting 60...\n`);

  // Deduplicate by link, take first 60
  const seen = new Set();
  const selected = all.filter(a => { if (seen.has(a.link)) return false; seen.add(a.link); return true; }).slice(0, 60);

  // Assign dates: today-29 → today+30
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dated = selected.map((a, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 29 + i);
    return { ...a, publishDate: d.toISOString().slice(0, 10) };
  });

  console.log('🌐 Translating titles + summaries to 5 languages (full body stays in English)...');
  const articles = [];
  for (let i = 0; i < dated.length; i++) {
    const a = dated[i];
    process.stdout.write(`   [${String(i+1).padStart(2)}/${dated.length}] ${a.title.slice(0, 50)}...\r`);

    // Translate title + 300-char excerpt into all 5 languages
    const translations = { en: { title: a.title, excerpt: a.excerpt } };
    for (const lang of LANGS) {
      const [title, excerpt] = await Promise.all([
        translateSingle(a.title, lang),
        translateSingle(a.excerpt.slice(0, 250), lang),
      ]);
      translations[lang] = { title, excerpt };
      await sleep(120);
    }

    articles.push({
      id: slugify(a.title, i),
      publishDate: a.publishDate,
      source: a.source,
      sourceUrl: a.sourceUrl,
      originalUrl: a.link,
      image: a.image || null,
      tag: a.tag,
      body: a.body,          // full English body text (up to 5000 chars)
      translations,          // translated title + excerpt in 6 langs
    });
  }
  process.stdout.write('\n');

  const output = JSON.stringify({ generated: new Date().toISOString(), articles }, null, 2);

  // Write to all 4 variants
  const targets = [
    'Asset-Manager/client/public',
    'Attached-Assets/client/public',
    'Mini-Computer-Shop-2/client/public',
    'Modern-Eshop/client/public',
  ];
  for (const t of targets) {
    const dir = resolve(ROOT, t);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, 'blog-data.json'), output);
  }

  const totalBodyChars = articles.reduce((s, a) => s + (a.body?.length || 0), 0);
  console.log(`\n✅ blog-data.json written to all 4 variants`);
  console.log(`   ${articles.length} articles | avg body: ${Math.round(totalBodyChars / articles.length)} chars`);
}

main().catch(e => { console.error(e); process.exit(1); });
