const recipeForm = document.getElementById("recipe-form");
if (recipeForm) {
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
                window.location.href = `/Cookit/pages/post.html?id=${data.ricetta_id}`; 
            } else {
                alert(data.message);
            }
    
        } catch (error) {
            console.error("Errore di connessione", error);
        }
    });
}