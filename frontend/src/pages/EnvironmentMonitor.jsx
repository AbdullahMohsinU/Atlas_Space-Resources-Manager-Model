import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { Globe, Zap, AlertTriangle, Shield, Compass, Sparkles, Database, Layers, ArrowUpRight } from 'lucide-react';
import DataCard from '../components/DataCard';
import CircularGauge from '../components/CircularGauge';
import Planet3DViewer from '../components/Planet3DViewer';
import { useWebSocket } from '../hooks/useWebSocket';
import { predictEnvironment } from '../utils/api';

const PLANET_LIST = [
  { id: 'Earth', name: 'EARTH (TERRA BASELINE)', color: '#00aaff', tag: 'CLASS-M' },
  { id: 'Mars', name: 'MARS (JEZERO CRATER)', color: '#ff6622', tag: 'COLD DESERT' },
  { id: 'Moon', name: 'MOON (SHACKLETON CRATER)', color: '#a0a8b0', tag: 'VACUUM REGOLITH' },
  { id: 'Europa', name: 'EUROPA (JOVIAN OCEAN)', color: '#00e5ff', tag: 'SUB-ICE OCEAN' },
  { id: 'Titan', name: 'TITAN (METHANE SEAS)', color: '#ffaa00', tag: 'CRYO HYDROCARBON' },
  { id: 'Venus', name: 'VENUS (UPPER CLOUDS)', color: '#ffd600', tag: 'SUPERCRITICAL' },
  { id: 'Enceladus', name: 'ENCELADUS (GEYSER PLUMES)', color: '#7fe5ff', tag: 'CRYOVULCANIC' }
];

