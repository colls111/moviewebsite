import { Header } from "../components/header.js";
import { getVideos } from "../data.js";
import { formatTime } from "../utils/format.js";

let preloadVideoElement = null;
let currentVideoId = null;

export function Video(id) {
    const video = getVideos().find(v => v.id === id);
    currentVideoId = id;

    // Cleanup any previous preload
    cleanupPreload();

    if (!video) {
        return `
            ${Header()}
            <main class="container">
                <h1>Video not found</h1>
            </main>
        `;
    }

    // Start smart preload
    startPreload(video);

    const typeText = video.category === "Shows" ? "📺 Show" : "🎬 Movie";

    const progress = Number(localStorage.getItem(`progress-${video.id}`));

    const watchText = !isNaN(progress) &&
        progress >= 60 &&
        progress <= video.duration - 600
            ? `▶️ Continue Watching • ${formatTime(progress)}`
            : "▶️ Watch Now";

    return `
        ${Header()}
        
        <main class="container fade-in">
            <div class="layout">
                <img class="thumbnail" src="${video.thumbnail}" alt="${video.title}">

                <div class="info">
                    <h1 class="title">${video.title}</h1>

                    <div class="meta">
                        <div>${typeText} • ${video.genre} • ${video.subgenre}</div>
                        <div>🕒 ${formatTime(video.duration)}</div>
                        <div>📅 ${video.date}</div>
                    </div>

                    <div class="description">${video.description}</div>

                    <a class="watch-btn" href="/watch/${video.id}" data-link>
                        <span class="play"></span>
                        <span>${watchText}</span>
                    </a>
                </div>
            </div>
        </main>
    `;
}

// ==================== PRELOADING ====================

function startPreload(video) {
    preloadVideoElement = document.createElement('video');
    preloadVideoElement.style.display = 'none';
    preloadVideoElement.preload = 'auto';
    preloadVideoElement.src = video.video;

    
    document.body.appendChild(preloadVideoElement);
}

function cleanupPreload() {
    if (!preloadVideoElement) return;

    preloadVideoElement.pause();
    preloadVideoElement.removeAttribute("src");
    preloadVideoElement.load();
    preloadVideoElement.remove();

    preloadVideoElement = null;
}

export function cleanupVideoPage() {
    cleanupPreload();
}
