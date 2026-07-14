/**
 * KAISAR TALKING AI - Main Dynamic Controller
 * Features Included: Authentication, High Performance Three.js Character & Environment, Speech Rec, Synthesis, and AI Integration.
 */

// ==========================================
// 1. FIREBASE ARCHITECTURE INITIALIZATION
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase SDK Compat Mode
if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    firebase.initializeApp(firebaseConfig);
} else {
    console.warn("KAISAR AI: Firebase is uninitialized. Configure valid credentials inside app.js to enable the Auth systems.");
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;

// ==========================================
// 2. DOM VIEWS & SPA CONTROLLERS
// ==========================================
const splashScreen = document.getElementById('splash-screen');
const authScreen = document.getElementById('auth-screen');
const appContainer = document.getElementById('app-container');

const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const loginEmailInput = document.getElementById('login-email');
const loginPassInput = document.getElementById('login-password');
const signupNameInput = document.getElementById('signup-name');
const signupEmailInput = document.getElementById('signup-email');
const signupPassInput = document.getElementById('signup-password');

// Handle Screen Toggling
function switchScreen(target) {
    [splashScreen, authScreen, appContainer].forEach(screen => screen?.classList.remove('active'));
    if (target === 'splash') splashScreen?.classList.add('active');
    if (target === 'auth') authScreen?.classList.add('active');
    if (target === 'app') appContainer?.classList.add('active');
}

// Authentication Forms Toggle
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
});

tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Mock Session for offline / initial testing fallback
let currentUser = null;

// Handle Fire Auth Hook Actions
if (auth) {
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            document.getElementById('prof-name').textContent = user.displayName || "Operator Matrix";
            document.getElementById('prof-email').textContent = user.email;
            document.getElementById('ai-status').textContent = "ONLINE";
            switchScreen('app');
            fetchChatHistory();
        } else {
            currentUser = null;
            switchScreen('auth');
        }
    });

    // Form Submission Actions
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value;
        const password = loginPassInput.value;
        auth.signInWithEmailAndPassword(email, password)
            .catch(err => alert("Operational Warning: " + err.message));
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = signupNameInput.value;
        const email = signupEmailInput.value;
        const password = signupPassInput.value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                return cred.user.updateProfile({ displayName: name });
            })
            .catch(err => alert("Structure Synthesis Failure: " + err.message));
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        auth.signOut();
    });

    document.getElementById('google-signin-btn').addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => alert("Federated Auth Error: " + err.message));
    });
} else {
    // Development Mode Fallback bypass
    setTimeout(() => {
        switchScreen('auth');
    }, 1500);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentUser = { displayName: "Local Operator", email: "guest@kaisar.ai" };
        document.getElementById('prof-name').textContent = currentUser.displayName;
        document.getElementById('prof-email').textContent = currentUser.email;
        switchScreen('app');
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        currentUser = null;
        switchScreen('auth');
    });
}

// ==========================================
// 3. THREE.JS 3D AI ASSISTANT SCENERY
// ==========================================
let scene, camera, renderer, characterGroup, eyeLeft, eyeRight, jawMesh;
let clouds = [];
let animState = 'idle'; // 'idle', 'listening', 'thinking', 'talking'
let clock = new THREE.Clock();

function init3DEnvironment() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    
    // Smooth natural backdrop lighting color palette (dusk transition)
    scene.background = new THREE.Color(0x020512);
    scene.fog = new THREE.FogExp2(0x020512, 0.04);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 100);
    camera.position.set(0, 1.8, 4.5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Dynamic environmental lights
    const ambientLight = new THREE.AmbientLight(0x0a1c3a, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00AEEF, 1.5);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const backGlowLight = new THREE.PointLight(0x00AEEF, 3, 10);
    backGlowLight.position.set(0, 2, -2);
    scene.add(backGlowLight);

    // Create Stylized Procedural Natural Background Elements
    createNaturalBackground();

    // Create Procedural Premium Character
    createAICharacter();

    // Resize viewport responsiveness
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Run active dynamic loops
    renderLoop();
}

