/**
 * KAISAR AI - Vocal Output Synthesis (Text To Speech) Engine
 */
const synthEngine = window.speechSynthesis;

function speakNeuralOutput(phraseText) {
    if (!synthEngine) return;
    synthEngine.cancel(); // Flush lingering sound buffers

    const configurationSpeed = parseFloat(localStorage.getItem('vSpeed')) || 1.0;
    const configurationVolume = parseFloat(localStorage.getItem('vVolume')) || 0.9;
    const currentLocality = localStorage.getItem('vLanguage') || 'en-US';

    const speakingSession = new SpeechSynthesisUtterance(phraseText);
    speakingSession.lang = currentLocality;
    speakingSession.rate = configurationSpeed;
    speakingSession.volume = configurationVolume;

    speakingSession.onstart = () => {
        currentAnimationState = 'talking';
        const wave = document.getElementById("voice-spectrum");
        if (wave) wave.classList.add("active");
    };

    speakingSession.onend = () => {
        currentAnimationState = 'idle';
        const wave = document.getElementById("voice-spectrum");
        if (wave) wave.classList.remove("active");
    };

    speakingSession.onerror = () => {
        currentAnimationState = 'idle';
        const wave = document.getElementById("voice-spectrum");
        if (wave) wave.classList.remove("active");
    };

    // Auto-detect optimal available dynamic localized voices
    const availableSystemVoices = synthEngine.getVoices();
    const activePronouncerVoice = availableSystemVoices.find(v => v.lang.includes(currentLocality));
    if (activePronouncerVoice) speakingSession.voice = activePronouncerVoice;

    synthEngine.speak(speakingSession);
}

if (synthEngine && synthEngine.onvoiceschanged !== undefined) {
    synthEngine.onvoiceschanged = () => {};
}
