import { Home } from "./pages/home.js";
import { Movies } from "./pages/movies.js";
import { Shows } from "./pages/shows.js";
import { Video } from "./pages/video.js";
import { Player } from "./pages/player.js";
import { setupVideoRows } from "./scrollRows.js";

export function router() {

    const app = document.getElementById("app");
    const path = window.location.pathname;

    if (path.startsWith("/watch/")) {

        const id = path.split("/")[2];

        app.innerHTML = Player(id);

        return;
    }

    // Handle /video/:id
    if (path.startsWith("/video/")) {

        const id = path.split("/")[2];

        app.innerHTML = Video(id);

        return;
    }

    switch (path) {

        case "/":
            app.innerHTML = Home();
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