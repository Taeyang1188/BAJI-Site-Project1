import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AuroraBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        maskImage: 'radial-gradient(ellipse at 50% 30%, black 0%, black 25%, transparent 60%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 0%, black 25%, transparent 60%)',
      }}
    >
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
            will-change: transform, background-color;
            width: 700px;
            height: 700px;
            top: 30%;
            left: 50%;
            margin-top: -350px;
            margin-left: -350px;
          }

          @keyframes fluid-wrap-1 {
            0% { transform: translate(-80%, -20%) scale(1.2); background-color: ${isDark ? '#C4275A' : '#ff6ec7'}; }
            50% { transform: translate(40%, 10%) scale(1.5); background-color: ${isDark ? '#B85A00' : '#7b61ff'}; }
            100% { transform: translate(-80%, -20%) scale(1.2); background-color: ${isDark ? '#C4B800' : '#00d4ff'}; }
          }
          @keyframes fluid-wrap-2 {
            0% { transform: translate(70%, 30%) scale(1.4); background-color: ${isDark ? '#00C4B8' : '#00d4ff'}; }
            50% { transform: translate(-30%, -20%) scale(1.1); background-color: ${isDark ? '#0052CC' : '#ff6ec7'}; }
            100% { transform: translate(70%, 30%) scale(1.4); background-color: ${isDark ? '#8800CC' : '#a8ff78'}; }
          }
          @keyframes fluid-wrap-3 {
            0% { transform: translate(-75%, 20%) scale(1.1); background-color: ${isDark ? '#CC0088' : '#7b61ff'}; }
            50% { transform: translate(45%, -10%) scale(1.6); background-color: ${isDark ? '#CC3700' : '#00d4ff'}; }
            100% { transform: translate(-75%, 20%) scale(1.1); background-color: ${isDark ? '#00CC6D' : '#ff6ec7'}; }
          }
          @keyframes fluid-wrap-4 {
            0% { transform: translate(80%, -10%) scale(1.6); background-color: ${isDark ? '#6200CC' : '#a8ff78'}; }
            50% { transform: translate(-40%, 15%) scale(1.2); background-color: ${isDark ? '#00A8CC' : '#7b61ff'}; }
            100% { transform: translate(80%, -10%) scale(1.6); background-color: ${isDark ? '#C4275A' : '#00d4ff'}; }
          }
        `}
      </style>

      <div className="fluid-bg">
        <div className="blob blob-1" style={{ animation: `fluid-wrap-1 ${isDark ? '11s' : '22s'} ease-in-out infinite` }} />
        <div className="blob blob-2" style={{ animation: `fluid-wrap-2 ${isDark ? '15s' : '30s'} ease-in-out infinite` }} />
        <div className="blob blob-3" style={{ animation: `fluid-wrap-3 ${isDark ? '13s' : '26s'} ease-in-out infinite` }} />
        <div className="blob blob-4" style={{ animation: `fluid-wrap-4 ${isDark ? '18s' : '36s'} ease-in-out infinite` }} />
      </div>
    </div>
  );
};

export default AuroraBackground;

