/**
 * KAISAR AI - Core Screen Transition and UI Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash-screen");
    if (splash) {
        splash.classList.add("active");
        setTimeout(() => {
            splash.classList.remove("active");
        }, 1200);
    }
});
