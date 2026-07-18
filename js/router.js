import { Home } from "./pages/home.js";
import { Movies } from "./pages/movies.js";
import { Shows } from "./pages/shows.js";
import { Video, cleanupVideoPage } from "./pages/video.js";
import { Player, getPlayerVideo } from "./pages/player.js";
import { setupVideoRows } from "./scrollRows.js";
import { initializePlayer } from "./components/playerControls.js";
import { initializeLiveSearch } from "./search.js";

let currentPlayer = null;
let lastRoute = null;   // Track previous route for cleanup

export function router() {
    const app = document.getElementById("app");
    const path = window.location.pathname;

    // === CLEANUP PREVIOUS ROUTE ===
    if (lastRoute && lastRoute.startsWith("/video/") && !path.startsWith("/video/")) {
        cleanupVideoPage();
    }

    // Destroy player if we're leaving the watch page
    if (currentPlayer) {
        currentPlayer.destroy();
        currentPlayer = null;
    }

    // === ROUTE HANDLING ===
    if (path.startsWith("/watch/")) {
        const id = path.split("/")[2];
        app.innerHTML = Player(id);
        const video = getPlayerVideo(id);
        if (video) {
            requestAnimationFrame(() => {
                currentPlayer = initializePlayer(video);
            });
        }
        lastRoute = path;
        return;
    }

    if (path.startsWith("/video/")) {
        const id = path.split("/")[2];
        app.innerHTML = Video(id);
        initializeLiveSearch();
        lastRoute = path;
        return;
    }

    // Other routes
    switch (path) {
        case "/":
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
    lastRoute = path;
}