function createNaturalBackground() {
    // 1. Mountain Cones
    const mountainGeo = new THREE.ConeGeometry(8, 12, 4);
    const mountainMat = new THREE.MeshPhongMaterial({
        color: 0x071126,
        flatShading: true,
        shininess: 10
    });
    
    const mtLeft = new THREE.Mesh(mountainGeo, mountainMat);
    mtLeft.position.set(-15, 4, -12);
    scene.add(mtLeft);

    const mtRight = new THREE.Mesh(mountainGeo, mountainMat);
    mtRight.position.set(15, 4, -12);
    scene.add(mtRight);

    // 2. Glowing Flow River
    const riverGeo = new THREE.PlaneGeometry(12, 40);
    const riverMat = new THREE.MeshStandardMaterial({
        color: 0x00AEEF,
        emissive: 0x0077b6,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -1, -15);
    scene.add(river);

    // 3. Clouds (Group of smooth Spheres)
    const cloudGeo = new THREE.SphereGeometry(1.5, 8, 8);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0x112345, transparent: true, opacity: 0.5 });
    
    for (let i = 0; i < 5; i++) {
        let cloudGroup = new THREE.Group();
        for (let j = 0; j < 3; j++) {
            let m = new THREE.Mesh(cloudGeo, cloudMat);
            m.position.set(j * 1.2, Math.random() * 0.5, 0);
            cloudGroup.add(m);
        }
        cloudGroup.position.set(-10 + Math.random() * 20, 4 + Math.random() * 2, -10);
        scene.add(cloudGroup);
        clouds.push(cloudGroup);
    }

    // 4. Floating Particles (Magical light particles / cyber flies)
    const pCount = 100;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
        pPos[i] = (Math.random() - 0.5) * 15;
        pPos[i + 1] = Math.random() * 6;
        pPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0x00AEEF,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);
}

function createAICharacter() {
    characterGroup = new THREE.Group();

    // Hierarchical breakdown for a stylized procedural boy model
    // 1. Core Head
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.4 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    characterGroup.add(head);

    // 2. Glowing Visor/Eyes (Boy Stylized Cyborg Aesthetic)
    const eyeGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00efff });
    
    eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-0.12, 1.75, 0.28);
    characterGroup.add(eyeLeft);

    eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(0.12, 1.75, 0.28);
    characterGroup.add(eyeRight);

    // 3. Cyber Hair Base
    const hairGeo = new THREE.ConeGeometry(0.38, 0.4, 4);
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x0f172a, flatShading: true });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.95, -0.05);
    hair.rotation.x = 0.2;
    characterGroup.add(hair);

    // 4. Moving Speaking Jaw (for visible phonetic tracking)
    const jawGeo = new THREE.BoxGeometry(0.15, 0.05, 0.1);
    const jawMat = new THREE.MeshStandardMaterial({ color: 0x00AEEF });
    jawMesh = new THREE.Mesh(jawGeo, jawMat);
    jawMesh.position.set(0, 1.55, 0.22);
    characterGroup.add(jawMesh);

    // 5. Neck
    const neckGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.2);
    const neck = new THREE.Mesh(neckGeo, headMat);
    neck.position.y = 1.45;
    characterGroup.add(neck);

    // 6. Cybernetic Torso (Premium neon jacket mesh)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.2, 0.8, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0A1128, metalness: 0.8, roughness: 0.2 });
    const torso = new THREE.Mesh(bodyGeo, bodyMat);
    torso.position.y = 0.95;
    characterGroup.add(torso);

    // Emissive glowing details on jacket body
    const stripeGeo = new THREE.TorusGeometry(0.31, 0.015, 8, 32);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x00AEEF });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.rotation.x = Math.PI / 2;
    stripe.position.y = 1.1;
    characterGroup.add(stripe);

    characterGroup.position.set(0, -0.3, 1.5);
    scene.add(characterGroup);
}

// 3D Interaction update frame logic
function renderLoop() {
    requestAnimationFrame(renderLoop);
    const time = clock.getElapsedTime();

    // 1. Natural Ambient Background Movement (Clouds floating & river dynamics)
    clouds.forEach((cloud, idx) => {
        cloud.position.x += 0.005 * (idx % 2 === 0 ? 1 : 1.2);
        if (cloud.position.x > 15) cloud.position.x = -15;
    });

    // 2. Character Idle & Natural Breathing Loop
    if (characterGroup) {
        characterGroup.position.y = -0.3 + Math.sin(time * 1.5) * 0.02; // Soft breathing bobbing
        
        // Random eye blink simulation
        if (Math.floor(time) % 4 === 0 && Math.sin(time * 10) > 0.8) {
            eyeLeft.scale.y = 0.1;
            eyeRight.scale.y = 0.1;
        } else {
            eyeLeft.scale.y = 1;
            eyeRight.scale.y = 1;
        }

        // Lip sync dynamic mouth talking simulation when engine is in 'talking' state
        if (animState === 'talking') {
            jawMesh.position.y = 1.53 - Math.abs(Math.sin(time * 18)) * 0.06;
        } else {
            jawMesh.position.y = 1.55; // Neutral closed jaw posture
        }

        // Shift behaviors based on overall internal state logic
        if (animState === 'thinking') {
            characterGroup.rotation.y = Math.sin(time * 4) * 0.1;
        } else {
            characterGroup.rotation.y = Math.sin(time * 0.5) * 0.05; // Standard tiny natural gaze adjustments
        }
    }

    renderer.render(scene, camera);
}

// Ensure WebGL initializations run after elements load
window.addEventListener('DOMContentLoaded', () => {
    init3DEnvironment();
});

