import { Home } from "./pages/home.js";
import { Movies } from "./pages/movies.js";
import { Shows } from "./pages/shows.js";
import { Video } from "./pages/video.js";
import { Player, getPlayerVideo } from "./pages/player.js";

import { setupVideoRows } from "./scrollRows.js";
import { initializePlayer } from "./components/playerControls.js";
import { initializeLiveSearch } from "./search.js";

let currentPlayer = null;

export function router() {

    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }

    const app = document.getElementById("app");
    const path = window.location.pathname;

    if (path.startsWith("/watch/")) {

        const id = path.split("/")[2];
        const video = getPlayerVideo(id);

        app.innerHTML = Player(id);

        if (video) {
            requestAnimationFrame(() => {
                currentPlayer = initializePlayer(video);
            });
        }
        return;
    }

    if (path.startsWith("/video/")) {

        const id = path.split("/")[2];
        const backButton = document.querySelector(".back-bttn");

        app.innerHTML = Video(id);
        initializeLiveSearch();
        return;
    }

    switch (path) {

        case "/":
            app.innerHTML = Home();
            document.title = "C's Movies";
            setupVideoRows();
            break;

        case "/home":
            app.innerHTML = Home();
            document.title = "C's Movies";
            setupVideoRows();
            break;

        case "/movies":
            app.innerHTML = Movies();
            document.title = "C's Movies";
            break;

        case "/shows":
            app.innerHTML = Shows();
            document.title = "C's Movies";
            break;

        default:
            app.innerHTML = `
                <h1>404</h1>
                <p>Page not found.</p>
            `;
    }
    initializeLiveSearch();
}
