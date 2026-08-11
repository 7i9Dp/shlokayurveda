/*
 * Copies the storefront's prices into the API's trusted price list.
 *
 *   node tools/sync-api-catalog.js
 *
 * Reads   src/assets/data/site-data.json
 * Updates ../SlokAyurvedaAPI/SlokAyurvedaAPI/appsettings.json  ("Catalog" section only)
 *
 * WHY: site-data.json is served to the browser, so the prices in it — and the prices
 * the browser posts back at checkout — can be edited by whoever is using the site. The
 * API works order totals out from its own copy in appsettings.json instead, and refuses
 * any line whose posted price disagrees with it. That means the two have to be kept in
 * step: run this after any price change, then restart or redeploy is NOT needed — the
 * API re-reads appsettings.json on the next request.
 *
 * Only the "Catalog" block is rewritten. Everything else in appsettings.json, comments
 * included, is left byte-for-byte alone, and the previous version is kept as
 * appsettings.json.bak.
 */

const fs = require('fs');
const path = require('path');

const SITE_DATA = path.join(__dirname, '..', 'src', 'assets', 'data', 'site-data.json');
const APPSETTINGS = path.join(__dirname, '..', '..', 'SlokAyurvedaAPI', 'SlokAyurvedaAPI', 'appsettings.json');

// Sits above the "Catalog" key, outside the part this script rewrites, so it survives.
const SECTION_COMMENT = `
  // Server-side price list for checkout — the prices the API actually charges.
  //
  // GENERATED. Regenerate with:  node tools/sync-api-catalog.js   (in the Angular repo)
  // Source of truth:  src/assets/data/site-data.json
  //
  // The storefront catalog is a static file served to the browser, so the UnitPrice it
  // posts at checkout can say anything. Orders are priced from this list instead, and a
  // posted price that disagrees is REJECTED with "Prices have changed" rather than
  // charged at a different amount than the cart showed. So: edit prices in
  // site-data.json, re-run the script, and these stay in step.
`.replace(/^\n/, '');

function main() {
  const items = readCatalog();
  const block = renderCatalogBlock(items);

  const original = fs.readFileSync(APPSETTINGS, 'utf8');
  const updated = replaceOrInsertCatalog(original, block);

  if (updated === original) {
    console.log(`Already in step — ${items.length} prices, nothing to change.`);
    return;
  }

  fs.writeFileSync(APPSETTINGS + '.bak', original, 'utf8');
  fs.writeFileSync(APPSETTINGS, updated, 'utf8');

  console.log(`Wrote ${items.length} prices to:\n  ${APPSETTINGS}`);
  console.log(`Previous version kept as:\n  ${APPSETTINGS}.bak`);
  console.log('\nThe API picks this up on its next request — no restart needed.');
}

/** Kits and products as one id-ordered list, with the checks worth failing loudly on. */
function readCatalog() {
  if (!fs.existsSync(SITE_DATA)) {
    fail(`Cannot find the storefront catalog at:\n  ${SITE_DATA}`);
  }
  if (!fs.existsSync(APPSETTINGS)) {
    fail(`Cannot find the API's appsettings.json at:\n  ${APPSETTINGS}\n`
      + 'Adjust APPSETTINGS in this script if the API lives somewhere else.');
  }

  const site = JSON.parse(fs.readFileSync(SITE_DATA, 'utf8'));
  const items = [...(site.kits || []), ...(site.products || [])].sort((a, b) => Number(a.id) - Number(b.id));

  if (!items.length) {
    fail('No kits or products found in site-data.json — refusing to write an empty price list.');
  }

  const seen = new Set();
  for (const item of items) {
    const id = Number(item.id);
    const price = Number(item.price);

    if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(price) || price <= 0) {
      fail(`"${item.productName}" has a non-numeric or non-positive id/price (id: ${item.id}, price: ${item.price}). Nothing written.`);
    }
    if (seen.has(id)) {
      fail(`Duplicate product id ${id} ("${item.productName}") — ids must be unique. Nothing written.`);
    }
    seen.add(id);
  }

  return items;
}

/** The whole `"Catalog": { ... }` property, aligned so the prices read down a column. */
function renderCatalogBlock(items) {
  const idOf = item => String(Number(item.id));
  const nameOf = item => JSON.stringify(String(item.productName || ''));
  const variantOf = item => JSON.stringify(String(item.pack || item.duration || ''));
  const isKitOf = item => (item.IsKit ? 'true' : 'false');
  const priceOf = item => String(Number(item.price));

  const widest = fn => Math.max(...items.map(item => fn(item).length));
  const idWidth = widest(idOf);
  const nameWidth = widest(nameOf);
  const variantWidth = widest(variantOf);
  const isKitWidth = widest(isKitOf);

  const rows = items.map((item, index) => {
    const comma = index === items.length - 1 ? '' : ',';
    return '      { '
      + `"ProductId": ${(idOf(item) + ',').padEnd(idWidth + 1)} `
      + `"ProductName": ${(nameOf(item) + ',').padEnd(nameWidth + 1)} `
      + `"Variant": ${(variantOf(item) + ',').padEnd(variantWidth + 1)} `
      + `"IsKit": ${(isKitOf(item) + ',').padEnd(isKitWidth + 1)} `
      + `"UnitPrice": ${priceOf(item)}`
      + ' }' + comma;
  });

  const block = '  "Catalog": {\n    "Items": [\n' + rows.join('\n') + '\n    ]\n  }';

  // Cheap insurance: the block must parse on its own before it goes near the real file.
  JSON.parse('{' + block + '}');

  return block;
}

function replaceOrInsertCatalog(text, block) {
  const span = findCatalogSpan(text);

  if (span) {
    return text.slice(0, span.start) + block + text.slice(span.end);
  }

  // First run: add it as the last property of the root object.
  const rootEnd = text.lastIndexOf('}');
  if (rootEnd === -1) {
    fail('appsettings.json does not look like a JSON object — no closing brace found. Nothing written.');
  }

  let before = text.slice(0, rootEnd).replace(/\s+$/, '');
  if (!before.endsWith(',') && !before.endsWith('{')) {
    before += ',';
  }

  return before + '\n\n' + SECTION_COMMENT + block + '\n' + text.slice(rootEnd);
}

/**
 * Character span of the existing `"Catalog": {...}` property, or null if there isn't
 * one. Walks the braces rather than regex-matching the body, skipping over string
 * literals and the // and /* comments appsettings.json is allowed to contain.
 *
 * The span starts at the beginning of the key's line, indentation included, because the
 * replacement carries its own — otherwise every run would indent the block two spaces
 * further than the last.
 */
function findCatalogSpan(text) {
  const key = /"Catalog"\s*:\s*\{/.exec(text);
  if (!key) return null;

  const lineStart = text.lastIndexOf('\n', key.index) + 1;
  const indent = text.slice(lineStart, key.index);
  const start = /^\s*$/.test(indent) ? lineStart : key.index;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = key.index + key[0].length - 1; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') { inString = true; continue; }

    if (ch === '/' && text[i + 1] === '/') {
      i = text.indexOf('\n', i);
      if (i === -1) break;
      continue;
    }
    if (ch === '/' && text[i + 1] === '*') {
      const close = text.indexOf('*/', i + 2);
      if (close === -1) break;
      i = close + 1;
      continue;
    }

    if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return { start: start, end: i + 1 };
  }

  fail('Found a "Catalog" section in appsettings.json but could not find where it ends '
    + '(unbalanced braces?). Nothing written — please check the file by hand.');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main();
