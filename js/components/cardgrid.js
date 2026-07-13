import { Card } from "./card.js";

export function CardGrid(title, videos, showDetails = false) {

    return `
        <section class="video-section">

            <h2 class="section-title">${title}</h2>

            <div class="grid">
                ${videos.map(video =>
                    Card(video, { showDetails })
                ).join("")}
            </div>

        </section>
    `;
}
