import { router } from "../router.js";
import { getPreloadedVideo, transferPreloadedVideo } from "./preloadVideo.js";

export function initializePlayer(currentVideo) {
    // ------------------------
    // CONSTANTS & REFERENCES
    // ------------------------
    let video = document.getElementById("video"); // will be updated if transferred
    const progress = document.getElementById("progress");
    const timePreview = document.getElementById("timePreview");
    const fullscreenBtn = document.getElementById("fullscreen");
    const time = document.getElementById("time");
    const player = document.querySelector(".player");

    const play = document.getElementById("play");
    const rewind = document.getElementById("rewind");
    const forward = document.getElementById("forward");
    const back = document.getElementById("back");

    const mute = document.getElementById("mute");
    const volume = document.getElementById("volume");

    const jumpTime = document.getElementById("jumpTime");
    const jumpPopup = document.getElementById("jumpPopup");
    const jumpInput = document.getElementById("jumpInput");
    const jumpGo = document.getElementById("jumpGo");

    const centerIcon = document.getElementById("centerIcon");

    const captionsBtn = document.getElementById("captions");
    const track = document.getElementById("captionTrack");
    const captionsOverlay = document.getElementById("captionsOverlay");

    const speed = document.getElementById("speed");
    const speedSlider = document.getElementById("speedSlider");
    const speedDisplay = document.getElementById("speedDisplay");

    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];

    // ------------------------
    // VARIABLES
    // ------------------------
    const videop = currentVideo;
    const progressKey = `progress-${videop.id}`;

    let lastVolume = 1;
    let playbackSpeed = 1;
    let hideTimer = null;
    let speedTimer = null;
    let centerIconTimer = null;

    let audioCtx = null;
    let source = null;
    let gainNode = null;
    let compressor = null;
    let audioInitialized = false;

    let captionsEnabled = false;
    let textTrack = null;

    let cleanupFns = [];

    // ------------------------
    // HELPER: Add & Auto-remove listener
    // ------------------------
    function addListener(target, event, handler, options = false) {
        if (!target) return;
        target.addEventListener(event, handler, options);
        cleanupFns.push(() => target.removeEventListener(event, handler, options));
    }

    // ------------------------
    // INITIAL SETUP
    // ------------------------
    function initPlayer() {
        if (!currentVideo) return;

        document.getElementById("videoTitle").textContent = currentVideo.title;
        document.title = currentVideo.title;

        // Try to transfer preloaded video
        const transferred = transferPreloadedVideo(video);

        if (transferred) {
            // Update reference after transfer
            video = document.getElementById("video"); // now points to transferred element
        } else {
            // Fallback
            video.src = currentVideo.video;
            video.load();
        }

        video.crossOrigin = "anonymous";

        if (currentVideo.captions) {
            document.getElementById("captionTrack").src = currentVideo.captions;
        }

        captionsEnabled = localStorage.getItem("captions") === "true";

        initAudio();
        loadVolume();
        loadPlaybackSpeed();

        updateSlider(progress);
        updateSlider(volume);
        updateSlider(speedSlider);
    }

    // ------------------------
    // AUDIO (uses current video reference)
    // ------------------------
    function initAudio() {
        if (audioCtx || audioInitialized) return;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(video);
        compressor = audioCtx.createDynamicsCompressor();
        gainNode = audioCtx.createGain();

        compressor.threshold.value = -20;
        compressor.knee.value = 25;
        compressor.ratio.value = 6;
        compressor.attack.value = 0.002;
        compressor.release.value = 0.15;

        source.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        audioInitialized = true;
    }

    // ... [rest of your functions remain the same: cleanupAudio, handlers, etc.] ...

    // In destroy(), make sure to use the current video reference
    function destroy() {
        // ... existing cleanup ...

        // Video cleanup
        if (video) {
            video.pause();
            video.src = "";
            video.load();
            video.removeAttribute("src");
        }

        // Clear DOM references
        textTrack = null;
    }

    // Setup everything
    initPlayer();
    setupListeners();

    // Auto-save interval
    const progressInterval = setInterval(() => {
        if (!video.paused) saveProgress();
    }, 15000);
    cleanupFns.push(() => clearInterval(progressInterval));

    // Start playback
    addListener(video, "canplay", () => {
        video.play().catch(() => {});
    }, { once: true });

    return { destroy };
}
