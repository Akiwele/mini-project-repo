const profiles = [
  {
    name: "Godwin Miller",
    username: "godwin",
    image: "Thumbnails/Ellipse malee41.png",
    skills: ["Algebra", "Music", "Economics"],
    bio: "I'm passionate about helping students understand Algebra and the beauty of music.",
    availableTimes: "Weekdays: 3PM – 6PM"
  },
  {
    name: "Caroline Jever",
    username: "caroline",
    image: "Thumbnails/Ellipse female 41.png",
    skills: ["Java", "Biology", "History"],
    bio: "Love teaching Java and helping students explore biological science.",
    availableTimes: "Weekends: 10AM – 2PM"
  },
  {
    name: "George Grey",
    username: "george",
    image: "Thumbnails/Ellipse  man 39.png",
    skills: ["Algebra", "Economics"],
    bio: "Helping peers with numbers and finance concepts is my strength.",
    availableTimes: "Evenings: 5PM – 8PM"
  },
  {
    name: "Lordina Roberts",
    username: "lordina",
    image: "Thumbnails/Ellipse femAle38.png",
    skills: ["Algebra", "Music", "Economics"],
    bio: "I enjoy both creative and analytical subjects and love sharing them!",
    availableTimes: "Weekdays: 4PM – 6PM"
  },
  {
    name: "Minister Rich",
    username: "minister",
    image: "Thumbnails/Ellipse  man 39.png",
    skills: ["Algebra", "Economics"],
    bio: "Happy to guide fellow students in mastering core mathematical skills.",
    availableTimes: "Mornings: 9AM – 11AM"
  },
  {
    name: "Mandy Mower",
    username: "mandy",
    image: "Thumbnails/Ellipse female.png",
    skills: ["Algebra"],
    bio: "I love helping people break down Algebra in simple terms.",
    availableTimes: "Weekends: 12PM – 3PM"
  }
];

const repeatedProfiles = Array.from({ length: 30 }, (_, i) => {
  const p = profiles[i % profiles.length];
  return { ...p };
});

const profilesGrid = document.getElementById("profilesGrid");

repeatedProfiles.forEach(profile => {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  card.innerHTML = `
    <img src="${profile.image}" alt="${profile.name}" class="profile-pic" />
    <h3>${profile.username}</h3>
    <div class="skills">
      ${profile.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
    </div>
    <button class="view-profile-button">View Profile</button>
  `;

  card.querySelector(".view-profile-button").addEventListener("click", () => showModal(profile));

  profilesGrid.appendChild(card);
});

function showModal(profile) {
  const modal = document.createElement("div");
  modal.className = "profile-modal";

  const upVotes = getVotes(profile.name).up;
  const downVotes = getVotes(profile.name).down;

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-button" onclick="this.closest('.profile-modal').remove()">&times;</button>
      <img src="${profile.image}" alt="${profile.name}" class="modal-pic">
      <h2>${profile.name} <span style="font-weight: normal; font-size: 16px; color: gray;">(${profile.username})</span></h2>
      <p><strong>Bio:</strong> ${profile.bio}</p>
      <p><strong>Available Times:</strong> ${profile.availableTimes}</p>

      <div class="ratings">
        <button class="thumb-up">👍 <span>${upVotes}</span></button>
        <button class="thumb-down">👎 <span>${downVotes}</span></button>
      </div>

      <button class="send-request-button">Send Request</button>
    </div>
  `;

  document.body.appendChild(modal);

  const sendRequestButton = modal.querySelector(".send-request-button");
  sendRequestButton.addEventListener("click", function () {
    alert("Connection request sent!");
    sendRequestButton.textContent = "Request Sent";
    sendRequestButton.disabled = true;
    sendRequestButton.style.backgroundColor = "#aaa";
    sendRequestButton.style.cursor = "default";
  });

  // Handle Rating
  modal.querySelector('.thumb-up').addEventListener('click', () => rate(profile.name, 'up', modal));
  modal.querySelector('.thumb-down').addEventListener('click', () => rate(profile.name, 'down', modal));
}

function getVotes(profileName) {
  const stored = JSON.parse(localStorage.getItem("ratings")) || {};
  return stored[profileName] || { up: 0, down: 0 };
}

function rate(profileName, type, modal) {
  const ratedKey = `rated-${profileName}`;
  if (localStorage.getItem(ratedKey)) {
    alert("You've already rated this profile.");
    return;
  }

  const ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  if (!ratings[profileName]) ratings[profileName] = { up: 0, down: 0 };

  ratings[profileName][type]++;
  localStorage.setItem("ratings", JSON.stringify(ratings));
  localStorage.setItem(ratedKey, "true");

  modal.remove();
  showModal({ ...profiles.find(p => p.name === profileName) }); // Refresh the modal
}

function goBack() {
  window.location.href = 'edit-profile.html';
}
