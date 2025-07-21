const skills = [
  "Cybersecurity",
  "Algebra",
  "Literature",
  "Chemistry",
  "Biology",
  "Accounting",
  "History",
  "Economics",
  "Music",
  "Politics",
  "Data Structures",
  "Psychology",
  "Physics",
  "Anatomy",
  "Genetics",
  "Statistics",
  "Java",
  "Circuit Theory",
  "E-Commerce",
  "Business Law",
  "Thermodynamics",
  "Artificial Intelligence",
  "Web Development",
  "Human Resource Management",
  "Financial Accounting",
  "Machine Learning",
  "Database Systems",
  "Philosophy",
  "Entrepreneurship",
  "Computer Graphics",
  "Marketing",
  "Software Engineering",
  "Sociology",
  "Discrete Mathematics",
  "Project Management",
  "Real-Time Systems",
  "Environmental Science",
  "UI/UX Design",
  "Ethics in Technology",
  "Blockchain Basics",
  "Mobile App Development",
  "Embedded Systems",
  "International Relations",
  "Cloud Computing",
  "Network Security",
  "Operations Research",
  "Creative Writing",
  "Public Speaking",
  "Data Analysis",
  "Game Development",
  "Digital Marketing",
  "Marketing",
];

const skillsGrid = document.getElementById("skillsGrid");
const saveButton = document.querySelector(".save-button");

skills.forEach((skill) => {
  const btn = document.createElement("div");
  btn.className = "skill";
  btn.textContent = skill;

  btn.onclick = () => {
    const selected = document.querySelectorAll(".skill.selected");
    if (btn.classList.contains("selected")) {
      btn.classList.remove("selected");
    } else if (selected.length < 3) {
      btn.classList.add("selected");
    } else {
      alert("You can only select up to 3 skills.");
    }
  };

  skillsGrid.appendChild(btn);
});

async function saveSkills() {
  saveButton.textContent = "Saving...";
  saveButton.classList.add("loading");
  saveButton.disabled = true;

  const selectedSkills = Array.from(
    document.querySelectorAll(".skill.selected")
  ).map((el) => el.textContent);

  if (selectedSkills.length === 0) {
    alert("Please select at least 1 skill.");
    saveButton.textContent = "Save";
    saveButton.disabled = false;
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const userId = userData?.data?.userId;

  const profileData =
    JSON.parse(sessionStorage.getItem("profileSetupData")) || {};
  const availability = profileData.availability || "";
  const bio = profileData.bio || "";
  const profileUrl = profileData.profileImageUrl || "";

  const finalPayload = {
    availability,
    bio,
    profileUrl,
    skills: selectedSkills,
  };

  console.log("Final payload to submit:", finalPayload);

  try {
    const response = await fetch(
      `http://localhost:8070/auth/create-profile?userId=${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      }
    );

    const result = await response.json();
    console.log("Profile saved:", result);

    localStorage.setItem("userData", JSON.stringify(result));

    saveButton.textContent = "Saved!";
    saveButton.classList.add("saved");

    window.location.replace("explore.html");
  } catch (error) {
    console.error("Error saving profile:", error.message);

    saveButton.textContent = "Save";
    saveButton.disabled = false;
  }
}

saveButton.addEventListener("click", saveSkills);
