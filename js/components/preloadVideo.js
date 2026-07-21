// preloadVideo.js
let preloader = null;

export function getPreloadedVideo() {
    return preloader;
}

export function preloadVideo(url) {
    if (preloader) {
        preloader.pause();
        preloader.remove();
    }

    preloader = document.createElement('video');
    preloader.crossOrigin = "anonymous";
    preloader.id = 'video-preloader';
    preloader.preload = 'auto';
    preloader.muted = true;
    preloader.controls = false;
    preloader.style.display = 'none';
    preloader.style.position = 'absolute';
    preloader.style.left = '-9999px';

    preloader.src = url;
    document.body.appendChild(preloader);
    preloader.load();

    preloadInitialChunk(url, 12);
    return preloader;
}

function preloadInitialChunk(url, megabytes = 12) {
    const bytes = Math.floor(megabytes * 1024 * 1024) - 1;
    fetch(url, { headers: { Range: `bytes=0-${bytes}` } }).catch(() => {});
}

export function transferPreloadedVideo() {
    if (!preloader) return null;

    const newVideo = preloader;

    // Move it to visible position
    newVideo.style.display = '';
    newVideo.style.position = '';
    newVideo.style.left = '';
    newVideo.muted = false;
    newVideo.id = 'video';

    // Remove from body (if still there)
    if (newVideo.parentNode) newVideo.parentNode.removeChild(newVideo);

    preloader = null;
    return newVideo;
}

export function cleanupPreloader() {
    if (preloader) {
        preloader.pause();
        preloader.remove();
        preloader = null;
    }
}
