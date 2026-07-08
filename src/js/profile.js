import './notifications.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');
let profileData;
const mainContainer = document.getElementById("profile-container");
const gridContainer = document.getElementById("recipes-grid");

try {
    const response = await fetch(`/Cookit/api/get_profile_data.php?id=${userId}`);
    profileData = await response.json();
    if (profileData.success) {
        renderProfilePage();
    } else {
        console.error("Errore: ", profileData.message);
    }
} catch (error) {
    console.error("Errore: ", error);
}

const followBtn = document.getElementById("follow-btn");
followBtn.addEventListener("click", () => follow());

async function follow() {
    try {
        const formData = new FormData();
        formData.append("followed_id", userId);
        const response = await fetch("/Cookit/api/follow.php", {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        if (result.success) {
           if (result.data.is_following) {
                followBtn.innerText = "Segui già";
           } else {
                followBtn.innerText = "Segui";
           }
           document.getElementById("follower-counter").innerText = `Follower: ${result.data.follower_count}`;
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

function renderProfilePage() {
    const header = document.createElement("div");
    header.classList = "grid px-s grid-cols-3 pb-s border-bottom-thick";
    
    const userImage = document.createElement("img");
    userImage.addEventListener("click", function() {location.href = "/Cookit/pages/profile-img.html"});
    userImage.classList = "centered-item h-icon rounded-md object-cover h-logo-l";
    userImage.src = profileData.data.profilo.immagine_profilo || "/Cookit/src/assets/default-avatar.png";
    userImage.alt = `immagine profilo di ${profileData.data.profilo.nickname}`;

    const nickname = document.createElement("p");
    nickname.classList = "centered-item m-0-auto";
    nickname.innerText = profileData.data.profilo.nickname;

    const followBtn = document.createElement("button");
    followBtn.classList = "centered-item p-s bg-primary text-white rounded-md";
    followBtn.id = "follow-btn";
    followBtn.style = "grid-row-start: 1; grid-column-start: 3;";

    if (profileData.data.profilo.is_owner) {
        followBtn.classList.add("hidden");
    }
    if (profileData.data.profilo.is_following) {
        followBtn.innerText = "Segui già";
    } else {
        followBtn.innerText = "Segui";
    }

    const follower = document.createElement("p");
    follower.classList = "centered-item mt-m m-0-auto";
    follower.innerText = `Follower: ${profileData.data.profilo.numero_follower}`;
    follower.style = "grid-row-start: 2; grid-column-start: 1;";
    follower.id = "follower-counter";

    const follow  = document.createElement("p");
    follow.classList = "centered-item mt-m m-0-auto";
    follow.innerText = `Segue: ${profileData.data.profilo.numero_seguiti}`;
    follow.style = "grid-row-start: 2; grid-column-start: 2;";

    const recipe = document.createElement("p");
    recipe.classList = "centered-item mt-m m-0-auto";
    recipe.innerText = `Ricette: ${profileData.data.profilo.numero_ricette}`;
    recipe.style = "grid-row-start: 2; grid-column-start: 3;";

    header.appendChild(userImage);
    header.appendChild(nickname);
    header.appendChild(followBtn);
    header.appendChild(follower);
    header.appendChild(follow);
    header.appendChild(recipe);

    mainContainer.prepend(header);
    
    profileData.data.ricette.forEach(ricetta => {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "flex flex-col min-w-0";

        const title = document.createElement("p");
        title.className = "txt-center txt-xs truncate";
        title.textContent = ricetta.titolo_ricetta; 

        const recipeImg = document.createElement("img");
        recipeImg.className = "w-full aspect-4-3 object-cover";
        recipeImg.src = ricetta.immagine_ricetta || "/Cookit/src/assets/default-dish.png";
        recipeImg.alt = `immagine di ${ricetta.titolo_ricetta} pubblicato da ${profileData.data.profilo.nickname}`;

        cardWrapper.addEventListener("click", () => {
            window.location.href = `/Cookit/pages/post.html?id=${ricetta.id_ricetta}`;
        });

        cardWrapper.appendChild(title);
        cardWrapper.appendChild(recipeImg);

        gridContainer.appendChild(cardWrapper);
    });
}
