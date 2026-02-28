#!/usr/bin/env node
/**
 * fetch-blog.mjs — Fetches RSS feeds, picks 60 articles (30 past + 30 future),
 * translates titles + excerpts to 6 languages, outputs blog-data.json
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
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
}

function parseRss(xml) {
  const items = [];
  // RSS 2.0
  for (const m of xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)) {
    const c = m[1];
    const title       = stripHtml((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)       ||[])[1] || '');
    const link        = stripHtml((c.match(/<link>([^<]+)<\/link>/)                                             ||
                                   c.match(/<link[^>]+href="([^"]+)"/)                                          ||[])[1] || '');
    const description = stripHtml((c.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)|| [])[1] || '').slice(0, 300);
    const pubDate     = ((c.match(/<pubDate[^>]*>(.*?)<\/pubDate>/)                                             ||[])[1] || '').trim();
    const image       = ((c.match(/<media:thumbnail[^>]*url="([^"]+)"/)                                         ||
                          c.match(/<enclosure[^>]*url="([^"]+).*?type="image/)                                  ||[])[1] || null);
    if (title && link) items.push({ title, link, description, pubDate, image });
  }
  // Atom
  if (!items.length) {
    for (const m of xml.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/g)) {
      const c = m[1];
      const title       = stripHtml((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)     ||[])[1] || '');
      const link        = ((c.match(/<link[^>]+href="([^"]+)"/)                                                 ||[])[1] || '').trim();
      const description = stripHtml((c.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) ||
                                     c.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/) ||[])[1] || '').slice(0, 300);
      const pubDate     = ((c.match(/<published[^>]*>(.*?)<\/published>/)                                       ||
                            c.match(/<updated[^>]*>(.*?)<\/updated>/)                                           ||[])[1] || '').trim();
      if (title && link) items.push({ title, link, description, pubDate, image: null });
    }
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const resp = await fetch(feed.url, {
      headers: { 'User-Agent': 'MinicomputerBlog/1.0', 'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*' },
      signal: AbortSignal.timeout(10000),
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

async function translate(text, targetLang, retries = 2) {
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
  return text; // fallback: original
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
    console.log(`   ${feed.name}: ${arts.length} articles`);
    all.push(...arts);
  }
  console.log(`\n📦 Total: ${all.length} articles, selecting 60...\n`);

  // Deduplicate by link, take first 60
  const seen = new Set();
  const selected = all.filter(a => { if (seen.has(a.link)) return false; seen.add(a.link); return true; }).slice(0, 60);

  // Assign dates: today-29 → today+30
  const today = new Date(); today.setHours(0,0,0,0);
  const dated = selected.map((a, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 29 + i);
    return { ...a, publishDate: d.toISOString().slice(0, 10) };
  });

  console.log('🌐 Translating titles + excerpts to 5 languages...');
  const articles = [];
  for (let i = 0; i < dated.length; i++) {
    const a = dated[i];
    process.stdout.write(`   [${String(i+1).padStart(2)}/${dated.length}] ${a.title.slice(0, 55)}...\r`);

    const translations = { en: { title: a.title, excerpt: a.description || '' } };
    for (const lang of LANGS) {
      const [title, excerpt] = await Promise.all([
        translate(a.title, lang),
        translate((a.description || '').slice(0, 200), lang),
      ]);
      translations[lang] = { title, excerpt };
      await sleep(150);
    }

    articles.push({
      id: slugify(a.title, i),
      publishDate: a.publishDate,
      source: a.source,
      sourceUrl: a.sourceUrl,
      originalUrl: a.link,
      image: a.image || null,
      tag: a.tag,
      translations,
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
  console.log(`\n✅ blog-data.json written to all 4 variants (${articles.length} articles)`);
}

main().catch(e => { console.error(e); process.exit(1); });
