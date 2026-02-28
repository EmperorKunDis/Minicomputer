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
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
    .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
    .replace(/<(p|li|blockquote|div)[^>]*>([\s\S]*?)<\/\1>/gi, '$2\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&#8230;/g, '…')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** Extract the richest text body from an RSS item/entry XML chunk */
function extractBody(c) {
  // Priority: content:encoded > content (Atom) > description/summary (fallback)
  const contentEncoded = (c.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/) || [])[1] || '';
  const atomContent    = (c.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/) || [])[1] || '';
  const description    = (c.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1] || '';
  const summary        = (c.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) || [])[1] || '';

  const raw = contentEncoded || atomContent || description || summary;
  return stripHtml(raw).slice(0, 5000);
}

function parseRss(xml) {
  const items = [];
  // RSS 2.0
  for (const m of xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)) {
    const c = m[1];
    const title    = stripHtml((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)   || [])[1] || '');
    const link     = stripHtml((c.match(/<link>([^<]+)<\/link>/)   || c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '');
    const body     = extractBody(c);
    const excerpt  = body.slice(0, 300);
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
      const body    = extractBody(c);
      const excerpt = body.slice(0, 300);
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

/** Translate text in 480-char chunks, reassemble */
async function translateChunked(text, targetLang) {
  if (!text) return '';
  const CHUNK = 480;
  // Split on sentence boundaries near the chunk size
  const chunks = [];
  let remaining = text.trim();
  while (remaining.length > 0) {
    if (remaining.length <= CHUNK) {
      chunks.push(remaining);
      break;
    }
    // Find last sentence boundary before CHUNK
    let cut = CHUNK;
    const dot = remaining.lastIndexOf('. ', CHUNK);
    if (dot > CHUNK / 2) cut = dot + 1;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
    if (chunks.length >= 10) { chunks.push(remaining); break; } // safety cap at 10 chunks
  }

  const translated = [];
  for (const chunk of chunks) {
    const t = await translateSingle(chunk, targetLang);
    translated.push(t);
    await sleep(200);
  }
  return translated.join(' ');
}

async function translateSingle(text, targetLang, retries = 2) {
  if (!text) return '';
  const short = text.slice(0, 480);
  for (let i = 0; i <= retries; i++) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(short)}&langpair=en|${targetLang}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const json = await resp.json();
      const t = json?.responseData?.translatedText || '';
      if (t && !t.startsWith('PLEASE SELECT') && json?.responseStatus === 200) return t;
    } catch {}
    await sleep(400);
  }
  return text;
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
