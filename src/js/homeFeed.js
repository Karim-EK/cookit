import './homeSearch.js';
import './homeButtons.js';

/**
 * Shows most recents users's post in the feed
 */

let postCache = [];
const feedContainer = document.getElementById("feed-container");
const sentinel = document.getElementById("feed-sentinel");
const profileBtn = document.getElementById("profile-btn");
const logoutBtn = document.getElementById("logout-btn");
const deleteProfileBtn = document.getElementById("delete-profile-btn");
const newRecipeBtn = document.getElementById("recipe-upload-btn");
newRecipeBtn.addEventListener("click", function() {location.href = "/Cookit/pages/upload.html"});
let userId;

if (feedContainer && sentinel && profileBtn) {
    initFeed().then(() => {
        if (userId) {
            profileBtn.href = `/Cookit/pages/profile.html?id=${userId}`;
        }
    });
    logoutBtn.addEventListener("click", () => logout());
    deleteProfileBtn.addEventListener("click", () => deleteProfile());
}

async function initFeed() {
    try {
        const response = await fetch("/Cookit/api/get_feed.php");
        const result = await response.json();
        if (!result.success) {
            console.error(result.message);
            location.href = "/Cookit/index.php";
            return;
        }
        userId = result.user_id;
        postCache = result.feed;
        if (postCache.length === 0) {
            feedContainer.innerHTML = "<p>Nessuna nuova ricetta da mostrarti al momento!</p>";
            return;
        }
        const isDesktop = window.innerWidth >= 900;
        const initial = Math.min(isDesktop ? 9 : 3, postCache.length);
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
    postCard.className = "shadow-sm p-s flex flex-col gap-s mb-m post";
    postCard.style.minWidth = "100%";
    const dishImg = post.Immagine || "/Cookit/src/assets/default-dish.png";
    const avatarImg = post.Immagine_Profilo || "/Cookit/src/assets/default-avatar.png";
    let difficultyColor;
    let difficultyText;
    switch (post.Difficolta) {
        case "facile":
            difficultyColor = "#81C784";
            difficultyText = "Facile";
            break;
        case "medio":
            difficultyColor = "#f9d66b";
            difficultyText = "Media";
            break
        case "difficile":
            difficultyColor = "#ff4444";
            difficultyText = "Difficile";
            break
        default:
            break;
    }
    postCard.innerHTML = `
        <div class="flex items-center">
            <img class="h-icon rounded-md object-cover mr-m" src="${avatarImg}" alt="immagine profilo di ${post.autore}">
            <a href = "/Cookit/pages/profile.html?id=${post.user_id}">${post.autore}</a>
            <p class="ml-auto txt-italic">${new Date(post.Data_Pubblicazione).toLocaleDateString()}</p>
        </div>
        <p>${post.titolo}</p>
        <p style="background-color: ${difficultyColor}" class="txt-m txt-center rounded-md">Difficoltà: ${difficultyText}</p>
        
        <div class="dynamic-container">
            <img data-content="image" class="h-post-img rounded-lg object-cover w-full" src="${dishImg}" alt="immagine di ${post.titolo} pubblicato da ${post.autore}">
        </div>

        <div class="flex justify-center gap-xl">
            <button data-btn-type="ingr-btn" data-recipe-id="${post.post_id}" class="shadow-md main-btn-icon">
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
           
            <button data-btn-type="prep-btn" data-recipe-id="${post.post_id}" class="shadow-md main-btn-icon">
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
    postCard.querySelector('[data-content="image"]').addEventListener("click", function() {
        location.href = `/Cookit/pages/post.html?id=${post.post_id}`});
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
async function logout() {
    try {
        const response = await fetch("/Cookit/api/logout.php", {
            method: "POST"
        });
        const result = await response.json();
        if (result.success) {
            alert("Ti sei disconnesso con successo");
            window.location.href = "/Cookit/index.php";
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}
async function deleteProfile() {
    const confirmDeletion = confirm("Vuoi davvero eliminare definitivamente il tuo account e ogni suo contenuto?");
    if (confirmDeletion) {
        const doublecheck = confirm("Sei davvero sicuro?");
        if (doublecheck) {
            try {
                const response = await fetch("/Cookit/api/delete_account.php", {
                    method: "POST",
                    body: new FormData().append("target_id", userId),
                });
                const result = await response.json();
                if (result.success) {
                    alert("È statu un piacere cucinare insieme, speriamo di rivederci!");
                    window.location.href = "/Cookit/index.php";
                } else {
                    console.error(result.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
}