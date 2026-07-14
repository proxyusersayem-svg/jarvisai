/**
 * KAISAR AI - Procedural Cyborg Character Mesh Construction
 */
let assistantCharacter, cyberJaw, activeLeftEye, activeRightEye;

function synthesizeVirtualHuman() {
    if (typeof scene === 'undefined') return;

    assistantCharacter = new THREE.Group();

    // 1. Cyber Skin Core Head
    const coreHeadGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const cyberSkinMat = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.35 });
    const headMesh = new THREE.Mesh(coreHeadGeo, cyberSkinMat);
    headMesh.position.y = 1.65;
    assistantCharacter.add(headMesh);

    // 2. Visor Glow Eyes
    const optEyeGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const laserEyeMat = new THREE.MeshBasicMaterial({ color: 0x00efff });

    activeLeftEye = new THREE.Mesh(optEyeGeo, laserEyeMat);
    activeLeftEye.position.set(-0.11, 1.7, 0.28);
    assistantCharacter.add(activeLeftEye);

    activeRightEye = new THREE.Mesh(optEyeGeo, laserEyeMat);
    activeRightEye.position.set(0.11, 1.7, 0.28);
    assistantCharacter.add(activeRightEye);

    // 3. Cyber Spiky Hair Trim
    const spikyHairGeo = new THREE.ConeGeometry(0.37, 0.42, 5);
    const hairMat = new THREE.MeshPhongMaterial({ color: 0x0a1128, flatShading: true });
    const geometricHair = new THREE.Mesh(spikyHairGeo, hairMat);
    geometricHair.position.set(0, 1.9, -0.05);
    geometricHair.rotation.x = 0.15;
    assistantCharacter.add(geometricHair);

    // 4. Articulating Jaw (Phonetic movement)
    const jawBlockGeo = new THREE.BoxGeometry(0.14, 0.04, 0.09);
    const emissiveJawMat = new THREE.MeshStandardMaterial({ color: 0x00AEEF });
    cyberJaw = new THREE.Mesh(jawBlockGeo, emissiveJawMat);
    cyberJaw.position.set(0, 1.5, 0.23);
    assistantCharacter.add(cyberJaw);

    // 5. High-Collar Cybernet Jacket & Torso
    const torsoBlockGeo = new THREE.CylinderGeometry(0.28, 0.18, 0.75, 32);
    const dynamicTorsoMat = new THREE.MeshStandardMaterial({ color: 0x050b18, metalness: 0.95, roughness: 0.15 });
    const structuralTorso = new THREE.Mesh(torsoBlockGeo, dynamicTorsoMat);
    structuralTorso.position.y = 0.95;
    assistantCharacter.add(structuralTorso);

    // 6. Glowing Neon Emissive Collar Stripe
    const stripeTorusGeo = new THREE.TorusGeometry(0.29, 0.015, 8, 32);
    const emissiveNeonMat = new THREE.MeshBasicMaterial({ color: 0x00AEEF });
    const glowingRingCollar = new THREE.Mesh(stripeTorusGeo, emissiveNeonMat);
    glowingRingCollar.rotation.x = Math.PI / 2;
    glowingRingCollar.position.y = 1.15;
    assistantCharacter.add(glowingRingCollar);

    // Standardize viewport translation
    assistantCharacter.position.set(0, -0.25, 1.6);
    scene.add(assistantCharacter);
}

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(synthesizeVirtualHuman, 250);
});
