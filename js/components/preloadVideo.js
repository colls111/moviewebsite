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
    fetch(url, {
        headers: { Range: `bytes=0-${bytes}` }
    }).catch(() => {});
}

export function transferPreloadedVideo(targetVideoElement) {
    if (!preloader) return false;

    if (preloader.parentNode) preloader.parentNode.removeChild(preloader);

    targetVideoElement.src = preloader.src;
    targetVideoElement.preload = 'auto';
    targetVideoElement.currentTime = preloader.currentTime || 0;

    preloader.style.display = '';
    preloader.style.position = '';
    preloader.style.left = '';
    preloader.muted = false;
    preloader.controls = false;

    const playerContainer = targetVideoElement.parentNode;
    if (playerContainer) {
        playerContainer.replaceChild(preloader, targetVideoElement);
    }

    preloader.id = 'video';
    preloader = null;

    return true;
}

export function cleanupPreloader() {
    if (preloader) {
        preloader.pause();
        preloader.remove();
        preloader = null;
    }
}
