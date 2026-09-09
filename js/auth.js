// ==========================================================================
// URBANWEAR AUTHENTICATION LOGIC (js/auth.js)
// ==========================================================================

// Register Form Handler
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      gender: gender || "Not Specified",
      email: email,
      password: password,
      role: "user",
    };

    const result = Store.addUser(newUser);
    if (!result.success) {
      alert(result.message);
      return;
    }

    // Auto login newly registered customer
    Store.setCurrentUser(newUser);
    alert(
      "Welcome to UrbanWear, " +
        firstName +
        "! Your account was created successfully.",
    );
    window.location.href = "shop.html";
  });
}

// Login Form Handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const users = Store.getUsers();
    const user = users.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );

    if (!user) {
      alert("Invalid email or password. Please try again.");
      return;
    }

    Store.setCurrentUser(user);

    if (user.role && user.role.toLowerCase() === "admin") {
      alert("Welcome back, Admin!");
      window.location.href = "dashboard.html";
    } else {
      alert("Welcome back, " + (user.first_name || "Shopper") + "!");
      window.location.href = "shop.html";
    }
  });
}

// Quick fill helper for testing
function fillAdminCredentials() {
  const emailInput = document.getElementById("loginEmail");
  const passInput = document.getElementById("loginPassword");
  if (emailInput && passInput) {
    emailInput.value = "admin@gmail.com";
    passInput.value = "admin123";
  }
}
