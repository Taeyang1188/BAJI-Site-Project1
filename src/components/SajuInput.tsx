import React, { useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Sparkles, Moon, Sun, Clock, Calendar } from 'lucide-react';

interface SajuData {
  birthDate: string;
  birthTime: string;
  name: string;
}

export default function SajuInput() {
  const [formData, setFormData] = useState<SajuData>({
    birthDate: '',
    birthTime: '12:00',
    name: '',
  });

  // Calculate rotation based on time and date
  // We use a simple hash of the date and time to determine the "cosmic angle"
  const cosmicAngle = useMemo(() => {
    if (!formData.birthDate) return 0;
    
    const dateNum = new Date(formData.birthDate).getTime() || 0;
    const [hours, minutes] = formData.birthTime.split(':').map(Number);
    const timeNum = (hours * 60 + minutes) * 1000;
    
    // Normalize to 0-360
    return ((dateNum + timeNum) / 100000) % 360;
  }, [formData.birthDate, formData.birthTime]);

  const springRotation = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    springRotation.set(cosmicAngle);
  }, [cosmicAngle, springRotation]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-cosmic-bg relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cosmic-purple/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cosmic-pink/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card rounded-[40px] p-8 relative z-10 neon-glow-purple"
      >
        {/* Cosmic Wheel Section */}
        <div className="relative h-48 flex justify-center items-end overflow-hidden mb-8">
          <motion.div 
            style={{ rotate: springRotation }}
            className="absolute top-0 w-80 h-80 border-[1px] border-white/20 rounded-full flex items-center justify-center"
          >
            {/* Celestial Markers */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                className="absolute h-full w-[1px] bg-white/10"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-cosmic-cyan rounded-full shadow-[0_0_8px_#2ff7f7]" />
              </div>
            ))}
            
            {/* Inner Symbols */}
            <div className="absolute inset-8 border border-white/5 rounded-full" />
            <div className="text-white/40 font-display text-[10px] tracking-widest uppercase">
              Cosmic Alignment
            </div>
          </motion.div>
          
          {/* Center Indicator */}
          <div className="absolute bottom-0 w-1 h-12 bg-gradient-to-t from-cosmic-cyan to-transparent z-20" />
          <div className="absolute bottom-0 p-2 bg-cosmic-bg rounded-full border border-cosmic-cyan/50 z-30 shadow-[0_0_15px_#2ff7f7]">
            <Sparkles className="w-4 h-4 text-cosmic-cyan" />
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold tracking-tight text-white neon-text-purple mb-2">
              Saju Discovery
            </h1>
            <p className="text-white/50 text-sm font-light">
              Enter your details to align with the stars
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#1a0b30] text-[10px] uppercase tracking-[0.2em] text-cosmic-cyan font-bold">
                Name
              </label>
              <input 
                type="text"
                placeholder="Your Name"
                className="w-full bg-transparent border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-cosmic-purple transition-colors font-light"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Date Input */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#1a0b30] text-[10px] uppercase tracking-[0.2em] text-cosmic-cyan font-bold">
                Birth Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="date"
                  className="w-full bg-transparent border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-cosmic-purple transition-colors font-light [color-scheme:dark]"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>
            </div>

            {/* Time Input */}
            <div className="relative group">
              <label className="absolute -top-2.5 left-4 px-2 bg-[#1a0b30] text-[10px] uppercase tracking-[0.2em] text-cosmic-cyan font-bold">
                Birth Time
              </label>
              <div className="relative">
                <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="time"
                  className="w-full bg-transparent border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:border-cosmic-purple transition-colors font-light [color-scheme:dark]"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 bg-gradient-to-r from-cosmic-purple to-cosmic-pink rounded-2xl text-white font-display font-bold tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(123,47,247,0.3)]"
          >
            Reveal My Destiny
          </motion.button>
        </div>

        {/* Footer Decoration */}
        <div className="mt-8 flex justify-center gap-6 opacity-20">
          <Sun className="w-4 h-4" />
          <Moon className="w-4 h-4" />
          <Sparkles className="w-4 h-4" />
        </div>
      </motion.div>

      {/* Floating Particles (Decorative) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
