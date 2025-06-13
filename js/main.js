const API_CONFIG = {
    BASE_URL: "https://www.thesportsdb.com/api/v1/json",
    ENDPOINTS: {
        ALL_LEAGUES: "/3/all_leagues.php",
        LOOKUP_LEAGUE: "/123/lookupleague.php",
        SEARCH_TEAMS: "/3/searchteams.php",
        SEARCH_TEAMS_DETAILED: "/123/searchteams.php",
        TEAMS_BY_LEAGUE: "/123/search_all_teams.php"
    }
};

const LEAGUE_LOGOS = {
    "English Premier League": "https://www.thesportsdb.com/images/media/league/badge/gasy9d1737743125.png",
    "Spanish La Liga": "https://www.thesportsdb.com/images/media/league/badge/ja4it51687628717.png",
    "Italian Serie A": "https://www.thesportsdb.com/images/media/league/badge/67q3q21679951383.png",
    "English League Championship": "https://www.thesportsdb.com/images/media/league/badge/ty5a681688770169.png",
    "Scottish Premier League": "https://www.thesportsdb.com/images/media/league/badge/72d3zc1688333496.png",
    "German Bundesliga": "https://www.thesportsdb.com/images/media/league/badge/teqh1b1679952008.png",
    "French Ligue 1": "https://www.thesportsdb.com/images/media/league/badge/9f7z9d1742983155.png",
    "Greek Superleague Greece": "https://www.thesportsdb.com/images/media/league/badge/jm7ky01602788843.png",
    "Dutch Eredivisie": "https://www.thesportsdb.com/images/media/league/badge/5cdsu21725984946.png",
    "Belgian Pro League": "https://www.thesportsdb.com/images/media/league/badge/mjit7n1593634474.png",
    "Turkish Super Lig": "https://www.thesportsdb.com/images/media/league/badge/h7xx231601671132.png",
    "Danish Superliga": "https://www.thesportsdb.com/images/media/league/badge/28uq381687624585.png",
    "Portuguese Primeira Liga": "https://www.thesportsdb.com/images/media/league/badge/18vypq1732294716.png",
    "American Major League Soccer": "https://www.thesportsdb.com/images/media/league/badge/dqo6r91549878326.png",
    "Swedish Allsvenskan": "https://www.thesportsdb.com/images/media/league/badge/denok11707459183.png",
    "Mexican Primera League": "https://www.thesportsdb.com/images/media/league/badge/mav5rx1686157960.png",
    "Brazilian Serie A": "https://www.thesportsdb.com/images/media/league/badge/ny47lx1701964009.png",
    "Ukrainian Premier League": "https://www.thesportsdb.com/images/media/league/badge/qprvpy1471773025.png",
    "Russian Football Premier League": "https://www.thesportsdb.com/images/media/league/badge/d4yp7g1690178551.png",
    "Australian A-League": "https://www.thesportsdb.com/images/media/league/badge/2u78lm1638459575.png",
    "Norwegian Eliteserien": "https://www.thesportsdb.com/images/media/league/badge/owo80l1512822583.png",
    "Chinese Super League": "https://www.thesportsdb.com/images/media/league/badge/jqwkag1697648182.png",
    "Italian Serie B": "https://www.thesportsdb.com/images/media/league/badge/uf5kph1598011132.png",
    "Scottish Championship": "https://www.thesportsdb.com/images/media/league/badge/i57nok1721301867.png",
    "English League 1": "https://www.thesportsdb.com/images/media/league/badge/afedb31688770443.png",
    "English League 2": "https://www.thesportsdb.com/images/media/league/badge/jmb3ms1688770451.png",
    "Italian Serie C Girone C": "https://www.thesportsdb.com/images/media/league/badge/3gzcx81720176510.png",
    "German 2. Bundesliga": "https://www.thesportsdb.com/images/media/league/badge/hl40981534764789.png",
    "Spanish La Liga 2": "https://www.thesportsdb.com/images/media/league/badge/r7u6821688425700.png",
    "French Ligue 2": "https://www.thesportsdb.com/images/media/league/badge/aofb771742983333.png",
    "Swedish Superettan": "https://www.thesportsdb.com/images/media/league/badge/uvzmu21707459258.png",
    "Brazilian Serie B": "https://www.thesportsdb.com/images/media/league/badge/i6mtvt1736403394.png",
    "Argentinian Primera Division": "https://www.thesportsdb.com/images/media/league/badge/1vslha1589960216.png"
};

const DEFAULTS = {
    TEAM_LOGO: '../img/bucaros.png',
    NO_IMAGE: "https://upload.wikimedia.org/wikipedia/commons/d/da/Imagen_no_disponible.svg",
    SCROLL_AMOUNT: 300,
    AUTO_SCROLL_INTERVAL: 6000,
    MAX_FAVORITES: 6,
    DESCRIPTION_LENGTH: 500
};

