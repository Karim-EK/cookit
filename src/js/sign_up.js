const signupForm = document.getElementById("signup-form");
signupForm.addEventListener("submit", async function(event) {
    const formData = new FormData(this);
    event.preventDefault();
    try{
        const response = await fetch("/Cookit/api/sign_up.php", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if(data.success) {
            console.log("Autenticato con successo");
        } else {
            console.log("Errore di autenticazione:", data.messaggio);
            alert(data.messaggio);
        }
    } catch (error) {
        console.error("Errore di connessione", error);
    }
})