import './recipeUpload.js';
import './cropper.js';

const EXTERN_API_TIMER = 800;
let apiTimer;
let selectedIngredients = [];
let ingredientsCounter = 0;

const searchInput = document.getElementById("search-ingr");
const searchResults = document.getElementById("search-results");
const ingredientsList = document.getElementById("ingredients-list");
const recipeDescription = document.getElementById("recipe-description");
const recipeForm = document.getElementById("recipe-form");
const missingIngContainer = document.getElementById("missing-ing-container");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        clearTimeout(apiTimer);
        if (query.length < 2) {
            searchResults.style.display ="none";
            return;
        }
        apiTimer = setTimeout(() => findIngredient(query), EXTERN_API_TIMER);
    });
}
    
async function findIngredient(string) {
    try {
        const urlAPI = `https://world.openfoodfacts.org/api/v3/taxonomy_suggestions?tagtype=ingredients&lc=it&string=${encodeURIComponent(string)}`;
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error("Errore di rete " + response.status);
        }
        const data = await response.json();
        const results = data.tags || data.suggestions || [];
        if (results.length > 0) {
            showResults(results);
        } else {
            searchResults.style.display = "none";
        }
    } catch (error) {
        console.error("Errore durante la comunicazione con OpenFoodFacts", error);
    }
}

function showResults(arrayResults) {
    searchResults.style.display = "block";
    searchResults.innerHTML = "";
    arrayResults.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            addIngredient(ingredient);
        })
        searchResults.appendChild(li);
    });
}

function addIngredient(ingName) {
    if (!selectedIngredients.includes(ingName)) {
        selectedIngredients.push(ingName);
        const li = document.createElement("li");
        li.textContent = ingName;
        li.className = "flex items-center gap-s"
        const input = document.createElement("input");
        input.type = "number";
        input.className = "input-base txt-s p-m"
        input.style.width = "4rem";
        input.name = `ingredients[${ingredientsCounter}][qty]`;
        const select = document.createElement("select");
        select.name = `ingredients[${ingredientsCounter}][unit]`;
        select.className = "input-base txt-s p-m"
        const optG = document.createElement("option");
        optG.textContent = "g";
        optG.value = "g";
        const optMl = document.createElement("option");
        optMl.textContent = "ml";
        optMl.value = "ml";
        const optPz = document.createElement("option");
        optPz.textContent = "pezzi";
        optPz.value = "pcs";
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = `ingredients[${ingredientsCounter}][name]`;
        hiddenInput.value = ingName;
        const btn = document.createElement("button");
        btn.className = "p-s txt-white rounded-md";
        btn.style.backgroundColor = "red";
        btn.textContent = "Elimina";
        btn.addEventListener("click", () => removeIngredient(li, ingName));

        select.appendChild(optG);
        select.appendChild(optMl);
        select.appendChild(optPz);
        
        li.appendChild(input);
        li.appendChild(select);
        li.appendChild(hiddenInput);
        li.appendChild(btn);

        ingredientsList.appendChild(li);

        ingredientsCounter ++;
    }
    searchInput.value = "";
    searchResults.style.display = "none";
}

function removeIngredient(element, ingName) {
    element.remove()
    selectedIngredients = selectedIngredients.filter(ingr => ingr !== ingName);
}

if(recipeForm) {
    recipeForm.addEventListener("submit", (e) => {
    missingIngContainer.innerHTML = "";
        const recipeText = recipeDescription.value.toLowerCase();
        let missingIngredients = [];
        selectedIngredients.forEach(ingredient => {
            if (!recipeText.includes(ingredient.toLowerCase())) {
                missingIngredients.push(ingredient);
            }
        })
        if (missingIngredients.length > 0) {
            event.preventDefault();
            const p = document.createElement("p");
            p.textContent = "Hai dimenticato questi ingredienti:";
            missingIngContainer.appendChild(p);
            missingIngredients.forEach(missingOne => {
                const span = document.createElement("span");
                span.textContent = " "+ missingOne + ";";
                span.style.color = "red";
                missingIngContainer.appendChild(span);
            })
        }
    });
}