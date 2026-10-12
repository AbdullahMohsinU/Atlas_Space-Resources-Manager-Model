import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, Activity, Thermometer, Wind, Zap, Compass, CheckSquare, Square } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const FORECAST_DATA = [
  { time: 'T-0', historical: 78, projection: 78, advisory: 65, abort: 60 },
  { time: 'T+15', historical: null, projection: 74, advisory: 65, abort: 60 },
  { time: 'T+30', historical: null, projection: 67, advisory: 65, abort: 60 },
  { time: 'T+35', historical: null, projection: 65, advisory: 65, abort: 60 },
  { time: 'T+45', historical: null, projection: 61, advisory: 65, abort: 60 },
  { time: 'T+60', historical: null, projection: 50, advisory: 65, abort: 60 }
];

const STAGES = [
  {
    num: '01',
    name: 'ENVIRONMENT',
    badge: 'WARNING AMBER',
    badgeColor: '#ff9100',
    details: 'Elevated thermal load detected (Surface 45.2°C, Solar Irradiance 1300 W/m²). Regolith backscatter active.'
  },
  {
    num: '02',
    name: 'ASTRONAUT',
    badge: 'LOAD ELEVATED',
    badgeColor: '#ffd600',
    details: 'Higher simulated physiological load: 112 BPM, Core Temp 37.6°C (+0.5°C). Metabolic rate at 180 kcal/hr.'
  },
  {
    num: '03',
    name: 'SUIT LIFE SUPPORT',
    badge: 'HIGH DEMAND',
    badgeColor: '#ff9100',
    details: 'Increased sublimator cooling demand (380W thermal rejection load). Radiator vapor pressure climbing.'
  },
  {
    num: '04',
    name: 'RESOURCES',
    badge: 'BURN RATE ++',
    badgeColor: '#ff9100',
    details: 'Reduced cooling water margin: Reservoir burn rate at 1.4x standard. Water delta: -320ml/hr over baseline.'
  },
  {
    num: '05',
    name: 'MISSION MARGIN',
    badge: 'CRITICAL ALERT',
    badgeColor: '#ff1744',
    details: 'Simulated EVA Margin reduced from 78% → 58% // Critical ingress window closing in T-44 min.'
  },
  {
    num: '06',
    name: 'CONTINGENCY & INGRESS',
    badge: 'ACTIVE RECOMMENDATION',
    badgeColor: '#00e5ff',
    details: 'Return scenario review triggered // Nominal ingress path Alpha-South recommended. Airlock hatch prep initiated.'
  }
];

