import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Shield, Zap, Heart, Thermometer, Droplets, Wind, Radio, CheckCircle, Cpu, Eye, Scan } from 'lucide-react';
import AstronautSVG from '../components/AstronautSVG';
import Suit3DScanner from '../components/Suit3DScanner';
import BioChipViewer from '../components/BioChipViewer';
import HelmetCamHUD from '../components/HelmetCamHUD';
import DataCard from '../components/DataCard';
import CircularGauge from '../components/CircularGauge';
import { useWebSocket } from '../hooks/useWebSocket';
import { sound } from '../utils/soundEffects';

const MiniECGWave = ({ color = '#00e676' }) => (
  <div style={{ height: '36px', width: '100%', overflow: 'hidden', position: 'relative' }}>
    <svg width="100%" height="100%" viewBox="0 0 160 36" preserveAspectRatio="none">
      <path
        d="M 0,18 L 25,18 L 32,6 L 40,30 L 48,18 L 75,18 L 82,6 L 90,30 L 98,18 L 130,18 L 137,6 L 145,30 L 152,18 L 160,18"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
    </svg>
  </div>
);

const ZONE_DESCRIPTIONS = {
  HELMET: {
    zoneNum: 'ZONE 1',
    title: 'HELMET & VISOR',
    status: 'ACTIVE // NOMINAL',
    statusColor: '#00e676',
    desc: 'Dual-layer poly-carbonate gold mirror visor. Integrated heads-up ocular array, high-bandwidth S-band tactical transceiver, and ambient orbital glare attenuation.',
    stat1: { label: 'HUD COMMS LATENCY', val: '12 ms' },
    stat2: { label: 'VISOR DEFOG FAN', val: '100% NOM' }
  },
  CORE: {
    zoneNum: 'ZONE 2',
    title: 'TORSO / LCG & BIO-CHIP',
    status: 'ACTIVE // NOMINAL',
    statusColor: '#00e676',
    desc: 'Liquid Cooling Garment with integrated ATLAS-NEUROBIO-X1 silicon-graphene chip matrix. Multi-channel micro-pumps regulate core metabolic temperature.',
    stat1: { label: 'LCG THERMAL BIAS', val: '21.4 °C' },
    stat2: { label: 'BIO-LINK CHIP', val: 'LOCKED (500Hz)' }
  },
  PLSS: {
    zoneNum: 'ZONE 3',
    title: 'PLSS LIFE SUPPORT BACKPACK',
    status: 'ACTIVE // NOMINAL',
    statusColor: '#00e676',
    desc: 'Primary Life Support System. Pure O2 dual-loop regulator, LiOH canister CO2 scrubbers, water sublimation evaporator, and 28.4V Li-ion solid state power cell.',
    stat1: { label: 'SUIT POWER CELL', val: '84% [28.4V]' },
    stat2: { label: 'O2 AUTONOMY', val: '02h 24m' }
  },
  ARMS: {
    zoneNum: 'ZONE 4',
    title: 'ARMS & THERMAL GLOVES',
    status: 'ADVISORY // THERMAL DRIFT',
    statusColor: '#ff9100',
    desc: 'High-dexterity sealed pressurized gloves with PTC active resistive heating elements. Sensor #RTA-24 detects localized thermal drift +1.8°C over baseline.',
    stat1: { label: 'GLOVE SENSOR #RTA-24', val: '+1.8 °C DRIFT' },
    stat2: { label: 'HEATER ECONOMIZER', val: 'STANDBY' }
  },
  LEGS: {
    zoneNum: 'ZONE 5',
    title: 'LEGS & MAGNETIC BOOTS',
    status: 'ACTIVE // NOMINAL',
    statusColor: '#00e676',
    desc: 'Articulated knee bearings and abrasive regolith gaiters. Magnetic soles with ground seal telemetry and electrostatic dust repulsion field active.',
    stat1: { label: 'BOOT SEAL INTEGRITY', val: '100% NOM' },
    stat2: { label: 'ELECTROSTATIC FIELD', val: 'ENGAGED' }
  }
};

