const profileImage = document.getElementById('profileImage');
const profilePicInput = document.getElementById('profilePicInput');
const themeToggle = document.getElementById('themeToggle');

// Change profile image preview
profilePicInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    profileImage.src = URL.createObjectURL(file);
  }
});



// Save form data and simulate going back
document.getElementById('editProfileForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const updatedProfile = {
    email: document.getElementById('email').value,
    time: document.getElementById('availableTime').value,
    skills: document.getElementById('skills').value.split(',').map(s => s.trim()),
    image: profileImage.src
  };

  localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  alert('Changes saved successfully!');
  window.location.href = 'explore.html'; // go back to explore
});

// Back button
document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById("goBackButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = 'explore.html';
    });
  }
});
