import { formatTime } from "../utils/format.js";

export function Card(video, options = {}) {

    const details = [video.genre, video.subgenre]
        .filter(Boolean)
        .join(" • ");

    const progress = Number(localStorage.getItem(`progress-${video.id}`));
    const percent = video.duration
        ? (progress / video.duration) * 100
        : 0;

    return `
        <a href="/video/${video.id}" class="card" data-link>

            <div class="thumb">

                <img
                    src="${video.thumbnail}"
                    alt="${video.title}"
                    loading="lazy"
                >
            
                ${
                    video.logo
                        ? `
                            <img
                                class="movie-logo"
                                src="${video.logo}"
                                alt="${video.title} logo"
                                loading="lazy"
                            >
                        `
                        : ""
                }
            
                <div class="duration">
                    ${formatTime(video.duration)}
                </div>

                ${
                    options.showProgress &&
                    !isNaN(progress)
                        ? `
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    style="width:${percent}%"
                                ></div>
                            </div>
                        `
                        : ""
                }

            </div>

            <h3>${video.title}</h3>

            ${
                options.showDetails && details
                    ? `<p>${details}</p>`
                    : ""
            }

        </a>
    `;
}
