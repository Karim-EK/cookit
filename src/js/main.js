import '../css/normalize.css'
import '../css/generic.css'
import '../css/styles.css'

let selectedIngredients = [];
let apiTimer;

const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const ingredientsList = document.getElementById("ingredients-list");
const hiddenInputsContainer = document.getElementById("db-list");
const recepiDescription = document.getElementById("recepi-description");
const recepiForm = document.getElementById("recepi-form");
const missingIngContainer = document.getElementById("missing-ing-container");

searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = '';
    clearTimeout(apiTimer);
    if (query.length < 2) {
        searchResults.style.display ="none";
        return;
    }
    apiTimer = setTimeout(() => findIngredient(query), 1000);
});
    
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
        ingredientsList.appendChild(li)
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "ingredients[]";
        hiddenInput.value = ingName;
        hiddenInputsContainer.appendChild(hiddenInput);
    }
    searchInput.value = "";
    searchResults.style.display = "none";
}

recepiForm.addEventListener("submit", (e) => checkForIngredients(e));

function checkForIngredients(event) {
    debugger;
    missingIngContainer.innerHTML = "";
    const recepiText = recepiDescription.value.toLowerCase();
    let missingIngredients = [];
    selectedIngredients.forEach(ingredient => {
        if (!recepiText.includes(ingredient.toLowerCase())) {
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
            span.textContent = " "+ missingOne;
            span.style.color = "red";
            missingIngContainer.appendChild(span);
        })
    }
}