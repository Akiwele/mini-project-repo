const profileImage = document.getElementById("profileImage");
const profilePicInput = document.getElementById("profilePicInput");
const editProfileForm = document.getElementById("editProfileForm");
const goBackBtn = document.getElementById("goBackBtn");

// 👇 Inputs
const fullNameInput = document.getElementById("Fullname");
const usernameInput = document.getElementById("Username");
const emailInput = document.getElementById("email");
const availableTimeInput = document.getElementById("availableTime");
const skillsInput = document.getElementById("skills");
const bioInput = document.getElementById("bio");

let uploadedProfileUrl = "";

document.addEventListener("DOMContentLoaded", async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.data?.userId;
  const token = userData?.data?.token;

  if (!userId) {
    alert("No user logged in.");
    window.location.href = "signin.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8070/users/user?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch user.");

    const result = await response.json();
    const user = result.data;
    profileImage.src = user.profileImageUrl || "Thumbnails/Ellipse female.png";
    uploadedProfileUrl = user.profileImageUrl || "";

    fullNameInput.value = user.fullName || "";
    usernameInput.value = user.username || "";
    emailInput.value = user.email || "";
    availableTimeInput.value = user.availability || "";
    skillsInput.value = user.skills ? user.skills.join(", ") : "";
    bioInput.value = user.bio || "";
  } catch (error) {
    console.error("Error fetching user:", error.message);
    alert("Failed to load profile. Try again.");
  }
});

profilePicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    profileImage.src = URL.createObjectURL(file);
  }
});

// Save profile changes
editProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const saveButton = editProfileForm.querySelector(".save-button");
  saveButton.textContent = "Saving...";
  saveButton.disabled = true;

  let newProfileImageUrl = uploadedProfileUrl;

  if (profilePicInput.files.length > 0) {
    const file = profilePicInput.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "talentloop");

    try {
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/difj8v0i0/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!cloudRes.ok) throw new Error("Image upload failed");
      const data = await cloudRes.json();
      newProfileImageUrl = data.secure_url;
    } catch (err) {
      alert("Failed to upload new profile image.");
      saveButton.textContent = "Save";
      saveButton.disabled = false;
      return;
    }
  }

  const payload = {
    username: usernameInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    bio: bioInput.value.trim(),
    availability: availableTimeInput.value.trim(),
    skills: skillsInput.value.split(",").map((s) => s.trim()),
    profileImageUrl: newProfileImageUrl,
  };

  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.data?.userId;
    const token = userData?.data?.token;

    const response = await fetch(
      `http://localhost:8070/users/update-profile?userId=${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) throw new Error("Failed to update profile");

    alert("Profile updated!");
    window.location.href = "explore.html";
  } catch (error) {
    alert("Could not save changes.");
    console.error(error);
  } finally {
    saveButton.textContent = "Save";
    saveButton.disabled = false;
  }
});

goBackBtn.addEventListener("click", () => {
  window.location.href = "explore.html";
});
