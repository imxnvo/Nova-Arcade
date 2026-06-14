import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2 } from 'lucide-react';

export default function IntroScreen({ onComplete }) {
  const [stage, setStage] = useState(1);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;

    // Keyboard listener to skip with Space or Enter key
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Exact video timeline synchronization (7.4s total)
    const timers = [
      // 0.0s - 1.0s: N left leg strikes (Stage 1)
      setTimeout(() => setStage(2), 1000),      // Stage 2: N rest + O strike
      setTimeout(() => setStage(3), 2200),      // Stage 3: V + A strike (NOVA fully illuminated)
      setTimeout(() => setStage(4), 3300),      // Stage 4: ARCADE strike below
      setTimeout(() => setStage(5), 4500),      // Stage 5: Anamorphic lens flare flash sweep
      setTimeout(() => setStage(6), 6200),      // Stage 6: Fade transition of logo before exit
      setTimeout(() => {
        onComplete();
      }, 7400)
    ];

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timers.forEach(t => clearTimeout(t));
    };
  }, [skipped, onComplete]);

  const handleSkip = () => {
    setSkipped(true);
    onComplete();
  };

  return (
    <div 
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden font-sans select-none"
      id="nova-arcade-intro-bg"
    >
      {/* 1. Cinematic Screen Flash Overlay (fires at 4.5s) */}
      <div className="absolute inset-0 screen-flash-overlay pointer-events-none z-45" />

      {/* 2. 3D Scrolling Perspective Grid Floor at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 retro-grid-floor opacity-80" />
        {/* Horizon glowing line & fog gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-t from-transparent via-brand-violet/10 to-brand-fuchsia/20 blur-md" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-fuchsia to-cyan-400 opacity-60" />
      </div>

      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-violet/5 blur-[160px] pointer-events-none" />

      {/* 3. Intro Canvas Container */}
      <div className="relative flex flex-col items-center justify-center scale-90 sm:scale-105 md:scale-110 z-10" id="intro-canvas">
        
        {/* Sparkle burst at 4.5s in background */}
        {stage >= 5 && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
            {/* Center flash point */}
            <div className="sparkle-ping-v2">
              <div className="w-14 h-14 rounded-full bg-white blur-md opacity-90" />
              <div className="w-24 h-24 rounded-full bg-cyan-400/40 blur-2xl" />
            </div>
            
            {/* Horizontal anamorphic flare line */}
            <div className="lens-flare-line-v2 w-[150vw]" />
          </div>
        )}

        {/* Main Logo Text combination */}
        <div className="flex flex-col items-center relative z-10" id="intro-text-combo">
          
          {/* Authentic SVG Neon "NOVA" Title Layout */}
          <div className="flex gap-4 sm:gap-6 md:gap-8 justify-center items-center">
            
            {/* Letter N */}
            <svg viewBox="0 0 100 150" className="w-16 h-24 sm:w-24 sm:h-36 md:w-32 md:h-48 shrink-0 overflow-visible" id="neon-letter-n">
              {/* Glass Tube Frame Structure (Unlit) */}
              <line x1="20" y1="15" x2="20" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <line x1="20" y1="15" x2="80" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <line x1="80" y1="15" x2="80" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />

              {/* Stroke 1: Left Pink Leg (Immediate start) */}
              <line x1="20" y1="15" x2="20" y2="135" stroke="#ff2e93" strokeWidth="12" className="neon-n-left-glow" />
              <line x1="20" y1="15" x2="20" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-n-left-core" />
              
              {/* Stroke 2: Diagonal Cyan (Stage 2 delay) */}
              <line x1="20" y1="15" x2="80" y2="135" stroke="#00f0ff" strokeWidth="12" className="neon-stage2-cyan-glow" />
              <line x1="20" y1="15" x2="80" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage2-core" />
              
              {/* Stroke 3: Right Pink Leg (Stage 2 delay) */}
              <line x1="80" y1="15" x2="80" y2="135" stroke="#ff2e93" strokeWidth="12" className="neon-stage2-pink-glow" />
              <line x1="80" y1="15" x2="80" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage2-core" />
            </svg>

            {/* Letter O */}
            <svg viewBox="0 0 100 150" className="w-16 h-24 sm:w-24 sm:h-36 md:w-32 md:h-48 shrink-0 overflow-visible" id="neon-letter-o">
              {/* Glass Tube Frame Structure (Unlit) */}
              <path d="M 50,15 C 20,15 20,135 50,135" fill="none" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <path d="M 50,15 C 80,15 80,135 50,135" fill="none" stroke="#101015" strokeWidth="12" strokeLinecap="round" />

              {/* Left Curve: Pink (Stage 2 delay) */}
              <path d="M 50,15 C 20,15 20,135 50,135" fill="none" stroke="#ff2e93" strokeWidth="12" className="neon-stage2-pink-glow" />
              <path d="M 50,15 C 20,15 20,135 50,135" fill="none" stroke="#ffffff" strokeWidth="3" className="neon-stage2-core" />
              
              {/* Right Curve: Cyan (Stage 2 delay) */}
              <path d="M 50,15 C 80,15 80,135 50,135" fill="none" stroke="#00f0ff" strokeWidth="12" className="neon-stage2-cyan-glow" />
              <path d="M 50,15 C 80,15 80,135 50,135" fill="none" stroke="#ffffff" strokeWidth="3" className="neon-stage2-core" />
            </svg>

            {/* Letter V */}
            <svg viewBox="0 0 100 150" className="w-16 h-24 sm:w-24 sm:h-36 md:w-32 md:h-48 shrink-0 overflow-visible" id="neon-letter-v">
              {/* Glass Tube Frame Structure (Unlit) */}
              <line x1="15" y1="15" x2="50" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <line x1="85" y1="15" x2="50" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />

              {/* Left Angle: Pink (Stage 3 delay) */}
              <line x1="15" y1="15" x2="50" y2="135" stroke="#ff2e93" strokeWidth="12" className="neon-stage3-pink-glow" />
              <line x1="15" y1="15" x2="50" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage3-core" />
              
              {/* Right Angle: Cyan (Stage 3 delay) */}
              <line x1="85" y1="15" x2="50" y2="135" stroke="#00f0ff" strokeWidth="12" className="neon-stage3-cyan-glow" />
              <line x1="85" y1="15" x2="50" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage3-core" />
            </svg>

            {/* Letter A */}
            <svg viewBox="0 0 100 150" className="w-16 h-24 sm:w-24 sm:h-36 md:w-32 md:h-48 shrink-0 overflow-visible" id="neon-letter-a">
              {/* Glass Tube Frame Structure (Unlit) */}
              <line x1="50" y1="15" x2="15" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <line x1="50" y1="15" x2="85" y2="135" stroke="#101015" strokeWidth="12" strokeLinecap="round" />
              <line x1="32.5" y1="85" x2="67.5" y2="85" stroke="#101015" strokeWidth="12" strokeLinecap="round" />

              {/* Left Leg: Pink (Stage 3 delay) */}
              <line x1="50" y1="15" x2="15" y2="135" stroke="#ff2e93" strokeWidth="12" className="neon-stage3-pink-glow" />
              <line x1="50" y1="15" x2="15" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage3-core" />
              
              {/* Right Leg: Cyan (Stage 3 delay) */}
              <line x1="50" y1="15" x2="85" y2="135" stroke="#00f0ff" strokeWidth="12" className="neon-stage3-cyan-glow" />
              <line x1="50" y1="15" x2="85" y2="135" stroke="#ffffff" strokeWidth="3" className="neon-stage3-core" />
              
              {/* Horizontal Bar: Cyan (Stage 3 delay) */}
              <line x1="32.5" y1="85" x2="67.5" y2="85" stroke="#00f0ff" strokeWidth="11" className="neon-stage3-cyan-glow" />
              <line x1="32.5" y1="85" x2="67.5" y2="85" stroke="#ffffff" strokeWidth="3" className="neon-stage3-core" />
            </svg>
          </div>

          {/* Subtitle neon "ARCADE" Container (Stage 4 strike delay) */}
          <div className="h-14 sm:h-18 flex items-center justify-center mt-3 sm:mt-5 relative overflow-visible w-full">
            <h2 
              className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.25em] font-display select-none neon-arcade-text-strike"
              id="neon-subtitle-arcade"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              ARCADE
            </h2>
          </div>
        </div>
      </div>

      {/* Bottom info panel */}
      <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between z-30 font-mono text-[10px] sm:text-xs">
        <div className="flex items-center gap-2.5 text-zinc-500 uppercase tracking-widest">
          <Gamepad2 className="w-4 h-4 text-brand-fuchsia animate-bounce shrink-0" />
          <span className="truncate max-w-[200px] xs:max-w-none">
            {stage === 1 && "CONNECTING HIGH-VOLTAGE CORE..."}
            {stage === 2 && "STRIKING PRIMARY ANODES (NO)..."}
            {stage === 3 && "STRIKING SECONDARY ANODES (VA)..."}
            {stage === 4 && "CHARGING SUBSYSTEM FILAMENTS..."}
            {stage >= 5 && "INTEGRATING CINEMATIC MATRIX... LOCK IN!"}
          </span>
          <span className="text-zinc-700 hidden xs:inline">|</span>
          <span className="hidden xs:inline text-brand-violet font-bold">READY TO BOOT</span>
        </div>

        {/* Skip button for convenient instant arcade experience */}
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-zinc-950/80 hover:bg-white hover:text-black border border-zinc-800 hover:border-white text-zinc-400 hover:text-black font-bold transition-all duration-300 tracking-widest uppercase cursor-pointer"
          id="skip-intro-action"
        >
          SKIP [SPACE]
        </button>
      </div>

      {/* Synchronized loading loading strip timeline (7.4s exact) */}
      <div 
        className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-brand-violet via-brand-fuchsia to-cyan-400 z-40 ease-linear" 
        style={{ width: '100%', animation: 'progress-loading 7.4s linear forwards' }} 
      />
    </div>
  );
}
