#!/usr/bin/env node
/**
 * export-blogposts-md.mjs — Full articles with ALL images downloaded locally
 *
 * Per article:
 *  1. Parse RSS → get article URL + rssHtml (content:encoded)
 *  2. Fetch the actual article page → extract clean HTML body
 *  3. Collect images from BOTH sources, download to images/
 *  4. Replace img src with local paths
 *  5. Convert HTML → Markdown
 *  6. Write .md file
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve, extname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT     = resolve(__dir, '..');
const OUT      = resolve(ROOT, 'blogposts_en');
const IMGS_DIR = resolve(OUT, 'images');

const FEEDS = [
  { name: 'TinkerTry',           slug: 'tinkertry',      url: 'https://tinkertry.com/feed',                          tag: 'homelab'    },
  { name: 'WilliamLam.com',      slug: 'williamlam',     url: 'https://williamlam.com/feed',                         tag: 'vmware'     },
  { name: 'b3n.org',             slug: 'b3n-org',        url: 'https://b3n.org/feed/',                               tag: 'homelab'    },
  { name: 'Chrisdooks.com',      slug: 'chrisdooks',     url: 'https://chrisdooks.com/category/homelab/feed/',        tag: 'vmware'     },
  { name: 'Cavelab Blog',        slug: 'cavelab',        url: 'https://blog.cavelab.dev/index.xml',                  tag: 'homelab'    },
  { name: 'Domalab',             slug: 'domalab',        url: 'https://domalab.com/feed/',                           tag: 'vmware'     },
  { name: 'mpoore.io',           slug: 'mpoore',         url: 'https://mpoore.io/index.xml',                         tag: 'vmware'     },
  { name: "Spencer's Blog",      slug: 'spencers-blog',  url: 'https://blog.filegarden.net/feed/',                   tag: 'selfhosted' },
  { name: 'Zuthof.nl Blog',      slug: 'zuthof',         url: 'https://blog.zuthof.nl/category/homelab/feed/',       tag: 'vmware'     },
  { name: 'dlford.io',           slug: 'dlford',         url: 'https://www.dlford.io/blog/index.xml',                tag: 'homelab'    },
  { name: 'NetworkProfile.org',  slug: 'networkprofile', url: 'https://blog.networkprofile.org/rss/',                tag: 'networking' },
  { name: 'TheOrangeOne',        slug: 'theorangeone',   url: 'https://theorangeone.net/feed/',                      tag: 'selfhosted' },
  { name: "Chris Bergeron's",    slug: 'chrisbergeron',  url: 'https://chrisbergeron.com/rss2.xml',                  tag: 'homelab'    },
  { name: 'DBplatz Blog',        slug: 'dbplatz',        url: 'https://blog.dbplatz.com/tag/homelab/rss/',           tag: 'homelab'    },
  { name: "Apalrd's Adventures", slug: 'apalrd',         url: 'https://www.apalrd.net/tags/homelab/index.xml',       tag: 'homelab'    },
];

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

// ── Utilities ─────────────────────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function formatDate(raw) {
  if (!raw) return 'Unknown date';
  try { return new Date(raw).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return raw; }
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…').replace(/&#8230;/g, '…').replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—').replace(/&#8216;/g, '\u2018').replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C').replace(/&#8221;/g, '\u201D')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
}

function stripTags(str = '') {
  return decodeEntities(str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// ── RSS parsing ───────────────────────────────────────────────────────────

function parseRss(xml) {
  const items = [];

  // RSS 2.0
  for (const m of xml.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g)) {
    const c = m[1];
    const title    = stripTags((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || '');
    const link     = stripTags((c.match(/<link>([^<]+)<\/link>/) || c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '');
    const rssHtml  = (c.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/) || [])[1]
                  || (c.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1]
                  || '';
    const pubDate  = ((c.match(/<pubDate[^>]*>(.*?)<\/pubDate>/) || [])[1] || '').trim();
    const author   = stripTags((c.match(/<dc:creator[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:creator>/)
                             || c.match(/<author[^>]*>([\s\S]*?)<\/author>/) || [])[1] || '');
    const rssImage = ((c.match(/<media:thumbnail[^>]*url="([^"]+)"/)
                    || c.match(/<media:content[^>]*url="([^"]+)"[^>]*type="image/)
                    || c.match(/<enclosure[^>]*url="([^"]+)[^"]*"[^>]*type="image/) || [])[1] || null);
    const cats     = [...c.matchAll(/<category[^>]*>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/category>/g)].map(m => stripTags(m[1]));
    if (title && link) items.push({ title, link, rssHtml, pubDate, author, rssImage, categories: cats });
  }

  // Atom
  if (!items.length) {
    for (const m of xml.matchAll(/<entry[^>]*>([\s\S]*?)<\/entry>/g)) {
      const c = m[1];
      const title   = stripTags((c.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1] || '');
      const link    = ((c.match(/<link[^>]+href="([^"]+)"/) || [])[1] || '').trim();
      const rssHtml = (c.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/) || [])[1]
                   || (c.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) || [])[1]
                   || '';
      const pubDate = ((c.match(/<published[^>]*>(.*?)<\/published>/) || c.match(/<updated[^>]*>(.*?)<\/updated>/) || [])[1] || '').trim();
      const author  = stripTags((c.match(/<name[^>]*>([\s\S]*?)<\/name>/) || [])[1] || '');
      const cats    = [...c.matchAll(/<category[^>]+term="([^"]+)"/g)].map(m => m[1]);
      if (title && link) items.push({ title, link, rssHtml, pubDate, author, rssImage: null, categories: cats });
    }
  }
  return items;
}

// ── Fetching ──────────────────────────────────────────────────────────────

async function fetchText(url, opts = {}) {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': opts.accept || 'text/html,application/xhtml+xml,*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      ...opts.extraHeaders,
    },
    signal: AbortSignal.timeout(opts.timeout || 20000),
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}

async function fetchBinary(url) {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'image/*,*/*',
    },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return { buffer: await resp.arrayBuffer(), contentType: resp.headers.get('content-type') || '' };
}

