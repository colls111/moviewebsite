import { Card } from "./card.js";

export function VideoRow(title, videos, options = {}) {

    return `
        <section class="video-section">

            <h2 class="section-title">${title}</h2>

            <div class="video-row-container">

                <button class="scroll-btn left">❮</button>

                <div class="video-row">
                    ${videos.map(video => Card(video, options)).join("")}
                </div>

                <button class="scroll-btn right"><spanR>❯<spanR></button>

            </div>

        </section>
    `;
}
