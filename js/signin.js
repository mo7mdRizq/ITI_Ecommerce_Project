// admin username and password
const ADMIN_EMAIL = "admin@modevia.com";
const ADMIN_PASSWORD = "adminpass123"; 
const ADMIN_NAME = "Modevia Admin";

function getUsers() {
    // b call data of users
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function showError(message) {
    const el = document.getElementById("errorMessage");
    if (el) el.textContent = message;
    else alert(message);
}

function getFieldValue(form, selector) {
    const el = form.querySelector(selector);
    return el ? el.value.trim() : "";
}

function setupSignIn() {
    const form = document.querySelector("#loginForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        showError(""); 

        const email = getFieldValue(form, "#email").toLowerCase();
        const password = getFieldValue(form, "#password");

        if (!email || !password) {
            showError("Kindly enter your email and password.");
            return;
        }

        // admin verification
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

            const adminUser = {
                id: "u_admin",
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                role: 'admin' 
            };

            localStorage.setItem("currentUser", JSON.stringify(adminUser));
            alert(`Hello ${ADMIN_NAME}!`);

            window.location.href = "../admin/admin-dashboard.html"; 
            return; 
        }

        // call users
        const users = getUsers();
        
        // search for users
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            
            localStorage.setItem("currentUser", JSON.stringify(user));

            alert(`Welcome ${user.name}Your role: ${user.role}`);

            if (user.role === 'seller') {
                window.location.href = "../../pages/seller/seller-dashboard.html"; 
            } else {
                window.location.href = "../testHome.html"; 
            }

        } else {
            showError("The email or password you entered is incorrect.");
        }
    });
}

function setupPasswordToggle() {
    
    const ICON_HIDE_SRC = "../../assets/icons/icons_hide.png";
    const ICON_SHOW_SRC = "../../assets/icons/icons_show.png";

   
    const toggle = document.getElementById("togglePassword"); 
    const passwordField = document.getElementById("password");
    const icon = document.getElementById("hideIcon"); 
    
    if (!toggle || !passwordField || !icon) return;

    passwordField.type = "password";
    icon.src = ICON_HIDE_SRC;

    toggle.addEventListener("click", () => {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            icon.src = ICON_SHOW_SRC; 
        } else {
            passwordField.type = "password";
            icon.src = ICON_HIDE_SRC; 
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setupSignIn();
    setupPasswordToggle(); 
});