// ==========================================
// 4. ACCESSIBILITY SPEECH SYNTHESIS ENGINE
// ==========================================
const synth = window.speechSynthesis;
let voiceSettings = {
    lang: 'en-US',
    rate: 1.0,
    volume: 0.9
};

// Modulate system synthesis voice
function playTTS(text) {
    if (!synth) return;
    synth.cancel(); // Terminate pending voices
    
    const utterance = new THREE.EventDispatcher(); // Reference mock tracking triggers
    const talkUtterance = new SpeechSynthesisUtterance(text);
    
    talkUtterance.lang = voiceSettings.lang;
    talkUtterance.rate = voiceSettings.rate;
    talkUtterance.volume = voiceSettings.volume;

    // Direct interface speech synthesis mapping to character states
    talkUtterance.onstart = () => {
        animState = 'talking';
        toggleWaveVisualizer(true);
    };

    talkUtterance.onend = () => {
        animState = 'idle';
        toggleWaveVisualizer(false);
    };

    talkUtterance.onerror = () => {
        animState = 'idle';
        toggleWaveVisualizer(false);
    };

    // Locate optimal human pronunciation config (male / robotic-accented neutral)
    const voices = synth.getVoices();
    const targetedVoice = voices.find(v => v.lang.includes(voiceSettings.lang) && v.name.toLowerCase().includes('male'));
    if (targetedVoice) talkUtterance.voice = targetedVoice;

    synth.speak(talkUtterance);
}

// Keep lists populated dynamic fallback voice trigger updates
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {};
}

// ==========================================
// 5. HOLD TO TALK SPEECH-TO-TEXT SYSTEM
// ==========================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isRecording = true;
        animState = 'listening';
        document.getElementById('ai-status').textContent = "LISTENING";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-text-input').value = transcript;
        processUserInput(transcript);
    };

    recognition.onerror = () => {
        animState = 'idle';
        document.getElementById('ai-status').textContent = "ONLINE";
    };

    recognition.onend = () => {
        isRecording = false;
        animState = 'idle';
        document.getElementById('ai-status').textContent = "ONLINE";
    };
}

// Bind physical tactile Hold interactions
const micBtn = document.getElementById('hold-mic-btn');

function triggerStartListening() {
    if (!recognition) return alert("Speech API unsupported in this environment. Input via text terminal.");
    recognition.lang = voiceSettings.lang;
    try {
        recognition.start();
        micBtn.classList.add('recording');
    } catch(e) {}
}

function triggerStopListening() {
    if (!recognition) return;
    try {
        recognition.stop();
        micBtn.classList.remove('recording');
    } catch(e) {}
}

micBtn.addEventListener('mousedown', triggerStartListening);
micBtn.addEventListener('mouseup', triggerStopListening);
micBtn.addEventListener('mouseleave', triggerStopListening);

micBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    triggerStartListening();
});
micBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    triggerStopListening();
});

// Keyboard mapping (Hold space bar logic context check)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && !isRecording) {
        e.preventDefault();
        triggerStartListening();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && isRecording) {
        triggerStopListening();
    }
});

// ==========================================
// 6. COGNITIVE SYNAPSE CHAT PIPELINE
// ==========================================
const chatForm = document.getElementById('chat-input-form');
const userInput = document.getElementById('user-text-input');
const chatStream = document.getElementById('chat-stream');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;
    userInput.value = '';
    processUserInput(query);
});

function displayBubble(sender, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', sender);
    
    const content = document.createElement('div');
    content.classList.add('bubble-content');
    content.textContent = text;
    
    const time = document.createElement('span');
    time.classList.add('bubble-time');
    const now = new Date();
    time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    bubble.appendChild(content);
    bubble.appendChild(time);
    chatStream.appendChild(bubble);
    chatStream.scrollTop = chatStream.scrollHeight;
}

function toggleWaveVisualizer(activate) {
    const visualizer = document.getElementById('wave-visualizer');
    if (activate) visualizer.classList.add('active');
    else visualizer.classList.remove('active');
}

// User text stream dynamic pipeline processes
async function processUserInput(query) {
    displayBubble('user', query);
    animState = 'thinking';
    document.getElementById('ai-status').textContent = "THINKING";

    // Standard local sync check (Bangla parsing normalization fallback)
    const containsBangla = /[\u0980-\u09FF]/.test(query);
    if (containsBangla) {
        voiceSettings.lang = 'bn-BD';
        document.getElementById('set-language').value = 'bn-BD';
    }

    try {
        const responseText = await queryCognitiveAI(query);
        displayBubble('ai', responseText);
        playTTS(responseText);
        saveChatToLog(query, responseText);
    } catch(err) {
        const fallbackErr = "Connection synchronization failed. Please check network routing metrics.";
        displayBubble('ai', fallbackErr);
        playTTS(fallbackErr);
    } finally {
        document.getElementById('ai-status').textContent = "ONLINE";
    }
}

