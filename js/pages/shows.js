import { Header } from "../components/header.js";
import { CardGrid } from "../components/cardgrid.js";
import { getVideos } from "../data.js";

export function Shows() {

    const shows = getVideos().filter(video => video.category === "Shows");

    return `
        ${Header("shows")}

        <main class="container fade-in">
            ${CardGrid("", shows, true)}
        </main>
    `;

}
