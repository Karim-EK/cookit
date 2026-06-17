/**
 * Handles the buttons in the home page
 */

const originalImageCache = new Map();
const feedContainer = document.getElementById("feed-container");

if (feedContainer) {
    feedContainer.addEventListener("click", async function(event) {
        const ingrBtn = event.target.closest(".ingr-btn");
        const prepBtn = event.target.closest(".prep-btn");
        const cookBtn = event.target.closest(".cook-btn");

        if (!ingrBtn && !prepBtn && !cookBtn) return;

        const activeBtn = ingrBtn || prepBtn || cookBtn;
        const parentPost = activeBtn.closest(".post");
        const recipeId = activeBtn.dataset.recipeId;
        const container = parentPost.querySelector(".dynamic-container");

        // Saves recipe's image for later use
        if (!originalImageCache.has(recipeId)) {
            originalImageCache.set(recipeId, container.innerHTML);
        }

        // 3. LETTURA DELLO STATO: Leggiamo cosa sta mostrando questo post specifico.
        // Se non è ancora stato cliccato nulla, lo stato di default è "image"
        const currentView = parentPost.dataset.currentView || "image";

        if (ingrBtn) {
            if (currentView === "ingredients") {
                // TOGGLE OFF: Se erano già visibili gli ingredienti, ripeschiamo l'immagine dalla mappa
                container.innerHTML = originalImageCache.get(recipeId);
                parentPost.dataset.currentView = "image";
            } else {
                // TOGGLE ON: Mostriamo gli ingredienti
                await showIngredients(ingrBtn);
                parentPost.dataset.currentView = "ingredients";
            }
        } 
        
        else if (prepBtn) {
            if (currentView === "preparation") {
                // TOGGLE OFF: Se era già visibile la preparazione, ripristiniamo l'immagine
                container.innerHTML = originalImageCache.get(recipeId);
                parentPost.dataset.currentView = "image";
            } else {
                // TOGGLE ON: Mostriamo la preparazione
                await showPreparation(prepBtn);
                parentPost.dataset.currentView = "preparation";
            }
        } 
        
        else if (cookBtn) {
            cookRecipe(cookBtn);
        }
    });
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
        // Sistemato il testo semantico dell'errore nel catch (era impostato su "ingredienti")
        container.innerHTML = `<p class="p-s">${result.data}</p>`; 
    } catch (error) {
        console.error("Errore nel recupero della preparazione:", error);
        container.innerHTML = "<p class='text-danger'>Impossibile caricare la preparazione.</p>";
    }
}

function cookRecipe(btn) {
    //TODO: Implementazione futura
}