/**
 * Handles the buttons in the home page
 */

const originalImageCache = new Map();
const feedContainer = document.getElementById("feed-container");

if (feedContainer) {
    feedContainer.addEventListener("click", (e) => handleMainButtons(e));
}

export async function handleMainButtons(event) {
    const ingrBtn = event.target.closest('[data-btn-type="ingr-btn"]');
    const prepBtn = event.target.closest('[data-btn-type="prep-btn"]');

    if (!ingrBtn && !prepBtn) return;

    const activeBtn = ingrBtn || prepBtn;
    const parentPost = activeBtn.closest(".post");
    const recipeId = activeBtn.dataset.recipeId;
    const container = parentPost.querySelector(".dynamic-container");

    // Salva la stringa HTML dell'immagine per uso futuro
    if (!originalImageCache.has(recipeId)) {
        originalImageCache.set(recipeId, container.innerHTML);
    }

    const currentView = parentPost.dataset.currentView || "image";

    if (ingrBtn) {
        if (currentView === "ingredients") {
            restoreImage(container, recipeId);
            parentPost.dataset.currentView = "image";
        } else {
            await showIngredients(ingrBtn);
            parentPost.dataset.currentView = "ingredients";
        }
    } 
    else if (prepBtn) {
        if (currentView === "preparation") {
            restoreImage(container, recipeId);
            parentPost.dataset.currentView = "image";
        } else {
            await showPreparation(prepBtn);
            parentPost.dataset.currentView = "preparation";
        }
    }
}

function restoreImage(container, recipeId) {
    container.innerHTML = originalImageCache.get(recipeId);
    const restoredImg = container.querySelector("img");
    if (restoredImg) {
        restoredImg.classList.add("cursor-pointer"); 
        restoredImg.addEventListener("click", function() {
            window.location.href = `/Cookit/pages/post.html?id=${recipeId}`;
        });
    }
}

async function showIngredients(btn) {
    const parentContainer = btn.closest(".post");
    const container = parentContainer.querySelector(".dynamic-container");
    const recipeId = btn.dataset.recipeId;
    
    try {
        container.innerHTML = "<p>Caricamento ingredienti...</p>";
        const response = await fetch(`/Cookit/api/get_recipe_data.php?id=${recipeId}&q=i`);
        const result = await response.json(); 
        if (!result.success) {
            throw new Error(result.message || "Errore nel recupero dati dal server");
        }
        container.innerHTML = "";
        const ul = document.createElement("ul");
        ul.className = "ingredients-feed-list";
        result.data.forEach(ing => {
            const li = document.createElement("li");
            li.style.marginLeft = "1rem";
            li.textContent = `${ing.name} - ${ing.qty} ${ing.unit}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    } catch (error) {
        console.error("Errore nel recupero degli ingredienti:", error);
        container.innerHTML = "<p class='text-danger'>Impossibile caricare gli ingredienti.</p>";
    }
}

async function showPreparation(btn) {
    const parentContainer = btn.closest(".post");
    const container = parentContainer.querySelector(".dynamic-container");
    const recipeId = btn.dataset.recipeId;
    
    try {
        container.innerHTML = "<p>Caricamento preparazione...</p>";
        const response = await fetch(`/Cookit/api/get_recipe_data.php?id=${recipeId}&q=p`);
        const result = await response.json(); 
        if (!result.success) {
            throw new Error(result.message || "Errore nel recupero dati dal server");
        }
        container.innerHTML = `<p class="p-s">${result.data}</p>`; 
    } catch (error) {
        console.error("Errore nel recupero della preparazione:", error);
        container.innerHTML = "<p class='text-danger'>Impossibile caricare la preparazione.</p>";
    }
}