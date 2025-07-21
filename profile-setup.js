document.addEventListener("DOMContentLoaded", function () {
  const uploadInput = document.getElementById("upload");
  const uploadButton = document.getElementById("uploadButton");
  const profileImage = document.getElementById("profileImage");
  const fileNameDisplay = document.getElementById("fileName");

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const availabilityInput = document.getElementById("availability");
  const bioInput = document.getElementById("bio");

  const nextButton = document.querySelector("button.next");

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData) {
    fullNameInput.value = userData.data?.fullName || "";
    emailInput.value = userData.data?.email || "";
  }

  uploadButton.addEventListener("click", function () {
    uploadInput.click();
  });

  uploadInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      profileImage.src = URL.createObjectURL(file) || uploadedProfileUrl;
      fileNameDisplay.textContent = `Selected: ${file.name}`;
    }
  });

  nextButton.addEventListener("click", async function (e) {
    e.preventDefault();

    nextButton.disabled = true;
    nextButton.classList.add("loading");
    nextButton.textContent = "Please wait...";

    let uploadedImageUrl = "";

    if (uploadInput.files.length > 0) {
      const file = uploadInput.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "talentloop");

      try {
        const cloudinaryResponse = await fetch(
          "https://api.cloudinary.com/v1_1/difj8v0i0/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error("Image upload failed.");
        }

        const cloudinaryData = await cloudinaryResponse.json();
        uploadedImageUrl = cloudinaryData.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        alert("Failed to upload image. Please try again.");

        nextButton.disabled = false;
        nextButton.classList.remove("loading");
        nextButton.textContent = "Next";
        return;
      }
    }

    const profileData = {
      availability: availabilityInput.value.trim(),
      bio: bioInput.value.trim(),
      profileImageUrl: uploadedImageUrl,
    };

    sessionStorage.setItem("profileSetupData", JSON.stringify(profileData));

    window.location.replace("skill-selection.html");
  });
});
