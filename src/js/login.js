const logingForm = document.getElementById("login");
if (logingForm) {
    logingForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        try {
            const response = await fetch("/Cookit/api/login.php", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
    
            if(data.success) {
                console.log("Autenticato con successo");
                window.location.href = "/Cookit/pages/home.html"; 
            } else {
                console.error("Errore di autenticazione:", data.messaggio);
            }
    
        } catch (error) {
            console.error("Errore di connessione", error);
        }
    });
}