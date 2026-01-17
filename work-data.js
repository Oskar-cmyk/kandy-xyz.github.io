const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

const query = `*[_type=="artwork"] | order(order asc){
  _id,
  title,
  year,
  school,
  description,
  credits,
  coverMedia{
      mediaType,
      "image": image.asset->url,
      vimeoUrl
    },

    "legacyCover": coverImage.asset->url,
  "cover": coverImage.asset->url,
  "gallery": gallery[].asset->url,
  videos,
  versions[]{
    title,
    description,
    "gallery": gallery[].asset->url,
    videos
  }
}`;

const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(
  query
)}`;

fetch(url)
  .then((res) => res.json())
  .then((res) => {
    console.log("Sanity data:", res.result); // DEBUG
    renderArtworks(res.result);
  })
  .catch((err) => console.error(err));
function renderCover(work) {
  if (work.coverMedia?.mediaType === "vimeo" && work.coverMedia.vimeoUrl) {
    return `
      <iframe
        src="${work.coverMedia.vimeoUrl}"
        width="100%" height="480" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      ></iframe>
    `;
  }

  if (work.coverMedia?.mediaType === "image" && work.coverMedia.image) {
    return `<img src="${work.coverMedia.image}" style="width:100%">`;
  }

  if (work.legacyCover) {
    return `<img src="${work.legacyCover}" style="width:100%">`;
  }

  return "";
}

function renderArtworks(artworks) {
  const container = document.getElementById("artworks");

  artworks.forEach((work) => {
    const item = document.createElement("div");
    item.className = "flex-item";

    item.innerHTML = `
      ${renderCover(work)}
      <div>
        <h3>${work.title}</h3>

        <div class="hidden-info">
          <h4>${work.title}<br>${work.year ?? ""}</h4>
          ${work.school ? `<h5>${work.school}</h5>` : ""}
          <p>${work.description ?? ""}</p>

          ${
            work.videos
              ?.map(
                (v) =>
                  `<iframe src="${v}" width="100%" height="480" frameborder="0" allowfullscreen></iframe>`
              )
              .join("") ?? ""
          }
        </div>

        <div class="hidden-images">
          ${work.gallery?.map((img) => `<img src="${img}">`).join("") ?? ""}
          ${work.credits ? `<h6>${work.credits}</h6>` : ""}
        </div>
      </div>
    `;

    container.appendChild(item);
  });
}
