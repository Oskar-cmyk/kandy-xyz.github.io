const PROJECT = 'z3noo8fe'
const DATASET = 'production'
const API = `https://${PROJECT}.apicdn.sanity.io/v2023-05-03/data/query/${DATASET}`

const slug = new URLSearchParams(location.search ).get('slug')
const el = document.getElementById('post')

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})

function renderSpan(child, markDefs) {
  let html = esc(child.text)
  for (const mark of child.marks || []) {
    const def = markDefs.find((d) => d._key === mark)
    if (def && def._type === 'link') html = `<a href="${esc(def.href)}" target="_blank" rel="noopener">${html}</a>`
    else if (mark === 'strong') html = `<strong>${html}</strong>`
    else if (mark === 'em') html = `<em>${html}</em>`
    else if (mark === 'underline') html = `<u>${html}</u>`
    else if (mark === 'code') html = `<code>${html}</code>`
  }
  return html
}

function renderBody(blocks = []) {
  let out = ''
  let listType = null
  const closeList = () => { if (listType) { out += `</${listType}>`; listType = null } }

  for (const block of blocks) {
    if (block._type === 'image' && block.url) {
      closeList()
      out += `<figure><img src="${block.url}?w=1400&fit=max&auto=format" alt="${esc(block.alt || '')}" loading="lazy">
        ${block.alt ? `<figcaption>${esc(block.alt)}</figcaption>` : ''}</figure>`
      continue
    }
    if (block._type !== 'block') continue

    const inner = (block.children || []).map((c) => renderSpan(c, block.markDefs || [])).join('')

    if (block.listItem) {
      const want = block.listItem === 'number' ? 'ol' : 'ul'
      if (listType !== want) { closeList(); out += `<${want}>`; listType = want }
      out += `<li>${inner}</li>`
      continue
    }
    closeList()
    const style = block.style && block.style !== 'normal' ? block.style : 'p'
    out += style === 'blockquote' ? `<blockquote>${inner}</blockquote>` : `<${style}>${inner}</${style}>`
  }
  closeList()
  return out
}
function loadMorePosts(currentSlug) {
  const q = `*[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...4]{
    _id,
    title,
    publishedAt,
    "slug": slug.current,

    excerpt
  }`

  const u = `${API}?query=${encodeURIComponent(q)}&$slug=${encodeURIComponent(JSON.stringify(currentSlug))}`

  fetch(u)
    .then((r) => r.json())
    .then(({result: posts}) => {
      if (!posts || !posts.length) return

      const cards = posts.map((p) => `
        <a class="post-card" href="post.html?slug=${encodeURIComponent(p.slug)}">

          <time class="post-card__date" datetime="${p.publishedAt}">${fmtDate(p.publishedAt)}</time>
          <h2 class="post-card__title">${esc(p.title)}</h2>
          ${p.excerpt ? `<p class="post-card__excerpt">${esc(p.excerpt)}</p>` : ''}
        </a>`).join('')

      el.insertAdjacentHTML('beforeend', `
        <section class="more-posts">
          <h3 class="more-posts__heading">More posts</h3>
          ${cards}
        </section>`)
    })
    .catch(() => {})
}

if (!slug) {
  el.innerHTML = '<p>No post specified. <a href="blog.html">Back to blog</a></p>'
} else {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    publishedAt,
    tags,
    "cover": coverImage.asset->url,
    "coverAlt": coverImage.alt,
    body[]{..., _type == "image" => {"url": asset->url, alt}}
  }`

  const url = `${API}?query=${encodeURIComponent(query)}&$slug=${encodeURIComponent(JSON.stringify(slug))}`

  fetch(url)
    .then((r) => r.json())
    .then(({result: p}) => {
      if (!p) {
        el.innerHTML = '<p>Post not found. <a href="blog.html">Back to blog</a></p>'
        return
      }
      document.title = `${p.title} — Oskar Kandare`
      el.innerHTML = `
        ${p.tags && p.tags.length
           ? `<div class="post__tags">${p.tags.map((t) => `<span class="post__tag">${esc(t)}</span>`).join('')}</div>`
           : ''}
        <time class="post__date" datetime="${p.publishedAt}">${fmtDate(p.publishedAt)}</time>
        <h2 class="post__title">${esc(p.title)}</h2><br>
        ${p.cover ? `<img class="post__cover" src="${p.cover}?w=1400&fit=max&auto=format" alt="${esc(p.coverAlt || p.title)}">` : ''}
        <div class="post__body">${renderBody(p.body)}</div>
        `
        loadMorePosts(slug)   // <-- add this
    })
    .catch(() => {
      el.innerHTML = '<p>Could not load this post.</p>'
    })
}
