document.addEventListener("DOMContentLoaded", function() {
    const lightbox = document.querySelector(".lightbox");
    const lightboxContent = document.querySelector(".lightbox .content");
    const closeButton = document.createElement("button");

    closeButton.classList.add("close");
    closeButton.innerHTML = "&#10005;"; // "x" symbol
    lightboxContent.appendChild(closeButton); // Append the close button once

    // Function to open the lightbox
    function openLightbox(content, hiddenInfo) {
        lightboxContent.innerHTML = content + hiddenInfo;
        lightbox.classList.add("active");

        // Adjust position of all iframes to relative
        const iframes = lightboxContent.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.style.position = 'relative';
        });
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightboxContent.innerHTML = ''; // Clear the content
        lightbox.classList.remove("active");
        lightboxContent.appendChild(closeButton); // Re-append the close button
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
                const hiddenInfo = this.querySelector('.hidden-info').innerHTML;
                openLightbox(embedCode, hiddenInfo);
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

    // Add event listener to redirect when clicking on the clickable header
    document.getElementById("clickableHeader").addEventListener("click", function() {
        window.location.href = "mainpage"; // Replace "mainpage" with the URL of your main page
    });
});