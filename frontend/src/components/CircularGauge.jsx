import React from 'react';
import { motion } from 'framer-motion';

const CircularGauge = ({ value, label, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let color = 'var(--alert-green)';
  if (value < 40) color = 'var(--alert-red)';
  else if (value < 70) color = 'var(--alert-yellow)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeLinecap: 'round',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            filter: `drop-shadow(0 0 4px ${color})`
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        marginTop: '-5px' // adjust for label
      }}>
        <motion.div 
          className="data-value"
          style={{ fontSize: size * 0.25, fontWeight: 'bold', color: 'white' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(value)}%
        </motion.div>
      </div>
      {label && (
        <div style={{
          marginTop: '10px',
          fontFamily: 'var(--font-heading)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          letterSpacing: '1px'
        }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default CircularGauge;
