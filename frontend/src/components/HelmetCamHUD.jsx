import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Crosshair, Compass, ShieldAlert } from 'lucide-react';

const HelmetCamHUD = ({ planetName = 'Mars', sol = 184, sector = 'DELTA-9' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width = canvas.parentElement.clientWidth || 600;
      const h = canvas.height = 180;

      // 1. Planetary Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (planetName === 'Mars') {
        skyGrad.addColorStop(0, '#2c1208');
        skyGrad.addColorStop(0.4, '#732c12');
        skyGrad.addColorStop(0.7, '#b84918');
        skyGrad.addColorStop(1, '#e5803d');
      } else if (planetName === 'Europa' || planetName === 'Enceladus') {
        skyGrad.addColorStop(0, '#040b17');
        skyGrad.addColorStop(0.5, '#0c223d');
        skyGrad.addColorStop(1, '#1e4875');
      } else {
        skyGrad.addColorStop(0, '#0d0f14');
        skyGrad.addColorStop(0.6, '#182438');
        skyGrad.addColorStop(1, '#2c436b');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Distant Sun with Atmospheric Flare
      const sunX = w * 0.75;
      const sunY = h * 0.42;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, 80);
      sunGlow.addColorStop(0, 'rgba(255, 255, 240, 0.95)');
      sunGlow.addColorStop(0.2, 'rgba(255, 210, 140, 0.6)');
      sunGlow.addColorStop(1, 'rgba(255, 140, 60, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
      ctx.fill();

      // 3. Martian Mountain Ridges / Dunes (Parallax layers)
      // Distant Ridge
      ctx.fillStyle = planetName === 'Mars' ? '#4d1c0c' : '#0c1a2e';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 30) {
        const y = h * 0.58 + Math.sin(x * 0.008 + 1) * 22 + Math.cos(x * 0.015) * 12;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Midground Sand Dunes
      ctx.fillStyle = planetName === 'Mars' ? '#6e2710' : '#142947';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) {
        const y = h * 0.68 + Math.sin(x * 0.012 + 2) * 18 + Math.cos(x * 0.02) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Foreground Rocky Terrain
      ctx.fillStyle = planetName === 'Mars' ? '#913313' : '#1c3961';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 15) {
        const y = h * 0.82 + Math.sin(x * 0.02 + 3) * 10;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Boulders & Regolith Rocks
      ctx.fillStyle = '#1f0802';
      const rocks = [
        { x: w * 0.15, y: h * 0.88, rx: 16, ry: 9 },
        { x: w * 0.38, y: h * 0.92, rx: 12, ry: 6 },
        { x: w * 0.85, y: h * 0.86, rx: 22, ry: 12 },
      ];
      rocks.forEach(r => {
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Helmet Visor Curvature Shadow Overlay (Hexagonal/Elliptical HUD Mask)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, w * 0.48, h * 0.46, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Vignette on outer corners
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.5, w / 2, h / 2, w * 0.65);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(5, 10, 20, 0.95)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      // 5. Tactical Avionics Pitch Ladder in Center
      const midX = w / 2;
      const midY = h / 2;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
      ctx.lineWidth = 1.5;

      // Horizon line with center gap
      ctx.beginPath();
      ctx.moveTo(midX - 50, midY);
      ctx.lineTo(midX - 15, midY);
      ctx.moveTo(midX + 15, midY);
      ctx.lineTo(midX + 50, midY);
      ctx.stroke();

      // Center crosshair
      ctx.beginPath();
      ctx.arc(midX, midY, 6, 0, Math.PI * 2);
      ctx.stroke();

      // Pitch bars
      [-25, 25].forEach(dy => {
        ctx.beginPath();
        ctx.moveTo(midX - 25, midY + dy);
        ctx.lineTo(midX - 10, midY + dy);
        ctx.lineTo(midX - 10, midY + dy + 4);
        ctx.moveTo(midX + 25, midY + dy);
        ctx.lineTo(midX + 10, midY + dy);
        ctx.lineTo(midX + 10, midY + dy + 4);
        ctx.stroke();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [planetName]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '180px',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 229, 255, 0.35)',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)'
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Top Left: HUD Lock & Azimuth Telemetry */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 12,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '9px',
          color: '#00e5ff',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        <div>AZ: 034.4° NNE // ELEV: +12.1°</div>
        <div style={{ color: '#80909a' }}>HUD LOCK // BIO-LINK OK</div>
      </div>

      {/* Top Right: Vital Diagnostics Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 12,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '9px',
          color: '#00e676',
          textAlign: 'right'
        }}
      >
        <div>CABIN: 4.31 PSI [NOM]</div>
        <div style={{ color: '#00e5ff' }}>O2 LOOP: 98.2% PURE</div>
      </div>

      {/* Center Bottom: ARES Mission Tag (Matching reference image) */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(6, 12, 22, 0.85)',
          padding: '4px 14px',
          borderRadius: '20px',
          border: '1px solid #00e5ff',
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
        }}
      >
        <Radio size={12} color="#00e5ff" style={{ animation: 'blink 1.5s infinite' }} />
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#FFFFFF', fontWeight: 'bold', letterSpacing: '1px' }}>
          ARES-07 SOL {sol} // SECTOR {sector} // TELEMETRY SYNCED
        </span>
      </div>
    </div>
  );
};

export default HelmetCamHUD;
