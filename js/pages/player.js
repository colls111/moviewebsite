import { getVideos } from "../data.js";

export function getPlayerVideo(id) {
    return getVideos().find(video => video.id === id);
}

export function Player(id) {

    const video = getPlayerVideo(id);

    if (!video) {
        return `
            <main class="container">
                <h1>Video not found</h1>
            </main>
        `;
    }

    return `
        <div class="player">

            <button id="back" class="back-btn">⬅️</button>

            <div id="captionsOverlay"></div>

            <video id="video" preload="auto">
                <track
                    id="captionTrack"
                    kind="subtitles"
                    srclang="en"
                    label="English"
                    src="">
            </video>

            <div id="centerIcon" class="center-icon">▶️</div>

            <div class="bottom">

                <input
                    id="progress"
                    type="range"
                    min="0"
                    max="100"
                    step="any"
                    value="0">

                <div id="timePreview" class="time-preview">0:00</div>
                
                <div class="info">
                    <span id="time">0:00 / 0:00</span>
                </div>

                <div class="controls">

                    <div class="left">

                        <button id="play">▶️</button>
                        <button id="rewind">⏪</button>
                        <button id="forward">⏩</button>

                        <div class="volume">

                            <button id="mute">🔊</button>

                            <input
                                id="volume"
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value="1">

                        </div>

                    </div>

                    <div id="videoTitle" class="center"></div>

                    <div class="right">

                        <div class="speed">

                            <button id="speed">🔄</button>

                            <input
                                id="speedSlider"
                                type="range"
                                min="0"
                                max="11"
                                step="1"
                                value="3">

                            <div id="speedDisplay">1×</div>

                        </div>

                        <div class="jump-container">

                            <button id="jumpTime">🕒</button>

                            <div id="jumpPopup" class="jump-popup">

                                <input
                                    id="jumpInput"
                                    type="text"
                                    placeholder="0:45">

                                <button id="jumpGo">Go</button>

                            </div>

                        </div>

                        <button id="captions">💬</button>
                        <button id="fullscreen">⏹️</button>

                    </div>

                </div>

            </div>

        </div>
    `;
}
