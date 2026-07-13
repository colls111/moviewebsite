import { getVideos } from "./data.js";

let currentTimeout = null;

export function initializeLiveSearch() {
    const input = document.getElementById("searchInput");
    const dropdown = document.getElementById("searchDropdown");
    const resultsContainer = document.getElementById("searchResultsLive");

    if (!input || !dropdown) return;

    function hideDropdown() {
        dropdown.style.display = "none";
    }

    input.addEventListener("input", () => {
        clearTimeout(currentTimeout);

        const query = input.value.trim();

        if (query.length < 2) {
            hideDropdown();
            return;
        }

        currentTimeout = setTimeout(() => {

        const q = query.toLowerCase();

        const results = getVideos().filter(video =>
            video.title.toLowerCase().includes(q) ||
            video.genre?.toLowerCase().includes(q) ||
            video.subgenre?.toLowerCase().includes(q) ||
            video.description?.toLowerCase().includes(q) ||
            video.tags?.some(tag =>
                tag.toLowerCase().includes(q)
            )
        ).slice(0, 8);

            if (results.length === 0) {
                resultsContainer.innerHTML = `<p style="padding: 20px; color: #aaa; text-align: center;">No results found for "${query}"</p>`;
            } else {
                resultsContainer.innerHTML = results.map(video => `
                    <a href="/video/${video.id}" data-link class="search-result-item">
                        <img src="${video.thumbnail || video.image}" alt="${video.title}">
                        <div class="search-result-info">
                            <h4>${video.title}</h4>
                            <p>${video.date || ''} • ${video.genre}</p>
                            <small>${video.description?.substring(0, 100)}...</small>
                        </div>
                    </a>
                `).join('');
            }

            dropdown.style.display = "block";
        }, 200);
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            hideDropdown();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideDropdown();
    });
}
