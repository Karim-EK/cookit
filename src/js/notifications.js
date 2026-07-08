const bellIcon = document.getElementById("bell-icon");
const badge = document.getElementById("badge");
const container = document.getElementById("notification-container");
document.getElementById("profile-container")
    .addEventListener("click", function() {
        if (container.style.display == "flex") {
            container.style.display = "none";
        } else {
            container.style.display = "flex";
        }
    })

try {
    const response = await fetch("/Cookit/api/get_notifications.php");
    const result = await response.json();
    if(result.success) {
        updateNotificationCounter(result.data);
        bellIcon.addEventListener("click",(e) => renderNotifications(e, result.data));
    } else {
        console.error(result.message);
    }
} catch (error) {
    console.error(error);
}

function updateNotificationCounter(array) {
    if (array.length == 0) {
        return;
    }
    if (array.length > 9) {
        badge.innerText = "9+"
        badge.style.right = "1rem";
    } else {
        badge.innerText = array.length;
    }
}

function renderNotifications(event, array) {
    badge.innerText = "";
    container.innerHTML = "";
    if (array.length == 0) {
        container.innerText = "Nessuna nuova notifica";
    }
    container.style.top = `${event.clientY}px`;
    container.style.left = `${event.clientX}px`;
    container.style.transform = "translateX(-100%)";
    container.style.display = "flex"; 
    array.forEach(element => {
        const notification = document.createElement("div");
        notification.className = "flex items-center gap-s p-s";
        const img = document.createElement("img");
        img.className = "h-icon";
        img.src = element.attore_immagine || "/Cookit/src/assets/default-avatar.png";
        const text = document.createElement("p");
        text.className = "flex-70";

        switch (element.tipo) {
            case "follow":
                text.innerText = `${element.attore_nickname} ha iniziato a seguirti`;
                text.addEventListener("click", function() {location.href = `/Cookit/pages/profile.html?id=${element.attore_id}`});
                break;
            case "commento":
                text.innerText = `${element.attore_nickname} ha commentato una tua ricetta`;
                text.addEventListener("click", function() {location.href = `/Cookit/pages/post.html?id=${element.ricetta_id}`});
                break;
            case "like":
                text.innerText = `${element.attore_nickname} ha messo like ad una tua ricetta`;
                text.addEventListener("click", function() {location.href = `/Cookit/pages/post.html?id=${element.ricetta_id}`});
                break;
            default:
                break;
        }

        notification.appendChild(img);
        notification.appendChild(text);
        container.appendChild(notification);

        toggleAsRead();
    });
}

async function toggleAsRead() {
    try {
        const response = await fetch("/Cookit/api/mark_as_read.php", {
            method: "POST"
        });
        const result = await response.json();
        if (result.success) {
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}