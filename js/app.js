import { loadVideos } from "./data.js";
import { router } from "./router.js";

window.addEventListener("DOMContentLoaded", async () => {

    await loadVideos();

    router();

    document.getElementById("app").classList.add("loaded");

});

window.addEventListener("popstate", router);

document.addEventListener("click", (e) => {

    const link = e.target.closest("[data-link]");

    if (!link) return;

    e.preventDefault();

    history.pushState({}, "", link.getAttribute("href"));

    router();

});
