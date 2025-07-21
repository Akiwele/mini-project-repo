document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(".login-button");
  const identifierInput = document.getElementById("identifier");
  const passwordInput = document.getElementById("password");
  const form = document.querySelector("form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = "Signing In...";
    loginButton.classList.add("loading");

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();

    if (!identifier || !password) {
      alert("Please enter your email/username and password.");
      loginButton.disabled = false;
      loginButton.textContent = "Sign In";
      loginButton.classList.remove("loading");
      return;
    }

    const payload = {
      identifier,
      password,
    };

    try {
      const response = await fetch(
        "https://talentloop-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend responded:", errorText);
        throw new Error("Invalid login credentials.");
      }

      const result = await response.json();

      localStorage.setItem("userData", JSON.stringify(result));

      window.location.replace("explore.html");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please check your credentials and try again.");

      loginButton.disabled = false;
      loginButton.textContent = "Sign In";
      loginButton.classList.remove("loading");
    }
  });
});
