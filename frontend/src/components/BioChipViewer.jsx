import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck, Radio, Wifi, Thermometer, Droplet } from 'lucide-react';

const CHIP_PINS = [
  { id: 'PIN_01', name: 'SUB-DERMAL THERMAL PROBE', zone: 'CORE LCG', value: '37.1 °C', spec: 'PT1000 RTD ±0.02°C', status: 'LOCKED', icon: Thermometer },
  { id: 'PIN_02', name: 'PIEZO-ECG CARDIAC SENSOR', zone: 'MYOCARDIAL', value: '94 BPM', spec: '500 Hz High-Res Oscilloscope', status: 'SYNCED', icon: Activity },
  { id: 'PIN_03', name: 'MICROFLUIDIC SWEAT SENSOR', zone: 'EPIDERMAL', value: '1.4 mmol/L', spec: 'Lactate & Na+ Ion Potentiostat', status: 'ACTIVE', icon: Droplet },
  { id: 'PIN_04', name: 'RESPIRATORY CHEST EXPANDER', zone: 'THORACIC', value: '21 RPM', spec: 'PZT Piezo Strain Sensor', status: 'NOMINAL', icon: Zap },
  { id: 'PIN_05', name: 'QUANTUM TELEMETRY LINK', zone: 'AVIONICS', value: '12 ms LAG', spec: 'Encrypted SHA-512 UHF Uplink', status: 'STABLE', icon: Radio },
  { id: 'PIN_06', name: 'LCG COOLANT LOOP VALVE', zone: 'SUIT PLSS', value: '82% NOM', spec: 'Sublimator Flow Actuator', status: 'OPTIMAL', icon: ShieldCheck },
];

