// =====================================
// GET USERS
// =====================================

let users = JSON.parse(
    localStorage.getItem("users") || "[]"
);


// =====================================
// DEFAULT ADMIN
// =====================================

const adminExists = users.some(
    user => user.email === "admin@gmail.com"
);

if (!adminExists) {

    users.push({

        first_name: "Admin",

        last_name: "User",

        gender: "Male",

        email: "admin@gmail.com",

        password: "admin123",

        role: "admin"

    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}


// =====================================
// REGISTER
// =====================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const first_name =
                document.getElementById(
                    "first_name"
                ).value.trim();

            const last_name =
                document.getElementById(
                    "last_name"
                ).value.trim();

            const gender =
                document.getElementById(
                    "gender"
                ).value;

            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            // Check existing email

            const exists = users.some(
                user =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


            if (exists) {

                alert(
                    "Email already registered!"
                );

                return;
            }


            // Create user

            const newUser = {

                first_name,

                last_name,

                gender,

                email,

                password,

                role: "user"

            };


            users.push(newUser);


            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            alert(
                "Registration successful!"
            );


            window.location.href =
                "login.html";
        }
    );
}


// =====================================
// LOGIN
// =====================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const user = users.find(
                user =>
                    user.email.toLowerCase() ===
                    email.toLowerCase() &&
                    user.password === password
            );


            if (!user) {

                alert(
                    "Wrong email or password!"
                );

                return;
            }


            // Save logged-in user

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );


            // Admin -> Staff Dashboard

            if (user.role === "admin") {

                window.location.href =
                    "staff.html";

            } else {

                window.location.href =
                    "index.html";
            }

        }
    );
}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";
}