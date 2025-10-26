//3amlt setup to emailjs
const EMAILJS_PUBLIC_KEY = "PWnOYcx745mwQ_YZz";
const EMAILJS_SERVICE_ID = "service_rhuwy09";
const EMAILJS_TEMPLATE_ID = "template_buowrat";

(function initEmailJS() {
  if (!window.emailjs) {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      if (window.emailjs && EMAILJS_PUBLIC_KEY) emailjs.init(EMAILJS_PUBLIC_KEY);
    };
    document.head.appendChild(s);
  } else {
    if (EMAILJS_PUBLIC_KEY) emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();


function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getPending() {
  return JSON.parse(localStorage.getItem("pendingUser") || "null");
}
function savePending(p) {
  localStorage.setItem("pendingUser", JSON.stringify(p));
}
function clearPending() {
  localStorage.removeItem("pendingUser");
}

function getPendingReset() {
  return JSON.parse(localStorage.getItem("pendingReset") || "null");
}
function savePendingReset(p) {
  localStorage.setItem("pendingReset", JSON.stringify(p));
}
function clearPendingReset() {
  localStorage.removeItem("pendingReset");
}

function emailExists(email) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return true;
  const p = getPending();
  if (p && p.email === email) return true;
  return false;
}

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function showError(message) {
  const el = document.getElementById("errorMessage");
  if (el) el.textContent = message;
  else alert(message);
}

function getFieldValue(form, selectors) {
  for (const s of selectors) {
    const el = form.querySelector(s);
    if (el && el.value !== undefined) return el.value.trim();
  }
  return "";
}

// b3ml validate ll number
function validatePhoneNumber(number) {
  const regex = /^(010|011|012|015)\d{8}$/;
  return regex.test(number);
}

// b send l code ll email
function sendVerificationEmail(email, name, code) {
  if (!window.emailjs) {
    return Promise.reject(new Error("EmailJS library not loaded"));
  }
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: email,
    to_name: name,
    verify_code: code
  });
}

// sign up set up function
function setupSignup(formSelector, defaultRole = "user") {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");


    const name = getFieldValue(form, ["#fullName", "input[placeholder='Owner name']", "input[placeholder='Full name']", "input[name='name']"]) || "";
    const storeName = getFieldValue(form, ["input[placeholder='Store name']", "input[name='store']"]) || "";
    const email = getFieldValue(form, ["#email", "input[type='email']"]).toLowerCase() || "";
    const password = getFieldValue(form, ["#password", "input[type='password']"]) || "";
    const confirmPassword = getFieldValue(form, ["#confirmPassword", "input[placeholder='Confirm password']"]) || "";

    const phoneNumber = getFieldValue(form, ["#phoneNumber", "input[type='tel']", "input[placeholder='Phone number']"]) || "";


    if (!email || !password || !name) {
      showError("Please fill in all required fields.");
      return;
    }


    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      showError("Phone number must be 11 digits and start with 010, 011, 012, or 015.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }
    if (confirmPassword && confirmPassword !== password) {
      showError("Password not match.");
      return;
    }
    if (emailExists(email)) {
      showError("Email is already in use.");
      return;
    }


    const code = makeCode();
    const expires = Date.now() + 15 * 60 * 1000;
    const role = defaultRole;

    const pending = {
      id: "p_" + Date.now(),
      name: name || storeName || "User",
      email,
      password,
      phoneNumber,
      role,
      code,
      codeExpiresAt: expires,
      createdAt: Date.now()
    };

    savePending(pending);

    // send code to your email
    try {
      await sendVerificationEmail(email, pending.name, code);
      alert("Activation code has been sent to your email. Please check your inbox or spam folder.");
      window.location.href = "verification.html"; //000000
    } catch (err) {
      console.error("EmailJS send error:", err);
      clearPending();
      showError("An error occurred while sending the email. Please check your EmailJS settings or try again later.");
    }
  });
}


// forget pass
function setupForgotPassword(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError("");

    const email = getFieldValue(form, ["#email", "input[type='email']"]).toLowerCase() || "";

    if (!email) {
      showError("Please enter your email address.");
      return;
    }

    const users = getUsers();
    const userToReset = users.find(u => u.email === email);

    if (!userToReset) {
      showError("This email address is not registered.");
      return;
    }

    // code for new pass
    const code = makeCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const pendingReset = {
      email: userToReset.email,
      name: userToReset.name,
      code: code,
      codeExpiresAt: expires,
    };

    savePendingReset(pendingReset);

    // resend code
    try {
      await sendVerificationEmail(email, userToReset.name, code);
      alert("A password reset code has been sent to your email.");

    
      window.location.href = "passreset.html?mode=reset"; 
    } catch (err) {
      console.error("EmailJS send error:", err);
      clearPendingReset();
      showError("An error occurred while sending the email. Please try again later.");
    }
  });
}

