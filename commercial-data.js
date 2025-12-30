const PROJECT_ID = "z3noo8fe";
const DATASET = "production";

const url = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data/query/${DATASET}?query=${encodeURIComponent(
  `*[_type=="commercial"] | order(_createdAt desc){title,description,link,type,videoEmbed,thumbnail}`
)}`;

fetch(url)
  .then((res) => res.json())
  .then((res) => renderCommercial(res.result))
  .catch((err) => console.error(err));

function renderCommercial(items) {
  const main = document.querySelector("main");
  main.innerHTML = "";

  items.forEach((item) => {
    const container = document.createElement("div");
    container.className = "commercial-item";

    if (item.type === "website") {
      container.innerHTML = `
        <a href="${item.link}" target="_blank">${item.title}</a>
        ${item.description ? `<p>${item.description}</p>` : ""}
        <div class="box">
          <iframe src="${item.link}" width="500" height="500"></iframe>
        </div>
      `;

      const box = container.querySelector(".box");
      box.style.display = "none"; // hide iframe initially

      // Show iframe on hover
      container.addEventListener("mouseenter", () => {
        box.style.display = "block";
      });
      container.addEventListener("mouseleave", () => {
        box.style.display = "none";
      });
    } else if (item.type === "video") {
      container.innerHTML = `
        <p>${item.title}</p>
        ${item.description ? `<p>${item.description}</p>` : ""}
        <div class="box-video" style="position:relative;padding-bottom:56.25%;display:none">
          <iframe src="${
            item.videoEmbed
          }" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
        </div>
      `;

      const boxVideo = container.querySelector(".box-video");
      container.addEventListener("mouseenter", () => {
        boxVideo.style.display = "block";
      });
      container.addEventListener("mouseleave", () => {
        boxVideo.style.display = "none";
      });
    }

    main.appendChild(container);
  });
}
