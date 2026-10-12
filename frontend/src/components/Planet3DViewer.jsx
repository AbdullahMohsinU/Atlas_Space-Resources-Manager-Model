import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Procedural texture generator for high-realism planetary surfaces
function createPlanetTexture(planetName) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (planetName === 'Earth') {
    // Deep Ocean Blue Base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
    oceanGrad.addColorStop(0, '#0a2342');
    oceanGrad.addColorStop(0.5, '#0b3954');
    oceanGrad.addColorStop(1, '#0a2342');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Continents
    ctx.fillStyle = '#2d6a4f';
    const continents = [
      { x: 180, y: 160, r: 85 }, // N America
      { x: 260, y: 320, r: 75 }, // S America
      { x: 500, y: 160, r: 65 }, // Europe
      { x: 520, y: 280, r: 90 }, // Africa
      { x: 680, y: 170, r: 120 }, // Asia
      { x: 800, y: 350, r: 65 }  // Australia
    ];
    continents.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      // sub islands
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(c.x + Math.sin(i) * c.r * 1.1, c.y + Math.cos(i) * c.r * 0.9, c.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#40916c';
        ctx.fill();
      }
    });

    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 40);
    ctx.fillRect(0, 475, 1024, 37);

    // Swirling white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 35; i++) {
      const cx = (i * 37) % 1024;
      const cy = 60 + ((i * 43) % 380);
      ctx.beginPath();
      ctx.ellipse(cx, cy, 70 + (i % 30), 16 + (i % 10), Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planetName === 'Mars') {
    // Red-ochre dust base
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#7f2915');
    grad.addColorStop(0.5, '#c1440e');
    grad.addColorStop(1, '#662211');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Darker basalt plains & Valles Marineris canyon
    ctx.fillStyle = '#4a1508';
    for (let i = 0; i < 40; i++) {
      const x = (i * 73) % 1024;
      const y = 100 + ((i * 59) % 320);
      ctx.beginPath();
      ctx.ellipse(x, y, 60, 25, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Great Valles Marineris rift
    ctx.strokeStyle = '#2d0c04';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(350, 260);
    ctx.bezierCurveTo(460, 275, 600, 240, 720, 270);
    ctx.stroke();

    // Olympus Mons caldera
    ctx.fillStyle = '#9e3810';
    ctx.beginPath();
    ctx.arc(280, 210, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a1107';
    ctx.beginPath();
    ctx.arc(280, 210, 16, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice cap (CO2 dry ice)
    ctx.fillStyle = '#f0f4f8';
    ctx.beginPath();
    ctx.ellipse(512, 18, 160, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(512, 496, 130, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (planetName === 'Moon') {
    // Silver/Grey Anorthosite base
    ctx.fillStyle = '#8a8d91';
    ctx.fillRect(0, 0, 1024, 512);

    // Lunar Maria (dark basalt plains)
    ctx.fillStyle = '#525458';
    const maria = [
      { x: 300, y: 190, r: 80 }, // Mare Imbrium
      { x: 440, y: 220, r: 65 }, // Mare Serenitatis
      { x: 550, y: 240, r: 70 }, // Mare Tranquillitatis
      { x: 230, y: 290, r: 90 }  // Oceanus Procellarum
    ];
    maria.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Impact craters with white rays
    for (let i = 0; i < 90; i++) {
      const cx = (i * 89) % 1024;
      const cy = 40 + ((i * 47) % 430);
      const rad = 5 + (i % 15);
      ctx.fillStyle = '#3d3e40';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#c2c5c9';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  } else if (planetName === 'Europa') {
    // Smooth ice crust with fractured lineae
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#d8eef8');
    grad.addColorStop(0.5, '#edf7fc');
    grad.addColorStop(1, '#c5e4f3');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Reddish-brown mineral fracture lines (cracks from tidal flexing)
    ctx.strokeStyle = 'rgba(150, 75, 40, 0.65)';
    for (let i = 0; i < 35; i++) {
      ctx.lineWidth = 2 + (i % 4);
      ctx.beginPath();
      const sx = (i * 91) % 1024;
      const sy = (i * 37) % 512;
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx + 120, sy - 60, sx + 240, sy + 80, sx + 340, sy);
      ctx.stroke();
    }
  } else if (planetName === 'Titan') {
    // Dense orange-gold photochemical smog
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#b86b1b');
    grad.addColorStop(0.5, '#e0892c');
    grad.addColorStop(1, '#8f4f10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Liquid methane/ethane polar lakes (Kraken Mare)
    ctx.fillStyle = '#1c150c';
    ctx.beginPath();
    ctx.ellipse(320, 60, 90, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(650, 75, 75, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Haze bands
    ctx.fillStyle = 'rgba(255, 180, 80, 0.2)';
    for (let y = 50; y < 480; y += 40) {
      ctx.fillRect(0, y, 1024, 18);
    }
  } else if (planetName === 'Venus') {
    // Sulphuric acid dense cloud tops
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#c9933b');
    grad.addColorStop(0.5, '#eec068');
    grad.addColorStop(1, '#b07b27');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Thick supersonic chevron storm clouds
    ctx.strokeStyle = 'rgba(120, 70, 20, 0.35)';
    ctx.lineWidth = 12;
    for (let i = 0; i < 25; i++) {
      const y = 40 + i * 18;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(512, y + 45, 1024, y);
      ctx.stroke();
    }
  } else {
    // Enceladus (Pristine bright white ice with south polar tiger stripes)
    ctx.fillStyle = '#f4f8fb';
    ctx.fillRect(0, 0, 1024, 512);

    // Cyan South Pole Tiger Stripes (cryovolcanic fissures)
    ctx.strokeStyle = '#00c3ff';
    ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      const sy = 440 + i * 8;
      ctx.beginPath();
      ctx.moveTo(380, sy);
      ctx.quadraticCurveTo(512, sy - 15, 640, sy);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

const Planet3DViewer = ({ planetName = 'Mars', autoRotate = true, onSectorClick }) => {
  const mountRef = useRef(null);
  const sphereRef = useRef(null);
  const cloudsRef = useRef(null);
  const ringRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  const [scanSector, setScanSector] = useState('EQUATORIAL-01');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Starfield particles in the background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 40;
      starCoords[i + 1] = (Math.random() - 0.5) * 40;
      starCoords[i + 2] = -5 - Math.random() * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.08, transparent: true, opacity: 0.7 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Main Planetary Sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = createPlanetTexture(planetName);
    
    // Shader or MeshStandardMaterial for realistic space lighting
    let roughness = 0.8;
    let metalness = 0.1;
    if (planetName === 'Earth') { roughness = 0.45; metalness = 0.2; }
    if (planetName === 'Europa' || planetName === 'Enceladus') { roughness = 0.25; metalness = 0.3; }

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: roughness,
      metalness: metalness
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Atmosphere Glow Ring
    const atmosphereColors = {
      Earth: 0x00aaff,
      Mars: 0xff6622,
      Moon: 0x8899aa,
      Europa: 0x00d4ff,
      Titan: 0xff9900,
      Venus: 0xffcc44,
      Enceladus: 0x66e5ff
    };
    const atmoColor = atmosphereColors[planetName] || 0x00e5ff;

    const atmoGeo = new THREE.RingGeometry(1.05, 1.35, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: atmoColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    });
    const atmoRing = new THREE.Mesh(atmoGeo, atmoMat);
    atmoRing.rotation.x = Math.PI / 2.4;
    scene.add(atmoRing);
    ringRef.current = atmoRing;

    // Telemetry Orbit Grid Marker
    const orbitTorusGeo = new THREE.TorusGeometry(1.22, 0.005, 16, 100);
    const orbitTorusMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.35 });
    const orbitTorus = new THREE.Mesh(orbitTorusGeo, orbitTorusMat);
    orbitTorus.rotation.x = Math.PI / 2;
    scene.add(orbitTorus);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a1626, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.4);
    sunLight.position.set(4, 2, 3);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(atmoColor, 1.1);
    rimLight.position.set(-4, -1, -2);
    scene.add(rimLight);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (sphereRef.current && autoRotate && !isDraggingRef.current) {
        sphereRef.current.rotation.y += 0.0035;
      }
      if (ringRef.current) {
        ringRef.current.rotation.z += 0.001;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Interaction for 3D Orbit Drag
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !sphereRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      sphereRef.current.rotation.y += deltaX * 0.008;
      sphereRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container) container.innerHTML = '';
    };
  }, [planetName, autoRotate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', overflow: 'hidden' }}>
      {/* 3D Canvas Mounting Container */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Cybernetic Telemetry HUD Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '11px',
          color: '#00e5ff',
          background: 'rgba(10, 16, 26, 0.75)',
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          backdropFilter: 'blur(6px)',
          pointerEvents: 'none'
        }}
      >
        <div>TARGET: {planetName.toUpperCase()}</div>
        <div style={{ color: '#88a0b0', fontSize: '9px', marginTop: '2px' }}>
          LAT: +18.44° // LON: -77.51° // ORBIT RES: 4K
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '9px',
            color: '#00e676',
            background: 'rgba(0, 230, 118, 0.1)',
            padding: '4px 8px',
            borderRadius: '2px',
            border: '1px solid #00e676',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', animation: 'blink 1.2s infinite' }} />
          3D SIMULATOR ACTIVE
        </div>
        <div
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '9px',
            color: '#80909a',
            background: 'rgba(10, 16, 26, 0.65)',
            padding: '4px 8px',
            borderRadius: '2px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          DRAG TO ROTATE 360°
        </div>
      </div>

      {/* Radar Crosshairs in Corners */}
      <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: '2px solid #00e5ff', borderRight: '2px solid #00e5ff', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: '2px solid #00e5ff', borderRight: '2px solid #00e5ff', pointerEvents: 'none' }} />
    </div>
  );
};

export default Planet3DViewer;
