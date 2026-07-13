export function Header(active = "", search = "") {

    return `
    
    <header class="header">

        <div class="header-left">

            <a href="/" data-link class="logo">
                C's Movies
            </a>

            <nav class="nav">

                <a
                    href="/home"
                    data-link
                    class="${active === "home" ? "active" : ""}"
                >
                    🏠 Home
                </a>

                <a
                    href="/movies"
                    data-link
                    class="${active === "movies" ? "active" : ""}"
                >
                    🎬 Movies
                </a>

                <a
                    href="/shows"
                    data-link
                    class="${active === "shows" ? "active" : ""}"
                >
                    📺 Shows
                </a>

            </nav>

            <div class="search-box">
                <span>🔍</span>
                <input
                    id="searchInput"
                    class="search"
                    value="${search}"
                    placeholder="Search movies, shows..."
                    autocomplete="off"
                >
                
                <div id="searchDropdown" class="search-dropdown">
                    <div id="searchResultsLive"></div>
                </div>
            </div>
        </div>
        <nav class="request">
            <a
                href="https://forms.gle/9DyMcscPDgCwfHcf6"
                target="_blank"
                rel="noopener noreferrer"
            >
                💭 Request
            </a>
        </nav>

    </header>

    `;

}
