const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

const query = `
*[_type == "artwork"] | order(order asc) {
  title,
  year,
  school,
  description,
  "cover": coverImage.asset->url,
  videos,
  "gallery": gallery[].asset->url,
  credits
}
`;

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

function renderArtworks(artworks) {
  const container = document.getElementById("artworks");

  artworks.forEach((work) => {
    const item = document.createElement("div");
    item.className = "flex-item";

    item.innerHTML = `
      <img src="${work.cover}" style="width:100%">
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
