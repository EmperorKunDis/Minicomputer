#!/usr/bin/env node
/**
 * translate-blog-bodies.mjs
 * Translates full article bodies in blog-data.json to CS/DE/PL/FR/ES
 * using Google Translate (unofficial API — no key needed).
 *
 * Strategy:
 *  - Split body into paragraphs (\n\n)
 *  - Protect inline code (`...`) and image tags (![...](url)) with placeholders
 *  - Translate 5 languages in PARALLEL per article
 *  - Within each language: process paragraphs sequentially (rate limit)
 *  - Save progress after EVERY article
 *  - Skip already-translated articles (resumable)
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');

const LANGS = ['cs', 'de', 'pl', 'fr', 'es'];

const TARGETS = [
  'Asset-Manager/client/public/blog-data.json',
  'Attached-Assets/client/public/blog-data.json',
  'Mini-Computer-Shop-2/client/public/blog-data.json',
  'Modern-Eshop/client/public/blog-data.json',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Google Translate unofficial API ─────────────────────────────────────────

async function googleTranslate(text, targetLang, retries = 3) {
  if (!text || !text.trim()) return text;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlogTranslator/1.0)' },
        signal: AbortSignal.timeout(12000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      // Response: [ [ ["translated", "original", ...], ... ], ... ]
      const translated = data[0].map(chunk => chunk[0] ?? '').join('');

      // Decode HTML entities that Google sometimes injects
      return translated
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

    } catch (e) {
      if (attempt < retries) {
        await sleep(600 * (attempt + 1));
      } else {
        return text; // Fallback: keep original
      }
    }
  }
  return text;
}

// ── Markdown-aware translation ────────────────────────────────────────────────

/**
 * Protect non-translatable Markdown tokens with placeholders.
 * Returns { text, slots } where slots[i] = original token.
 */
function protect(text) {
  const slots = [];
  const PH = (i) => `@@K${i}@@`;

  let t = text;

  // 1. Fenced code blocks  ```...```
  t = t.replace(/```[\s\S]*?```/g, m => { const i = slots.push(m) - 1; return PH(i); });

  // 2. Inline code  `...`
  t = t.replace(/`[^`\n]+`/g, m => { const i = slots.push(m) - 1; return PH(i); });

  // 3. Image tags  ![alt](url)
  t = t.replace(/!\[[^\]]*\]\([^)\s]+\)/g, m => { const i = slots.push(m) - 1; return PH(i); });

  // 4. Link URLs — keep [text](URL): protect URL only, translate text
  t = t.replace(/(\[[^\]]+\])\(([^)\s]+)\)/g, (_, anchor, url) => {
    const i = slots.push(url) - 1;
    return `${anchor}(${PH(i)})`;
  });

  return { text: t, slots };
}

function restore(text, slots) {
  return text.replace(/@@K(\d+)@@/g, (_, i) => slots[parseInt(i)] ?? '');
}

/**
 * Translate a single Markdown paragraph, preserving syntax.
 */
async function translateParagraph(para, lang) {
  const trimmed = para.trim();

  // Skip empty
  if (!trimmed) return para;

  // Skip fenced code blocks
  if (trimmed.startsWith('```')) return para;

  // Skip pure image paragraphs (only image tags, no other text)
  if (/^(!\[[^\]]*\]\([^)]*\)\s*)+$/.test(trimmed)) return para;

  // Skip horizontal rules
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) return para;

  // Protect markdown tokens
  const { text: protected_, slots } = protect(trimmed);

  // Translate
  const translatedText = await googleTranslate(protected_, lang);

  // Restore
  return restore(translatedText, slots);
}

/**
 * Translate the full Markdown body into one language.
 */
async function translateBody(body, lang) {
  if (!body) return body;

  const paragraphs = body.split('\n\n');
  const results = [];

  for (const para of paragraphs) {
    const translated = await translateParagraph(para, lang);
    results.push(translated);
    // Small delay to stay within rate limits
    if (para.trim() && !para.trim().startsWith('```')) {
      await sleep(180 + Math.random() * 80);
    }
  }

  return results.join('\n\n');
}

/**
 * Translate body into all 5 languages in PARALLEL.
 */
async function translateBodyAllLangs(body, langs) {
  const results = await Promise.all(langs.map(lang => translateBody(body, lang)));
  return Object.fromEntries(langs.map((lang, i) => [lang, results[i]]));
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const sourcePath = resolve(ROOT, TARGETS[0]);
  const data = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const articles = data.articles;

  console.log(`📖 ${articles.length} articles to translate into ${LANGS.join(', ')}`);

  // Count already translated
  const alreadyDone = articles.filter(a =>
    LANGS.every(l => a.translations[l]?.body && a.translations[l].body.length > 50)
  ).length;

  if (alreadyDone > 0) {
    console.log(`✅ ${alreadyDone} already translated — skipping those\n`);
  }

  let translated = 0;
  const startTime = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];

    // Skip if all languages already have a body translation
    if (LANGS.every(l => article.translations[l]?.body && article.translations[l].body.length > 50)) {
      process.stdout.write(`  [${i+1}/${articles.length}] ✓ (already done)\n`);
      continue;
    }

    const title = (article.translations?.en?.title || article.id).slice(0, 55);
    process.stdout.write(`  [${i+1}/${articles.length}] ${title}...\n`);

    const paraCount = article.body.split('\n\n').filter(p => p.trim()).length;
    process.stdout.write(`         ↳ ${paraCount} paragraphs × 5 langs parallel... `);

    try {
      const bodies = await translateBodyAllLangs(article.body, LANGS);

      for (const lang of LANGS) {
        if (!article.translations[lang]) article.translations[lang] = { title: '', excerpt: '' };
        article.translations[lang].body = bodies[lang];
      }
      // Also explicitly set English body
      article.translations.en.body = article.body;

      translated++;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const remaining = articles.length - i - 1;
      const avgPerArticle = (Date.now() - startTime) / (translated * 1000);
      const eta = (remaining * avgPerArticle).toFixed(0);
      process.stdout.write(`done (${elapsed}s elapsed, ~${eta}s remaining)\n`);

      // Save progress to all 4 variants after each article
      const output = JSON.stringify(data, null, 2);
      for (const target of TARGETS) {
        writeFileSync(resolve(ROOT, target), output);
      }

    } catch (e) {
      console.error(`\n  ❌ Error translating article ${i+1}: ${e.message}`);
      // Continue with next article
    }
  }

  console.log(`\n✅ Done! Translated ${translated} articles into ${LANGS.length} languages`);
  console.log(`   Total time: ${((Date.now() - startTime) / 1000).toFixed(0)}s`);

  // Final save
  const output = JSON.stringify(data, null, 2);
  for (const target of TARGETS) {
    writeFileSync(resolve(ROOT, target), output);
    console.log(`   Saved → ${target}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
