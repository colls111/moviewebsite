export function Header(active = "home") {

    return `
    
    <header class="header">

        <div class="header-left">

            <a href="/" data-link class="logo">
                C's Movies
            </a>

            <nav class="nav">

                <a
                    href="/"
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
                    type="text"
                    placeholder="Search movies, shows..."
                >

            </div>

        </div>

    </header>

    `;

}
