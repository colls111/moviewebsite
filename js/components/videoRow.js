import { Card } from "./card.js";

export function VideoRow(title, videos) {

    return `
        <section class="video-section">

            <h2 class="section-title">${title}</h2>

            <div class="video-row-container">

                <button class="scroll-btn left">❮</button>

                <div class="video-row">
                    ${videos.map(Card).join("")}
                </div>

                <button class="scroll-btn right">❯</button>

            </div>

        </section>
    `;
}