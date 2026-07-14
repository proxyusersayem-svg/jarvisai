/**
 * KAISAR AI - Procedural Natural Environment Scene Generator
 */
let ambientClouds = [];

function generateSceneryElements() {
    if (typeof scene === 'undefined') return;

    // 1. Stylized Mountains Landscape
    const mtGeometry = new THREE.ConeGeometry(7, 10, 4);
    const mtMaterial = new THREE.MeshPhongMaterial({
        color: 0x071126,
        flatShading: true,
        shininess: 8
    });

    const forestLeft = new THREE.Mesh(mtGeometry, mtMaterial);
    forestLeft.position.set(-14, 3, -11);
    scene.add(forestLeft);

    const forestRight = new THREE.Mesh(mtGeometry, mtMaterial);
    forestRight.position.set(14, 3, -11);
    scene.add(forestRight);

    // 2. Animated Flowing Neon Waterway
    const waterGeometry = new THREE.PlaneGeometry(12, 35);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x00AEEF,
        emissive: 0x005b96,
        roughness: 0.15,
        transparent: true,
        opacity: 0.75
    });
    const landscapeRiver = new THREE.Mesh(waterGeometry, waterMaterial);
    landscapeRiver.rotation.x = -Math.PI / 2;
    landscapeRiver.position.set(0, -1, -12);
    scene.add(landscapeRiver);

    // 3. Dynamic Soft Atmospheric Clouds
    const sphereBlock = new THREE.SphereGeometry(1.4, 8, 8);
    const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0x112345, transparent: true, opacity: 0.45 });

    for (let i = 0; i < 4; i++) {
        const cloudCluster = new THREE.Group();
        for (let j = 0; j < 3; j++) {
            const part = new THREE.Mesh(sphereBlock, cloudMaterial);
            part.position.set(j * 1.1, Math.random() * 0.4, 0);
            cloudCluster.add(part);
        }
        cloudCluster.position.set(-12 + Math.random() * 24, 3.8 + Math.random() * 1.5, -9);
        scene.add(cloudCluster);
        ambientClouds.push(cloudCluster);
    }

    // 4. Floating Bio-luminescent Energy Sparks
    const count = 80;
    const arrayGeometry = new THREE.BufferGeometry();
    const coordinateSet = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
        coordinateSet[i] = (Math.random() - 0.5) * 16;
        coordinateSet[i + 1] = Math.random() * 5.5;
        coordinateSet[i + 2] = (Math.random() - 0.5) * 8;
    }
    arrayGeometry.setAttribute('position', new THREE.BufferAttribute(coordinateSet, 3));
    const sparkMaterial = new THREE.PointsMaterial({
        color: 0x00AEEF,
        size: 0.045,
        transparent: true,
        opacity: 0.75
    });
    const sparks = new THREE.Points(arrayGeometry, sparkMaterial);
    scene.add(sparks);
}

window.addEventListener("DOMContentLoaded", () => {
    // Small delay to ensure WebGL setup completes
    setTimeout(generateSceneryElements, 200);
});
