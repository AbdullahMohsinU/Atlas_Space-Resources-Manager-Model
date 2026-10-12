import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Globe, User, Zap, Radio, Clock, Shield, ArrowRight, Cpu, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import DataCard from '../components/DataCard';
import CircularGauge from '../components/CircularGauge';
import { useWebSocket } from '../hooks/useWebSocket';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(2470); // T+ 00:41:10

  const envWsUrl = `ws://${window.location.hostname}:8002/ws/environment`;
  const astroWsUrl = `ws://${window.location.hostname}:8002/ws/astronaut`;
  const { data: envData, buffer: envBuffer, status: envWs } = useWebSocket(envWsUrl, 20);
  const { data: astroData, buffer: astroBuffer, status: astroWs } = useWebSocket(astroWsUrl, 20);

  const hrHistory = useMemo(() => astroBuffer.map((d, i) => ({ t: i, hr: d.heart_rate })), [astroBuffer]);
  const tempHistory = useMemo(() => envBuffer.map((d, i) => ({ t: i, temp: d.surface_temp })), [envBuffer]);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMissionTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `T+ ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const envStatusColor = envWs === 'CONNECTED' ? '#00e676' : '#ff1744';
  const astroStatusColor = astroWs === 'CONNECTED' ? '#00e676' : '#ff1744';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '30px'
      }}
    >
      {/* Top Mission Control Banner */}
      <div
        className="bg-panel"
        style={{
          padding: '16px 20px',
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff', letterSpacing: '2px' }}>
            ATLAS SPACE COMMAND // ARES-07 MISSION CONTROL
          </div>
          <h2 style={{ fontSize: '18px', color: '#FFFFFF', marginTop: '2px' }}>
            MISSION OVERVIEW & TELEMETRY SYNTHESIS
          </h2>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', display: 'flex', gap: '14px', marginTop: '4px' }}>
            <span>SECTOR: <span style={{ color: '#FFFFFF' }}>DELTA-9</span></span>
            <span>CREW: <span style={{ color: '#FFFFFF' }}>CMDR. SHEPARD</span></span>
            <span>SOL: <span style={{ color: '#ffd600' }}>184</span></span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a' }}>
            MISSION CLOCK
          </div>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '26px', fontWeight: 'bold', color: '#00e5ff', letterSpacing: '2px' }}>
            {formatMissionTime(timer)}
          </div>
          <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#00e676' }}>
            ● TELEMETRY RELAY SYNCED
          </div>
        </div>
      </div>

      {/* Real-time Subsystem Connection Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ padding: '10px 16px', borderRadius: '4px', background: 'rgba(13, 19, 33, 0.85)', border: '1px solid rgba(0, 229, 255, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={14} color="#00e5ff" />
            PLANETARY VECTOR: {envData?.planet_name?.toUpperCase() || 'MARS'}
          </span>
          <span style={{ color: envStatusColor, fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: envStatusColor, animation: 'blink 1.5s infinite' }} />
            {envWs}
          </span>
        </div>

        <div style={{ padding: '10px 16px', borderRadius: '4px', background: 'rgba(13, 19, 33, 0.85)', border: '1px solid rgba(0, 229, 255, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={14} color="#00e5ff" />
            SUIT AVIONICS & VITALS
          </span>
          <span style={{ color: astroStatusColor, fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: astroStatusColor, animation: 'blink 1.5s infinite' }} />
            {astroWs}
          </span>
        </div>

        <div style={{ padding: '10px 16px', borderRadius: '4px', background: 'rgba(13, 19, 33, 0.85)', border: '1px solid rgba(0, 229, 255, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={14} color="#00e676" />
            ATLAS BIO-CHIP LINK
          </span>
          <span style={{ color: '#00e676', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 'bold' }}>
            LOCKED (500 Hz)
          </span>
        </div>
      </div>

      {/* Main Two Interactive Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Module Card 1: Planet Environment & Resource Extraction */}
        <motion.div
          className="bg-panel glowing-border"
          whileHover={{ borderColor: '#00e5ff', boxShadow: '0 8px 24px rgba(0, 229, 255, 0.2)' }}
          onClick={() => navigate('/environment')}
          style={{ padding: '20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 229, 255, 0.25)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={18} color="#00e5ff" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', color: '#FFFFFF' }}>3D PLANET SIMULATOR & ENVIRONMENT</h3>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff' }}>
                  ACTIVE TARGET: {envData?.planet_name?.toUpperCase() || 'MARS'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
              <span>OPEN 3D SIM</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <DataCard title="SURFACE TEMP" value={envData ? envData.surface_temp.toFixed(1) : '---'} unit="°C" status="highlight" />
            <DataCard title="PRESSURE" value={envData ? envData.pressure.toFixed(2) : '---'} unit="kPa" status="normal" />
            <DataCard title="RADIATION" value={envData ? envData.radiation.toFixed(2) : '---'} unit="mSv/d" status="normal" />
            <DataCard title="GRAVITY" value={envData ? envData.gravity.toFixed(2) : '---'} unit="m/s²" status="normal" />
          </div>

          {tempHistory.length > 2 && (
            <div style={{ height: '70px', marginTop: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tempHistory}>
                  <defs>
                    <linearGradient id="dashTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="temp" stroke="#00e5ff" strokeWidth={2} fill="url(#dashTemp)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Module Card 2: Astronaut Suit & Smart Bio-Chip */}
        <motion.div
          className="bg-panel glowing-border"
          whileHover={{ borderColor: '#00e5ff', boxShadow: '0 8px 24px rgba(0, 229, 255, 0.2)' }}
          onClick={() => navigate('/astronaut')}
          style={{ padding: '20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 229, 255, 0.25)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00e5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} color="#00e5ff" />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', color: '#FFFFFF' }}>ASTRONAUT SUIT & SMART CHIP HUB</h3>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff' }}>
                  MK-IX MATRIX // ATLAS BIO-LINK ACTIVE
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
              <span>OPEN SUIT HUD</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <DataCard title="HEART RATE" value={astroData ? Math.round(astroData.heart_rate) : '94'} unit="BPM" status="highlight" />
            <DataCard title="CORE TEMP" value={astroData ? astroData.core_temperature.toFixed(1) : '37.1'} unit="°C" status="normal" />
            <DataCard title="SUIT PRESSURE" value={astroData ? astroData.suit_internal_pressure.toFixed(2) : '4.31'} unit="PSI" status="good" />
            <DataCard title="EVA MARGIN" value={astroData ? Math.round(astroData.eva_margin) : '78'} unit="%" status="good" />
          </div>

          {hrHistory.length > 2 && (
            <div style={{ height: '70px', marginTop: 'auto' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hrHistory}>
                  <defs>
                    <linearGradient id="dashHR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff1744" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ff1744" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="hr" stroke="#ff1744" strokeWidth={2} fill="url(#dashHR)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Module Card 3: What-If Cascade Simulation Banner */}
      <motion.div
        className="bg-panel"
        whileHover={{ borderColor: '#ff9100' }}
        onClick={() => navigate('/cascade')}
        style={{
          padding: '16px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          border: '1px solid rgba(255, 145, 0, 0.4)',
          background: 'linear-gradient(90deg, rgba(255, 145, 0, 0.08) 0%, rgba(13, 19, 33, 0.9) 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(255, 145, 0, 0.15)', border: '1px solid #ff9100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="#ff9100" />
          </div>
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '13px', color: '#FFFFFF', fontWeight: 'bold' }}>
              MONTE CARLO LAB // 6-STAGE CASCADE CONTINGENCY ENGINE
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#80909a', marginTop: '2px' }}>
              Simulate future margin breakdown, cooling load surges, and airlock ingress retreat corridor.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9100', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 'bold' }}>
          <span>LAUNCH CASCADE LAB</span>
          <ArrowRight size={14} />
        </div>
      </motion.div>

      {/* Active Diagnostics & Alerts */}
      <div className="bg-panel glowing-border" style={{ padding: '18px', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '13px', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <AlertCircle size={16} />
          ACTIVE MISSION ALERTS & PROTOCOLS
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 145, 0, 0.1)', borderLeft: '4px solid #ff9100', borderRadius: '2px' }}>
            <span style={{ color: '#d0d8e0' }}>[ADVISORY] Thermal Drift Detected in Right Glove (+1.8°C). Sensor #RTA-24 micro-thermistor drift.</span>
            <span style={{ color: '#ff9100', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/astronaut')}>INSPECT</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(0, 230, 118, 0.05)', borderLeft: '4px solid #00e676', borderRadius: '2px' }}>
            <span style={{ color: '#d0d8e0' }}>[NOMINAL] ATLAS Neuro-Bio Chip polling 500 Hz bio-link. Sub-dermal core temp 37.1°C locked.</span>
            <span style={{ color: '#00e676', fontWeight: 'bold' }}>VERIFIED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
