const profilesGrid = document.getElementById("profilesGrid");
const searchBar = document.getElementById("searchBar");
const profileAvatar = document.getElementById("profileAvatar");

const localUserData = JSON.parse(localStorage.getItem("userData")) || {};
const token = localUserData?.data?.token || "";

let allProfiles = [];

async function fetchProfiles() {
  try {
    const response = await fetch("http://localhost:8070/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    allProfiles = data?.data || [];

    renderProfiles(allProfiles);

    if (allProfiles.length > 0) {
      const currentUser = allProfiles.find(
        (p) => p.id === localUserData?.data?.userId
      );
      if (currentUser && currentUser.profileImageUrl) {
        profileAvatar.src = currentUser.profileImageUrl;
      } else {
        profileAvatar.src = "Thumbnails/Ellipse female.png";
      }
    }
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }
}

// === Render profiles ===
function renderProfiles(profiles) {
  profilesGrid.innerHTML = "";
  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.classList.add("profile-card");

    card.innerHTML = `
      <img src="${
        profile.profileImageUrl || "Thumbnails/Ellipse female.png"
      }" alt="${profile.fullName}" class="profile-pic" />
      <h3>${profile.username || "Unknown"}</h3>
      <div class="skills">
        ${(profile.skills || [])
          .map((skill) => `<span class="skill">${skill}</span>`)
          .join("")}
      </div>
      <button class="view-profile-button">View Profile</button>
    `;

    card
      .querySelector(".view-profile-button")
      .addEventListener("click", () => showModal(profile));

    profilesGrid.appendChild(card);
  });
}

// === Filter profiles ===
searchBar.addEventListener("input", () => {
  const searchTerm = searchBar.value.toLowerCase();

  const filtered = allProfiles.filter((profile) => {
    const nameMatch = (profile.fullName || "")
      .toLowerCase()
      .includes(searchTerm);
    const usernameMatch = (profile.username || "")
      .toLowerCase()
      .includes(searchTerm);
    const skillsMatch = (profile.skills || []).some((skill) =>
      skill.toLowerCase().includes(searchTerm)
    );
    const bioMatch = (profile.bio || "").toLowerCase().includes(searchTerm);
    const availabilityMatch = (profile.availability || "")
      .toLowerCase()
      .includes(searchTerm);

    return (
      nameMatch || usernameMatch || skillsMatch || bioMatch || availabilityMatch
    );
  });

  renderProfiles(filtered);
});

function showModal(profile) {
  const modal = document.createElement("div");
  modal.className = "profile-modal";

  const upVotes = getVotes(profile.fullName).up;
  const downVotes = getVotes(profile.fullName).down;

  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-button" onclick="this.closest('.profile-modal').remove()">&times;</button>
      <img src="${
        profile.profileImageUrl || "Thumbnails/Ellipse female.png"
      }" alt="${profile.fullName}" class="modal-pic">
      <h2>${
        profile.fullName
      } <span style="font-weight: normal; font-size: 16px; color: gray;">(${
    profile.username
  })</span></h2>
      <p><strong>Bio:</strong> ${profile.bio || "No bio provided"}</p>
      <p><strong>Available Times:</strong> ${profile.availability || "N/A"}</p>

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

  modal
    .querySelector(".thumb-up")
    .addEventListener("click", () => rate(profile.fullName, "up", modal));
  modal
    .querySelector(".thumb-down")
    .addEventListener("click", () => rate(profile.fullName, "down", modal));
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
  showModal({ ...allProfiles.find((p) => p.fullName === profileName) });
}

function goBack() {
  // window.location.href = "edit-profile.html";
}

fetchProfiles();
