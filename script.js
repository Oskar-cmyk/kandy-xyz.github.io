document.addEventListener("DOMContentLoaded", function() {
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
                    ${hiddenImages ? hiddenImages : ''}
                </div>
                <div class="text-content">
                    ${hiddenInfo}
                </div>
                ${vimeoVideo ? `
                <div class="vimeo-video">
                    ${vimeoVideo}
                </div>` : ''}
            </div>
        `;
        lightboxContent.appendChild(closeButton); // Ensure the close button is appended after updating content
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
    }

    // Add event listener to open the lightbox when clicking on gallery items
    const galleryItems = document.querySelectorAll(".flex-item, .vimeo-video");  // Include .vimeo-video as clickable
    galleryItems.forEach(item => {
        item.addEventListener("click", function(event) {
            // Prevent default action to prevent click event from propagating
            event.preventDefault();

            const imageSrc = this.querySelector('img') ? this.querySelector('img').src : '';
            const imageCode = imageSrc ? `<img src="${imageSrc}" alt="lightbox-image">` : '';
            const hiddenInfo = this.querySelector('.hidden-info').innerHTML;
            const hiddenImages = this.querySelector('.hidden-images') ? this.querySelector('.hidden-images').innerHTML : '';
            const vimeoVideo = this.querySelector('.vimeo-video') ? this.querySelector('.vimeo-video').innerHTML : '';

            openLightbox(imageCode, hiddenInfo, hiddenImages, vimeoVideo);
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
