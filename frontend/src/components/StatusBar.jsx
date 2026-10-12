import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Globe, User, Shield, Activity, Radio, Cpu, Volume2, VolumeX } from 'lucide-react';
import AtlasLogo from './AtlasLogo';
import { getMissionStatus } from '../utils/api';
import { sound } from '../utils/soundEffects';

const StatusBar = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mission, setMission] = useState({
    id: 'ATLAS-SAFE 2047',
    module: 'ARES-07 EVA-04',
    sol: 184,
    status: 'NOMINAL',
    eva_clock: '02:41:17 CURRENT'
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    getMissionStatus().then(data => {
      if (data) setMission(prev => ({ ...prev, ...data }));
    }).catch(() => {});
    return () => clearInterval(timer);
  }, []);

  const formatUTC = (date) => {
    return date.toISOString().substr(11, 8) + ' UTC';
  };

  const handleToggleAudio = () => {
    const next = sound.toggleSound();
    setAudioEnabled(next);
    if (next) sound.playBeep(1200, 0.08);
  };

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(8, 12, 22, 0.95)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.25)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        position: 'sticky',
        top: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* Top Cybernetic Status Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 24px',
          borderBottom: '1px solid rgba(26, 39, 68, 0.7)',
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '12px'
        }}
      >
        {/* Left Telemetry Vectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#00e5ff' }}>
          <div
            onClick={() => {
              sound.playClick();
              navigate('/');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <AtlasLogo width={34} height={30} showText={false} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '4px', color: '#FFFFFF', textShadow: '0 0 10px rgba(0, 229, 255, 0.7)' }}>
              ATLAS
            </span>
          </div>

          <span style={{ color: '#80909a' }}>//</span>
          <span style={{ color: '#00e5ff', fontWeight: 600 }}>ATLAS-SAFE 2047</span>
          <span style={{ color: '#80909a' }}>//</span>
          <span style={{ color: '#d0d8e0' }}>ARES-07 EVA-04</span>
          <span style={{ color: '#80909a' }}>//</span>
          <span style={{ color: '#ffd600' }}>SOL 184</span>
          <span style={{ color: '#80909a' }}>//</span>
          <span style={{ color: '#FFFFFF' }}>{formatUTC(time)}</span>
        </div>

        {/* Right Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00e676',
                boxShadow: '0 0 8px #00e676',
                animation: 'blink 2s infinite'
              }}
            />
            <span style={{ color: '#00e676', fontWeight: 'bold', letterSpacing: '1px' }}>
              ● NOMINAL
            </span>
          </div>

          <div
            style={{
              padding: '3px 8px',
              borderRadius: '2px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#00e5ff',
              fontSize: '10px'
            }}
          >
            LOCAL AI CORE v4.8
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleAudio}
            title={audioEnabled ? "Mute Sci-Fi Audio" : "Enable Sci-Fi Audio"}
            style={{
              background: 'transparent',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '2px',
              padding: '4px 6px',
              color: audioEnabled ? '#00e5ff' : '#80909a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(10, 16, 28, 0.98)'
        }}
      >
        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '2px' }}>
          {[
            { name: 'MISSION CONTROL', path: '/dashboard', icon: Shield },
            { name: '3D PLANET SIMULATOR', path: '/environment', icon: Globe },
            { name: 'ASTRONAUT & BIO-CHIP', path: '/astronaut', icon: User },
            { name: 'WHAT-IF CASCADE', path: '/cascade', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                onClick={() => sound.playClick()}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textDecoration: 'none',
                  color: isActive ? '#00e5ff' : '#80909a',
                  borderBottom: isActive ? '2px solid #00e5ff' : '2px solid transparent',
                  background: isActive ? 'linear-gradient(to bottom, rgba(0,229,255,0.08) 0%, transparent 100%)' : 'transparent',
                  transition: 'all 0.25s ease'
                })}
              >
                <Icon size={14} />
                <span>{tab.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Tactical Sub-Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#80909a' }}>
          <div>
            HORIZON: <span style={{ color: '#00e5ff' }}>+60 MIN</span>
          </div>
          <div>
            QUANTUM UPLINK: <span style={{ color: '#00e676' }}>0.04 kbps</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StatusBar;
