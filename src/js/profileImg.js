import { btnConfirmCrop } from './cropper.js';

const uploadBtn = document.getElementById("upload-btn");
const form = document.getElementById("image-form");

form.addEventListener("submit", (e) => uploadImg(e));

btnConfirmCrop.addEventListener("click", function() {
    uploadBtn.classList.toggle("hidden");
    filename.innerText
});

async function uploadImg(e) {
    e.preventDefault();
    try {
        const response = await fetch("/Cookit/api/profile_img.php", {
            method: "POST",
            body: new FormData(e.target)
        });
        const result = await response.json();

        if (result.success) {
            console.log(result.message);
            location.href = `/Cookit/pages/profile.html?id=${result.data.id}`;
        } else {
            location.href = "/Cookit/index.php";
        }
    } catch (error) {
        console.error(error);
    }
}