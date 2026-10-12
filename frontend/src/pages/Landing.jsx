import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, User, Activity, Shield, ArrowRight, Sparkles } from 'lucide-react';
import AtlasLogo from '../components/AtlasLogo';
import StarField from '../components/StarField';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 20%, #0d1a30 0%, #060a12 60%, #030508 100%)',
        padding: '30px 20px',
        boxSizing: 'border-box'
      }}
    >
      <StarField />

      {/* Cybernetic Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* TOP BRANDING HEADER: PROPER ATLAS UPWARD */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        style={{
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10px'
        }}
      >
        <AtlasLogo width={180} height={160} showText={true} textSub="SPACE EXPLORATION & TELEMETRY COMMAND // 2047" />

        {/* Futuristic Subtitle Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            marginTop: '18px',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '5px',
            color: '#00e5ff',
            textAlign: 'center',
            textShadow: '0 0 15px rgba(0, 229, 255, 0.5)'
          }}
        >
          SIMULATE THE FUTURE BEFORE IT BECOMES THE PRESENT
        </motion.div>
      </motion.div>

      {/* THREE INTERACTIVE PRODUCTION MODULE CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 340px)',
          gap: '24px',
          zIndex: 10,
          maxWidth: '1100px',
          width: '100%',
          justifyContent: 'center',
          margin: '20px 0'
        }}
      >
        {/* Module 1: 3D Planet Environment Monitor */}
        <motion.div
          whileHover={{ scale: 1.03, y: -6, borderColor: '#00e5ff', boxShadow: '0 12px 30px rgba(0, 229, 255, 0.25)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-panel"
          style={{
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(13, 22, 38, 0.9) 0%, rgba(8, 14, 25, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
          onClick={() => navigate('/environment')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={24} color="#00e5ff" />
              </div>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#00e676', border: '1px solid #00e676', padding: '2px 6px', borderRadius: '2px' }}>
                3D SIMULATOR
              </span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '1px' }}>
              3D PLANET SIMULATOR & RESOURCE LAB
            </h3>
            <p style={{ fontSize: '12px', color: '#80909a', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
              Explore Earth, Mars, Moon, Europa, Titan, and Venus in full 3D. Predict habitability, atmospheric flux, and in-situ resource extraction.
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
            <span>LAUNCH SIMULATOR</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>

        {/* Module 2: Astronaut Suit & Bio-Chip Hub */}
        <motion.div
          whileHover={{ scale: 1.03, y: -6, borderColor: '#00e5ff', boxShadow: '0 12px 30px rgba(0, 229, 255, 0.25)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="bg-panel"
          style={{
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(13, 22, 38, 0.9) 0%, rgba(8, 14, 25, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
          onClick={() => navigate('/astronaut')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={24} color="#00e5ff" />
              </div>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#00e5ff', border: '1px solid #00e5ff', padding: '2px 6px', borderRadius: '2px' }}>
                MK-IX MATRIX
              </span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '1px' }}>
              ASTRONAUT SUIT & SMART CHIP HUB
            </h3>
            <p style={{ fontSize: '12px', color: '#80909a', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
              Integrated ATLAS Neuro-Bio Chip matrix, live ECG heartbeat telemetry, LCG coolant regulation, and EVA operational safety buffer.
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
            <span>OPEN SUIT HUD</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>

        {/* Module 3: What-If Cascade Engine */}
        <motion.div
          whileHover={{ scale: 1.03, y: -6, borderColor: '#00e5ff', boxShadow: '0 12px 30px rgba(0, 229, 255, 0.25)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="bg-panel"
          style={{
            padding: '24px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(13, 22, 38, 0.9) 0%, rgba(8, 14, 25, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            transition: 'border-color 0.3s, box-shadow 0.3s'
          }}
          onClick={() => navigate('/cascade')}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(255, 145, 0, 0.1)', border: '1px solid #ff9100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={24} color="#ff9100" />
              </div>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#ff9100', border: '1px solid #ff9100', padding: '2px 6px', borderRadius: '2px' }}>
                MONTE CARLO LAB
              </span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '8px', letterSpacing: '1px' }}>
              CASCADE RISK & CONTINGENCY ENGINE
            </h3>
            <p style={{ fontSize: '12px', color: '#80909a', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
              Simulate subsystem failure propagation across 6 stages. Execute real-time stress testing, burn rate analysis, and airlock ingress.
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9100', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
            <span>ENTER CASCADE LAB</span>
            <ArrowRight size={14} />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        style={{ zIndex: 10, marginBottom: '20px' }}
      >
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 229, 255, 0.7)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '16px 48px',
            background: 'linear-gradient(90deg, #00e5ff 0%, #0099ff 100%)',
            border: 'none',
            borderRadius: '4px',
            color: '#030812',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '15px',
            fontWeight: 900,
            letterSpacing: '3px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span>ENTER MISSION CONTROL</span>
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Landing;
