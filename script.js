document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.querySelector(".lightbox");
  const lightboxContent = document.querySelector(".lightbox .content");
  const closeButton = document.createElement("button");

  closeButton.classList.add("close");
  closeButton.innerHTML = "&#10005;"; // "x" symbol

  function openLightbox(content, hiddenInfo, hiddenImages, vimeoVideo) {
    lightboxContent.innerHTML = `
            <div class="lightbox-inner">
                <div class="image-content">
                    ${content}
                    ${hiddenImages ? hiddenImages : ""}
                </div>
                <div class="text-content">
                    ${hiddenInfo}
                </div>
                ${
                  vimeoVideo
                    ? `
                <div class="vimeo-video">
                    ${vimeoVideo}
                </div>`
                    : ""
                }
            </div>
        `;
    lightboxContent.appendChild(closeButton);
    lightbox.classList.add("active");

    // Make iframes relative
    const iframes = lightboxContent.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.style.position = "relative";
    });
  }

  function closeLightbox() {
    lightboxContent.innerHTML = "";
    lightbox.classList.remove("active");
  }
  function showVersion(version) {
    const img = document.querySelector(".image-content");
    const text = document.querySelector(".text-content");

    img.innerHTML = "";
    text.innerHTML = "";

    version.gallery?.forEach((src) => {
      const el = document.createElement("img");
      el.src = src;
      img.appendChild(el);
    });

    version.videos?.forEach((url) => {
      img.innerHTML += `<iframe src="${url}" allowfullscreen></iframe>`;
    });

    if (version.description) {
      text.innerHTML = `<p>${version.description}</p>`;
    }
  }

  function renderVersions(versions) {
    if (!versions?.length) return "";

    return `
      <div class="version-tabs">
        ${versions
          .map(
            (v, i) =>
              `<button class="version-tab ${
                i === 0 ? "active" : ""
              }" data-index="${i}">
                ${v.title || `Version ${i + 1}`}
              </button>`
          )
          .join("")}
      </div>
    `;
  }

  // ------------------------
  // Event delegation on container
  // ------------------------
  const container = document.getElementById("artworks");
  container.addEventListener("click", function (event) {
    const flexItem = event.target.closest(".flex-item");
    if (!flexItem) return; // clicked outside flex-item

    event.preventDefault();

    const imageSrc = flexItem.querySelector("img")
      ? flexItem.querySelector("img").src
      : "";
    const imageCode = imageSrc
      ? `<img src="${imageSrc}" alt="lightbox-image">`
      : "";
    const hiddenInfo = flexItem.querySelector(".hidden-info")
      ? flexItem.querySelector(".hidden-info").innerHTML
      : "";
    const hiddenImages = flexItem.querySelector(".hidden-images")
      ? flexItem.querySelector(".hidden-images").innerHTML
      : "";
    const vimeoVideo = flexItem.querySelector(".vimeo-video")
      ? flexItem.querySelector(".vimeo-video").innerHTML
      : "";

    openLightbox(imageCode, hiddenInfo, hiddenImages, vimeoVideo);
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document
    .getElementById("clickableHeader")
    .addEventListener("click", function () {
      window.location.href = "mainpage";
    });
});
document.querySelectorAll(".version-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".version-tab")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    showVersion(artworkData.versions[btn.dataset.index]);
  });
});
