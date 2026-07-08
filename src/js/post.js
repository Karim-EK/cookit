import { handleMainButtons } from "./homeButtons.js";

const urlParams = new URLSearchParams(window.location.search);
const idPost = urlParams.get("id");
const container = document.getElementById("post-container");
const unlikedIcon = `<svg class="h-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M442.9 144C415.6 144 389.9 157.1 373.9 179.2L339.5 226.8C335 233 327.8 236.7 320.1 236.7C312.4 236.7 305.2 233 300.7 226.8L266.3 179.2C250.3 157.1 224.6 144 197.3 144C150.3 144 112.2 182.1 112.2 229.1C112.2 279 144.2 327.5 180.3 371.4C221.4 421.4 271.7 465.4 306.2 491.7C309.4 494.1 314.1 495.9 320.2 495.9C326.3 495.9 331 494.1 334.2 491.7C368.7 465.4 419 421.3 460.1 371.4C496.3 327.5 528.2 279 528.2 229.1C528.2 182.1 490.1 144 443.1 144zM335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1C576 297.7 533.1 358 496.9 401.9C452.8 455.5 399.6 502 363.1 529.8C350.8 539.2 335.6 543.9 320 543.9C304.4 543.9 289.2 539.2 276.9 529.8C240.4 502 187.2 455.5 143.1 402C106.9 358.1 64 297.7 64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1L320 171.8L335 151.1z"/></svg>`;
const likedIcon = `<svg class="h-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/></svg>`;
let postData;

try {
  const response = await fetch(`/Cookit/api/get_post_page.php?id=${idPost}`);
  postData = await response.json();
  if(postData.success) {
	  renderPage();
  } else {
    console.log("Impossibile trovare il post");
    window.location.href = "/Cookit/pages/home.html";
  }
} catch (error) {
  console.error("Errore durante la comunicazione con il server", error);
}

