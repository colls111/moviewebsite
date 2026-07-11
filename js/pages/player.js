import { getVideos } from "../data.js";

export function Player(id){

    const video = getVideos().find(v => v.id === id);

    if(!video){
        return "<h1>Video not found</h1>";
    }

    return `
        <div class="player">

            <button id="back" class="back-btn">⬅️</button>

            <video id="video">
                <track
                    id="captionTrack"
                    kind="subtitles"
                    srclang="en"
                    src="${video.captions ?? ""}">
            </video>

            ...

        </div>
    `;
}