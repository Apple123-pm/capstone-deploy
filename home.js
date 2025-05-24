document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-gallery img");

    images.forEach(img => {
        img.addEventListener("click", function () {
            const modal = document.createElement("div");
            modal.classList.add("modal");
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <img src="${this.src}" alt="Expanded Image">
                </div>
            `;
            document.body.appendChild(modal);

            document.querySelector(".close").addEventListener("click", function () {
                modal.remove();
            });
        });
    });
});
