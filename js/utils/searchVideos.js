import { getVideos } from "../data.js";

export function searchVideos(query) {

    const q = query.toLowerCase().trim();

    return getVideos().filter(video =>
        video.title.toLowerCase().includes(q) ||
        video.genre?.toLowerCase().includes(q) ||
        video.subgenre?.toLowerCase().includes(q) ||
        video.description?.toLowerCase().includes(q) ||
        video.tags?.some(tag => tag.toLowerCase().includes(q))
    );

}
