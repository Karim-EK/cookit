const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
const follower = document.getElementById("follower-btn");
const follow = document.getElementById("follow-btn");
const container = document.getElementById("follow-container");
try {
    const response = await fetch(`/Cookit/api/get_followers.php?id=${userId}`);
    const result = await response.json();

    if (result.success) {
        follower.addEventListener("click", () => renderFollower(result.data.followers));
        follow.addEventListener("click", () => renderFollower(result.data.seguiti));
    } else {
        location.href = `Cookit/pages/profile.html?id=${userId}`;
    }
} catch (error) {
    console.error(error);
}

function renderFollower(array) {
    container.innerHTML = "";
    array.forEach(element => {
        const card = document.createElement("div");
        card.className = "flex items-center justify-center gap-m";
        const img = document.createElement("img");
        img.className = "h-icon";
        img.src = element.immagine_profilo || "/Cookit/src/assets/default-avatar.png";
        img.alt = `immagine profilo di ${element.nickname}`;
        const nickname = document.createElement("p");
        nickname.innerText = element.nickname;

        card.appendChild(img);
        card.appendChild(nickname);
        card.addEventListener("click", function() {location.href = `/Cookit/pages/profile.html?id=${element.id_utente}`});

        container.appendChild(card);
    });
}