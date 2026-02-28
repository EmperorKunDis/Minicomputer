#!/usr/bin/env node
/**
 * translate-blog-titles.mjs
 * Translates article titles + excerpts in existing blog-data.json
 * to CS/DE/PL/FR/ES using Google Translate (unofficial API — no key needed).
 *
 * Usage:  node scripts/translate-blog-titles.mjs
 * Run after fetch-blog.mjs if titles/excerpts are still in English.
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

      const translated = data[0].map(chunk => chunk[0] ?? '').join('');
      return translated
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
    } catch (e) {
      if (attempt < retries) {
        await sleep(600 * (attempt + 1));
      } else {
        console.warn(`  ⚠ Translation failed (${targetLang}): ${e.message}`);
        return text; // fallback: keep original
      }
    }
  }
  return text;
}

async function main() {
  const sourcePath = resolve(ROOT, TARGETS[0]);
  const data = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const articles = data.articles;

  console.log(`📖 ${articles.length} articles — translating titles + excerpts into ${LANGS.join(', ')}`);

  // Count already translated (title differs from English)
  const alreadyDone = articles.filter(a =>
    LANGS.every(l => {
      const t = a.translations[l]?.title;
      const en = a.translations['en']?.title;
      return t && t.length > 0 && t !== en;
    })
  ).length;

  if (alreadyDone > 0) {
    console.log(`✅ ${alreadyDone} already translated — skipping those\n`);
  }

  let translated = 0;
  const startTime = Date.now();

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const enTitle = article.translations?.en?.title || '';
    const enExcerpt = article.translations?.en?.excerpt || '';

    // Check if ALL langs have different title from English
    const allTranslated = LANGS.every(l => {
      const t = article.translations[l]?.title;
      return t && t.length > 0 && t !== enTitle;
    });

    if (allTranslated) {
      process.stdout.write(`  [${i+1}/${articles.length}] ✓ already done\n`);
      continue;
    }

    process.stdout.write(`  [${i+1}/${articles.length}] ${enTitle.slice(0, 50)}...\n`);

    for (const lang of LANGS) {
      // Skip if this lang already has a different title
      const existingTitle = article.translations[lang]?.title;
      if (existingTitle && existingTitle !== enTitle && existingTitle.length > 0) {
        continue;
      }

      const [title, excerpt] = await Promise.all([
        googleTranslate(enTitle, lang),
        googleTranslate(enExcerpt.slice(0, 300), lang),
      ]);

      if (!article.translations[lang]) {
        article.translations[lang] = { title: '', excerpt: '' };
      }
      article.translations[lang].title = title;
      article.translations[lang].excerpt = excerpt;

      await sleep(150 + Math.random() * 80);
    }

    translated++;

    // Save progress after every article
    const output = JSON.stringify(data, null, 2);
    for (const target of TARGETS) {
      writeFileSync(resolve(ROOT, target), output);
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const remaining = articles.length - i - 1;
    const avgPerArticle = (Date.now() - startTime) / (translated * 1000);
    const eta = (remaining * avgPerArticle).toFixed(0);
    process.stdout.write(`         ↳ done (${elapsed}s elapsed, ~${eta}s remaining)\n`);
  }

  console.log(`\n✅ Done! Translated ${translated} articles`);
  console.log(`   Total time: ${((Date.now() - startTime) / 1000).toFixed(0)}s`);

  // Final save
  const output = JSON.stringify(data, null, 2);
  for (const target of TARGETS) {
    writeFileSync(resolve(ROOT, target), output);
    console.log(`   Saved → ${target}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
