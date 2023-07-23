// imagepreview.js

document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById('uploadimage');
  const profileContainer = document.getElementById('imagePreview');

  imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function () {
        const imageUrl = reader.result;
        profileContainer.style.backgroundImage = `url(${imageUrl})`;
      };
    }
  });
});