const BioChipViewer = ({ astroData, onSelectPin }) => {
  const [selectedPin, setSelectedPin] = useState(CHIP_PINS[1]);

  const chipTemp = astroData?.bio_chip?.chip_temp || 36.8;
  const impedance = astroData?.bio_chip?.impedance_kohm || 12.4;
  const latency = astroData?.bio_chip?.neural_latency_ms || 3.8;
  const pollingHz = astroData?.bio_chip?.polling_rate_hz || 500;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(13, 19, 33, 0.95) 0%, rgba(8, 12, 22, 0.98) 100%)',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '8px',
        padding: '18px',
        position: 'relative',
        boxShadow: 'inset 0 0 25px rgba(0, 229, 255, 0.05), 0 8px 30px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* Chip Header with Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0, 229, 255, 0.2)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid #00e5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)'
            }}
          >
            <Cpu size={18} color="#00e5ff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '2px' }}>
              ATLAS BIO-CHIP // MK-X MATRIX
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff' }}>
              SILICON-GRAPHENE NEURAL BIO-LINK // REV 4.9.2
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '2px',
              background: 'rgba(0, 230, 118, 0.12)',
              border: '1px solid #00e676',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '10px',
              color: '#00e676',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00e676', animation: 'blink 1.5s infinite' }} />
            CHIP TELEMETRY LOCKED
          </span>
        </div>
      </div>

      {/* Interactive 3D Holographic Chip Architecture Visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
        {/* Hologram Chip Vector Diagram */}
        <div
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 150, 255, 0.08) 0%, rgba(6, 10, 18, 0.95) 75%)',
            border: '1px solid rgba(26, 39, 68, 0.8)',
            borderRadius: '6px',
            padding: '16px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '260px'
          }}
        >
          {/* Subtle Grid Canvas BG */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.12) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              pointerEvents: 'none'
            }}
          />

          {/* SVG High-Tech Chip Layout */}
          <svg width="240" height="200" viewBox="0 0 240 200" fill="none" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.4))' }}>
            {/* Outer PCB board with gold traces */}
            <rect x="40" y="30" width="160" height="140" rx="8" fill="#0d1829" stroke="#00e5ff" strokeWidth="2" />
            <rect x="52" y="42" width="136" height="116" rx="4" fill="#09101d" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="1" />

            {/* Micro Pins on Left */}
            {[50, 75, 100, 125, 150].map((y, idx) => (
              <g key={`lpin-${idx}`}>
                <line x1="20" y1={y} x2="40" y2={y} stroke="#00e5ff" strokeWidth="3" />
                <circle cx="16" cy={y} r="3" fill="#00e676" />
              </g>
            ))}

            {/* Micro Pins on Right */}
            {[50, 75, 100, 125, 150].map((y, idx) => (
              <g key={`rpin-${idx}`}>
                <line x1="200" y1={y} x2="220" y2={y} stroke="#00e5ff" strokeWidth="3" />
                <circle cx="224" cy={y} r="3" fill="#00e5ff" />
              </g>
            ))}

            {/* Graphene Core Processor */}
            <rect x="80" y="65" width="80" height="70" rx="4" fill="rgba(0, 229, 255, 0.15)" stroke="#00e5ff" strokeWidth="1.5" />
            
            {/* Animated Core Glow Pulse */}
            <motion.circle
              cx="120"
              cy="100"
              r="22"
              fill="rgba(0, 229, 255, 0.2)"
              stroke="#00e5ff"
              strokeWidth="1"
              strokeDasharray="4 2"
              animate={{ rotate: 360, scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            <text x="120" y="97" textAnchor="middle" fill="#FFFFFF" fontFamily="Orbitron" fontSize="10" fontWeight="bold">ATLAS</text>
            <text x="120" y="110" textAnchor="middle" fill="#00e5ff" fontFamily="Roboto Mono" fontSize="8">NEURO-X1</text>

            {/* PCB bus lines */}
            <path d="M 60,65 L 80,65" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1" />
            <path d="M 60,135 L 80,135" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1" />
            <path d="M 160,65 L 180,65" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1" />
            <path d="M 160,135 L 180,135" stroke="rgba(0, 229, 255, 0.5)" strokeWidth="1" />
          </svg>

          {/* Real-time Oscilloscope Line at Bottom */}
          <div style={{ width: '100%', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#80909a', marginBottom: '3px' }}>
              <span>BIO-POTENTIAL OSCILLOSCOPE</span>
              <span style={{ color: '#00e676' }}>500 Hz SAMPLING</span>
            </div>
            <div style={{ height: '32px', width: '100%', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 32" preserveAspectRatio="none">
                <path
                  d="M 0,16 L 30,16 L 38,4 L 46,28 L 54,16 L 90,16 L 98,4 L 106,28 L 114,16 L 150,16 L 158,4 L 166,28 L 174,16 L 200,16"
                  fill="none"
                  stroke="#00e676"
                  strokeWidth="2"
                  style={{ filter: 'drop-shadow(0 0 4px #00e676)' }}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Diagnostic Pins & Real-time Readouts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#00e5ff', letterSpacing: '1px' }}>
            INTEGRATED TELEMETRY NODES
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '250px', overflowY: 'auto' }}>
            {CHIP_PINS.map((pin) => {
              const Icon = pin.icon;
              const isSelected = selectedPin.id === pin.id;
              return (
                <div
                  key={pin.id}
                  onClick={() => {
                    setSelectedPin(pin);
                    if (onSelectPin) onSelectPin(pin);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    background: isSelected ? 'rgba(0, 229, 255, 0.15)' : 'rgba(13, 19, 33, 0.6)',
                    border: `1px solid ${isSelected ? '#00e5ff' : 'rgba(26, 39, 68, 0.9)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(0, 229, 255, 0.25)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} color={isSelected ? '#00e5ff' : '#80909a'} />
                    <div>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: isSelected ? '#FFFFFF' : '#d0d8e0', fontWeight: 'bold' }}>
                        {pin.id} // {pin.name}
                      </div>
                      <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#80909a' }}>
                        ZONE: {pin.zone} • {pin.spec}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold', color: isSelected ? '#00e5ff' : '#00e676' }}>
                      {pin.value}
                    </div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '8px', color: '#80909a' }}>
                      {pin.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Chip Metrics Bar */}
          <div
            style={{
              marginTop: '4px',
              padding: '8px 12px',
              background: 'rgba(0, 229, 255, 0.05)',
              borderRadius: '4px',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              textAlign: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", color: '#80909a' }}>CHIP TEMP</div>
              <div style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#00e5ff', fontWeight: 'bold' }}>{chipTemp}°C</div>
            </div>
            <div>
              <div style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", color: '#80909a' }}>IMPEDANCE</div>
              <div style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#00e676', fontWeight: 'bold' }}>{impedance} kΩ</div>
            </div>
            <div>
              <div style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", color: '#80909a' }}>LATENCY</div>
              <div style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#00e5ff', fontWeight: 'bold' }}>{latency} ms</div>
            </div>
            <div>
              <div style={{ fontSize: '8px', fontFamily: "'Orbitron', sans-serif", color: '#80909a' }}>POLL RATE</div>
              <div style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#ffd600', fontWeight: 'bold' }}>{pollingHz} Hz</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioChipViewer;