// setup verification
function setupVerification() {
  const form = document.querySelector("#verificationForm");
  if (!form) return;

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  let pendingData, clearFunction;
  let redirectSuccess;

  if (mode === 'reset') {
    pendingData = getPendingReset();
    clearFunction = clearPendingReset;
    
    redirectSuccess = "newpass.html"; //000000
  } else {
    pendingData = getPending(); 
    clearFunction = clearPending;
    redirectSuccess = pendingData ? (pendingData.role === 'seller' ? "../../pages/seller/seller-dashboard.html" : "welcome.html") : "welcome.html"; //00000000000
  }


  if (!pendingData) {
    showError("No activation or reset request is currently pending. Please start over.");
    return;
  }

  const inputs = form.querySelectorAll('.verifyCode');

  
  inputs.forEach((input, index) => {
    input.addEventListener('keyup', (e) => {
      if (e.key === 'Backspace' && input.value === '') {
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
      else if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
      else if (input.value.length === 1 && index === inputs.length - 1) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) submitButton.focus();
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

    const enteredCode = Array.from(inputs).map(input => input.value).join('');

    if (enteredCode.length !== 6 || isNaN(enteredCode)) {
      showError("Please enter a valid 6-digit code.");
      return;
    }

    if (enteredCode === pendingData.code) {
      if (Date.now() > pendingData.codeExpiresAt) {
        clearFunction();
        showError("The code has expired. Please start the process again.");
        return;
      }

      if (mode === 'reset') {
        alert("Verification successful. You can now set your new password.");
        window.location.href = redirectSuccess; 
      } else {
        
        const newUser = {
         
          id: "u_" + Date.now(),
          name: pendingData.name,
          email: pendingData.email,
          password: pendingData.password,
          phoneNumber: pendingData.phoneNumber,
          role: pendingData.role,
          createdAt: pendingData.createdAt,
          verifiedAt: Date.now()
        };
        const users = getUsers();
        users.push(newUser);
        saveUsers(users);
        clearFunction();
        alert("Password verified successfully.");
        window.location.href = redirectSuccess; // -> seller-dashboard.html or welcome.html
      }

    } else {
      showError("The code is incorrect. Please try again.");
    }
  });
}

// send code again
async function setupResendCode(linkSelector) {
  const link = document.querySelector(linkSelector);
  if (!link) return;

  link.addEventListener("click", async (e) => {
    e.preventDefault();
    showError("");

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const pendingData = mode === 'reset' ? getPendingReset() : getPending();
    const clearFunction = mode === 'reset' ? clearPendingReset : clearPending;

    if (!pendingData) {
      showError("No request is currently pending.");
      return;
    }

    const newCode = makeCode();
    const newExpires = Date.now() + 15 * 60 * 1000;

    pendingData.code = newCode;
    pendingData.codeExpiresAt = newExpires;

    if (mode === 'reset') savePendingReset(pendingData);
    else savePending(pendingData);

    // send new code
    try {
      await sendVerificationEmail(pendingData.email, pendingData.name, newCode);
      alert("A new code has been sent successfully. It will be valid for 15 minutes.");

      link.textContent = "Sent (please wait 60 seconds).";
      link.style.pointerEvents = 'none';

      setTimeout(() => {
        link.textContent = "Resend code";
        link.style.pointerEvents = 'auto';
      }, 60000);

    } catch (err) {
      console.error("EmailJS Resend error:", err);
      showError("There was an error sending the new email. Please verify your settings.");
    }
  });
}


function setupResetPassword(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  const pendingReset = getPendingReset();
  if (!pendingReset) {
    window.location.href = "signin.html"; //0000000
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    showError("");

  
    const newPassword = getFieldValue(form, ["#password"]).trim();
    const confirmPassword = getFieldValue(form, ["#confirmPassword"]).trim();

    if (newPassword.length < 6) {
      showError("The new password must be at least 6 characters.");
      return;
    }
    if (confirmPassword !== newPassword) {
      showError("Passwords do not match.");
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === pendingReset.email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      saveUsers(users);

      clearPendingReset();
      // alert("Password reset successful. You can now sign in.");
      window.location.href = "finishednewpass.html"; //000000
    } else {
      clearPendingReset();
      showError("An unexpected error occurred. Please try signing in again.");
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  // switch between seller and user
  if (document.getElementById("goUser") && document.getElementById("goSeller")) {
    document.getElementById("goUser").addEventListener("click", () => window.location.href = "signupuser.html"); //0000000
    document.getElementById("goSeller").addEventListener("click", () => window.location.href = "signupseller.html"); //00000
  }

  // form of seller
  if (document.querySelector("#signupSellerForm")) {
    setupSignup("#signupSellerForm", "seller");
  }

  // form of user
  if (document.querySelector("#signupUserForm")) {
    setupSignup("#signupUserForm", "user");
  }

  // form of verification
  if (document.querySelector("#verificationForm")) {
    setupVerification();
  }

 // form of forgot pass
  if (document.querySelector("#forgotPasswordForm")) {
    setupForgotPassword("#forgotPasswordForm");
  }

  // new pass
  if (document.querySelector("#resetPasswordForm")) {
    setupResetPassword("#resetPasswordForm");
  }

  // resend code button
  if (document.querySelector("#resendCodeLink")) {
    setupResendCode("#resendCodeLink");
  }

  // toggle password

  const ICON_HIDE_SRC = "../../assets/icons/icons_hide.png"; //000000
  const ICON_SHOW_SRC = "../../assets/icons/icons_show.png"; ///0000000

  function setupPasswordToggle(toggleId, passwordId, iconId) {
    const toggle = document.getElementById(toggleId);
    const passwordField = document.getElementById(passwordId);
    const icon = document.getElementById(iconId);

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

  setupPasswordToggle("togglePassword1", "password", "hideIcon");

  setupPasswordToggle("togglePassword2", "confirmPassword", "hideIcon1");
});