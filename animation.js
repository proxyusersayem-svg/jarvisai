/**
 * KAISAR AI - Keyframe State & Procedural Physics Animations
 */
let systemClock = new THREE.Clock();
let currentAnimationState = 'idle'; // Options: 'idle', 'talking', 'listening'

function dynamicBoneUpdateLoop() {
    requestAnimationFrame(dynamicBoneUpdateLoop);
    if (!renderer || !scene || !camera) return;

    const absoluteTime = systemClock.getElapsedTime();

    // 1. Natural cloud floating translation loop
    if (ambientClouds) {
        ambientClouds.forEach((cloud, index) => {
            cloud.position.x += 0.003 * (index % 2 === 0 ? 1 : 1.25);
            if (cloud.position.x > 14) cloud.position.x = -14;
        });
    }

    // 2. Procedural Character Motion Controller
    if (assistantCharacter) {
        // Soft idle breathing loop translation
        assistantCharacter.position.y = -0.25 + Math.sin(absoluteTime * 1.6) * 0.015;

        // Blinking simulation logic
        if (Math.floor(absoluteTime) % 5 === 0 && Math.sin(absoluteTime * 12) > 0.8) {
            activeLeftEye.scale.y = 0.1;
            activeRightEye.scale.y = 0.1;
        } else {
            activeLeftEye.scale.y = 1;
            activeRightEye.scale.y = 1;
        }

        // Active State Transitions mapping
        if (currentAnimationState === 'talking') {
            // Rapid mouth sync movement matching vocal frequency
            cyberJaw.position.y = 1.48 - Math.abs(Math.sin(absoluteTime * 18)) * 0.05;
        } else if (currentAnimationState === 'listening') {
            // Attentive tilt
            assistantCharacter.rotation.y = Math.sin(absoluteTime * 5) * 0.08;
            cyberJaw.position.y = 1.5;
        } else {
            // Base rest state idle movement
            assistantCharacter.rotation.y = Math.sin(absoluteTime * 0.4) * 0.04;
            cyberJaw.position.y = 1.5;
        }
    }

    if (orbitControls) orbitControls.update();
    renderer.render(scene, camera);
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(dynamicBoneUpdateLoop, 500);
});
