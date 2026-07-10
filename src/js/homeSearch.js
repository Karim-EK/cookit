const searchBtn = document.getElementById("search-btn");
const searchPanel = document.getElementById("toggleable");
const searchText = document.getElementById("searched-text");
const API_TIMER = 300;
let apiTimer;

searchPanel.addEventListener("click", (e) => redirection(e));

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        searchPanel.classList.toggle("hidden");
    })
}

if (searchText) {
    searchText.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        clearTimeout(apiTimer);
        if (query.length < 2) {
            return;
        }
        apiTimer = setTimeout(() => search(query), API_TIMER);
    });
}

async function search(query) {

    if (searchText) {
        while (searchText.nextElementSibling) {
            searchText.nextElementSibling.remove();
        }
    }

    try {
        const response = await fetch(`/Cookit/api/search.php?q=${query}`);
        const result = await response.json();
        result.data.forEach(item => {
            switch (item.tipo) {
            case 'utente':
                renderUserCard(item);
                break;
                
            case 'ricetta':
                renderRecipeCard(item);
                break;
                
            default:
                console.error("Tipo di dato non riconosciuto:", item.tipo);
            }
        });

    } catch (error) {
        console.error("Errore durante la comunicazione con il server", error);
    }
}

function renderUserCard(item) {
    const outer = document.createElement("div");
    outer.className = "flex items-center justify-between w-full";
    outer.dataset.id = item.id;
    outer.dataset.type = item.tipo;
    
    const inner = document.createElement("div");
    inner.className = "flex items-center gap-s";
    
    const img = document.createElement("img");
    img.className = "h-icon";
    img.src = item.immagine_profilo || "/Cookit/src/assets/default-avatar.png";
    
    const nickname = document.createElement("span");
    nickname.innerText = item.nome_titolo;
    
    const ricette = document.createElement("span");
    ricette.innerText = (item.numero_ricette ?? 0) + " Ricette"; 
    
    inner.appendChild(img);
    inner.appendChild(nickname);
    outer.appendChild(inner);
    outer.appendChild(ricette);
    searchPanel.appendChild(outer);
}

function renderRecipeCard(item) {
    const outer = document.createElement("div");
    outer.className = "flex items-center justify-between w-full";
    outer.dataset.id = item.id;
    outer.dataset.type = item.tipo;

    const inner = document.createElement("div");
    inner.className = "flex items-center gap-s";
    const img = document.createElement("img");
    img.className = "h-icon";
    img.src = item.immagine_ricetta || "/Cookit/src/assets/default-dish.png";
    const title = document.createElement("p");
    title.innerText = item.nome_titolo;
    title.style = "max-height:calc((1em + 0.5rem) + 3rem); overflow: hidden;";
    const difficulty = document.createElement("span");
    difficulty.innerText = item.difficolta;

    outer.appendChild(inner);
    inner.appendChild(img);
    inner.appendChild(title);
    outer.append(difficulty);
    searchPanel.append(outer);
}

function redirection(e) {
    const card = event.target.closest("[data-id]");
    if(card) {
        const id = card.dataset.id;
        if (card.dataset.type == "utente") {
            window.location.href = `/Cookit/pages/profile.html?id=${id}`;
        } else {
            window.location.href = `/Cookit/pages/post.html?id=${id}`;
        }
    }
}