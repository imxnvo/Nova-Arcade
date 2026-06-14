import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import GameIcon from './GameIcon';
import { RefreshCw, Maximize2, Heart, Info, ArrowLeft } from 'lucide-react';

export default function GamePlay({ game, onClose, isFavorite, onToggleFavorite }) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playContainerRef = useRef(null);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (!playContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      playContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      id={`game-play-layout-${game.id}`}
    >
      {/* 2/3 Column: Game Frame Sandbox Container */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* Play Controls bar header */}
        <div className="flex items-center justify-between bg-zinc-900 border-2 border-zinc-800 p-4 rounded-none">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-950 border-2 border-zinc-800 text-zinc-400 hover:text-brand-fuchsia hover:border-brand-fuchsia transition-colors cursor-pointer"
              title="Back to Games list"
              id="gameplay-back-btn"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div>
              <h2 className="font-display text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                {game.title}
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span>SERVER: </span>
                <span className="text-zinc-500">{game.iframeUrl.startsWith('/') ? 'LOCAL_ASSET_HOST' : 'REMOTE_ARCADE_LINK'}</span>
              </p>
            </div>
          </div>

          {/* Utility buttons for iframe play */}
          <div className="flex items-center gap-2">
            
            {/* Toggle Favorite heart badge */}
            <button
              onClick={() => onToggleFavorite(game.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-none border-2 transition-colors cursor-pointer ${
                isFavorite 
                  ? 'bg-brand-fuchsia border-white text-black' 
                  : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-rose-500 hover:border-zinc-650'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
              id="gameplay-fav-btn"
            >
              <Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Reload control */}
            <button
              onClick={handleReload}
              className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-950 border-2 border-zinc-800 text-zinc-400 hover:text-white hover:border-brand-fuchsia transition-all cursor-pointer"
              title="Restart Game Instance"
              id="gameplay-reload-btn"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>

            {/* Immersive View toggler */}
            <button
              onClick={handleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-none bg-zinc-950 border-2 border-zinc-800 text-zinc-400 hover:text-brand-fuchsia hover:border-brand-fuchsia transition-all cursor-pointer"
              title="Fullscreen view (Press ESC key to exit)"
              id="gameplay-fullscreen-btn"
            >
              <Maximize2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Framing Window */}
        <div 
          ref={playContainerRef}
          id="iframe-aspect-container"
          className={`relative bg-black rounded-none border-2 border-zinc-800 overflow-hidden aspect-[4/3] w-full flex items-center justify-center ${isFullscreen ? 'border-none p-0 rounded-none h-full w-full aspect-auto z-50' : ''}`}
        >
          <iframe
            key={`${game.id}-${iframeKey}`}
            src={game.iframeUrl}
            title={game.title}
            className="absolute inset-0 w-full h-full border-none"
            allow="fullscreen; gamepad; autoplay"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            referrerPolicy="no-referrer"
            id={`game-frame-${game.id}`}
          />
        </div>
      </div>

      {/* 1/3 Column: Retro Side-drawer Meta specifications */}
      <div className="space-y-6">
        
        {/* Statistics & descriptions wrapper panel */}
        <div className="bg-zinc-900 border-2 border-zinc-800 rounded-none p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-none bg-gradient-to-br ${game.themeColor} text-white shrink-0`}>
              <GameIcon name={game.iconName} className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider font-mono bg-zinc-950 text-zinc-400 px-2 py-0.5 border border-zinc-800 inline-block font-black">
                {game.category}
              </span>
              <h3 className="text-xl font-display font-black text-white mt-1 uppercase tracking-tight leading-none">{game.title}</h3>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed font-mono uppercase">
            {game.description}
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-zinc-800 py-4 font-mono text-xs">
            <div>
              <span className="text-zinc-500 uppercase block tracking-wider">APPROVAL RATE</span>
              <span className="text-brand-fuchsia font-black text-xl flex items-center gap-1.5 mt-1">
                <GameIcon name="Star" className="h-4 w-4 text-amber-500" />
                {game.rating.toFixed(1)} / 5.0
              </span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block tracking-wider">PLAYS STATED</span>
              <span className="text-white font-black text-xl mt-1 block">
                {game.plays.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Instructional user guides list */}
          <div className="bg-zinc-950 p-5 border-2 border-zinc-800 space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-brand-fuchsia flex items-center gap-2 font-bold">
              <Info className="h-4 w-4 shrink-0" />
              <span>INSTRUCTIONS_SET:</span>
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium whitespace-pre-line uppercase select-text font-mono">
              {game.instructions}
            </p>
          </div>
        </div>

        {/* System safety status notice */}
        <div className="border-l-4 border-brand-fuchsia bg-zinc-900/40 p-5 border-y-2 border-r-2 border-zinc-800">
          <div className="flex gap-3">
            <GameIcon name="Sparkles" className="h-5 w-5 text-brand-fuchsia shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                SYSTEM PLAY COMPATIBILITY
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-1 font-mono uppercase">
                THIS INTERACTIVE PORTAL INJECTS RE-EMULATED VINTAGE ASSETS DIRECTLY THROUGH CLEAN WRAPPERS TO ENSURE OPTIMAL PERFORMANCE, HIGH FIDELITY RUNDOWN TIMINGS, AND STABILIZED GRAPHICS ACCELERATION WITH ZERO CLUTTER.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
