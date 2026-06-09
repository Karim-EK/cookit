const recipeForm = document.getElementById("recipe-form");
if (recipeForm) {
    debugger;
    recipeForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        try {
            const response = await fetch("/Cookit/api/recipe_upload.php", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
    
            if(data.success) {
                console.log("Ricetta pubblicata con successo");
                //TODO: carica pagina del post
                window.location.href = "/Cookit/pages/home.html"; 
            } else {
                console.log("Errore", data.messaggio);
                alert(data.messaggio);
            }
    
        } catch (error) {
            console.error("Errore di connessione", error);
        }
    });
}