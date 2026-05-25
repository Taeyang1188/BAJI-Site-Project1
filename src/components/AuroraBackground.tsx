import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AuroraBackground: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <style>
        {`
          .fluid-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            opacity: ${isDark ? '0.5' : '0.4'};
            mix-blend-mode: ${isDark ? 'screen' : 'multiply'};
            will-change: transform;
            transform: translate3d(0, 0, 0);
          }
          
          /* Substantially lightweight blur (only 28px) combined with radial-gradients for outstanding performance and zero cooling-fan overhead */
          .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(28px);
            will-change: transform;
            width: 700px;
            height: 700px;
            top: 30%;
            left: 50%;
            margin-top: -350px;
            margin-left: -350px;
            transform: translate3d(0, 0, 0);
          }

          /* Hardware acceleration enabled using translate3d instead of standard translate */
          @keyframes fluid-wrap-1 {
            0% { transform: translate3d(-60%, -20%, 0) scale(1.1); }
            50% { transform: translate3d(30%, 10%, 0) scale(1.3); }
            100% { transform: translate3d(-60%, -20%, 0) scale(1.1); }
          }
          @keyframes fluid-wrap-2 {
            0% { transform: translate3d(50%, 20%, 0) scale(1.3); }
            50% { transform: translate3d(-20%, -15%, 0) scale(1.0); }
            100% { transform: translate3d(50%, 20%, 0) scale(1.3); }
          }
          @keyframes fluid-wrap-3 {
            0% { transform: translate3d(-55%, 15%, 0) scale(1.0); }
            50% { transform: translate3d(35%, -10%, 0) scale(1.4); }
            100% { transform: translate3d(-55%, 15%, 0) scale(1.0); }
          }
          @keyframes fluid-wrap-4 {
            0% { transform: translate3d(60%, -10%, 0) scale(1.4); }
            50% { transform: translate3d(-30%, 10%, 0) scale(1.1); }
            100% { transform: translate3d(60%, -10%, 0) scale(1.4); }
          }
        `}
      </style>

      {/* GPU-Optimized Vignette Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at 50% 30%, rgba(11, 4, 22, 0) 15%, rgba(11, 4, 22, 0.4) 45%, #0B0416 85%)'
            : 'radial-gradient(ellipse at 50% 30%, rgba(250, 249, 246, 0) 15%, rgba(250, 249, 246, 0.4) 45%, #FAF9F6 85%)'
        }}
      />

      <div className="fluid-bg">
        {/* We use inline radial-gradients so that the edges naturally blend and fade prior to any browser blur evaluation */}
        <div 
          className="blob blob-1" 
          style={{ 
            background: isDark 
              ? 'radial-gradient(circle, rgba(196, 39, 90, 0.8) 0%, rgba(196, 39, 90, 0.3) 40%, rgba(196, 39, 90, 0) 70%)' 
              : 'radial-gradient(circle, rgba(255, 110, 199, 0.8) 0%, rgba(255, 110, 199, 0.3) 40%, rgba(255, 110, 199, 0) 70%)', 
            animation: 'fluid-wrap-1 14s ease-in-out infinite' 
          }} 
        />
        <div 
          className="blob blob-2" 
          style={{ 
            background: isDark 
              ? 'radial-gradient(circle, rgba(0, 196, 184, 0.7) 0%, rgba(0, 196, 184, 0.25) 40%, rgba(0, 196, 184, 0) 70%)' 
              : 'radial-gradient(circle, rgba(0, 212, 255, 0.7) 0%, rgba(0, 212, 255, 0.25) 40%, rgba(0, 212, 255, 0) 70%)', 
            animation: 'fluid-wrap-2 18s ease-in-out infinite' 
          }} 
        />
        <div 
          className="blob blob-3" 
          style={{ 
            background: isDark 
              ? 'radial-gradient(circle, rgba(204, 0, 136, 0.75) 0%, rgba(204, 0, 136, 0.3) 40%, rgba(204, 0, 136, 0) 70%)' 
              : 'radial-gradient(circle, rgba(123, 97, 255, 0.75) 0%, rgba(123, 97, 255, 0.3) 40%, rgba(123, 97, 255, 0) 70%)', 
            animation: 'fluid-wrap-3 16s ease-in-out infinite' 
          }} 
        />
        <div 
          className="blob blob-4" 
          style={{ 
            background: isDark 
              ? 'radial-gradient(circle, rgba(98, 0, 204, 0.7) 0%, rgba(98, 0, 204, 0.25) 40%, rgba(98, 0, 204, 0) 70%)' 
              : 'radial-gradient(circle, rgba(168, 255, 120, 0.6) 0%, rgba(168, 255, 120, 0.2) 40%, rgba(168, 255, 120, 0) 70%)', 
            animation: 'fluid-wrap-4 22s ease-in-out infinite' 
          }} 
        />
      </div>
    </div>
  );
};

export default AuroraBackground;
