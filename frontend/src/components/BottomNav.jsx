import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, User, Globe, Activity, FileText } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'CONTROL', path: '/dashboard', icon: Shield },
    { name: 'SUIT HUD', path: '/astronaut', icon: User },
    { name: '3D PLANET SIM', path: '/environment', icon: Globe },
    { name: 'CASCADE LAB', path: '/cascade', icon: Activity }
  ];

  return (
    <footer
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '0',
        backgroundColor: 'rgba(8, 12, 22, 0.98)',
        borderTop: '1px solid rgba(0, 229, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 100
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 28px',
                color: isActive ? '#00e5ff' : '#80909a',
                textDecoration: 'none',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1px',
                borderTop: isActive ? '2px solid #00e5ff' : '2px solid transparent',
                background: isActive ? 'linear-gradient(to top, rgba(0,229,255,0.12) 0%, transparent 100%)' : 'transparent',
                transition: 'all 0.25s ease',
                minWidth: '130px'
              })}
            >
              <Icon size={18} style={{ marginBottom: '4px' }} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNav;