const EnvironmentMonitor = () => {
  const [selectedPlanet, setSelectedPlanet] = useState('Mars');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Connect to WebSocket with current selected planet query parameter
  const wsUrl = `ws://${window.location.hostname}:8002/ws/environment?planet=${selectedPlanet}`;
  const { data: envData, buffer, status: wsStatus } = useWebSocket(wsUrl, 30);

  // Trigger AI prediction whenever planet changes or on mount
  useEffect(() => {
    runPrediction();
  }, [selectedPlanet]);

  const tempHistory = useMemo(() => {
    return buffer.map((d, i) => ({
      time: `-${30 - i}s`,
      temp: parseFloat((d.surface_temp || 0).toFixed(1)),
      radiation: parseFloat((d.radiation || 0).toFixed(3)),
    }));
  }, [buffer]);

  const atmosphereData = useMemo(() => {
    if (!envData?.atmosphere_composition) return [];
    return Object.entries(envData.atmosphere_composition).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  }, [envData]);

  const runPrediction = async () => {
    setLoading(true);
    try {
      const result = await predictEnvironment({
        planet_name: selectedPlanet,
        surface_temp: envData?.surface_temp,
        pressure: envData?.pressure,
        radiation: envData?.radiation,
        dust_density: envData?.dust_density,
      });
      setPrediction(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const currentPlanetMeta = PLANET_LIST.find(p => p.id === selectedPlanet) || PLANET_LIST[1];

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
      {/* LEFT COLUMN: 3D PLANET SIMULATOR & TELEMETRY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Planet Selector Bar */}
        <div
          className="bg-panel"
          style={{
            padding: '14px 18px',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#80909a', marginBottom: '2px' }}>
              CELESTIAL RECONNAISSANCE ARRAY
            </div>
            <h2 style={{ fontSize: '17px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#00e5ff" />
              PLANET ENVIRONMENT SIMULATOR
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={selectedPlanet}
              onChange={(e) => {
                setSelectedPlanet(e.target.value);
                setPrediction(null);
              }}
              style={{
                background: '#09101d',
                color: '#00e5ff',
                border: '1px solid #00e5ff',
                padding: '8px 14px',
                borderRadius: '4px',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '12px',
                fontWeight: 'bold',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {PLANET_LIST.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                padding: '8px 12px',
                background: autoRotate ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                borderRadius: '4px',
                color: autoRotate ? '#00e5ff' : '#80909a',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              {autoRotate ? '⟳ ROTATING' : '⏸ PAUSED'}
            </button>
          </div>
        </div>

        {/* 3D Planet Interactive Viewport */}
        <div
          className="bg-panel glowing-border"
          style={{
            height: '380px',
            borderRadius: '6px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Planet3DViewer planetName={selectedPlanet} autoRotate={autoRotate} />
        </div>

        {/* Real-Time Telemetry Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <DataCard
            title="SURFACE TEMP"
            value={envData ? `${envData.surface_temp.toFixed(1)}` : '---'}
            unit="°C"
            status={envData ? (envData.surface_temp < -100 || envData.surface_temp > 60 ? 'critical' : 'highlight') : 'normal'}
            delay={0.1}
          />
          <DataCard
            title="ATM PRESSURE"
            value={envData ? `${envData.pressure.toFixed(2)}` : '---'}
            unit="kPa"
            status={envData && (envData.pressure < 1 || envData.pressure > 500) ? 'warning' : 'good'}
            delay={0.2}
          />
          <DataCard
            title="RADIATION"
            value={envData ? `${envData.radiation.toFixed(2)}` : '---'}
            unit="mSv/d"
            status={envData && envData.radiation > 10 ? 'critical' : 'normal'}
            delay={0.3}
          />
          <DataCard
            title="DUST DENSITY"
            value={envData ? `${Math.round(envData.dust_density)}` : '---'}
            unit="p/cm³"
            status="normal"
            delay={0.4}
          />
          <DataCard
            title="SOLAR IRRADIANCE"
            value={envData ? `${Math.round(envData.solar_irradiance)}` : '---'}
            unit="W/m²"
            status="normal"
            delay={0.5}
          />
          <DataCard
            title="WIND SPEED"
            value={envData ? `${envData.wind_speed.toFixed(1)}` : '---'}
            unit="m/s"
            status="normal"
            delay={0.6}
          />
          <DataCard
            title="GRAVITY"
            value={envData ? `${envData.gravity.toFixed(2)}` : '---'}
            unit="m/s²"
            status="highlight"
            delay={0.7}
          />
          <DataCard
            title="MAG SHIELD"
            value={envData ? `${envData.magnetic_field.toFixed(1)}` : '---'}
            unit="μT"
            status={envData && envData.magnetic_field > 10 ? 'good' : 'warning'}
            delay={0.8}
          />
        </div>

        {/* Live Charts: Temperature History & Atmospheric Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px', minHeight: '220px' }}>
          {/* Temperature Timeline */}
          <div className="bg-panel" style={{ padding: '16px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#80909a' }}>DIURNAL THERMAL VECTOR</span>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e5ff' }}>● LIVE STREAM</span>
            </div>
            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tempHistory}>
                  <defs>
                    <linearGradient id="planetTempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="#80909a" fontSize={9} />
                  <YAxis domain={['auto', 'auto']} stroke="#80909a" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#09101d', borderColor: '#00e5ff', fontFamily: 'Roboto Mono', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="temp" stroke="#00e5ff" strokeWidth={2} fill="url(#planetTempGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Atmosphere Composition Gas Chromatograph */}
          <div className="bg-panel" style={{ padding: '16px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#80909a' }}>ATMOSPHERE CHROMATOGRAPH</span>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#00e676' }}>MASS SPECTROMETRY</span>
            </div>
            <div style={{ height: '160px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={atmosphereData} layout="vertical">
                  <XAxis type="number" stroke="#80909a" fontSize={9} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#80909a" fontSize={10} width={45} />
                  <Tooltip contentStyle={{ background: '#09101d', borderColor: '#00e5ff', fontFamily: 'Roboto Mono' }} formatter={(val) => [`${val}%`, 'Mole Fraction']} />
                  <Bar dataKey="value" fill="#00e5ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: ATLAS AI CORE ENGINE & IN-SITU RESOURCE RECOMMENDATIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Atlas Core Engine Header */}
        <div
          className="bg-panel glowing-border"
          style={{
            padding: '20px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0, 229, 255, 0.25)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00e5ff', animation: 'pulse 2s infinite' }} />
              <div>
                <h3 style={{ fontSize: '14px', color: '#00e5ff', letterSpacing: '2px' }}>ATLAS CORE ENGINE</h3>
                <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', color: '#80909a' }}>
                  v4.8 NEURAL PREDICTIVE FUSION // ACTIVE
                </div>
              </div>
            </div>

            <button
              onClick={runPrediction}
              disabled={loading}
              style={{
                padding: '8px 14px',
                background: loading ? 'rgba(0, 229, 255, 0.2)' : '#00e5ff',
                border: 'none',
                borderRadius: '3px',
                color: '#000000',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? 'ANALYZING...' : '▶ RUN PREDICTION'}
            </button>
          </div>

          {/* Habitability & Mission Margin Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularGauge
                value={prediction?.habitability_score || 72}
                label="HABITABILITY INDEX"
                size={130}
                strokeWidth={10}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularGauge
                value={prediction?.mission_margin_forecast || 84}
                label="MISSION MARGIN"
                size={130}
                strokeWidth={10}
              />
            </div>
          </div>

          {/* Recommended Suit Configuration Mode */}
          <div style={{ padding: '12px 16px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid #00e5ff', borderRadius: '4px' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a', marginBottom: '4px' }}>
              RECOMMENDED SUIT CONFIGURATION
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', color: '#00e5ff', fontWeight: 'bold' }}>
              {prediction?.recommended_suit_configuration || 'ATLAS MK-IX Thermal Polar Regolith Deflector'}
            </div>
          </div>

          {/* Risk Assessment Matrix */}
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#FFFFFF', marginBottom: '10px' }}>
              MULTI-VECTOR RISK ASSESSMENT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(prediction?.risk_assessment || {
                radiation_hazard: 'MODERATE',
                thermal_hazard: 'WARNING',
                atmospheric_hazard: 'HIGH (HYPOBARIC)',
                dust_hazard: 'SEVERE REGOLITH HAZARD'
              }).map(([risk, val]) => {
                const isCrit = val.includes('SEVERE') || val.includes('LETHAL') || val.includes('EXTREME');
                const isWarn = val.includes('HIGH') || val.includes('WARNING') || val.includes('MODERATE');
                const color = isCrit ? '#ff1744' : isWarn ? '#ff9100' : '#00e676';
                return (
                  <div
                    key={risk}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${color}40`,
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  >
                    <div style={{ fontSize: '9px', color: '#80909a', textTransform: 'uppercase' }}>
                      {risk.replace('_hazard', '').replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '11px', color: color, fontWeight: 'bold', marginTop: '2px' }}>
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* In-Situ Resource Recommendations */}
          <div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#FFFFFF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="#00e5ff" />
              PRIORITIZED IN-SITU RESOURCES (ISRU)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(prediction?.resource_recommendations || [
                { resource_name: 'Subsurface Regolith Ice (H2O)', suitability_score: 94, extraction_method: 'Sabatier ISRU Propellant & Water' },
                { resource_name: 'Atmospheric CO2 Cracking', suitability_score: 91, extraction_method: 'MOXIE O2 Production' },
                { resource_name: 'Basalt & Regolith Iron/Silicon', suitability_score: 86, extraction_method: '3D Sintered Habitat Construction' }
              ]).map((res, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(0, 229, 255, 0.05)',
                    border: '1px solid rgba(0, 229, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#FFFFFF', fontWeight: 'bold' }}>
                      {res.resource_name}
                    </div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#80909a', marginTop: '2px' }}>
                      UTIL: {res.extraction_method}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '14px', fontWeight: 'bold', color: '#00e676' }}>
                      {res.suitability_score}%
                    </div>
                    <div style={{ fontSize: '8px', color: '#80909a', fontFamily: "'Roboto Mono', monospace" }}>
                      VIABILITY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable AI Reasons */}
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px 14px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a', marginBottom: '6px' }}>
              EXPLAINABLE AI TELEMETRY SYNTHESIS
            </div>
            {prediction?.explainability_reasons?.map((reason, idx) => (
              <div key={idx} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#d0d8e0', lineHeight: 1.5, marginBottom: '4px' }}>
                ▸ {reason}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnvironmentMonitor;
