/**
 * KAISAR AI - Dialog rendering & Message Stream Controller
 */
document.addEventListener("DOMContentLoaded", () => {
    const userTextForm = document.getElementById("chat-input-form");
    if (userTextForm) {
        userTextForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const textElement = document.getElementById("user-text-input");
            const queryValue = textElement.value.trim();
            if (!queryValue) return;
            textElement.value = "";
            processUserQuery(queryValue);
        });
    }

    // Default intro message on initialize
    setTimeout(() => {
        appendDialogBubble('ai', "System connection established. Ready to assist.");
    }, 1500);
});

function appendDialogBubble(roleType, renderableMessage) {
    const stream = document.getElementById("chat-stream");
    if (!stream) return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("chat-bubble", roleType);

    const messageContent = document.createElement("div");
    messageContent.textContent = renderableMessage;

    wrapper.appendChild(messageContent);
    stream.appendChild(wrapper);
    stream.scrollTop = stream.scrollHeight;
}

async function processUserQuery(promptValue) {
    appendDialogBubble('user', promptValue);
    currentAnimationState = 'thinking';
    document.getElementById('ai-status').textContent = "THINKING";
    document.getElementById('ai-status').style.background = "rgba(245,158,11,0.2)";

    try {
        const textResponse = await queryCoreAI(promptValue);
        appendDialogBubble('ai', textResponse);
        speakNeuralOutput(textResponse);
    } catch (err) {
        const warnText = "Operational error. Unable to coordinate complete analysis.";
        appendDialogBubble('ai', warnText);
        speakNeuralOutput(warnText);
    } finally {
        document.getElementById('ai-status').textContent = "ONLINE";
        document.getElementById('ai-status').style.background = "rgba(16,185,129,0.15)";
    }
}
