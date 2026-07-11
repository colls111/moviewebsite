export function setupVideoRows() {

    document.querySelectorAll(".video-row-container").forEach(container => {

        const row = container.querySelector(".video-row");

        container.querySelector(".left").onclick = () => {
            row.scrollBy({
                left: -650,
                behavior: "smooth"
            });
        };

        container.querySelector(".right").onclick = () => {
            row.scrollBy({
                left: 650,
                behavior: "smooth"
            });
        };

    });

}