const CascadeEngine = () => {
  const [selectedActions, setSelectedActions] = useState([true, false, true, true, false, true]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [contingencyConfirmed, setContingencyConfirmed] = useState(false);
  const [simResults, setSimResults] = useState(null);

  const toggleAction = (idx) => {
    setSelectedActions(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimResults({
        marginShift: '-24%',
        coolingLoad: '+48%',
        burnRate: '1.8x',
        ingressWindow: '42m'
      });
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.3fr',
        gap: '20px',
        height: '100%',
        overflowY: 'auto',
        paddingBottom: '30px'
      }}
    >
      {/* LEFT COLUMN: WHAT-IF LAB & FORECAST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Header Header vector */}
        <div className="bg-panel" style={{ padding: '16px', borderRadius: '6px' }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#00e5ff', letterSpacing: '2px', marginBottom: '4px' }}>
            SIMULATE THE FUTURE BEFORE IT BECOMES THE PRESENT
          </div>
          <h2 style={{ fontSize: '18px', color: '#FFFFFF' }}>AI MARGIN & WHAT-IF LAB</h2>
        </div>

        {/* Forecast Graph Panel */}
        <div className="bg-panel glowing-border" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a' }}>TELEMETRY VECTOR</div>
              <h3 style={{ fontSize: '15px' }}>MISSION MARGIN FORECAST</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '26px', fontWeight: 'bold', color: '#00e5ff' }}>
                78%
              </div>
              <div style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: '#80909a' }}>CURRENT MET</div>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={FORECAST_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="time" stroke="#80909a" fontSize={10} />
                <YAxis domain={[40, 100]} stroke="#80909a" fontSize={10} />
                <Tooltip contentStyle={{ background: '#09101d', borderColor: '#00e5ff', fontFamily: 'Roboto Mono' }} />
                <Line type="monotone" dataKey="projection" stroke="#00e5ff" strokeWidth={2.5} dot={{ r: 4 }} name="AI Projection" />
                <Line type="monotone" dataKey="advisory" stroke="#ff9100" strokeDasharray="4 4" strokeWidth={1.5} name="65% Advisory Limit" />
                <Line type="monotone" dataKey="abort" stroke="#ff1744" strokeDasharray="2 2" strokeWidth={1.5} name="60% Critical Abort" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Explainable AI Cards */}
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#80909a' }}>
              <span>WHY DID THE FORECAST CHANGE? [EXPLAINABLE AI]</span>
              <span style={{ color: '#00e5ff' }}>3 PARAMETERS</span>
            </div>

            <div style={{ padding: '8px 12px', background: 'rgba(255, 145, 0, 0.08)', border: '1px solid rgba(255, 145, 0, 0.3)', borderRadius: '4px', fontSize: '11px', fontFamily: "'Roboto Mono', monospace" }}>
              <span style={{ color: '#ff9100', fontWeight: 'bold' }}>METABOLIC DEMAND SURGE (+18%): </span>
              <span style={{ color: '#d0d8e0' }}>Ascent trajectory increases simulated physiological load to 240W.</span>
            </div>

            <div style={{ padding: '8px 12px', background: 'rgba(255, 145, 0, 0.08)', border: '1px solid rgba(255, 145, 0, 0.3)', borderRadius: '4px', fontSize: '11px', fontFamily: "'Roboto Mono', monospace" }}>
              <span style={{ color: '#ff9100', fontWeight: 'bold' }}>REGOLITH HEAT RADIANCE (+45°C): </span>
              <span style={{ color: '#d0d8e0' }}>Elevated ambient sun angle amplifies LCG water sublimation rates.</span>
            </div>

            <div style={{ padding: '8px 12px', background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: '4px', fontSize: '11px', fontFamily: "'Roboto Mono', monospace" }}>
              <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>RESERVE DRAWDOWN (-11%): </span>
              <span style={{ color: '#d0d8e0' }}>Primary O2 loop switchover shrinks ingress safety margin by 14 minutes.</span>
            </div>
          </div>
        </div>

        {/* Monte Carlo Lab Simulation */}
        <div className="bg-panel" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '12px', color: '#00e5ff' }}>MONTE CARLO LAB // WHAT-IF STRESS SIMULATION</h4>
            <span style={{ padding: '2px 8px', background: '#0077ff', color: '#fff', fontSize: '9px', borderRadius: '2px', fontFamily: 'Roboto Mono' }}>ACTIVE BENCH</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#80909a', marginBottom: '6px' }}>BASELINE [CURRENT]</div>
              <div>AMB TEMP: <span style={{ color: '#fff' }}>32°C</span></div>
              <div>WORKLOAD: <span style={{ color: '#fff' }}>120W (MOD)</span></div>
              <div>O2 STATUS: <span style={{ color: '#00e676' }}>78%</span></div>
              <div>COOLING: <span style={{ color: '#00e676' }}>82%</span></div>
              <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#00e5ff' }}>MARGIN: 78%</div>
            </div>

            <div style={{ background: 'rgba(255, 23, 68, 0.08)', border: '1px solid rgba(255, 23, 68, 0.3)', padding: '10px', borderRadius: '4px' }}>
              <div style={{ color: '#ff1744', marginBottom: '6px' }}>STRESS SIM [PARAM TEST]</div>
              <div>AMB TEMP: <span style={{ color: '#ff9100' }}>45°C</span></div>
              <div>WORKLOAD: <span style={{ color: '#ff1744' }}>240W (HIGH)</span></div>
              <div>O2 STATUS: <span style={{ color: '#ffd600' }}>55%</span></div>
              <div>COOLING: <span style={{ color: '#ffd600' }}>56%</span></div>
              <div style={{ marginTop: '8px', fontWeight: 'bold', color: '#ff1744' }}>MARGIN: 54%</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            style={{
              width: '100%',
              marginTop: '14px',
              padding: '12px',
              background: '#00e5ff',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '12px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
          >
            {isSimulating ? 'EXECUTING MONTE CARLO ITERATIONS...' : '▶ EXECUTE REAL-TIME WHAT-IF SIMULATION'}
          </motion.button>

          {/* Delta Impact Comparison */}
          <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ fontSize: '8px', color: '#80909a' }}>MARGIN SHIFT</div>
              <div style={{ fontSize: '13px', color: '#ff1744', fontWeight: 'bold' }}>-24%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ fontSize: '8px', color: '#80909a' }}>COOLING LOAD</div>
              <div style={{ fontSize: '13px', color: '#ff9100', fontWeight: 'bold' }}>+48%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ fontSize: '8px', color: '#80909a' }}>O2 BURN RATE</div>
              <div style={{ fontSize: '13px', color: '#ffd600', fontWeight: 'bold' }}>1.8x</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px' }}>
              <div style={{ fontSize: '8px', color: '#80909a' }}>INGRESS WINDOW</div>
              <div style={{ fontSize: '13px', color: '#00e5ff', fontWeight: 'bold' }}>42m</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 6-STAGE PROPAGATION TREE & CONTINGENCY CONSOLE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Cascade Header */}
        <div className="bg-panel" style={{ padding: '16px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '10px', color: '#ff9100' }}>
                CONTINGENCY PROTOCOL DELTA-3 // ARES-SYNTH
              </div>
              <h3 style={{ fontSize: '16px', color: '#FFFFFF' }}>MISSION CASCADE & CONTINGENCY ENGINE</h3>
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', textAlign: 'right' }}>
              <div>PROPAGATION LAG: <span style={{ color: '#00e5ff' }}>142 ms</span></div>
              <div>EVA REMAINING: <span style={{ color: '#ff9100' }}>58% (-20%)</span></div>
            </div>
          </div>
        </div>

        {/* 6-Stage Propagation Timeline */}
        <div className="bg-panel" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#00e5ff' }}>
            <span>6-STAGE SYSTEM PROPAGATION TREE</span>
            <span style={{ color: '#00e676' }}>SOL 184 ACTIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STAGES.map((stg) => (
              <div
                key={stg.num}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderLeft: `4px solid ${stg.badgeColor}`,
                  border: '1px solid rgba(26, 39, 68, 0.7)'
                }}
              >
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: stg.badgeColor, fontWeight: 'bold', minWidth: '70px' }}>
                  STAGE {stg.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#FFFFFF' }}>{stg.name}</span>
                    <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: stg.badgeColor, border: `1px solid ${stg.badgeColor}`, padding: '1px 6px', borderRadius: '2px' }}>
                      {stg.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#80909a', lineHeight: 1.4 }}>
                    {stg.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Decision Matrix Checkbox List */}
        <div className="bg-panel" style={{ padding: '18px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#ff9100' }}>
              STATUS: REVIEW REQUIRED // ACTIONABLE DECISION MATRIX
            </span>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#80909a' }}>
              6 ACTIONS IDENTIFIED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: '[REVIEW O2 MARGIN]', meta: 'TELEMETRY: Check 78.4% nominal, consumption acceptable' },
              { title: '[THROTTLE SUIT COOLING]', meta: 'CRITICAL OPT: Activate sublimator economizer loop (-15% water)' },
              { title: '[REDUCE SIMULATED WORKLOAD]', meta: 'PHYSIO: Order 10-minute mandatory rest stop at Waypoint Delta' },
              { title: '[EVALUATE RETURN SCENARIO]', meta: 'RECOMMENDED: Ingress airlock distance: 340m, estimated t-14 min' },
              { title: '[VERIFY REDUNDANT COMMS]', meta: 'AVIONICS: UHF Channel B secondary link confirmed operational' },
              { title: '[LOG TO FLIGHT RECORDER]', meta: 'AUTO-QUEUE: SOL 184 telemetry packet archived' }
            ].map((act, i) => (
              <div
                key={i}
                onClick={() => toggleAction(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  background: selectedActions[i] ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${selectedActions[i] ? '#00e5ff' : 'rgba(26, 39, 68, 0.8)'}`,
                  cursor: 'pointer',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px'
                }}
              >
                {selectedActions[i] ? <CheckSquare size={16} color="#00e5ff" /> : <Square size={16} color="#80909a" />}
                <div style={{ flex: 1 }}>
                  <span style={{ color: selectedActions[i] ? '#FFFFFF' : '#80909a', fontWeight: 'bold' }}>{act.title}</span>
                  <div style={{ fontSize: '10px', color: '#80909a' }}>{act.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Human-In-The-Loop Verification & Ingress Button */}
        <div className="bg-panel glowing-border" style={{ padding: '20px', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', color: '#00e5ff' }}>
              HUMAN-IN-THE-LOOP VERIFICATION CONSOLE
            </span>
            <span style={{ padding: '2px 8px', background: '#00e5ff', color: '#000', fontSize: '9px', fontWeight: 'bold', borderRadius: '2px' }}>
              AUTH REQ
            </span>
          </div>

          <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#80909a', lineHeight: 1.5, marginBottom: '14px' }}>
            Human decision required before command uplink. Autonomous execution suspended per Flight Protocol Delta-3. Mission Commander approval required to transmit telemetry bypass commands.
          </p>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setContingencyConfirmed(!contingencyConfirmed)}
            style={{
              width: '100%',
              padding: '14px',
              background: contingencyConfirmed ? '#00e676' : '#00e5ff',
              border: 'none',
              borderRadius: '4px',
              color: '#000000',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '13px',
              fontWeight: 900,
              letterSpacing: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {contingencyConfirmed ? '✓ CONTINGENCY INGRESS CONFIRMED & TRANSMITTED' : '⮞ CONFIRM CONTINGENCY INGRESS'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CascadeEngine;
