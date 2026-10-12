import React from 'react';
import { motion } from 'framer-motion';

const DataCard = ({ title, value, unit, status = 'normal', sparkline = null, delay = 0 }) => {
  let valueColor = 'var(--text-primary)';
  if (status === 'warning') valueColor = 'var(--alert-yellow)';
  if (status === 'critical') valueColor = 'var(--alert-red)';
  if (status === 'good') valueColor = 'var(--alert-green)';
  if (status === 'highlight') valueColor = 'var(--primary-cyan)';

  return (
    <motion.div 
      className="bg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, borderColor: 'var(--primary-cyan)' }}
      style={{
        padding: '15px',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        marginBottom: '10px'
      }}>
        {title}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
        <motion.div 
          className="data-value"
          key={value}
          initial={{ opacity: 0.5, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ fontSize: '24px', fontWeight: 'bold', color: valueColor }}
        >
          {value}
        </motion.div>
        {unit && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {unit}
          </div>
        )}
      </div>
      
      {sparkline && (
        <div style={{ marginTop: '10px', height: '30px' }}>
          {sparkline}
        </div>
      )}
      
      {status !== 'normal' && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '4px',
          height: '100%',
          backgroundColor: valueColor,
          boxShadow: `0 0 10px ${valueColor}`
        }} />
      )}
    </motion.div>
  );
};

export default DataCard;
