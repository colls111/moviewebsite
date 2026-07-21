import { router } from "../router.js";
import { getPreloadedVideo, transferPreloadedVideo } from "../components/preloadVideo.js";

export function initializePlayer(currentVideo) {
    // ------------------------
    // CONSTANTS
    // ------------------------
    let video = null;
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

        // === TRANSFER PRELOADED VIDEO ===
        const transferredVideo = transferPreloadedVideo();

        if (transferredVideo) {
            video = transferredVideo;

            // Insert the transferred video into the player container
            const playerContainer = document.querySelector(".player");
            const oldVideo = document.getElementById("video"); // in case placeholder still exists

            if (oldVideo && oldVideo !== video) {
                oldVideo.parentNode.replaceChild(video, oldVideo);
            } else {
                // If no placeholder, append directly
                const bottom = document.querySelector(".bottom") || playerContainer;
                playerContainer.insertBefore(video, bottom);
            }
        } else {
            // Fallback: create or use existing
            video = document.getElementById("video");
            if (!video) {
                video = document.createElement('video');
                video.id = 'video';
                // append logic...
            }
            video.src = currentVideo.video;
            video.load();
        }

        video.crossOrigin = "anonymous";

        if (currentVideo.captions) {
            document.getElementById("captionTrack").src = currentVideo.captions;
        }

        // Rest of init...
        captionsEnabled = localStorage.getItem("captions") === "true";

        initAudio();
        loadVolume();
        loadPlaybackSpeed();

        updateSlider(progress);
        updateSlider(volume);
        updateSlider(speedSlider);
    }

    // ------------------------
    // AUDIO
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

    function cleanupAudio() {
        if (source) source.disconnect();
        if (gainNode) gainNode.disconnect();
        if (compressor) compressor.disconnect();
        if (audioCtx) {
            audioCtx.close().catch(() => {});
        }
        source = gainNode = compressor = audioCtx = null;
    }

    // ------------------------
    // EVENT HANDLERS (named for removal)
    // ------------------------
    function handleKeydown(e) {
        showUI();

        if (e.target.tagName === "INPUT") return;

        switch (e.key.toLowerCase()) {
            case " ":
            case "k":
                e.preventDefault();
                togglePlay();
                break;
            case "f":
                e.preventDefault();
                toggleFullscreen();
                break;
            case "m":
                e.preventDefault();
                toggleMute();
                break;
            case "c":
                e.preventDefault();
                toggleCaptions();
                break;
            case "arrowleft":
                e.preventDefault();
                skip(-10);
                break;
            case "arrowright":
                e.preventDefault();
                skip(10);
                break;
            case "arrowup":
                e.preventDefault();
                setVolume(video.volume + 0.05);
                break;
            case "arrowdown":
                e.preventDefault();
                setVolume(video.volume - 0.05);
                break;
        }
    }

    function handleClickOutside() {
        jumpPopup.classList.remove("show");
    }

    function handleTimeUpdate() {
        progress.value = video.currentTime;
        updateSlider(progress);
        time.textContent = `${format(video.currentTime)} / ${format(video.duration)}`;
    }

    function handleCueChange() {
        if (!captionsEnabled) {
            captionsOverlay.textContent = "";
            return;
        }
        const cue = textTrack?.activeCues?.[0];
        captionsOverlay.textContent = cue ? cue.text : "";
    }

    // ------------------------
    // EVENT LISTENERS
    // ------------------------
    function setupListeners() {
        addListener(document, "keydown", handleKeydown);
        addListener(document, "click", handleClickOutside);
        addListener(video, "play", () => {
            play.textContent = "⏸️";
        });

        addListener(video, "pause", () => {
            play.textContent = "▶️";
        });

        addListener(video, "loadedmetadata", () => {
            loadProgress();
            updateSlider(progress);
            initCaptions();
        });

        addListener(video, "pause", () => {
            clearTimeout(hideTimer);
            player.classList.remove("hide-ui");
        });

        addListener(video, "ended", () => {
            localStorage.removeItem(progressKey);
        });

        addListener(video, "timeupdate", handleTimeUpdate);

        addListener(video, "pause", saveProgress);
        addListener(video, "play", showUI);
        addListener(video, "click", togglePlay);
        addListener(video, "dblclick", toggleFullscreen);

        addListener(player, "mousemove", showUI);
        addListener(player, "mouseenter", showUI);
        
        addListener(progress, "mousemove", updateTimePreview);

        addListener(progress, "change", saveProgress);
        addListener(progress, "input", () => {
            video.currentTime = progress.value;
            handleTimeUpdate();
            saveProgress();
        });
        addListener(progress, "mouseenter", () => {
            timePreview.classList.add("show");
        });

        addListener(progress, "mouseleave", () => {
            timePreview.classList.remove("show");
        });
        addListener(window, "beforeunload", saveProgress);

        addListener(jumpInput, "keydown", (e) => {
            if (e.key === "Enter") jumpToTime();
        });

        // Button handlers
        addListener(play, "click", togglePlay);

        back.onclick = () => {
            document.title = "C's Movies";
            history.pushState({}, "", `/home`);
            router();
        };
        cleanupFns.push(() => { back.onclick = null; });

        fullscreenBtn.onclick = toggleFullscreen;
        cleanupFns.push(() => { fullscreenBtn.onclick = null; });

        rewind.onclick = () => skip(-10);
        cleanupFns.push(() => { rewind.onclick = null; });

        forward.onclick = () => skip(10);
        cleanupFns.push(() => { forward.onclick = null; });

        volume.oninput = () => setVolume(Number(volume.value));
        cleanupFns.push(() => { volume.oninput = null; });

        mute.onclick = toggleMute;
        cleanupFns.push(() => { mute.onclick = null; });

        speedSlider.oninput = () => {
            const index = Number(speedSlider.value);
            playbackSpeed = speeds[index];
            video.playbackRate = playbackSpeed;
            speedDisplay.textContent = `${playbackSpeed}×`;
            showSpeedDisplay();
            updateSlider(speedSlider);
            localStorage.setItem("player-speed", playbackSpeed);
        };
        cleanupFns.push(() => { speedSlider.oninput = null; });

        captionsBtn.onclick = toggleCaptions;
        cleanupFns.push(() => { captionsBtn.onclick = null; });

        jumpGo.onclick = jumpToTime;
        cleanupFns.push(() => { jumpGo.onclick = null; });

        jumpPopup.onclick = (e) => e.stopPropagation();
        cleanupFns.push(() => { jumpPopup.onclick = null; });

        jumpTime.onclick = (e) => {
            e.stopPropagation();
            jumpPopup.classList.toggle("show");
            if (jumpPopup.classList.contains("show")) {
                jumpInput.focus();
                jumpInput.select();
            }
        };
        cleanupFns.push(() => { jumpTime.onclick = null; });
    }

    // ------------------------
    // CORE FUNCTIONS
    // ------------------------
    async function togglePlay() {

        if (audioCtx?.state === "suspended") {
            await audioCtx.resume();
        }

        if (video.paused) {
            try {
                await video.play();
            } catch (err) {

                if (err.name !== "AbortError") {
                    console.error(err);
                }

            }
            showCenterIcon("▶️");
        } else {
            video.pause();
            showCenterIcon("⏸️");
        }

        saveProgress();
    }

    function skip(seconds) {
        video.currentTime = Math.min(
            video.duration,
            Math.max(0, video.currentTime + seconds)
        );

        handleTimeUpdate(); // Update slider + time immediately
        saveProgress();
    }

    function jumpToTime() {
        const seconds = parseTime(jumpInput.value);
        if (seconds == null) return;

        video.currentTime = Math.min(Math.max(seconds, 0), video.duration);
        saveProgress();
        jumpPopup.classList.remove("show");
    }

    function showUI() {
        player.classList.remove("hide-ui");
        clearTimeout(hideTimer);

        if (!video.paused) {
            hideTimer = setTimeout(() => {
                player.classList.add("hide-ui");
            }, 2500);
        }
    }

    function showCenterIcon(icon) {
        centerIcon.textContent = icon;
        centerIcon.classList.add("show");

        clearTimeout(centerIconTimer);
        centerIconTimer = setTimeout(() => {
            centerIcon.classList.remove("show");
        }, 350);
    }

    function setVolume(value) {
        value = Math.max(0, Math.min(1, value));
        if (gainNode) gainNode.gain.value = value * 3;

        video.muted = value === 0;
        volume.value = value;
        updateSlider(volume);

        mute.textContent = value === 0 ? "🔇" : "🔊";

        if (value > 0) lastVolume = value;
        localStorage.setItem("player-volume", value);
    }

    function showSpeedDisplay() {
        speedDisplay.classList.add("show");
        clearTimeout(speedTimer);
        speedTimer = setTimeout(() => {
            speedDisplay.classList.remove("show");
        }, 800);
    }

    function toggleMute() {
        if (video.muted || video.volume === 0) {
            setVolume(lastVolume);
        } else {
            lastVolume = video.volume;
            setVolume(0);
        }
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (player.requestFullscreen) {
                player.requestFullscreen().catch(() => {});
            }
        }
    }

    function toggleCaptions() {
        captionsEnabled = !captionsEnabled;
        localStorage.setItem("captions", captionsEnabled);
        captionsBtn.classList.toggle("active", captionsEnabled);
        captionsOverlay.style.display = captionsEnabled ? "block" : "none";
        updateCaption();
    }

    function saveProgress() {
        if (video.currentTime >= 60 && video.currentTime <= video.duration - 600) {
            localStorage.setItem(progressKey, video.currentTime);
        } else {
            localStorage.removeItem(progressKey);
        }
    }

    function loadVolume() {
        const saved = localStorage.getItem("player-volume");
        if (saved === null) return;
        const value = Number(saved);
        setVolume(value);
        if (value > 0) lastVolume = value;
    }

    function loadPlaybackSpeed() {
        const saved = Number(localStorage.getItem("player-speed"));
        if (!speeds.includes(saved)) {
            playbackSpeed = 1;
            video.playbackRate = 1;
            speedSlider.value = speeds.indexOf(1);
            speedDisplay.textContent = "1×";
            return;
        }
        playbackSpeed = saved;
        video.playbackRate = saved;
        speedSlider.value = speeds.indexOf(saved);
        speedDisplay.textContent = `${saved}×`;
    }

    function loadProgress() {
        progress.max = video.duration;
        const savedTime = Number(localStorage.getItem(progressKey));
        if (!isNaN(savedTime) && savedTime < video.duration - 10) {
            video.currentTime = savedTime;
        }
        progress.value = video.currentTime;
        updateSlider(progress);
    }

    function initCaptions() {
        textTrack = video.textTracks[0];
        if (textTrack) {
            textTrack.mode = "hidden";
            addListener(textTrack, "cuechange", handleCueChange);
        }

        captionsEnabled = localStorage.getItem("captions") === "true";
        captionsOverlay.style.display = captionsEnabled ? "block" : "none";
        captionsBtn.classList.toggle("active", captionsEnabled);
    }

    function updateCaption() {
        if (!textTrack || !captionsEnabled) {
            captionsOverlay.textContent = "";
            return;
        }
        const cue = textTrack.activeCues?.[0];
        captionsOverlay.textContent = cue ? cue.text : "";
    }

    function format(seconds) {
        if (isNaN(seconds)) return "0:00";
        seconds = Math.floor(seconds);
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function parseTime(text) {
        text = text.trim();
        const parts = text.split(":").map(Number);
        if (parts.some(isNaN)) return null;

        if (parts.length === 1) return parts[0];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return null;
    }

    function updateSlider(slider) {
        const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #4da3ff 0%, #4da3ff ${percent}%, #555 ${percent}%, #555 100%)`;
    }

    function updateTimePreview(e) {
        if (!video.duration || isNaN(video.duration)) return;

        const rect = progress.getBoundingClientRect();

        const thumbWidth = 22;
        const halfThumb = thumbWidth / 2;

        const x = Math.max(
            halfThumb,
            Math.min(rect.width - halfThumb, e.clientX - rect.left)
        );

        const percent =
            (x - halfThumb) /
            (rect.width - thumbWidth);

        const hoverTime = percent * video.duration;

        timePreview.textContent = format(hoverTime);

        const previewWidth = timePreview.offsetWidth;
        let leftPos = x - previewWidth / 2;

        leftPos = Math.max(
            10,
            Math.min(leftPos, rect.width - previewWidth - 10)
        );

        timePreview.style.left = `${leftPos}px`;
    }

    // ------------------------
    // CLEANUP
    // ------------------------
    function destroy() {
        if (video) {
            video.pause();
            video.src = "";
            video.load();
        }
        clearTimeout(hideTimer);
        clearTimeout(speedTimer);
        clearTimeout(centerIconTimer);
        
        // Remove interval
        if (window.progressSaveInterval) {
            clearInterval(window.progressSaveInterval);
            window.progressSaveInterval = null;
        }

        // Run all cleanup functions (listeners)
        cleanupFns.forEach(fn => fn());
        cleanupFns = [];

        // Audio
        cleanupAudio();

        // Video
        video.pause();
        video.src = "";
        video.load();
        video.removeAttribute("src");
        if (textTrack) textTrack.mode = "disabled";

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

    if (video) {
        addListener(video, "canplay", () => {
            video.play().catch(() => {});
        }, { once: true });
    }
    // Return destroy function for SPA router
    return { destroy };
}
