import { formatTime } from "../utils/format.js";

export function Card(video, options = {}) {

    const { showProgress = false } = options;

    const progress = Number(localStorage.getItem(`progress-${video.id}`));
    const percent = Math.min(progress / video.duration * 100, 100);

    console.log(options);
    console.log(showProgress);

    return `
        <a class="card" href="/video/${video.id}" data-link>

            <div class="thumb">
                <img src="${video.thumbnail}">

                ${
                    showProgress
                    ? `
                    <div class="progress-bar">
                        <div
                            class="progress-fill"
                            style="width:${percent}%">
                        </div>
                    </div>
                    `
                    : `
                    <div class="duration">${formatTime(video.duration)}</div>
                    `
                }
            </div>

            <h3>${video.title}</h3>

        </a>
    `;

}