const elements = {
    carousel: document.getElementById("carrusel-de-equipos"),
    btnLeft: document.getElementById("btnIzquierda"),
    btnRight: document.getElementById("btnDerecha"),
    searchInput: document.getElementById("searchInput"),
    btnSearch: document.getElementById("btn-Buscar"),
    btnFavorites: document.getElementById("btn-Favoritos"),
    filterSport: document.getElementById("filterSport"),
    modal: document.getElementById("modalEquipo"),
    modalClose: document.getElementById("cerrarModal"),
    modalType: document.getElementById("modalTipo"),
    modalName: document.getElementById("modalNombre"),
    modalLeague: document.getElementById("modalLiga"),
    modalCountry: document.getElementById("modalPais"),
    modalLogo: document.getElementById("modalLogo"),
    modalDescription: document.getElementById("modalDescripcion"),
    modalStadium: document.getElementById("modalEstadio"),
    modalFounded: document.getElementById("modalFundacion")
};

class ApiService {
    static async fetchData(endpoint, params = {}) {
        try {
            const url = new URL(API_CONFIG.BASE_URL + endpoint);
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}

class FavoritesManager {
    static getFavorites() {
        return JSON.parse(localStorage.getItem("favoritos")) || [];
    }

    static saveFavorites(favorites) {
        localStorage.setItem("favoritos", JSON.stringify(favorites));
    }

    static toggleFavorite(team) {
        let favorites = this.getFavorites();
        const exists = favorites.find(fav => fav.idTeam === team.idTeam);

        if (exists) {
            favorites = favorites.filter(fav => fav.idTeam !== team.idTeam);
            this.showMessage(`${team.strTeam} eliminado de favoritos`);
        } else {
            if (favorites.length >= DEFAULTS.MAX_FAVORITES) {
                this.showMessage(`Solo puedes tener ${DEFAULTS.MAX_FAVORITES} equipos favoritos. Elimina uno para agregar otro.`);
                return false;
            }
            favorites.push(team);
            this.showMessage(`${team.strTeam} agregado a favoritos`);
        }

        this.saveFavorites(favorites);
        return true;
    }

    static showMessage(message) {
        alert(message);
    }
}

class UIManager {
    static clearCarousel() {
        elements.carousel.innerHTML = "";
    }

    static showError(message) {
        elements.carousel.innerHTML = `<p class="text-white text-center w-full">${message}</p>`;
    }

    static createCard(item, type = 'team') {
        const card = document.createElement("div");
        card.className = `inline-block bg-gray-800 rounded-xl overflow-hidden shadow-md ${type === 'league' ? 'w-48' : 'w-60'} flex-shrink-0 mx-2`;

        if (type === 'league') {
            card.innerHTML = this.createLeagueCardHTML(item);
        } else {
            card.innerHTML = this.createTeamCardHTML(item);
        }

        return card;
    }

    static createLeagueCardHTML(league) {
        const logo = LEAGUE_LOGOS[league.strLeague] || DEFAULTS.NO_IMAGE;
        return `
            <img src="${logo}" alt="${league.strLeague}" class="w-full h-48 object-contain bg-black" />
            <div class="p-3">
                <h3 class="text-white text-center text-sm font-semibold">${league.strLeague}</h3>
                <button class="ver-mas-liga mt-2 block mx-auto bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1 rounded">
                    Ver más
                </button>
            </div>
        `;
    }

    static createTeamCardHTML(team, showRemoveFavorite = false) {
        const favoriteButton = showRemoveFavorite 
            ? '<button class="btn-favorito mt-2 mx-auto block text-yellow-400 text-sm">❌ Quitar</button>'
            : '<button class="btn-favorito mt-2 block mx-auto text-yellow-400 text-xs">⭐ Favorito</button>';

        return `
            <img src="${team.strTeamBadge || team.strBadge}" alt="${team.strTeam}" class="w-full h-48 object-contain bg-black" />
            <div class="p-3">
                <h3 class="text-white text-center text-lg font-semibold">${team.strTeam}</h3>
                <p class="text-gray-300 text-center text-sm">${team.strLeague}</p>
                <p class="text-gray-400 text-center text-xs">${team.strCountry}</p>
                <button class="ver-mas mt-2 block mx-auto bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1 rounded">
                    Ver más
                </button>
                ${favoriteButton}
            </div>
        `;
    }

    static showModal(data, type = 'team') {
        elements.modalType.textContent = type === 'team' ? "Información de Equipo" : "Información de Liga";
        elements.modalName.textContent = data.strTeam || data.strLeague;
        elements.modalLeague.textContent = type === 'team' ? data.strLeague : `Deporte: ${data.strSport}`;
        elements.modalCountry.textContent = type === 'team' ? data.strCountry : `País: ${data.strCountry || 'Desconocido'}`;
        elements.modalLogo.src = data.strTeamBadge || data.strBadge || DEFAULTS.TEAM_LOGO;
        elements.modalDescription.textContent = (data.strDescriptionEN || "Sin descripción.").slice(0, DEFAULTS.DESCRIPTION_LENGTH);
        
        if (type === 'team') {
            elements.modalStadium.textContent = `Estadio: ${data.strStadium || 'N/A'}`;
            elements.modalFounded.textContent = `Fundado en: ${data.intFormedYear || 'N/A'}`;
        } else {
            elements.modalStadium.textContent = `Temporada actual: ${data.strCurrentSeason || 'N/A'}`;
            elements.modalFounded.textContent = `Fundado en: ${data.intFormedYear || 'N/A'}`;
        }

        elements.modal.classList.remove("hidden");
    }
}