// ── Article HTML extraction ────────────────────────────────────────────────

function extractArticleHtml(pageHtml) {
  // Remove script/style first
  const clean = pageHtml
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');

  // Strategy 1: <article> tag (Hugo, Ghost, modern static)
  const artMatch = clean.match(/<article[^>]*>([\s\S]+?)<\/article>/i);
  if (artMatch && stripTags(artMatch[1]).length > 300) return artMatch[1];

  // Strategy 2: Common WordPress / CMS content div classes
  const contentClasses = [
    'entry-content', 'post-content', 'article-content', 'article-body',
    'post-body', 'content-body', 'single-content', 'post-inner',
    'gh-content', 'post-full-content', 'article__body', 'td-post-content',
    'post__content', 'blog-post-content', 'hentry', 'the-content',
  ];
  for (const cls of contentClasses) {
    // Grab content up to footer/nav/share sections
    const re = new RegExp(
      `<div[^>]+class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]+?)(?=<div[^>]+class="[^"]*\\b(?:entry-footer|post-footer|post-nav|post-share|related-posts|comments|author-bio|sharedaddy|post-tags)\\b|<footer|<\\/main)`,
      'i'
    );
    const m = clean.match(re);
    if (m && stripTags(m[1]).length > 300) return m[1];
  }

  // Strategy 3: <main> tag
  const mainMatch = clean.match(/<main[^>]*>([\s\S]+?)<\/main>/i);
  if (mainMatch && stripTags(mainMatch[1]).length > 300) return mainMatch[1];

  // Fallback: body stripped of chrome
  return clean
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');
}

// ── Image extraction ──────────────────────────────────────────────────────

