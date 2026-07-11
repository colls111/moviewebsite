let videos = [];

export async function loadVideos() {

    const response = await fetch("/data/videos.json");

    videos = await response.json();

}

export function getVideos() {
    return videos;
}
