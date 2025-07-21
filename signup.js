const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", function () {
  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  this.src = isVisible
    ? "Thumbnails/eye closed.png"
    : "Thumbnails/eye opened.png";
});

const confirmInput = document.getElementById("confirmPassword");
const toggleConfirm = document.getElementById("toggleConfirmPassword");
toggleConfirm.addEventListener("click", function () {
  const isVisible = confirmInput.type === "text";
  confirmInput.type = isVisible ? "password" : "text";
  this.src = isVisible
    ? "Thumbnails/eye closed.png"
    : "Thumbnails/eye opened.png";
});

const signupButton = document.getElementById("signupButton");
signupButton.addEventListener("click", handleSignup);

async function handleSignup() {
  clearErrors();

  const fullName = document.getElementById("fullname").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  let isValid = true;

  if (fullName === "") {
    showError("fullnameError", "Fullname is required");
    isValid = false;
  }

  if (username === "") {
    showError("usernameError", "Username is required");
    isValid = false;
  }

  if (email === "") {
    showError("emailError", "Email is required");
    isValid = false;
  }

  if (password.length < 6) {
    showError("passwordError", "Password must be at least 6 characters");
    isValid = false;
  }

  if (password !== confirmPassword) {
    showError("confirmPasswordError", "Passwords do not match");
    isValid = false;
  }

  if (!isValid) return;

  signupButton.disabled = true;
  signupButton.textContent = "Signing up...";
  signupButton.classList.add("loading");

  try {
    const response = await fetch("http://localhost:8070/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert("Signup failed: " + (errorData.message || "Unknown error"));
      throw new Error("Signup failed");
    }

    const responseData = await response.json();

    localStorage.setItem("userData", JSON.stringify(responseData));

    window.location.href = "profile-setup.html";
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    signupButton.disabled = false;
    signupButton.textContent = "Sign Up";
    signupButton.classList.remove("loading");
  }
}

function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  [
    "fullnameError",
    "usernameError",
    "emailError",
    "passwordError",
    "confirmPasswordError",
  ].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  signupButton.disabled = false;
  signupButton.textContent = "Sign Up";
  signupButton.classList.remove("loading");
}
