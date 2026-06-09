const imageUpload = document.getElementById('image-upload');
const cropUI = document.getElementById('crop-ui');
const imageToCrop = document.getElementById('image-to-crop');
const btnConfirmCrop = document.getElementById('btn-confirm-crop');
const finalPreview = document.getElementById('final-preview');
const hiddenImageData = document.getElementById('cropped_image_data');

let cropper = null;
if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
    
        // FileReader traduce il file fisico in un URL temporaneo leggibile dal browser
        const reader = new FileReader();
        reader.onload = function(event) {
            cropUI.style.display = 'flex';
            imageToCrop.src = event.target.result;
    
            if (cropper) {
                cropper.destroy();
            }
    
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 4 / 3, 
                viewMode: 2,
                background: false,
            });
        };
        reader.readAsDataURL(file);
    });
}

if (btnConfirmCrop) {
    btnConfirmCrop.addEventListener('click', function() {
        if (!cropper) return;
    
        const canvas = cropper.getCroppedCanvas({
            width: 800,
            height: 600,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });
    
        // Traduciamo il canvas in una stringa di testo Base64 (formato JPEG, qualità 80%)
        const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    
        hiddenImageData.value = base64Image;
        
        finalPreview.src = base64Image;
        finalPreview.style.display = 'block';
        
        cropUI.style.display = 'none';
        cropper.destroy();
        cropper = null;
    });
}