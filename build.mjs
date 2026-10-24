// build.mjs
import fs from 'node:fs';

const PROJECT_ID = 'z3noo8fe';
const DATASET = 'production';
const TEMPLATE = 'second.html'; // the page that shows the works

const query = `*[_type=="artwork"] | order(order asc){
  _id,
  "slug": slug.current,
  title, year, school, description, credits,
  "cover": coverImage.asset->url,
  "gallery": gallery[].asset->url,
  videos
}`;

const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

const esc = (s = '') =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const renderCover = (w) =>
  w.cover
    ? `<img src="${esc(w.cover)}?w=1200&fit=max&auto=format" alt="${esc(w.title)}" style="width:100%" loading="lazy">`
    : '';

const renderItem = (w) => `
  <div class="flex-item" data-slug="${esc(w.slug || w._id)}">
    ${renderCover(w)}
    <div>
      <h3>${esc(w.title)}</h3>
      <div class="hidden-info">
        <h4>${esc(w.title)}<br>${esc(w.year ?? '')}</h4>
        ${w.school ? `<h5>${esc(w.school)}</h5>` : ''}
        ${w.description ? `<p>${esc(w.description).replace(/\n/g, '<br>')}</p>` : ''}
        ${(w.videos ?? [])
          .map((v) => `<iframe src="${esc(v)}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`)
          .join('')}
      </div>
      <div class="hidden-images">
        ${(w.gallery ?? [])
          .map((img) => `<img src="${esc(img)}?w=1600&fit=max&auto=format" alt="" loading="lazy">`)
          .join('')}
        ${w.credits ? `<h6>${esc(w.credits)}</h6>` : ''}
      </div>
    </div>
  </div>`;

// 1. Fetch from Sanity (build time only)
const res = await fetch(url);
if (!res.ok) throw new Error(`Sanity request failed: ${res.status}`);
const { result: works } = await res.json();

// 2. Copy site files into dist/
fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');

const skip = new Set([
  'node_modules', '.git', '.github', 'dist',
  'build.mjs', 'work-data.js', 'package.json', 'package-lock.json',
]);

for (const entry of fs.readdirSync('.')) {
  if (skip.has(entry)) continue;
  fs.cpSync(entry, `dist/${entry}`, { recursive: true });
}
// 3. Bake the works into the HTML
let html = fs.readFileSync(TEMPLATE, 'utf8');

const emptyContainer = '<div class="flex-container" id="artworks"></div>';
if (!html.includes(emptyContainer)) throw new Error('Container not found in template');

html = html
  .replace(emptyContainer,
    `<div class="flex-container" id="artworks">${works.length ? works.map(renderItem).join('') : '<p>No work yet.</p>'}</div>`)
  .replace('<script src="work-data.js"></script>', '');

fs.writeFileSync(`dist/${TEMPLATE}`, html);
console.log(`Built ${works.length} works`);