// ==========================================
// 7. AI API HANDLER & DIRECT CONNECTOR
// ==========================================
async function queryCognitiveAI(userInputText) {
    /**
     * Provide a direct customizable bridge here. 
     * You can direct the request to an OpenAI-compatible URL, your own local backend, or a serverless function.
     */
    const API_ENDPOINT = "https://api.openai.com/v1/chat/completions"; 
    const DEVELOPER_KEY = "YOUR_AI_API_KEY_HERE";

    if (DEVELOPER_KEY === "YOUR_AI_API_KEY_HERE") {
        // Mock Response fallback for offline/preview testing modes
        return new Promise((resolve) => {
            setTimeout(() => {
                const isBangla = voiceSettings.lang === 'bn-BD';
                if (isBangla) {
                    resolve("আমি কায়সার টকিং এআই। আপনার নির্দেশনা সফলভাবে বিশ্লেষণ করা হয়েছে। আমি আপনাকে কীভাবে সাহায্য করতে পারি?");
                } else {
                    resolve("This is KAISAR AI. System API coordinates are unassigned. Populate 'YOUR_AI_API_KEY_HERE' in app.js to integrate actual live AI completions.");
                }
            }, 1000);
        });
    }

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            { 
                role: "system", 
                content: "You are KAISAR TALKING AI, an elegant, direct, and futuristic young male cognitive virtual assistant. Respond clearly and conversationally. You easily understand and respond in English, Bangla, or code formats." 
            },
            { role: "user", content: userInputText }
        ],
        temperature: 0.7
    };

    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEVELOPER_KEY}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("API operational interface failure.");
    const data = await response.json();
    return data.choices[0].message.content;
}

// ==========================================
// 8. FIRESTORE DATABASE LOG PERSISTENCE
// ==========================================
function saveChatToLog(userPrompt, aiResponse) {
    if (!db || !currentUser) return;
    db.collection("users").doc(currentUser.uid).collection("chats").add({
        prompt: userPrompt,
        response: aiResponse,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn("Firestore Logging Error: ", e));
}

function fetchChatHistory() {
    const logList = document.getElementById('history-log-list');
    if (!db || !currentUser) {
        logList.innerHTML = `<p class="empty-notif">No dynamic active session synced.</p>`;
        return;
    }

    db.collection("users").doc(currentUser.uid).collection("chats")
        .orderBy("timestamp", "desc").limit(10)
        .get()
        .then(snapshot => {
            logList.innerHTML = "";
            if (snapshot.empty) {
                logList.innerHTML = `<p class="empty-notif">Chat logs are clear.</p>`;
                return;
            }
            snapshot.forEach(doc => {
                const chatData = doc.data();
                const logRow = document.createElement('div');
                logRow.className = "info-field";
                logRow.style.borderBottom = "1px solid var(--glass-border)";
                logRow.style.padding = "0.5rem 0";
                logRow.innerHTML = `
                    <label>${chatData.timestamp ? chatData.timestamp.toDate().toLocaleTimeString() : 'Recent'}</label>
                    <p style="font-size:0.9rem; color:#fff;"><strong>Prompt:</strong> ${chatData.prompt}</p>
                    <p style="font-size:0.85rem; color:#9ca3af;"><strong>AI:</strong> ${chatData.response}</p>
                `;
                logList.appendChild(logRow);
            });
        }).catch(() => {
            logList.innerHTML = `<p class="empty-notif">Failed to coordinate history. Verify Firestore rules.</p>`;
        });
}

// ==========================================
// 9. MODALS TOGGLES & SETTINGS MAPPINGS
// ==========================================
function setupModalEvents(btnId, modalId) {
    const btn = document.getElementById(btnId);
    const modal = document.getElementById(modalId);
    const close = modal ? modal.querySelector('.close-modal') : null;

    if (btn && modal) {
        btn.addEventListener('click', () => {
            modal.classList.add('active');
            if (modalId === 'history-modal') fetchChatHistory();
        });
    }
    if (close && modal) {
        close.addEventListener('click', () => modal.classList.remove('active'));
    }
}

setupModalEvents('open-settings-btn', 'settings-modal');
setupModalEvents('open-profile-btn', 'profile-modal');
setupModalEvents('open-history-btn', 'history-modal');

// Sync operational language configurations
document.getElementById('set-language').addEventListener('change', (e) => {
    voiceSettings.lang = e.target.value;
});
document.getElementById('set-voice-speed').addEventListener('input', (e) => {
    voiceSettings.rate = parseFloat(e.target.value);
});
document.getElementById('set-volume').addEventListener('input', (e) => {
    voiceSettings.volume = parseFloat(e.target.value);
});
