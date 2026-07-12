import { Home } from "./pages/home.js";
import { Movies } from "./pages/movies.js";
import { Shows } from "./pages/shows.js";
import { Video } from "./pages/video.js";
import { Player, getPlayerVideo } from "./pages/player.js";

import { setupVideoRows } from "./scrollRows.js";
import { initializePlayer } from "./components/playerControls.js";

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

        app.innerHTML = Video(id);
        return;
    }

    switch (path) {

        case "/":
        app.innerHTML = Home();

        document.querySelector(".logo")?.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.reload();
        });

        setupVideoRows();
        break;

        case "/movies":
            app.innerHTML = Movies();
            break;

        case "/shows":
            app.innerHTML = Shows();
            break;

        default:
            app.innerHTML = `
                <h1>404</h1>
                <p>Page not found.</p>
            `;
    }
}
