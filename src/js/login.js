const logingForm = document.getElementById("login");
logingForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.table(Array.from(formData.entries()));
    try {
        const response = await fetch("/Cookit/api/login.php", {
            method: "POST",
            body: formData
        });
        const data = await response.json();

        if(data.success) {
            console.log("Autenticato con successo");
            window.location.href = "/Cookit/home.html"; 
        } else {
            console.log("Errore di autenticazione:", data.messaggio);
            alert(data.messaggio); // O inserisci il testo in un <span> rosso nel form
        }

    } catch (error) {
        console.error("Errore di connessione", error);
    }
});