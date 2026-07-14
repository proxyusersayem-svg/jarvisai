/**
 * KAISAR AI - WebGL Graphic Scene Boilerplate Pipeline
 */
let scene, camera, renderer, orbitControls;

function initializeThreeEngine() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020512);
    scene.fog = new THREE.FogExp2(0x020512, 0.045);

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.8, 5.0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1c3a, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00AEEF, 1.8);
    keyLight.position.set(5, 12, 6);
    scene.add(keyLight);

    const glowBackLight = new THREE.PointLight(0x00AEEF, 2, 8);
    glowBackLight.position.set(0, 2, -2.5);
    scene.add(glowBackLight);

    // Standard viewport orientation bounds
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2 + 0.05;
    orbitControls.minDistance = 2.5;
    orbitControls.maxDistance = 10;

    window.addEventListener("resize", () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

window.addEventListener("DOMContentLoaded", initializeThreeEngine);
