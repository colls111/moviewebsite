import { Header } from "../components/header.js";
import { VideoRow } from "../components/videoRow.js";
import { CardGrid } from "../components/cardgrid.js";
import { getVideos } from "../data.js";

function getContinueWatching(videos) {
    return videos.filter(video =>
        localStorage.getItem(`progress-${video.id}`)
    );
}

function getRecentlyAdded(videos, days = 30) {

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return videos
        .filter(video => new Date(video.added_date) >= cutoff)
        .sort((a, b) => new Date(b.added_date) - new Date(a.added_date))
        .slice(0, 10);
}

export function Home() {

    const videos = getVideos();

    const continueWatching = getContinueWatching(videos);
    const recentlyAdded = getRecentlyAdded(videos, 30);

    return `
        ${Header("home")}

        <main class="container fade-in">

            ${continueWatching.length > 0
                    ? VideoRow("Continue Watching", continueWatching)
                    : ""
            }

            ${VideoRow("Recently Added", recentlyAdded)}

            ${CardGrid("All Content", videos)}

        </main>
    `;
}
