/**
 * Shows most recents users's post in the feed
 */
let postCache = [];
const feedContainer = document.getElementById("feed-container");
const sentinel = document.getElementById("feed-sentinel");

if (feedContainer && sentinel) {
    initFeed();
}

async function initFeed() {
    try {
        const response = await fetch("/Cookit/api/get_feed.php");
        const result = await response.json();
        if (!result.success) {
            feedContainer.innerHTML = `<p class="error">${result.messaggio}</p>`;
            return;
        }
        postCache = result.feed;
        if (postCache.length === 0) {
            feedContainer.innerHTML = "<p>Nessuna nuova ricetta da mostrarti al momento!</p>";
            return;
        }
        // Load first 3 posts at once to fill the height of the screen
        // TODO: new approch for desktop
        const initial = Math.min(3, postCache.length);
        for (let i = 0; i < initial; i++) {
            renderNextPost();
        }
        setupInfiniteScroll();
    } catch (error) {
        console.error("Impossibile caricare il feed:", error);
        feedContainer.innerHTML = "<p class='error'>Errore di connessione al server.</p>";
    }
}

function renderNextPost() {
    if (postCache.length === 0) {
        console.log("Tutti i post della cache sono stati renderizzati.");
        sentinel.innerHTML = "<p class='text-muted txt-center'>Hai visto tutte le ricette di oggi!</p>";
        return;
    }
    const post = postCache.shift();
    const postCard = document.createElement("div");
    postCard.className = "shadow-sm p-s w-95 flex flex-col gap-s mb-m post";
    //TODO: colore difficoltà immagine profilo
    postCard.innerHTML = `
        <div class="flex items-center">
            <img class="h-icon rounded-md object-cover mr-m" src="" alt="immagine profilo di ${post.autore}">
            <p>${post.autore}</p>
            <p class="ml-auto txt-italic">${new Date(post.Data_Pubblicazione).toLocaleDateString()}</p>
        </div>
        <p>${post.titolo}</p>
        <p style="background-color: #f9d66b" class="txt-m txt-center rounded-md">Difficoltà: ${post.Difficolta}</p>
        
        <div class="dynamic-container">
            <img class="h-post-img rounded-lg object-cover w-full" src="${post.Immagine}" alt="immagine di ${post.titolo} pubblicato da ${post.autore}">
        </div>

        <div class="flex justify-center gap-xl">
            <button data-recipe-id="${post.post_id}" class="shadow-md main-btn-icon ingr-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

                <path
                d="M 10 3 L 14 3 C 14 7.5, 17 9, 19.5 12.5 C 21.5 15.5, 19.5 20, 15 20 L 9 20 C 4.5 20, 2.5 15.5, 4.5 12.5 C 7 9, 10 7.5, 10 3 Z" />

                <path d="M 11 3 C 9 8, 8 14, 10 20" />
                <path d="M 13 3 C 15 8, 16 14, 14 20" />

                <path d="M 9.5 20 V 22" />
                <path d="M 11.16 20 V 22" />
                <path d="M 12.83 20 V 22" />
                <path d="M 14.5 20 V 22" />

            </svg>
            </button>
            <button data-recipe-id="${post.post_id}" class="shadow-md main-btn-icon cook-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="48" height="48" fill="none"
                stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <path d="M 17 46 H 83 V 54 C 83 66 17 66 17 54 Z" />
                <path d="M 83 46 L 99 38" />

                <g>
                <path d="M 33 30 C 33 21 37 21 37 17 C 37 13 33 13 33 4" />
                <path d="M 50 30 C 50 21 54 21 54 17 C 54 13 50 13 50 4" />
                <path d="M 67 30 C 67 21 71 21 71 17 C 71 13 67 13 67 4" />
                </g>
            </svg>
            </button>
            <button data-recipe-id="${post.post_id}" class="shadow-md main-btn-icon prep-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none"
                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

                <!-- 1. Tagliere (Invariato come punto di ancoraggio visivo) -->
                <rect x="2" y="19" width="20" height="3" rx="1" />

                <!-- 2. Cibo a cubetti (Diced food) -->
                <!-- Cubetto di sinistra -->
                <rect x="5" y="16" width="3" height="3" rx="0.5" />
                <!-- Cubetto centrale (più piccolo per dare realismo e disordine organico) -->
                <rect x="9" y="17" width="2" height="2" rx="0.5" />
                <!-- Cubetto di destra -->
                <rect x="12" y="16" width="3" height="3" rx="0.5" />

                <!-- 3. Coltello (Coordinate ampliate e posizionato in alto) -->
                <g transform="rotate(-15 14 13)">
                <!-- Lama ricalcolata -->
                <path d="M 5 9 L 17 9 L 17 13 L 11 13 C 7.5 13, 5 11.5, 5 9 Z" />
                <!-- Manico proporzionato alla nuova lama -->
                <rect x="17" y="10" width="6" height="2" rx="0.5" />
                </g>
            </svg>
            </button>
        </div>
    `;
    feedContainer.appendChild(postCard);
}

function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            renderNextPost();
        }
    }, {
        rootMargin: "200px" 
    });
    observer.observe(sentinel);
}