function resolveImgSrc(raw, baseUrl) {
  try {
    const src = raw.replace(/&amp;/g, '&').trim();
    if (!src || src.startsWith('data:')) return null;
    if (src.startsWith('//')) return 'https:' + src;
    if (src.startsWith('http')) return src;
    return new URL(src, baseUrl).href;
  } catch { return null; }
}

function pickBestSrcset(srcset) {
  // "img-300.jpg 300w, img-600.jpg 600w, img-1200.jpg 1200w"
  // Pick highest width descriptor
  const parts = srcset.split(',').map(s => s.trim()).filter(Boolean);
  if (!parts.length) return null;
  let best = null, bestW = 0;
  for (const part of parts) {
    const tokens = part.trim().split(/\s+/);
    const url = tokens[0];
    if (!url) continue;
    const desc = tokens[1] || '';
    const w = desc.endsWith('w') ? parseInt(desc) : (desc.endsWith('x') ? parseInt(desc) * 500 : 400);
    if (w >= bestW) { best = url; bestW = w; }
  }
  return best;
}

function extractImgRefs(html, baseUrl) {
  const seen = new Set();
  const refs = [];

  for (const m of html.matchAll(/<img([^>]+)>/gi)) {
    const attrs   = m[1];
    const fullTag = m[0];

    // Priority: data-lazy-src > data-src > srcset (largest) > src
    const lazySrc  = (attrs.match(/\bdata-lazy-src="([^"]+)"/i) || [])[1];
    const dataSrc  = (attrs.match(/\bdata-src="([^"]+)"/i) || [])[1];
    const srcset   = (attrs.match(/\bsrcset="([^"]+)"/i) || [])[1];
    const plainSrc = (attrs.match(/\bsrc="([^"]+)"/i) || [])[1];

    const rawSrc = lazySrc || dataSrc || (srcset ? pickBestSrcset(srcset) : null) || plainSrc;
    if (!rawSrc) continue;

    const src = resolveImgSrc(rawSrc, baseUrl);
    if (!src) continue;

    // Skip tiny images (tracking pixels, icons)
    const w = parseInt((attrs.match(/\bwidth="?(\d+)/i) || [])[1] || '0');
    const h = parseInt((attrs.match(/\bheight="?(\d+)/i) || [])[1] || '0');
    if (w > 0 && w < 60) continue;
    if (h > 0 && h < 60) continue;
    if (/\b(pixel|tracker|tracking|beacon|spacer|1x1|blank)\b/i.test(src)) continue;
    // Skip WordPress emoji / admin bar images
    if (src.includes('/wp-includes/') || src.includes('s.w.org')) continue;

    const canonical = src.split('?')[0];
    if (seen.has(canonical)) continue;
    seen.add(canonical);

    const alt = (attrs.match(/\balt="([^"]*)"/i) || [])[1] || '';
    refs.push({ src, alt, fullTag });
  }
  return refs;
}

async function downloadImage(src, destPath) {
  try {
    const { buffer, contentType } = await fetchBinary(src);
    if (!buffer || buffer.byteLength < 300) return false; // Skip tiny/empty

    // Validate it's actually an image
    const bytes = new Uint8Array(buffer.slice(0, 4));
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
    const isPng  = bytes[0] === 0x89 && bytes[1] === 0x50;
    const isGif  = bytes[0] === 0x47 && bytes[1] === 0x49;
    const isWebp = bytes[0] === 0x52 && bytes[2] === 0x46; // RIFF
    const isSvg  = contentType.includes('svg');
    if (!isJpeg && !isPng && !isGif && !isWebp && !isSvg) {
      // Accept anyway if content-type says image
      if (!contentType.startsWith('image/')) return false;
    }

    writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch { return false; }
}

async function localizeImages(html, baseUrl, imgPrefix) {
  const refs = extractImgRefs(html, baseUrl);
  if (!refs.length) return { html, count: 0 };

  const replacements = new Map(); // origSrc → localPath
  let imgNum = 1;

  // Download images with concurrency limit of 4
  for (let i = 0; i < refs.length; i += 4) {
    const batch = refs.slice(i, i + 4);
    await Promise.all(batch.map(async (ref) => {
      let ext = extname(new URL(ref.src).pathname).split('?')[0].toLowerCase();
      if (!ext || ext.length > 5 || !/^\.\w+$/.test(ext)) {
        // Guess from URL
        if (/\.(jpg|jpeg)/i.test(ref.src)) ext = '.jpg';
        else if (/\.png/i.test(ref.src)) ext = '.png';
        else if (/\.gif/i.test(ref.src)) ext = '.gif';
        else if (/\.webp/i.test(ref.src)) ext = '.webp';
        else if (/\.svg/i.test(ref.src)) ext = '.svg';
        else ext = '.jpg';
      }
      const filename = `${imgPrefix}-img${String(imgNum++).padStart(2, '0')}${ext}`;
      const ok = await downloadImage(ref.src, resolve(IMGS_DIR, filename));
      replacements.set(ref.src, ok ? `images/${filename}` : ref.src);
    }));
  }

  // Replace all src occurrences in HTML
  let out = html;
  for (const [origSrc, localPath] of replacements) {
    if (!localPath.startsWith('images/')) continue; // only replace successfully downloaded
    const escaped = origSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(new RegExp(escaped, 'g'), localPath);
    // Also replace HTML-encoded variant (&amp; → &)
    const encodedSrc = origSrc.replace(/&/g, '&amp;');
    if (encodedSrc !== origSrc) {
      const escapedEnc = encodedSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp(escapedEnc, 'g'), localPath);
    }
  }

  const downloadedCount = [...replacements.values()].filter(v => v.startsWith('images/')).length;
  return { html: out, count: downloadedCount };
}

// ── HTML → Markdown ────────────────────────────────────────────────────────

function htmlToMarkdown(html) {
  return html
    // Noise removal
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    // Figures with optional captions
    .replace(/<figure[^>]*>\s*(<img[^>]*>)\s*(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/gi,
      (_, imgTag, caption) => '\n' + imgTag + (caption ? `\n*${stripTags(caption).trim()}*\n` : '\n'))
    // Images (any attribute order)
    .replace(/<img([^>]+)>/gi, (_, attrs) => {
      const src = (attrs.match(/\bsrc="([^"]+)"/i) || [])[1] || '';
      const alt = (attrs.match(/\balt="([^"]*)"/i) || [])[1] || '';
      return src ? `\n\n![${alt}](${src})\n\n` : '';
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
    // Code blocks (before inline code)
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n')
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
    // Lists
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '\n$1\n')
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '\n$1\n')
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

// ── Markdown file builder ──────────────────────────────────────────────────

function buildMarkdownFile(meta, bodyMarkdown) {
  const { title, link, pubDate, author, rssImage, categories, tag, feedName } = meta;
  const date = formatDate(pubDate);
  const cats = categories?.length ? categories.slice(0, 5).join(', ') : tag;

  const lines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `source: "${feedName}"`,
    `url: "${link}"`,
    `date: "${date}"`,
    ...(author ? [`author: "${author.replace(/"/g, '\\"')}"`] : []),
    `tag: "${tag}"`,
    ...(cats ? [`categories: "${cats}"`] : []),
    ...(rssImage ? [`image: "${rssImage}"`] : []),
    '---',
    '',
    `# ${title}`,
    '',
    `> **Source:** [${feedName}](${link})  `,
    `> **Date:** ${date}  `,
    ...(author ? [`> **Author:** ${author}  `] : []),
    `> **Tag:** \`${tag}\``,
    '',
    '---',
    '',
    bodyMarkdown,
    '',
    '---',
    '',
    `*Originally published at: [${link}](${link})*`,
  ];

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(IMGS_DIR, { recursive: true });

  console.log(`📁 Output : ${OUT}`);
  console.log(`🖼  Images : ${IMGS_DIR}`);
  console.log('📡 Fetching RSS + article pages + images...\n');

  let totalArticles = 0, totalImages = 0;
  const index = [];

  for (const feed of FEEDS) {
    console.log(`\n📰 ${feed.name} (${feed.url})`);

    // ── 1. Fetch RSS ──
    let rssItems = [];
    try {
      const xml = await fetchText(feed.url, {
        accept: 'application/rss+xml, application/atom+xml, text/xml, */*',
        timeout: 15000,
      });
      rssItems = parseRss(xml).slice(0, 5);
      if (!rssItems.length) { console.warn('  ⚠ No items in feed'); continue; }
    } catch (e) {
      console.warn(`  ⚠ RSS fetch failed: ${e.message}`);
      continue;
    }

    // ── 2. Process each article ──
    for (let i = 0; i < rssItems.length; i++) {
      const item   = rssItems[i];
      const prefix = `${feed.slug}-${String(i + 1).padStart(2, '0')}`;
      process.stdout.write(`  [${i + 1}/5] ${item.title.slice(0, 50).padEnd(52)} `);

      let articleHtml = item.rssHtml || '';
      let source      = 'rss';

      // ── 3. Fetch article page ──
      try {
        const pageHtml     = await fetchText(item.link, { timeout: 25000 });
        const extracted    = extractArticleHtml(pageHtml);
        const pageTextLen  = stripTags(extracted).length;
        const rssTextLen   = stripTags(item.rssHtml || '').length;

        if (pageTextLen > rssTextLen * 1.15 + 300) {
          // Page has significantly more content → use page version
          articleHtml = extracted;
          source = 'page';
        } else {
          // RSS content is fine but supplement with any extra images from page
          const rssImgSrcs  = new Set(extractImgRefs(item.rssHtml || '', item.link).map(r => r.src.split('?')[0]));
          const pageImgRefs = extractImgRefs(extracted, item.link).filter(r => !rssImgSrcs.has(r.src.split('?')[0]));
          if (pageImgRefs.length) {
            articleHtml += '\n' + pageImgRefs.map(r => r.fullTag).join('\n');
            source = 'rss+page-imgs';
          }
        }
      } catch (e) {
        source = `rss(${e.message.slice(0, 25)})`;
      }

      // ── 4. Download images ──
      const { html: localHtml, count: imgCount } = await localizeImages(articleHtml, item.link, prefix);

      // ── 5. Convert to Markdown ──
      const bodyMd = htmlToMarkdown(localHtml);

      // ── 6. Write file ──
      const filename = `${prefix}-${slugify(item.title)}.md`;
      const mdContent = buildMarkdownFile({ ...item, feedName: feed.name, tag: feed.tag }, bodyMd);
      writeFileSync(resolve(OUT, filename), mdContent, 'utf8');

      index.push({ file: filename, feed: feed.name, tag: feed.tag, title: item.title, url: item.link });
      totalArticles++;
      totalImages += imgCount;

      console.log(`✓  [src:${source}] ${imgCount} imgs, ${bodyMd.length} chars`);
    }
  }

  // ── Write README index ──
  const readmeLines = [
    '# blogposts_en — Homelab Blog Articles (Full + Images)',
    '',
    `Generated: ${new Date().toISOString().slice(0, 10)}  `,
    `Total articles: **${totalArticles}** | Images downloaded: **${totalImages}**`,
    '',
    '---',
    '',
    '## Index',
    '',
  ];

  let currentFeed = '';
  for (const item of index) {
    if (item.feed !== currentFeed) {
      readmeLines.push(`### ${item.feed} \`#${item.tag}\``);
      readmeLines.push('');
      currentFeed = item.feed;
    }
    readmeLines.push(`- [${item.title}](./${item.file})`);
  }

  readmeLines.push('', '---', '', '*Content belongs to respective authors and publications.*');
  writeFileSync(resolve(OUT, 'README.md'), readmeLines.join('\n'), 'utf8');

  console.log(`\n✅ Done! ${totalArticles} articles, ${totalImages} images → blogposts_en/`);
}

main().catch(e => { console.error(e); process.exit(1); });
