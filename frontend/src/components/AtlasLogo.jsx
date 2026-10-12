import React from 'react';
import { motion } from 'framer-motion';

const AtlasLogo = ({ width = 120, height = 120, showText = true, textSub = "SPACE COMMAND // 2047" }) => {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 300 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 16px rgba(0, 195, 255, 0.45))' }}
      >
        <defs>
          <linearGradient id="atlasA" x1="50" y1="20" x2="250" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D8E8F5" />
          </linearGradient>
          <linearGradient id="orbitGrad" x1="30" y1="80" x2="270" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0077FF" />
            <stop offset="45%" stopColor="#00D4FF" />
            <stop offset="85%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#0055EE" />
          </linearGradient>
          <radialGradient id="dotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E0FFFF" />
            <stop offset="40%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0077FF" />
          </radialGradient>
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back portion of Orbital Ring */}
        <ellipse
          cx="150"
          cy="116"
          rx="112"
          ry="34"
          transform="rotate(-18 150 116)"
          stroke="url(#orbitGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* The Letter A (Main Legs) */}
        {/* Left Leg */}
        <polygon
          points="150,26 122,26 62,176 96,176 136,76"
          fill="url(#atlasA)"
        />
        {/* Right Leg */}
        <polygon
          points="150,26 178,26 238,176 204,176 164,76"
          fill="url(#atlasA)"
        />

        {/* Central 4-pointed Star under the A vertex */}
        <g transform="translate(150, 162)">
          <path
            d="M0,-16 Q0,0 16,0 Q0,0 0,16 Q0,0 -16,0 Q0,0 0,-16 Z"
            fill="#FFFFFF"
            style={{ filter: 'drop-shadow(0 0 6px #FFFFFF)' }}
          />
        </g>

        {/* Front portion of Orbital Ring overlay */}
        <path
          d="M 46,134 C 84,166 200,160 252,98"
          stroke="url(#orbitGrad)"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
          filter="url(#neonGlow)"
        />

        {/* Blue Planet/Orbital Satellite Sphere with animated subtle pulse */}
        <motion.circle
          cx="248"
          cy="88"
          r="12"
          fill="url(#dotGlow)"
          filter="url(#neonGlow)"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {showText && (
        <div style={{ textAlign: 'center', marginTop: '-6px' }}>
          <div
            style={{
              fontFamily: "'Orbitron', 'Space Grotesk', sans-serif",
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '14px',
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 150, 255, 0.3)',
              marginLeft: '14px', // compensation for letter-spacing
              lineHeight: 1.1
            }}
          >
            ATLAS
          </div>
          {textSub && (
            <div
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '10px',
                letterSpacing: '4px',
                color: '#00e5ff',
                opacity: 0.85,
                marginTop: '4px',
                textTransform: 'uppercase'
              }}
            >
              {textSub}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AtlasLogo;
