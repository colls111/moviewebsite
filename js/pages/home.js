import { Header } from "../components/header.js";
import { VideoRow } from "../components/videoRow.js";
import { CardGrid } from "../components/cardgrid.js";
import { getVideos } from "../data.js";

function getContinueWatching(videos) {
    return videos.filter(video =>
        localStorage.getItem(`progress-${video.id}`)
    );
}

function getRecentlyAdded(videos) {
    return [...videos]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 10);
}

export function Home() {

    const videos = getVideos();

    const continueWatching = getContinueWatching(videos);
    const recentlyAdded = getRecentlyAdded(videos);

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
