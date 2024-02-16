document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.querySelector(".lightbox");
    const lightboxContent = document.querySelector(".lightbox .content");
    const closeButton = document.createElement("button");

    closeButton.classList.add("close");
    closeButton.innerHTML = "&#10005;"; // "x" symbol

    // Function to open the lightbox
    function openLightbox(content, hiddenInfo) {
        lightboxContent.innerHTML = content + hiddenInfo;
        lightbox.classList.add("active");
        lightboxContent.appendChild(closeButton); // Append the close button
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightboxContent.innerHTML = ''; // Clear the content
        lightbox.classList.remove("active");
    }

    // Add event listener to open the lightbox when clicking on gallery items
    const galleryItems = document.querySelectorAll(".flex-item");
    galleryItems.forEach(item => {
        item.addEventListener("click", function(event) {
            // Prevent default action to prevent click event from propagating
            event.preventDefault();

            // Check if the clicked item is a Vimeo video or an image
            const isVimeoVideo = this.querySelector('iframe[src*="player.vimeo.com"]');
            if (isVimeoVideo) {
                const embedCode = isVimeoVideo.outerHTML;
                openLightbox(embedCode, '');
            } else {
                const imageSrc = this.querySelector('img').src;
                const imageCode = `<img src="${imageSrc}" alt="lightbox-image">`;
                const hiddenInfo = this.querySelector('.hidden-info').innerHTML;
                openLightbox(imageCode, hiddenInfo);
            }
        });
    });

    // Add event listener to close the lightbox when clicking the close button
    closeButton.addEventListener("click", closeLightbox);

    // Add event listener to close the lightbox when clicking outside its content
    lightbox.addEventListener("click", function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
});
