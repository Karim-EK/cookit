const signupForm = document.getElementById("signup-form");
if (signupForm) {
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
                alert("Account creato con successo, puoi effettuare il login");
                location.href = "/Cookit/index.html";
            } else {
                console.log("Errore di autenticazione:", data.messaggio);
                alert(data.messaggio);
            }
        } catch (error) {
            console.error("Errore di connessione", error);
        }
    });
}