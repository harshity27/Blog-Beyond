document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const signUpForm = document.querySelector(".sign-up form");
    const signInForm = document.querySelector(".sign-in form");

    // Toggle between Sign In and Sign Up
    document.getElementById("login").addEventListener("click", () => {
        container.classList.remove("active");
    });

    document.getElementById("register").addEventListener("click", () => {
        container.classList.add("active");
    });

    // Sign Up Logic
    signUpForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = signUpForm.querySelector("input[placeholder='Name']").value.trim();
        const email = signUpForm.querySelector("input[placeholder='Enter E-mail']").value.trim();
        const password = signUpForm.querySelector("input[placeholder='Enter Password']").value.trim();

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some(user => user.email === email)) {
            alert("User with this email already exists.");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful. Please log in.");
        container.classList.remove("active");
    });

    // Sign In Logic
    signInForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = signInForm.querySelector("input[placeholder='Enter E-mail']").value.trim();
        const password = signInForm.querySelector("input[placeholder='Enter Password']").value.trim();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert("Login successful.");
            window.location.href = "./Website/trail.html"; // Redirect to the main page
        } else {
            alert("Invalid email or password.");
        }
    });
});