function renderPage() {
  container.className = "post w-full";
  const title = document.createElement("p");
  const deleteIconButton = document.createElement("button");
  deleteIconButton.id = "delete-btn"; 
  if (postData.data.is_author) {
    deleteIconButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    `;
  } else {
    deleteIconButton.innerHTML = "";
  }

  const header = document.createElement("div");
  header.classList = "flex justify-between";
  header.appendChild(title);
  header.appendChild(deleteIconButton);

  title.className = "txt-l mb-m";
  title.innerText = postData.data.Nome;

  const userInfo = document.createElement("div");
  userInfo.className = "flex items-center mb-s";
  const userImg = document.createElement("img");
  userImg.className = "h-icon rounded-md object-cover mr-m";
  userImg.src = postData.data.immagine_profilo || "/Cookit/src/assets/default-avatar.png";
  // TODO: Verifica checkers
  userImg.alt = "";
  const username = document.createElement("p");
  username.innerText = postData.data.Username;
  const time = document.createElement("p");
  time.classList = "ml-auto"
  const safeDateString = postData.data.Data_Pubblicazione.replace(" ", "T");
  const formattedDate = new Date(safeDateString).toLocaleString("it-IT", {
    day: "2-digit", 
    month: "short", 
    hour: "2-digit", 
    minute: "2-digit"
  });
  time.innerText = formattedDate;
  container.appendChild(header);
  container.appendChild(userInfo);
  userInfo.appendChild(userImg);
  userInfo.appendChild(username);
  userInfo.appendChild(time);

  const dynamicContainer = document.createElement("div");
  //TODO: dimensione minima
  dynamicContainer.className = "dynamic-container";
  const postImage = document.createElement("img");
  postImage.className = "h-post-img rounded-lg object-cover w-full";
  postImage.src = postData.data.immagine_ricetta || "/Cookit/src/assets/default-dish.png";
  postImage.alt = ""; //TODO
  dynamicContainer.appendChild(postImage);
  container.appendChild(dynamicContainer);

  const mainButtonsContainer = document.createElement("div");
  mainButtonsContainer.className = "flex justify-center justify-evenly my-m";
  mainButtonsContainer.innerHTML = `
	<div class="flex flex-col items-center">
	<p class="bold">Ingredienti</p>
	<button data-btn-type="ingr-btn" data-recipe-id="${postData.data.id_ricetta}" class="btn-icon">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none"
	stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

	<path
	d="M 10 3 L 14 3 C 14 7.5, 17 9, 19.5 12.5 C 21.5 15.5, 19.5 20, 15 20 L 9 20 C 4.5 20, 2.5 15.5, 4.5 12.5 C 7 9, 10 7.5, 10 3 Z" />

	<path d="M 11 3 C 9 8, 8 14, 10 20" />
	<path d="M 13 3 C 15 8, 16 14, 14 20" />

	<path d="M 9.5 20 V 22" />
	<path d="M 11.16 20 V 22" />
	<path d="M 12.83 20 V 22" />
	<path d="M 14.5 20 V 22" />

	</svg>
	</button>
	</div>
	<button class="btn-icon invisible">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none"
	stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

	<path
	d="M 10 3 L 14 3 C 14 7.5, 17 9, 19.5 12.5 C 21.5 15.5, 19.5 20, 15 20 L 9 20 C 4.5 20, 2.5 15.5, 4.5 12.5 C 7 9, 10 7.5, 10 3 Z" />

	<path d="M 11 3 C 9 8, 8 14, 10 20" />
	<path d="M 13 3 C 15 8, 16 14, 14 20" />

	<path d="M 9.5 20 V 22" />
	<path d="M 11.16 20 V 22" />
	<path d="M 12.83 20 V 22" />
	<path d="M 14.5 20 V 22" />

	</svg>
	</button>
	<div class="flex flex-col items-center">
	<p class="bold">Preparazione</p>
	<button id="prep-btn" data-recipe-id="${postData.data.id_ricetta}" class="btn-icon">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="none"
	stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">

	<!-- 1. Tagliere (Invariato come punto di ancoraggio visivo) -->
	<rect x="2" y="19" width="20" height="3" rx="1" />

	<!-- 2. Cibo a cubetti (Diced food) -->
	<!-- Cubetto di sinistra -->
	<rect x="5" y="16" width="3" height="3" rx="0.5" />
	<!-- Cubetto centrale (più piccolo per dare realismo e disordine organico) -->
	<rect x="9" y="17" width="2" height="2" rx="0.5" />
	<!-- Cubetto di destra -->
	<rect x="12" y="16" width="3" height="3" rx="0.5" />

	<!-- 3. Coltello (Coordinate ampliate e posizionato in alto) -->
	<g transform="rotate(-15 14 13)">
	<!-- Lama ricalcolata -->
	<path d="M 5 9 L 17 9 L 17 13 L 11 13 C 7.5 13, 5 11.5, 5 9 Z" />
	<!-- Manico proporzionato alla nuova lama -->
	<rect x="17" y="10" width="6" height="2" rx="0.5" />
	</g>

	</svg>
	</button>
	</div>
  `
  const secondaryButtonsContainer = document.createElement("div");
  secondaryButtonsContainer.className = "flex items-center p-sg gap-m";

  let likeSvg = null;
  likeSvg = postData.data.has_liked ? likedIcon :unlikedIcon;

  secondaryButtonsContainer.innerHTML = `
	<button id="comment-btn" class="btn-icon mr-auto">
	<svg class="h-icon" xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
	<path
	d="M115.9 448.9C83.3 408.6 64 358.4 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304C576 436.5 461.4 544 320 544C283.5 544 248.8 536.8 217.4 524L101 573.9C97.3 575.5 93.5 576 89.5 576C75.4 576 64 564.6 64 550.5C64 546.2 65.1 542 67.1 538.3L115.9 448.9zM153.2 418.7C165.4 433.8 167.3 454.8 158 471.9L140 505L198.5 479.9C210.3 474.8 223.7 474.7 235.6 479.6C261.3 490.1 289.8 496 319.9 496C437.7 496 527.9 407.2 527.9 304C527.9 200.8 437.8 112 320 112C202.2 112 112 200.8 112 304C112 346.8 127.1 386.4 153.2 418.7z" />
	</svg>
	</button>
	<button id="share-btn" class="btn-icon">
	<svg class="h-icon" xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
	<path
	d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z" />
	</svg>
	</button>
	
	<div class="flex items-center">
	<button id="like-btn" class="btn-icon">${likeSvg}</button>
	<p id="likes-counter" class="txt-xs">${postData.data.total_likes}</p>
	</div>
  `;

  container.appendChild(mainButtonsContainer);
  container.appendChild(secondaryButtonsContainer);
}
const likesCounter = document.getElementById("likes-counter");
const ingrBtn = document.querySelector('[data-btn-type="ingr-btn"]');
const prepBtn = document.querySelector('[data-btn-type="prep-btn"]');
const commentBtn = document.getElementById("comment-btn");
const shareBtn = document.getElementById("share-btn");
const likeBtn = document.getElementById("like-btn");
const commentContainer = document.getElementById("comment-container");
const commentForm = document.getElementById("comment-form");
const wholePage = document.getElementById("post-page");
const commentText = document.getElementById("user-comment");

if (postData.data.is_author) {
  const deleteButton = document.getElementById("delete-btn");
  deleteButton.addEventListener("click", () => deletePost());
}

renderCommentSection();
container.addEventListener("click", (e) => handleMainButtons(e));
likeBtn.addEventListener("click", () => like());
shareBtn.addEventListener("click", () => share());
commentBtn.addEventListener("click", () => comment());
wholePage.addEventListener("click", (e) => hideComment(e));
commentForm.addEventListener("submit", (e) => publicComment(e));

async function like() {
  try {
	const formData = new FormData();
	formData.append("recipe_id", idPost);
	const response = await fetch("/Cookit/api/toggle_like.php", {
				method: "POST",
				body: formData
			  });
	const result = await response.json();
	if (result.success) {
		likeBtn.innerHTML = result.data.has_liked ? likedIcon : unlikedIcon;
		likesCounter.innerText = result.data.total_likes;
	} else {
    alert("Devi Prima registrarti per mettere Like!")
	  console.error(response.message);
	}
  } catch (error) {
		console.error("Errore durante la condivisione:", error);
	}
}
async function share() {
  const shareUrl = `${window.location.origin}/Cookit/pages/recipe.php?id=${postData.data.id_ricetta}`;
  if (navigator.share) {
	try {
		await navigator.share({
			title: postData.data.nome,
			text: `Guarda questa fantastica ricetta su Cookit: ${postData.data.nome}`,
			url: shareUrl
		});
		console.log("Condivisione eseguita con successo!");
	} catch (error) {
		console.error("Errore durante la condivisione:", error);
	}
  //Desktop
  } else {
	  try {
		  await navigator.clipboard.writeText(shareUrl);
		  alert("Link della ricetta copiato negli appunti! Condividilo dove vuoi.");
	  } catch (err) {
		  console.error("Impossibile copiare il link:", err);
	  }
  }
}
function comment() {
  commentForm.classList.toggle("hidden");
}
function hideComment(e) {
  if (!commentForm.classList.contains("hidden") && !e.target.classList.contains("h-icon")) {
    commentForm.classList.add("hidden");
  }
}
function cook() {}

async function renderCommentSection() {
  try {
    commentContainer.innerHTML = "";
    const response = await fetch(`/Cookit/api/get_comments.php?id=${idPost}`);
    const result = await response.json();
    if (result.success && result.data.length != 0) {
      result.data.forEach(comment => {
        const commentCard = document.createElement("div");
        commentCard.className = "shadow-md mb-m"; 
        const commentDate = new Date(comment.data).toLocaleString("it-IT", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
        });
        commentCard.innerHTML = `
            <div class="p-s flex flex-col gap-m">
                <div class="flex items-center">
                    <img class="h-icon rounded-md object-cover mr-m" 
                         src="${comment.img_profilo || '/Cookit/src/assets/default-avatar.png'}" 
                         alt="immagine profilo di ${comment.username}">
                    
                    <a href="/Cookit/pages/profile.html?id=${comment.utente_id}" class="text-bold text-decoration-none" style="color: inherit;">
                        ${comment.username}
                    </a>
                    
                    <p class="p-s ml-auto txt-italic">${commentDate}</p>
                </div>
                <div>
                    <p class="word-wrap safe-comment-text"></p>
                </div>
            </div>
        `;
        // to avoid code injection
        commentCard.querySelector(".safe-comment-text").textContent = comment.testo;
        commentContainer.appendChild(commentCard);
    });
    } else {
      commentContainer.classList.add("txt-m");
      commentContainer.classList.add("m-m");
      commentContainer.classList.add("p-m");
      commentContainer.innerText = "Ancora Nessun Commento!"
      console.log(result.message);
    }
  } catch (error) {
		console.error("Errore durante il caricamento dei commenti:", error);
  }
}
async function publicComment(e) {
  e.preventDefault();
  if (commentText.value.trim() != "") {
    const formData = new FormData(e.target);
    formData.append("recipe_id", idPost);
    try {
      const response = await fetch("/Cookit/api/upload_comment.php", {
                method: "POST",
                body: formData
            });
      const result = await response.json();
      if (result.success) {
        commentText.value = "";
        comment();
        renderCommentSection();
      } else {
        alert("Devi essere registrato per commentare!")
      }
    } catch (error) {
      console.error("Errore durante la pubblicazione", error);
      alert("Non puoi pubblicare un commento vuoto")
    }
  }
}

async function deletePost() {
  const confirmDeletion = confirm("Vuoi davvero eliminare definitivamente la tua Ricetta?");
  if (confirmDeletion) {
    try {
      const formdata = new FormData();
      formdata.append("recipe_id", idPost);
      const response = await fetch("/Cookit/api/delete_post.php", {
        method: "POST",
        body: formdata
      });
      const result = await response.json();
      if(result.success) {
        window.location.href = "/Cookit/pages/home.html";
      } else {
        console.error("Impossibile eliminare il post ", result.data.message);
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione ", error);
    }
  }
}