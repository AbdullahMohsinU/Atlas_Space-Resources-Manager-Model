import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/soundEffects';

const Suit3DScanner = ({ activeZone = 'CORE', onZoneSelect, gloveAlert = true }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const suitGroupRef = useRef(null);
  const laserScannerRef = useRef(null);
  const rightGloveRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const [scanMode, setScanMode] = useState('ANATOMY'); // 'ANATOMY', 'THERMAL', 'PRESSURE', 'BIO_CHIP'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Holographic Reticle Radar & Grid Floor
    const gridHelper = new THREE.GridHelper(3.5, 14, 0x00e5ff, 0x132238);
    gridHelper.position.y = -1.75;
    scene.add(gridHelper);

    // Hologram circular pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.2, 1.25, 0.08, 32);
    const pedestalMat = new THREE.MeshBasicMaterial({ color: 0x091424, transparent: true, opacity: 0.85 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.74;
    scene.add(pedestal);

    const pedRingGeo = new THREE.RingGeometry(1.15, 1.2, 32);
    const pedRingMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide });
    const pedRing = new THREE.Mesh(pedRingGeo, pedRingMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.y = -1.69;
    scene.add(pedRing);

    // 4. Construct High-Detail Procedural Space Suit Mesh Group
    const suitGroup = new THREE.Group();
    suitGroupRef.current = suitGroup;
    scene.add(suitGroup);

    // Dynamic Materials based on Scan Mode
    const baseMat = new THREE.MeshStandardMaterial({
      color: scanMode === 'THERMAL' ? 0x1a3350 : 0x0f1826,
      roughness: 0.45,
      metalness: 0.65,
      wireframe: false
    });

    const armorMat = new THREE.MeshStandardMaterial({
      color: scanMode === 'THERMAL' ? 0x245575 : 0x16253b,
      roughness: 0.3,
      metalness: 0.8
    });

    const glowCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: scanMode === 'ANATOMY' ? 0.35 : 0.15
    });

    const goldVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0xffb703,
      emissive: 0xaa7000,
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    // Thermal Heat Map Material for Right Glove
    const thermalAlertMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff5500,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });

    // --- A. HELMET & VISOR ---
    const helmetGroup = new THREE.Group();
    helmetGroup.position.set(0, 1.1, 0);

    const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), armorMat);
    helmetDome.scale.set(1, 1.1, 1.05);
    helmetGroup.add(helmetDome);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 24, 0, Math.PI, 0, Math.PI), goldVisorMat);
    visor.rotation.y = -Math.PI / 2;
    visor.position.set(0, 0.02, 0.15);
    visor.scale.set(0.9, 0.75, 0.85);
    helmetGroup.add(visor);

    // Helmet Ocular Array Antennas
    const antGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
    const antMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const ant1 = new THREE.Mesh(antGeo, antMat);
    ant1.position.set(-0.35, 0.2, -0.05);
    ant1.rotation.z = Math.PI / 8;
    helmetGroup.add(ant1);

    suitGroup.add(helmetGroup);

    // --- B. TORSO & CORE PLSS ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.45, 0);

    // Chest Breastplate
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.85, 0.45), armorMat);
    torsoGroup.add(chest);

    // Bio-Chip Matrix Port on Chest Center
    const chipPort = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.05), new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x00aacc, emissiveIntensity: 0.5 }));
    chipPort.position.set(0, 0.12, 0.24);
    torsoGroup.add(chipPort);

    // PLSS Backpack on back
    const plssPack = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.95, 0.35), baseMat);
    plssPack.position.set(0, 0.05, -0.38);
    torsoGroup.add(plssPack);

    // Dual Cryo Tanks on PLSS
    const tankGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 16);
    const tank1 = new THREE.Mesh(tankGeo, armorMat);
    tank1.position.set(-0.2, 0.08, -0.52);
    torsoGroup.add(tank1);
    const tank2 = new THREE.Mesh(tankGeo, armorMat);
    tank2.position.set(0.2, 0.08, -0.52);
    torsoGroup.add(tank2);

    suitGroup.add(torsoGroup);

    // --- C. ARMS & GLOVES ---
    // Left Arm
    const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), armorMat);
    lShoulder.position.set(-0.52, 0.75, 0);
    suitGroup.add(lShoulder);

    const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.55, 16), baseMat);
    lArm.position.set(-0.6, 0.42, 0.05);
    lArm.rotation.z = Math.PI / 14;
    suitGroup.add(lArm);

    const lGlove = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 0.15), armorMat);
    lGlove.position.set(-0.68, 0.08, 0.1);
    suitGroup.add(lGlove);

    // Right Arm (With Thermal Sensor Drift Warning!)
    const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), armorMat);
    rShoulder.position.set(0.52, 0.75, 0);
    suitGroup.add(rShoulder);

    const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.55, 16), baseMat);
    rArm.position.set(0.6, 0.42, 0.05);
    rArm.rotation.z = -Math.PI / 14;
    suitGroup.add(rArm);

    const rGlove = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.22, 0.15),
      (scanMode === 'THERMAL' || gloveAlert) ? thermalAlertMat : armorMat
    );
    rGlove.position.set(0.68, 0.08, 0.1);
    suitGroup.add(rGlove);
    rightGloveRef.current = rGlove;

    // --- D. LEGS & MAGNETIC BOOTS ---
    // Left Leg
    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.65, 16), armorMat);
    lThigh.position.set(-0.22, -0.32, 0);
    suitGroup.add(lThigh);

    const lCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.65, 16), baseMat);
    lCalf.position.set(-0.22, -0.92, 0);
    suitGroup.add(lCalf);

    const lBoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.45), armorMat);
    lBoot.position.set(-0.22, -1.45, 0.08);
    suitGroup.add(lBoot);

    // Right Leg
    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.65, 16), armorMat);
    rThigh.position.set(0.22, -0.32, 0);
    suitGroup.add(rThigh);

    const rCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.65, 16), baseMat);
    rCalf.position.set(0.22, -0.92, 0);
    suitGroup.add(rCalf);

    const rBoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.45), armorMat);
    rBoot.position.set(0.22, -1.45, 0.08);
    suitGroup.add(rBoot);

    // Wireframe Hologram Ghost Shell
    const wireframeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 3.2, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, wireframe: true, transparent: true, opacity: 0.12 })
    );
    wireframeMesh.position.y = -0.1;
    suitGroup.add(wireframeMesh);

    // 5. Vertical Laser Scanner Ring Plane
    const laserRingGeo = new THREE.RingGeometry(0.95, 1.25, 48);
    const laserRingMat = new THREE.MeshBasicMaterial({
      color: scanMode === 'THERMAL' ? 0xff5500 : 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const laserScanner = new THREE.Mesh(laserRingGeo, laserRingMat);
    laserScanner.rotation.x = Math.PI / 2;
    scene.add(laserScanner);
    laserScannerRef.current = laserScanner;

    // 6. Lights
    const ambient = new THREE.AmbientLight(0x0c192c, 2.0);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00e5ff, 2.5);
    cyanRim.position.set(-3, 1, -2);
    scene.add(cyanRim);

    // 7. Interactive Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Oscillating vertical scanner laser beam
      if (laserScannerRef.current && scannerActive) {
        laserScannerRef.current.position.y = Math.sin(elapsedTime * 2.2) * 1.5;
      }

      // Gentle auto-rotation when user is not dragging
      if (suitGroupRef.current && !isDraggingRef.current) {
        suitGroupRef.current.rotation.y += 0.004;
      }

      // Right Glove thermal alert pulse
      if (rightGloveRef.current && (scanMode === 'THERMAL' || gloveAlert)) {
        const pulse = 0.5 + Math.sin(elapsedTime * 6) * 0.4;
        rightGloveRef.current.material.emissiveIntensity = pulse;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 8. Mouse Drag & Touch Interactions
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !suitGroupRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      suitGroupRef.current.rotation.y += dx * 0.008;
      suitGroupRef.current.rotation.x += dy * 0.004;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      camera.position.z = Math.max(2.5, Math.min(6.5, camera.position.z + e.deltaY * 0.003));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nw ? nh : 400);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [scanMode, scannerActive, gloveAlert]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px' }}>
      {/* 3D Canvas Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Top Scan Mode Control Toggles */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          display: 'flex',
          gap: '6px',
          zIndex: 10
        }}
      >
        {[
          { id: 'ANATOMY', label: 'MK-IX ANATOMY' },
          { id: 'THERMAL', label: 'THERMAL SCAN (IR)' },
          { id: 'PRESSURE', label: 'PRESSURE LOOP' },
          { id: 'BIO_CHIP', label: 'NEURAL CHIP BUS' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setScanMode(m.id);
              sound.playClick();
            }}
            style={{
              padding: '5px 10px',
              borderRadius: '2px',
              background: scanMode === m.id ? (m.id === 'THERMAL' ? '#ff5500' : '#00e5ff') : 'rgba(8, 14, 25, 0.85)',
              border: `1px solid ${scanMode === m.id ? '#FFFFFF' : 'rgba(0, 229, 255, 0.3)'}`,
              color: scanMode === m.id ? '#000000' : '#00e5ff',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '9px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: scanMode === m.id ? '0 0 10px rgba(0, 229, 255, 0.4)' : 'none'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Real-time Telemetry Coordinates & Laser Status */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '9px'
        }}
      >
        <span
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid #00e5ff',
            color: '#00e5ff',
            padding: '3px 8px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff', animation: 'blink 1.2s infinite' }} />
          LASER VOLUMETRIC SCAN: ACTIVE
        </span>

        <span
          style={{
            background: 'rgba(255, 145, 0, 0.12)',
            border: '1px solid #ff9100',
            color: '#ff9100',
            padding: '3px 8px',
            borderRadius: '2px'
          }}
        >
          THERMAL DRIFT SENSOR #RTA-24 (+1.8°C)
        </span>
      </div>

      {/* Floating Callout Badges on Top Right */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '9px',
          textAlign: 'right',
          pointerEvents: 'none'
        }}
      >
        <div style={{ color: '#00e5ff', background: 'rgba(9, 16, 29, 0.8)', padding: '4px 8px', borderRight: '2px solid #00e5ff' }}>
          VISOR HUD: 12ms SYNC
        </div>
        <div style={{ color: '#00e676', background: 'rgba(9, 16, 29, 0.8)', padding: '4px 8px', borderRight: '2px solid #00e676' }}>
          CORE BIO-CHIP: 500Hz LOCKED
        </div>
        <div style={{ color: '#ff9100', background: 'rgba(9, 16, 29, 0.8)', padding: '4px 8px', borderRight: '2px solid #ff9100' }}>
          RIGHT GLOVE: +1.8°C DRIFT
        </div>
      </div>
    </div>
  );
};

export default Suit3DScanner;
