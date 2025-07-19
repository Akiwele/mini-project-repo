const skills = [
  "Cybersecurity", "Algebra", "Literature", "Chemistry", "Biology", "Accounting",
  "History", "Economics", "Music", "Politics", "Data Structures", "Psychology",
  "Physics", "Anatomy", "Genetics", "Statistics", "Java", "Circuit Theory",
  "E-Commerce", "Business Law", "Thermodynamics", "Artificial Intelligence",
  "Web Development", "Human Resource Management", "Financial Accounting",
  "Machine Learning", "Database Systems", "Philosophy", "Entrepreneurship",
  "Computer Graphics", "Marketing", "Software Engineering", "Sociology",
  "Discrete Mathematics", "Project Management", "Real-Time Systems",
  "Environmental Science", "UI/UX Design", "Ethics in Technology", "Blockchain Basics",
  "Mobile App Development", "Embedded Systems", "International Relations",
  "Cloud Computing", "Network Security", "Operations Research", "Creative Writing",
  "Public Speaking", "Data Analysis", "Game Development", "Digital Marketing", "Marketing"
];

const skillsGrid = document.getElementById("skillsGrid");

skills.forEach(skill => {
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

function saveSkills() {
  const selectedSkills = Array.from(document.querySelectorAll(".skill.selected"))
    .map(el => el.textContent);
  localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
  window.location.href = "explore.html";
}
