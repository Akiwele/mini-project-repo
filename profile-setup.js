document.addEventListener('DOMContentLoaded', function () {
      const uploadInput = document.getElementById('upload');
      const uploadButton = document.getElementById('uploadButton');
      const profileImage = document.getElementById('profileImage');
      const fileNameDisplay = document.getElementById('fileName');

      // Open file selector when Upload button is clicked
      uploadButton.addEventListener('click', function () {
        uploadInput.click();
      });

      // Preview selected image and show filename
      uploadInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          profileImage.src = URL.createObjectURL(file);
          fileNameDisplay.textContent = `Selected: ${file.name}`;
        }
      });
    });