import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AuroraBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <style>
        {`
          .fluid-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: ${isDark ? '0.45' : '0.35'};
            mix-blend-mode: ${isDark ? 'screen' : 'multiply'};
          }
          
          .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(120px);
            opacity: 0.7;
            will-change: transform;
            width: 700px;
            height: 700px;
            top: 30%;
            left: 50%;
            margin-top: -350px;
            margin-left: -350px;
          }

          @keyframes fluid-wrap-1 {
            0% { transform: translate(-80%, -20%) scale(1.2); }
            50% { transform: translate(40%, 10%) scale(1.5); }
            100% { transform: translate(-80%, -20%) scale(1.2); }
          }
          @keyframes fluid-wrap-2 {
            0% { transform: translate(70%, 30%) scale(1.4); }
            50% { transform: translate(-30%, -20%) scale(1.1); }
            100% { transform: translate(70%, 30%) scale(1.4); }
          }
          @keyframes fluid-wrap-3 {
            0% { transform: translate(-75%, 20%) scale(1.1); }
            50% { transform: translate(45%, -10%) scale(1.6); }
            100% { transform: translate(-75%, 20%) scale(1.1); }
          }
          @keyframes fluid-wrap-4 {
            0% { transform: translate(80%, -10%) scale(1.6); }
            50% { transform: translate(-40%, 15%) scale(1.2); }
            100% { transform: translate(80%, -10%) scale(1.6); }
          }
        `}
      </style>

      {/* GPU-Optimized Vignette Layer (Replaces WebKit CSS stencils for buttery smooth layout painting) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at 50% 30%, rgba(11, 4, 22, 0) 15%, rgba(11, 4, 22, 0.4) 45%, #0B0416 85%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(250, 249, 246, 0) 15%, rgba(250, 249, 246, 0.4) 45%, #FAF9F6 85%)'
        }}
      />

      <div className="fluid-bg">
        <div className="blob blob-1" style={{ backgroundColor: isDark ? '#C4275A' : '#ff6ec7', animation: 'fluid-wrap-1 11s ease-in-out infinite' }} />
        <div className="blob blob-2" style={{ backgroundColor: isDark ? '#00C4B8' : '#00d4ff', animation: 'fluid-wrap-2 15s ease-in-out infinite' }} />
        <div className="blob blob-3" style={{ backgroundColor: isDark ? '#CC0088' : '#7b61ff', animation: 'fluid-wrap-3 13s ease-in-out infinite' }} />
        <div className="blob blob-4" style={{ backgroundColor: isDark ? '#6200CC' : '#a8ff78', animation: 'fluid-wrap-4 18s ease-in-out infinite' }} />
      </div>
    </div>
  );
};

export default AuroraBackground;

