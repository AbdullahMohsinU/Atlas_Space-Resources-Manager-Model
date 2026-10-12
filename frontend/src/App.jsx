import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import EnvironmentMonitor from './pages/EnvironmentMonitor';
import AstronautHub from './pages/AstronautHub';
import CascadeEngine from './pages/CascadeEngine';
import StatusBar from './components/StatusBar';
import BottomNav from './components/BottomNav';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="app-container">
      <div className="scanlines"></div>
      {!isLanding && <StatusBar />}
      
      <main className={`main-content ${isLanding ? 'full-height' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/environment" element={<EnvironmentMonitor />} />
            <Route path="/astronaut" element={<AstronautHub />} />
            <Route path="/cascade" element={<CascadeEngine />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isLanding && <BottomNav />}
    </div>
  );
}

export default App;
