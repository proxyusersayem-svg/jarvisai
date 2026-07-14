/**
 * KAISAR AI - Web Speech Recognition (Hold to Talk) System
 */
const UserSpeechEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
let systemRecognizer = null;
let holdsTalkState = false;

function initializeSpeechAPI() {
    if (!UserSpeechEngine) {
        console.warn("Vocal detection framework is unsupported inside current client.");
        return;
    }

    systemRecognizer = new UserSpeechEngine();
    systemRecognizer.continuous = false;
    systemRecognizer.interimResults = false;

    systemRecognizer.onstart = () => {
        holdsTalkState = true;
        currentAnimationState = 'listening';
        document.getElementById('ai-status').textContent = "LISTENING";
        document.getElementById('ai-status').style.background = "rgba(0,174,239,0.2)";
    };

    systemRecognizer.onresult = (event) => {
        const queryTextResult = event.results[0][0].transcript;
        const targetInput = document.getElementById('user-text-input');
        if (targetInput) {
            targetInput.value = queryTextResult;
            processUserQuery(queryTextResult);
        }
    };

    systemRecognizer.onend = () => {
        holdsTalkState = false;
        currentAnimationState = 'idle';
        document.getElementById('ai-status').textContent = "ONLINE";
        document.getElementById('ai-status').style.background = "rgba(16, 185, 129, 0.15)";
    };
}

document.addEventListener("DOMContentLoaded", () => {
    initializeSpeechAPI();

    const microphoneTrigger = document.getElementById("hold-mic-btn");
    if (microphoneTrigger && systemRecognizer) {
        const startAction = (e) => {
            e.preventDefault();
            systemRecognizer.lang = localStorage.getItem('vLanguage') || 'en-US';
            try {
                systemRecognizer.start();
                microphoneTrigger.classList.add("active");
            } catch (err) {}
        };

        const stopAction = (e) => {
            e.preventDefault();
            try {
                systemRecognizer.stop();
                microphoneTrigger.classList.remove("active");
            } catch (err) {}
        };

        microphoneTrigger.addEventListener("mousedown", startAction);
        microphoneTrigger.addEventListener("mouseup", stopAction);
        microphoneTrigger.addEventListener("mouseleave", stopAction);
        microphoneTrigger.addEventListener("touchstart", startAction);
        microphoneTrigger.addEventListener("touchend", stopAction);
    }
});