const AstronautHub = () => {
  const [activeZone, setActiveZone] = useState('ARMS');
  const [viewMode, setViewMode] = useState('3D_SCANNER'); // '3D_SCANNER', '2D_SCHEMATIC', 'BIO_CHIP'
  const [gloveAlertResolved, setGloveAlertResolved] = useState(false);

  const wsUrl = `ws://${window.location.hostname}:8002/ws/astronaut`;
  const { data: vitals } = useWebSocket(wsUrl, 30);

  const curZone = ZONE_DESCRIPTIONS[activeZone] || ZONE_DESCRIPTIONS.CORE;

  const handleResolveAlert = () => {
    sound.playBeep(900, 0.12);
    setGloveAlertResolved(true);
  };

  const handleAdjustAlert = () => {
    sound.playScan();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: '20px',
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '30px'
      }}
    >
      {/* LEFT COLUMN: FIRST PERSON HUD CAM + 3D SUIT SCANNER & BIO-CHIP */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Helmet Cam Horizon First-Person View */}
        <HelmetCamHUD planetName="Mars" sol={184} sector="DELTA-9" />

        {/* Model Output Diagnosis Header Bar matching reference screenshot */}
        <div
          className="bg-panel"
          style={{
            padding: '12px 16px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ padding: '2px 8px', background: '#0077ff', color: '#fff', fontSize: '9px', fontFamily: 'Roboto Mono', borderRadius: '2px' }}>
                MODEL OUTPUT: EVA-DIAG #E061
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'Roboto Mono', color: '#80909a' }}>
                HUMAN VERIFIED: FLIGHT SURGEON
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ padding: '2px 6px', background: 'rgba(0, 229, 255, 0.1)', color: '#00e5ff', fontSize: '9px', border: '1px solid #00e5ff', borderRadius: '2px', fontFamily: 'Roboto Mono' }}>
                ● SIMULATED WEARABLE DATA
              </span>
              <span style={{ padding: '2px 6px', background: 'rgba(255, 23, 68, 0.1)', color: '#ff1744', fontSize: '9px', border: '1px solid #ff1744', borderRadius: '2px', fontFamily: 'Roboto Mono' }}>
                MK-IX-ARES
              </span>
            </div>
          </div>

          {/* Thermal Drift Alert Row */}
          {!gloveAlertResolved ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '4px',
                background: 'rgba(255, 145, 0, 0.1)',
                border: '1px solid #ff9100'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(255, 145, 0, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Thermometer size={16} color="#ff9100" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#ff9100', fontWeight: 'bold' }}>
                    Thermal Drift Detected in Right Glove (+1.8°C)
                  </div>
                  <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#80909a' }}>
                    AI confidence: 96.6% • Sensor #RTA-24 micro-thermistor drift
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleAdjustAlert}
                  style={{ padding: '5px 12px', background: '#00e5ff', border: 'none', borderRadius: '2px', color: '#000', fontFamily: 'Orbitron', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ADJUST
                </button>
                <button
                  onClick={handleAdjustAlert}
                  style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #80909a', borderRadius: '2px', color: '#80909a', fontFamily: 'Orbitron', fontSize: '9px', cursor: 'pointer' }}
                >
                  OVERRIDE
                </button>
                <button
                  onClick={handleResolveAlert}
                  style={{ padding: '5px 12px', background: '#ff9100', border: 'none', borderRadius: '2px', color: '#000', fontFamily: 'Orbitron', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  RESOLVE
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: 'rgba(0, 230, 118, 0.1)', border: '1px solid #00e676', borderRadius: '4px', fontFamily: 'Roboto Mono', fontSize: '11px', color: '#00e676' }}>
              <CheckCircle size={16} color="#00e676" />
              <span>Right Glove thermal bias nominal. Heaters normalized to 21.4°C baseline.</span>
            </div>
          )}
        </div>

        {/* View Switcher: 3D Scanner vs 2D Matrix Schematic vs Bio-Chip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { id: '3D_SCANNER', label: '3D VOLUMETRIC SCANNER', icon: Scan },
            { id: '2D_SCHEMATIC', label: 'MK-IX 2D MATRIX SCHEMATIC', icon: Shield },
            { id: 'BIO_CHIP', label: 'SMART BIO-CHIP MATRIX', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setViewMode(tab.id);
                  sound.playScan();
                }}
                style={{
                  padding: '10px 8px',
                  borderRadius: '4px',
                  background: isSelected ? 'rgba(0, 229, 255, 0.18)' : 'rgba(13, 19, 33, 0.65)',
                  border: `1px solid ${isSelected ? '#00e5ff' : 'rgba(26, 39, 68, 0.8)'}`,
                  color: isSelected ? '#00e5ff' : '#80909a',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 229, 255, 0.3)' : 'none'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main View Area based on Mode */}
        {viewMode === '3D_SCANNER' && (
          <div className="bg-panel glowing-border" style={{ padding: '16px', borderRadius: '6px', minHeight: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '10px', color: '#80909a' }}>3D SPATIAL TELEMETRY</div>
                <h3 style={{ fontSize: '15px', color: '#FFFFFF' }}>HOLOGRAPHIC SUIT SCANNER // ROTATABLE</h3>
              </div>
              <div style={{ fontFamily: 'Roboto Mono', fontSize: '9px', color: '#00e5ff' }}>
                DRAG 360° • SCROLL ZOOM
              </div>
            </div>

            <div style={{ height: '390px' }}>
              <Suit3DScanner activeZone={activeZone} onZoneSelect={setActiveZone} gloveAlert={!gloveAlertResolved} />
            </div>
          </div>
        )}

        {viewMode === '2D_SCHEMATIC' && (
          <div className="bg-panel glowing-border" style={{ padding: '18px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a' }}>SUIT ANATOMY SCHEMATIC</div>
                <h3 style={{ fontSize: '15px', color: '#FFFFFF' }}>MK-IX MATRIX INTERFACE</h3>
              </div>
            </div>

            <div style={{ height: '320px', position: 'relative' }}>
              <AstronautSVG activeZone={activeZone} onZoneClick={setActiveZone} gloveAlert={!gloveAlertResolved} />
            </div>

            {/* Horizontal Zone Selector */}
            <div style={{ display: 'flex', gap: '6px', margin: '14px 0' }}>
              {['HELMET', 'CORE', 'PLSS', 'ARMS', 'LEGS'].map(z => (
                <button
                  key={z}
                  onClick={() => {
                    setActiveZone(z);
                    sound.playClick();
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '2px',
                    background: activeZone === z ? 'rgba(0, 229, 255, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${activeZone === z ? '#00e5ff' : 'rgba(26, 39, 68, 0.8)'}`,
                    color: activeZone === z ? '#00e5ff' : '#80909a',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* Zone Detail Box */}
            <div style={{ padding: '14px', background: 'rgba(0, 0, 0, 0.35)', borderRadius: '4px', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#FFFFFF', fontWeight: 'bold' }}>
                  {curZone.zoneNum}: {curZone.title}
                </span>
                <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: curZone.statusColor, border: `1px solid ${curZone.statusColor}`, padding: '2px 6px', borderRadius: '2px' }}>
                  {curZone.status}
                </span>
              </div>
              <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', lineHeight: 1.5, marginBottom: '12px' }}>
                {curZone.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '2px' }}>
                  <div style={{ fontSize: '8px', fontFamily: 'Orbitron', color: '#80909a' }}>{curZone.stat1.label}</div>
                  <div style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#00e5ff', fontWeight: 'bold' }}>{curZone.stat1.val}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '2px' }}>
                  <div style={{ fontSize: '8px', fontFamily: 'Orbitron', color: '#80909a' }}>{curZone.stat2.label}</div>
                  <div style={{ fontSize: '13px', fontFamily: 'Roboto Mono', color: '#00e676', fontWeight: 'bold' }}>{curZone.stat2.val}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'BIO_CHIP' && (
          <BioChipViewer astroData={vitals} />
        )}
      </div>

      {/* RIGHT COLUMN: PHYSIOLOGICAL BIO-METRICS & PLSS ATMOSPHERIC REGULATION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Physiological Bio-Metrics */}
        <div className="bg-panel" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(26, 39, 68, 0.8)', paddingBottom: '10px' }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: '#80909a' }}>PHYSIOLOGICAL BIO-METRICS</div>
              <h3 style={{ fontSize: '15px', color: '#FFFFFF' }}>VITALS STREAM // ARES-07</h3>
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e676', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', animation: 'blink 1.2s infinite' }} />
              TELEMETRY: LIVE
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Heart Rate */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontFamily: 'Orbitron', color: '#80909a' }}>HEART RATE</span>
                <Heart size={14} color="#ff1744" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontSize: '26px', fontFamily: 'Roboto Mono', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {vitals ? Math.round(vitals.heart_rate) : 94}
                </span>
                <span style={{ fontSize: '11px', color: '#80909a', fontFamily: 'Roboto Mono' }}>BPM</span>
              </div>
              <MiniECGWave color="#ff1744" />
            </div>

            {/* Respiration */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontFamily: 'Orbitron', color: '#80909a' }}>RESPIRATION</span>
                <Wind size={14} color="#00e5ff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontSize: '26px', fontFamily: 'Roboto Mono', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {vitals ? Math.round(vitals.respiration_rate) : 21}
                </span>
                <span style={{ fontSize: '11px', color: '#80909a', fontFamily: 'Roboto Mono' }}>RPM</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '10px', marginBottom: '4px' }}>
                <div style={{ width: '65%', height: '100%', background: '#00e5ff', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'Roboto Mono', color: '#80909a' }}>Metabolic Rate: Moderate</div>
            </div>

            {/* Core Temperature */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontFamily: 'Orbitron', color: '#80909a' }}>CORE TEMP</span>
                <Thermometer size={14} color="#ff9100" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontSize: '26px', fontFamily: 'Roboto Mono', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {vitals ? vitals.core_temperature.toFixed(1) : '37.1'}
                </span>
                <span style={{ fontSize: '11px', color: '#80909a', fontFamily: 'Roboto Mono' }}>°C</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '10px', marginBottom: '4px' }}>
                <div style={{ width: '74%', height: '100%', background: '#ff9100', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'Roboto Mono', color: '#80909a' }}>LCG Thermal Bias: 21.4°C</div>
            </div>

            {/* Load / Hydration */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontFamily: 'Orbitron', color: '#80909a' }}>LOAD / HYDRATION</span>
                <Droplets size={14} color="#00e5ff" />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '4px 0' }}>
                <span style={{ fontSize: '26px', fontFamily: 'Roboto Mono', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {vitals ? Math.round(vitals.hydration_level) : 84}
                </span>
                <span style={{ fontSize: '11px', color: '#80909a', fontFamily: 'Roboto Mono' }}>% LOAD</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '10px', marginBottom: '4px' }}>
                <div style={{ width: `${vitals?.hydration_level || 84}%`, height: '100%', background: '#00e5ff', borderRadius: '3px' }} />
              </div>
              <div style={{ fontSize: '9px', fontFamily: 'Roboto Mono', color: '#ffd600' }}>RISK: MODERATE</div>
            </div>
          </div>
        </div>

        {/* PLSS Pneumatics & Gas Loop */}
        <div className="bg-panel glowing-border" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(26, 39, 68, 0.8)', paddingBottom: '10px' }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: '#80909a' }}>PLSS PNEUMATICS & GAS LOOP</div>
              <h3 style={{ fontSize: '15px', color: '#FFFFFF' }}>ATMOSPHERIC REGULATION</h3>
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e5ff' }} />
              PRESSURE STABLE
            </div>
          </div>

          {/* Pressure Gauge */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '10px', color: '#80909a' }}>SUIT INTERNAL PRESSURE</span>
              <span style={{ fontFamily: 'Roboto Mono', fontSize: '18px', color: '#00e5ff', fontWeight: 'bold' }}>
                {vitals ? vitals.suit_internal_pressure.toFixed(2) : '4.31'} <span style={{ fontSize: '11px', color: '#80909a' }}>PSI</span>
              </span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #0077ff, #00e5ff)', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: 'Roboto Mono', fontSize: '9px', color: '#80909a' }}>
              <span>MIN CRIT (3.80)</span>
              <span style={{ color: '#00e5ff' }}>NOMINAL SAFE RANGE (4.10 - 4.50 PSI)</span>
              <span>MAX CRIT (4.90)</span>
            </div>
          </div>

          {/* Gas Mix & Scrubbers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.8)' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '9px', color: '#80909a', marginBottom: '6px' }}>IN-SUIT GAS MIX</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <div>
                  <div style={{ fontFamily: 'Roboto Mono', fontSize: '18px', color: '#FFFFFF', fontWeight: 'bold' }}>98.2%</div>
                  <div style={{ fontSize: '8px', color: '#00e5ff', fontFamily: 'Roboto Mono' }}>PURE O2 LOOP</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Roboto Mono', fontSize: '16px', color: '#80909a' }}>1.8%</div>
                  <div style={{ fontSize: '8px', color: '#80909a', fontFamily: 'Roboto Mono' }}>TRACE N2</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(26, 39, 68, 0.8)' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '9px', color: '#80909a', marginBottom: '6px' }}>CO2 SCRUBBER & COOLANT</div>
              <div style={{ fontFamily: 'Roboto Mono', fontSize: '10px', color: '#d0d8e0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div>LiOH Saturation: <span style={{ color: '#00e676' }}>0.42%</span></div>
                <div>LCG Flow Loop: <span style={{ color: '#00e5ff' }}>82% NOM</span></div>
                <div>Reserve Bottle: <span style={{ color: '#00e676' }}>100% READY</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Safety Buffer / Margin */}
        <div className="bg-panel" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '9px', color: '#80909a' }}>DYNAMIC SAFETY BUFFER</div>
              <h3 style={{ fontSize: '15px', color: '#FFFFFF' }}>EVA OPERATIONAL MARGIN</h3>
            </div>
            <div style={{ fontFamily: 'Roboto Mono', fontSize: '11px', color: '#00e5ff' }}>
              01:45:00 REMAINING
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <CircularGauge value={vitals?.eva_margin || 78} label="MARGIN" size={130} strokeWidth={11} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'Roboto Mono', fontSize: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: '#80909a' }}>O2 AUTONOMY</span>
                  <span style={{ color: '#00e5ff' }}>78% [02h 24m]</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '78%', height: '100%', background: '#00e5ff', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: '#80909a' }}>THERMAL RECIRC</span>
                  <span style={{ color: '#00e676' }}>82% [NOMINAL]</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '82%', height: '100%', background: '#00e676', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: '#80909a' }}>SUIT POWER CELL</span>
                  <span style={{ color: '#00e5ff' }}>84% [28.4V]</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '84%', height: '100%', background: '#00e5ff', borderRadius: '2px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: '#80909a' }}>INGRESS BUFFER</span>
                  <span style={{ color: '#ffd600' }}>69% [SOL-184]</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '69%', height: '100%', background: '#ffd600', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Encrypted Telemetry Link Footer */}
        <div
          style={{
            padding: '10px 16px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(26, 39, 68, 0.9)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '10px'
          }}
        >
          <span style={{ color: '#80909a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={14} color="#00e5ff" />
            ARES-07 EVA TELEMETRY LINK // ENCRYPTED // QUANTUM RELAY Q-2047 // SOL 184
          </span>
          <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>
            0.04 kbps
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AstronautHub;
