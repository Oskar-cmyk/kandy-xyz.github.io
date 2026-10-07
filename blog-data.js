const PROJECT = 'z3noo8fe'
const DATASET = 'production'
const API = `https://${PROJECT}.apicdn.sanity.io/v2023-05-03/data/query/${DATASET}`

const query = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  publishedAt,
  "slug": slug.current,
  "cover": coverImage.asset->url,
  "alt": coverImage.alt,
  excerpt
}`

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})

fetch(`${API}?query=${encodeURIComponent(query)}`)
  .then((r) => r.json())
  .then(({result}) => {
    const el = document.getElementById('posts')
    if (!result || !result.length) {
      el.innerHTML = '<p>No posts yet.</p>'
      return
    }
    el.innerHTML = result
      .map(
        (p) => `
      <a class="post-card" href="post.html?slug=${encodeURIComponent(p.slug)}">
        ${
          p.cover
            ? `<img class="post-card__image" src="${p.cover}?w=800&fit=max&auto=format"
                 alt="${(p.alt || p.title).replace(/"/g, '&quot;')}" loading="lazy">`
            : ''
        }
        <time class="post-card__date" datetime="${p.publishedAt}">${fmtDate(p.publishedAt)}</time>
        <h2 class="post-card__title">${p.title}</h2>
        ${p.excerpt ? `<p class="post-card__excerpt">${p.excerpt}</p>` : ''}
      </a>`
      )
      .join('')
  })
  .catch(() => {
    document.getElementById('posts').innerHTML = '<p>Could not load posts.</p>'
  })
