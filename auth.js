/**
 * KAISAR AI - Modular Authentication & Routing Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    const isMainAppPage = document.getElementById("canvas-container") !== null;

    // Direct redirection logic to manage continuous auth persistence state
    if (auth) {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (!isMainAppPage && (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html"))) {
                    window.location.href = "index.html";
                }
            } else {
                if (isMainAppPage) {
                    window.location.href = "login.html";
                }
            }
        });
    }

    // Google Authentication Hook
    const googleBtn = document.getElementById("google-btn");
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            if (!auth) return alert("Firebase setup incomplete.");
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(() => { window.location.href = "index.html"; })
                .catch(err => alert("Google Synchronization Failure: " + err.message));
        });
    }

    // Standard Submit Sign In form bindings
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            auth.signInWithEmailAndPassword(email, password)
                .then(() => { window.location.href = "index.html"; })
                .catch(err => alert("Authorization Warning: " + err.message));
        });
    }

    // Standard Profile Synthesis signup registration
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signup-name").value;
            const email = document.getElementById("signup-email").value;
            const password = document.getElementById("signup-password").value;

            auth.createUserWithEmailAndPassword(email, password)
                .then(cred => {
                    return cred.user.updateProfile({ displayName: name });
                })
                .then(() => { window.location.href = "index.html"; })
                .catch(err => alert("Profile Synthesis Failure: " + err.message));
        });
    }

    // Recovery Key Generation trigger
    const forgotPwdLink = document.getElementById("forgot-password");
    if (forgotPwdLink) {
        forgotPwdLink.addEventListener("click", (e) => {
            e.preventDefault();
            const email = prompt("Enter register identity (Email) for key recovery:");
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => alert("Recovery parameters dispatched to email registration."))
                    .catch(err => alert("Recovery pipeline initialization failed: " + err.message));
            }
        });
    }

    // Standard Logout binder
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (auth) {
                auth.signOut().then(() => { window.location.href = "login.html"; });
            }
        });
    }
});
