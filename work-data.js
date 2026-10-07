// work-data.js
const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

const query = `*[_type=="artwork"] | order(order asc){
  _id,
  "slug": slug.current,
  title,
  year,
  school,
  description,
  credits,
  "cover": coverImage.asset->url,
  "gallery": gallery[].asset->url,
  videos
}`;

const url = `https://${PROJECT_ID}.apicdn.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

const esc = (s = "") =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderCover(work) {
  if (!work.cover) return "";
  return `<img src="${esc(work.cover)}?w=1200&fit=max&auto=format" alt="${esc(work.title)}" style="width:100%" loading="lazy">`;
}

function renderArtworks(artworks = []) {
  const container = document.getElementById("artworks");
  if (!container) return;

  if (!artworks.length) {
    container.innerHTML = "<p>No work yet.</p>";
    return;
  }

  artworks.forEach((work) => {
    const item = document.createElement("div");
    item.className = "flex-item";
    item.dataset.slug = work.slug || work._id;

    item.innerHTML = `
      ${renderCover(work)}
      <div>
        <h3>${esc(work.title)}</h3>

        <div class="hidden-info">
          <h4>${esc(work.title)}<br>${esc(work.year ?? "")}</h4>
          ${work.school ? `<h5>${esc(work.school)}</h5>` : ""}
          ${work.description ? `<p>${esc(work.description).replace(/\n/g, "<br>")}</p>` : ""}

          ${
            work.videos
              ?.map(
                (v) =>
                  `<iframe src="${esc(v)}" width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
              )
              .join("") ?? ""
          }
        </div>

        <div class="hidden-images">
          ${work.gallery?.map((img) => `<img src="${esc(img)}?w=1600&fit=max&auto=format" alt="" loading="lazy">`).join("") ?? ""}
          ${work.credits ? `<h6>${esc(work.credits)}</h6>` : ""}
        </div>
      </div>
    `;

    container.appendChild(item);
  });

  window.openFromHash?.();
}

fetch(url, { cache: "no-store" })
  .then((res) => res.json())
  .then((res) => renderArtworks(res.result))
  .catch((err) => console.error(err));
