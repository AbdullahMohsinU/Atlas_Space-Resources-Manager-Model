import React from 'react';
import { motion } from 'framer-motion';

const AstronautSVG = ({ activeZone = 'CORE', onZoneClick, gloveAlert = true }) => {
  const defaultStroke = "rgba(0, 229, 255, 0.45)";
  const highlightStroke = "#00e5ff";
  const alertStroke = "#ff9100";

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 340 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 12px rgba(0, 229, 255, 0.25))' }}
      >
        <defs>
          <radialGradient id="targetGrid" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Concentric radar rings matching reference image */}
        <circle cx="170" cy="180" r="145" fill="url(#targetGrid)" stroke="rgba(0, 229, 255, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="170" cy="180" r="105" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="170" cy="180" r="60" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Diagonal Reticle Crosshair */}
        <line x1="170" y1="20" x2="170" y2="340" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="20" y1="180" x2="320" y2="180" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="1" strokeDasharray="6 6" />

        {/* 1. HELMET & VISOR */}
        <g
          onClick={() => onZoneClick && onZoneClick('HELMET')}
          style={{ cursor: 'pointer' }}
        >
          {/* Outer Helmet Dome */}
          <ellipse
            cx="170"
            cy="70"
            rx="24"
            ry="16"
            fill="#0b1424"
            stroke={activeZone === 'HELMET' ? highlightStroke : defaultStroke}
            strokeWidth={activeZone === 'HELMET' ? "2.5" : "1.8"}
          />
          {/* Inner Cyan Visor */}
          <ellipse
            cx="170"
            cy="70"
            rx="16"
            ry="9"
            fill="rgba(0, 229, 255, 0.25)"
            stroke="#00e5ff"
            strokeWidth="1.5"
          />
          {/* Visor HUD Dot */}
          <circle cx="170" cy="70" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Callout: VISOR_HUD */}
        <g>
          <line x1="188" y1="68" x2="235" y2="52" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 2" />
          <text x="238" y="55" fill="#00e5ff" fontFamily="Roboto Mono" fontSize="9" fontWeight="bold">VISOR_HUD</text>
        </g>

        {/* 2. TORSO & CORE PLSS */}
        <g
          onClick={() => onZoneClick && onZoneClick('CORE')}
          style={{ cursor: 'pointer' }}
        >
          {/* Torso Box */}
          <rect
            x="146"
            y="94"
            width="48"
            height="68"
            rx="4"
            fill="#09101d"
            stroke={activeZone === 'CORE' ? highlightStroke : defaultStroke}
            strokeWidth={activeZone === 'CORE' ? "2.5" : "1.8"}
          />
          {/* Chest Bio-Chip Matrix Port */}
          <rect x="157" y="110" width="26" height="24" rx="2" fill="rgba(0, 229, 255, 0.15)" stroke="#00e5ff" strokeWidth="1" />
          <motion.circle
            cx="170"
            cy="122"
            r="4.5"
            fill="#00e5ff"
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </g>

        {/* Callout: CORE_PLSS */}
        <g>
          <line x1="146" y1="120" x2="95" y2="105" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 2" />
          <text x="50" y="108" fill="#00e5ff" fontFamily="Roboto Mono" fontSize="9" fontWeight="bold">CORE_PLSS</text>
        </g>

        {/* 3. ARMS & SHOULDERS */}
        <g
          onClick={() => onZoneClick && onZoneClick('ARMS')}
          style={{ cursor: 'pointer' }}
        >
          {/* Left Arm */}
          <line x1="146" y1="102" x2="110" y2="155" stroke={activeZone === 'ARMS' ? highlightStroke : defaultStroke} strokeWidth="3" strokeLinecap="round" />
          <circle cx="110" cy="155" r="4.5" fill="#0b1424" stroke="#00e5ff" strokeWidth="1.5" />
          <line x1="110" y1="155" x2="94" y2="205" stroke={activeZone === 'ARMS' ? highlightStroke : defaultStroke} strokeWidth="3" strokeLinecap="round" />
          <circle cx="94" cy="205" r="5" fill="#00e5ff" />

          {/* Right Arm */}
          <line x1="194" y1="102" x2="230" y2="155" stroke={activeZone === 'ARMS' ? highlightStroke : defaultStroke} strokeWidth="3" strokeLinecap="round" />
          <circle cx="230" cy="155" r="4.5" fill="#0b1424" stroke="#00e5ff" strokeWidth="1.5" />
          <line x1="230" y1="155" x2="246" y2="205" stroke={activeZone === 'ARMS' ? highlightStroke : defaultStroke} strokeWidth="3" strokeLinecap="round" />
          
          {/* Thermal Drift Alert Glove on Right Arm (Matching reference screenshot) */}
          <motion.circle
            cx="246"
            cy="205"
            r="8"
            fill="rgba(255, 145, 0, 0.25)"
            stroke={alertStroke}
            strokeWidth="2"
            animate={gloveAlert ? { scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <circle cx="246" cy="205" r="4" fill="#ff9100" />
        </g>

        {/* Callout: THERM +1.8°C */}
        <g>
          <line x1="254" y1="205" x2="285" y2="218" stroke="#ff9100" strokeWidth="1" />
          <text x="245" y="235" fill="#ff9100" fontFamily="Roboto Mono" fontSize="9" fontWeight="bold">THERM +1.8°</text>
        </g>

        {/* 4. LEGS & BOOTS */}
        <g
          onClick={() => onZoneClick && onZoneClick('LEGS')}
          style={{ cursor: 'pointer' }}
        >
          {/* Waist Band */}
          <line x1="150" y1="162" x2="190" y2="162" stroke="#00e5ff" strokeWidth="2" strokeDasharray="3 3" />

          {/* Left Leg */}
          <line x1="160" y1="162" x2="152" y2="255" stroke={activeZone === 'LEGS' ? highlightStroke : defaultStroke} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="152" cy="255" r="4.5" fill="#0b1424" stroke="#00e5ff" strokeWidth="1.5" />
          <line x1="152" y1="255" x2="148" y2="325" stroke={activeZone === 'LEGS' ? highlightStroke : defaultStroke} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="136" y="325" width="24" height="10" rx="3" fill="#0d192c" stroke="#00e5ff" strokeWidth="1.5" />

          {/* Right Leg */}
          <line x1="180" y1="162" x2="188" y2="255" stroke={activeZone === 'LEGS' ? highlightStroke : defaultStroke} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="188" cy="255" r="4.5" fill="#0b1424" stroke="#00e5ff" strokeWidth="1.5" />
          <line x1="188" y1="255" x2="192" y2="325" stroke={activeZone === 'LEGS' ? highlightStroke : defaultStroke} strokeWidth="3.5" strokeLinecap="round" />
          <rect x="180" y="325" width="24" height="10" rx="3" fill="#0d192c" stroke="#00e5ff" strokeWidth="1.5" />
        </g>

        {/* Callout: BOOT_SEAL 100% */}
        <g>
          <line x1="205" y1="330" x2="245" y2="310" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 2" />
          <text x="225" y="304" fill="#00e5ff" fontFamily="Roboto Mono" fontSize="8" fontWeight="bold">BOOT_SEAL 100%</text>
        </g>

        {/* Bottom Status text in diagram matching reference */}
        <text x="24" y="365" fill="#80909a" fontFamily="Roboto Mono" fontSize="9">LAT_PITCH: +0.02°</text>
        <text x="225" y="365" fill="#00e5ff" fontFamily="Roboto Mono" fontSize="9" fontWeight="bold">EVA_SYNC ACTIVE</text>
      </svg>
    </div>
  );
};

export default AstronautSVG;
