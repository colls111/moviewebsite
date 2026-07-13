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
        .filter(video => new Date(video.date_added) >= cutoff)
        .sort((a, b) => new Date(b.date_added) - new Date(a.date_added))
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
                    ? VideoRow("Continue Watching", continueWatching, {
                        showProgress: true
                    })
                    : ""
            }

            ${VideoRow("Recently Added", recentlyAdded)}

            ${CardGrid("All Content", videos)}
            <footer class="footer">
                <p>All videos are hosted on our servers to ensure a secure and fast experience.</p>
            </footer>

        </main>
    `;
}
