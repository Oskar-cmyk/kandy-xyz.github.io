document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.querySelector(".lightbox");
  const lightboxContent = document.querySelector(".lightbox .content");
  const container = document.getElementById("artworks");
  const closeButton = document.createElement("button");

  closeButton.classList.add("close");
  closeButton.innerHTML = "&#10005;"; // "x" symbol

  // ------------------------
  // Open / close
  // ------------------------
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
    document.body.style.overflow = "hidden";

    // Make iframes relative
    lightboxContent.querySelectorAll("iframe").forEach((iframe) => {
      iframe.style.position = "relative";
    });
  }

  function closeLightbox(updateHash = true) {
    lightboxContent.innerHTML = "";
    lightbox.classList.remove("active");
    document.body.style.overflow = "";

    if (updateHash && location.hash) {
      history.pushState(null, "", location.pathname + location.search);
    }
  }

  // ------------------------
  // Build lightbox from a grid item
  // ------------------------
  function openFromItem(flexItem, updateHash = true) {
    const imageSrc = flexItem.querySelector("img")?.src || "";
    const imageCode = imageSrc ? `<img src="${imageSrc}" alt="lightbox-image">` : "";
    const hiddenInfo = flexItem.querySelector(".hidden-info")?.innerHTML || "";
    const hiddenImages = flexItem.querySelector(".hidden-images")?.innerHTML || "";
    const vimeoVideo = flexItem.querySelector(".vimeo-video")?.innerHTML || "";

    openLightbox(imageCode, hiddenInfo, hiddenImages, vimeoVideo);

    if (updateHash && flexItem.dataset.slug) {
      history.pushState(null, "", `#${encodeURIComponent(flexItem.dataset.slug)}`);
    }
  }

  // ------------------------
  // Deep linking via #slug
  // ------------------------
  window.openFromHash = function () {
    const slug = decodeURIComponent(location.hash.slice(1));

    if (!slug) {
      closeLightbox(false);
      return;
    }

    const item = container?.querySelector(`.flex-item[data-slug="${CSS.escape(slug)}"]`);
    if (item) {
      openFromItem(item, false);
      item.scrollIntoView({ block: "center" });
    }
  };

  window.addEventListener("popstate", window.openFromHash);

  // ------------------------
  // Events
  // ------------------------
  container?.addEventListener("click", function (event) {
    const flexItem = event.target.closest(".flex-item");
    if (!flexItem) return;

    event.preventDefault();
    openFromItem(flexItem);
  });

  closeButton.addEventListener("click", () => closeLightbox());

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  document.getElementById("clickableHeader")?.addEventListener("click", function () {
    window.location.href = "mainpage";
  });

  // In case the fetch resolved before this script ran
  window.openFromHash();
});
