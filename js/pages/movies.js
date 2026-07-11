import { Header } from "../components/header.js";
import { CardGrid } from "../components/cardgrid.js";
import { getVideos } from "../data.js";

export function Movies() {

    const movies = getVideos().filter(video => video.category === "Movies");

    return `
        ${Header("movies")}

        <main class="container">
            ${CardGrid("", movies)}
        </main>
    `;

}