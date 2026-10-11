import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCanvas = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene, Camera, Renderer setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 7);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        mount.appendChild(renderer.domElement);

        // ═══════════════════════════════════════════════════════════
        // LUXURY LIGHTING RIG
        // Studio lights creating chrome reflections & subtle gold sheen
        // ═══════════════════════════════════════════════════════════
        const ambientLight = new THREE.AmbientLight(0xfaf5ee, 1.2);
        scene.add(ambientLight);

        // Directional Key Light (Neutral Chrome highlight)
        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(5, 8, 6);
        scene.add(dirLight);

        // Subtle Gold Accent Light for warm reflections
        const goldPointLight = new THREE.PointLight(0xC9A227, 2.5, 20);
        goldPointLight.position.set(-4, 3, 3);
        scene.add(goldPointLight);

        // Cool Rim Light for metallic edges
        const rimLight = new THREE.DirectionalLight(0xdde4f0, 1.5);
        rimLight.position.set(-5, -4, -2);
        scene.add(rimLight);

        // ═══════════════════════════════════════════════════════════
        // SHADED MATERIALS (Chrome, Dark Metallic, Gold & Burgundy)
        // ═══════════════════════════════════════════════════════════
        const chromeMaterial = new THREE.MeshStandardMaterial({
            color: 0xdedfe3,
            metalness: 0.92,
            roughness: 0.15,
        });

        const darkMetallicMaterial = new THREE.MeshStandardMaterial({
            color: 0x242426,
            metalness: 0.85,
            roughness: 0.28,
        });

        const burgundyMaterial = new THREE.MeshStandardMaterial({
            color: 0x6E1720,
            metalness: 0.25,
            roughness: 0.35,
        });

        const goldAccentMaterial = new THREE.MeshStandardMaterial({
            color: 0xC9A227,
            metalness: 0.88,
            roughness: 0.22,
        });

        // Main Tools Container
        const toolsGroup = new THREE.Group();
        scene.add(toolsGroup);

        // ───────────────────────────────────────────────────────────
        // 1. STRAIGHT RAZOR (Milano Classic)
        // ───────────────────────────────────────────────────────────
        const razorGroup = new THREE.Group();

        // Steel Razor Blade (Chrome / Silver)
        const bladeGeo = new THREE.BoxGeometry(0.04, 1.8, 0.45);
        const razorBlade = new THREE.Mesh(bladeGeo, chromeMaterial);
        razorBlade.position.set(0, 0.9, 0);
        razorGroup.add(razorBlade);

        // Razor Spine / Tang (Dark Metallic)
        const tangGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.6, 16);
        const tang = new THREE.Mesh(tangGeo, darkMetallicMaterial);
        tang.position.set(0, -0.2, -0.15);
        tang.rotation.x = Math.PI / 6;
        razorGroup.add(tang);

        // Pivot Pin (Luxury Gold)
        const pivotGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
        const pivot = new THREE.Mesh(pivotGeo, goldAccentMaterial);
        pivot.rotation.z = Math.PI / 2;
        pivot.position.set(0, 0, -0.15);
        razorGroup.add(pivot);

        // Razor Handle / Scales (Deep Burgundy Accent)
        const handleGeo = new THREE.BoxGeometry(0.06, 2.0, 0.35);
        const handle = new THREE.Mesh(handleGeo, burgundyMaterial);
        handle.position.set(0.02, -1.0, -0.05);
        handle.rotation.z = 0.25;
        razorGroup.add(handle);

        razorGroup.position.set(2.4, 0.8, -0.5);
        razorGroup.rotation.set(0.4, -0.6, -0.3);
        toolsGroup.add(razorGroup);

        // ───────────────────────────────────────────────────────────
        // 2. PRECISION BARBER SHEARS / SCISSORS
        // ───────────────────────────────────────────────────────────
        const shearsGroup = new THREE.Group();

        // Blade 1
        const shearBlade1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 2.2, 16), chromeMaterial);
        shearBlade1.position.set(-0.1, 1.1, 0);
        shearBlade1.rotation.z = -0.12;
        shearsGroup.add(shearBlade1);

        // Blade 2
        const shearBlade2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 2.2, 16), chromeMaterial);
        shearBlade2.position.set(0.1, 1.1, 0);
        shearBlade2.rotation.z = 0.12;
        shearsGroup.add(shearBlade2);

        // Central Tension Screw (Gold Accent)
        const tensionScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), goldAccentMaterial);
        tensionScrew.rotation.x = Math.PI / 2;
        shearsGroup.add(tensionScrew);

        // Finger Ring 1 (Dark Metallic with Burgundy Insert)
        const ringGeo1 = new THREE.TorusGeometry(0.24, 0.05, 12, 24);
        const ring1 = new THREE.Mesh(ringGeo1, darkMetallicMaterial);
        ring1.position.set(-0.35, -0.65, 0);
        shearsGroup.add(ring1);

        const insert1 = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 12, 24), burgundyMaterial);
        insert1.position.set(-0.35, -0.65, 0);
        shearsGroup.add(insert1);

        // Finger Ring 2
        const ring2 = new THREE.Mesh(ringGeo1, darkMetallicMaterial);
        ring2.position.set(0.35, -0.65, 0);
        shearsGroup.add(ring2);

        const insert2 = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 12, 24), burgundyMaterial);
        insert2.position.set(0.35, -0.65, 0);
        shearsGroup.add(insert2);

        shearsGroup.position.set(-2.6, -0.4, -0.8);
        shearsGroup.rotation.set(-0.3, 0.5, 0.4);
        toolsGroup.add(shearsGroup);

        // ───────────────────────────────────────────────────────────
        // 3. BARBER COMB (Dark Metallic Titanium + Gold Accent)
        // ───────────────────────────────────────────────────────────
        const combGroup = new THREE.Group();

        // Comb Spine
        const spineGeo = new THREE.BoxGeometry(2.4, 0.18, 0.06);
        const spine = new THREE.Mesh(spineGeo, darkMetallicMaterial);
        combGroup.add(spine);

        // Gold Inlay Line
        const inlayGeo = new THREE.BoxGeometry(2.2, 0.03, 0.07);
        const inlay = new THREE.Mesh(inlayGeo, goldAccentMaterial);
        inlay.position.set(0, 0.05, 0);
        combGroup.add(inlay);

        // Teeth (24 precision teeth)
        const teethCount = 24;
        const toothWidth = 0.035;
        const toothLength = 0.55;
        for (let i = 0; i < teethCount; i++) {
            const tooth = new THREE.Mesh(
                new THREE.BoxGeometry(toothWidth, toothLength, 0.05),
                darkMetallicMaterial
            );
            const xPos = -1.1 + (i * (2.2 / teethCount));
            tooth.position.set(xPos, -0.32, 0);
            combGroup.add(tooth);
        }

        combGroup.position.set(1.5, -1.8, -1.2);
        combGroup.rotation.set(0.5, 0.3, -0.4);
        toolsGroup.add(combGroup);

        // ═══════════════════════════════════════════════════════════
        // SUBTLE AMBIENT SPECKS (Warm Silver & Muted Gold)
        // ═══════════════════════════════════════════════════════════
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 16;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: new THREE.Color(0xC9A227),
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);

        // Mouse Parallax
        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
        };
        window.addEventListener('mousemove', onMouseMove);

        // Animation Loop
        let animationFrameId;
        const timer = new THREE.Timer();
        let isVisible = true;

        const render = (timestamp) => {
            if (!isVisible) return;

            timer.update(timestamp);
            const elapsed = timer.getElapsed();

            // Smooth floating & rotation of barber tools
            toolsGroup.rotation.y = THREE.MathUtils.lerp(toolsGroup.rotation.y, mouseX * 0.5, 0.05);
            toolsGroup.rotation.x = THREE.MathUtils.lerp(toolsGroup.rotation.x, mouseY * 0.5, 0.05);

            razorGroup.rotation.y = -0.6 + Math.sin(elapsed * 0.6) * 0.12;
            razorGroup.position.y = 0.8 + Math.cos(elapsed * 0.7) * 0.08;

            shearsGroup.rotation.x = -0.3 + Math.cos(elapsed * 0.5) * 0.1;
            shearsGroup.position.y = -0.4 + Math.sin(elapsed * 0.6) * 0.08;

            combGroup.rotation.z = -0.4 + Math.sin(elapsed * 0.4) * 0.08;
            combGroup.position.y = -1.8 + Math.cos(elapsed * 0.5) * 0.06;

            // Particles drift
            particleMesh.rotation.y = elapsed * 0.03;
            particleMesh.rotation.x = elapsed * 0.01;

            renderer.render(scene, camera);
            animationFrameId = window.requestAnimationFrame(render);
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            isVisible = entry.isIntersecting;

            if (isVisible) {
                if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
                render();
            } else {
                if (animationFrameId) {
                    window.cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        }, { threshold: 0 });

        if (mount) observer.observe(mount);

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (mount) observer.unobserve(mount);
            if (animationFrameId) window.cancelAnimationFrame(animationFrameId);

            if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }

            particlesGeometry.dispose();
            particlesMaterial.dispose();
            bladeGeo.dispose();
            tangGeo.dispose();
            pivotGeo.dispose();
            handleGeo.dispose();
            ringGeo1.dispose();
            spineGeo.dispose();
            inlayGeo.dispose();
            chromeMaterial.dispose();
            darkMetallicMaterial.dispose();
            burgundyMaterial.dispose();
            goldAccentMaterial.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            className="absolute top-0 left-0 w-full h-full z-1 pointer-events-none opacity-80"
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        />
    );
};

export default HeroCanvas;
