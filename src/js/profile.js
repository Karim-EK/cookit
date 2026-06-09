async function loadData(p) {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    let apiUrl = "/Cookit/api/get_user_info.php";
    if (targetUserId) {
        apiUrl += `?id=${targetUserId}`;
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();        

        // Qui in futuro inietterai i dati di 'data' dentro l'elemento 'p' (nameSurname)

    } catch (error) {
        console.error("Errore FATALE:", error);
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const nameSurname = document.getElementById("name-surname");
    if(nameSurname) {
        loadData(nameSurname);
    }
});