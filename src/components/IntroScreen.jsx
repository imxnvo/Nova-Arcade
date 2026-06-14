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

    // Stage updates over the timeline matching the video flow
    const timers = [
      // Stage 1 -> Stage 2: Draw base line & start "NO" flicker
      setTimeout(() => setStage(2), 1500),
      // Stage 2 -> Stage 3: Complete the full word "NOVA"
      setTimeout(() => setStage(3), 3200),
      // Stage 3 -> Stage 4: Add "ARCADE" in outline under "NOVA"
      setTimeout(() => setStage(4), 4600),
      // Stage 4 -> Stage 5: Lens Flare Sweep begins across the logo
      setTimeout(() => setStage(5), 5600),
      // Stage 5 -> Complete: Trigger the fade transition of the preloader
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
      {/* Dynamic Grid Background with glowing purple neon floor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0a0f_1px,transparent_1px),linear-gradient(to_bottom,#0c0a0f_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-brand-violet/5 blur-[160px] pointer-events-none" />

      {/* Intro Canvas */}
      <div className="relative flex flex-col items-center justify-center" id="intro-canvas">
        
        {/* Stage 1: Diagonal neon segment / glowing light spark */}
        {stage === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.1, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-16 h-1 border-t-2 border-r-2 border-brand-fuchsia text-brand-fuchsia shadow-[0_0_15px_#d946ef] absolute z-15"
            style={{ top: '-40px', left: '-50px' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white absolute right-0 top-0 shadow-[0_0_8px_#fff]" />
          </motion.div>
        )}

        {/* Ambient neon sparkles in backgrounds */}
        {stage >= 2 && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-12 z-0 opacity-40">
            <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-fuchsia animate-pulse delay-500" />
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-ping delay-1000" />
          </div>
        )}

        {/* Main Logo Text wrapper */}
        <div className="flex flex-col items-center relative z-10 scale-90 sm:scale-100" id="intro-text-combo">
          
          {/* word "NOVA" container */}
          <div className="flex font-black italic tracking-tighter text-6xl sm:text-8xl md:text-9xl uppercase font-display select-none">
            
            {/* NO letters group */}
            {stage >= 2 ? (
              <motion.div 
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                <span className="text-pink-500 text-neon-pink-shadow animate-neon-pink select-none">N</span>
                <span className="text-cyan-400 text-neon-cyan-shadow animate-neon-cyan select-none ml-1 sm:ml-2">O</span>
              </motion.div>
            ) : (
              <span className="opacity-0 select-none">NO</span>
            )}

            {/* VA letters group */}
            {stage >= 3 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="flex"
              >
                <span className="text-pink-500 text-neon-pink-shadow animate-neon-pink ml-1 sm:ml-2 select-none">V</span>
                <span className="text-cyan-400 text-neon-cyan-shadow animate-neon-cyan select-none">A</span>
              </motion.div>
            ) : (
              <span className="opacity-0 select-none">VA</span>
            )}
          </div>

          {/* word "ARCADE" container */}
          <div className="h-12 sm:h-20 flex items-center justify-center mt-2 relative overflow-visible w-full">
            {stage >= 4 && (
              <motion.h2 
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.25em] text-neon-outline-blue font-display select-none"
              >
                ARCADE
              </motion.h2>
            )}
          </div>
        </div>

        {/* Stage 5: Anamorphic Horizontal Lens-flare & Glowing sparkles */}
        {stage >= 5 && (
          <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none">
            {/* The lens flare line running horizontally across */}
            <div className="lens-flare-line absolute w-[120vw] left-1/2 -translate-x-1/2" />
            
            {/* Pulsing center stars simulating flash lens sparkle in video */}
            <div className="absolute left-[30vw] top-1/2 -translate-y-1/2 sparkle-burst text-white">
              <Sparkles className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_10px_#22d3ee]" />
            </div>
            
            <div className="absolute right-[25vw] top-1/3 -translate-y-1/2 sparkle-burst text-white delay-300">
              <Sparkles className="w-8 h-8 text-fuchsia-400 drop-shadow-[0_0_8px_#f472b6]" />
            </div>
          </div>
        )}

      </div>

      {/* Sleek bottom status readout & skip button */}
      <div className="absolute bottom-10 left-6 right-6 flex items-center justify-between z-30 font-mono text-[10px] sm:text-xs">
        <div className="flex items-center gap-2.5 text-zinc-500 uppercase tracking-widest">
          <Gamepad2 className="w-4 h-4 text-brand-fuchsia animate-bounce" />
          <span>INITIALIZING NOVA CORE...</span>
          <span className="text-zinc-700 hidden xs:inline">|</span>
          <span className="hidden xs:inline text-brand-violet font-bold">READY TO BOOT</span>
        </div>

        {/* Skip action button */}
        <button
          onClick={handleSkip}
          className="px-4 py-2 bg-zinc-950/80 hover:bg-white hover:text-black border border-zinc-800 hover:border-white text-zinc-400 font-bold transition-all duration-300 tracking-widest uppercase cursor-pointer"
          id="skip-intro-action"
        >
          SKIP INTRO [SPACE]
        </button>
      </div>

      {/* Progress loading strip at the very bottom */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-brand-violet via-brand-fuchsia to-cyan-400 z-40 ease-linear" style={{ width: '100%', animation: 'progress-loading 7.4s linear' }} />
    </div>
  );
}
