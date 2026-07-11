import { formatTime } from "../utils/format.js";

export function Card(video) {

    return `
        <a class="card" href="/video/${video.id}" data-link>

            <div class="thumb">

                <img src="${video.thumbnail}" alt="${video.title}">

                <span class="duration">
                    ${formatTime(video.duration)}
                </span>

            </div>

            <h3>${video.title}</h3>

        </a>
    `;

}
