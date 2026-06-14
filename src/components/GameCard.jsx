import { motion } from 'motion/react';
import GameIcon from './GameIcon';
import { Heart } from 'lucide-react';

export default function GameCard({ game, isFavorite, onSelect, onToggleFavorite }) {
  const abbrev = (() => {
    const letters = game.title
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .join('');
    if (letters.length >= 2) return letters.slice(0, 3).toUpperCase();
    return game.title.slice(0, 3).toUpperCase();
  })();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(game)}
      className="group relative cursor-pointer flex flex-col focus:outline-none"
      id={`game-card-${game.id}`}
    >
      {/* Aspect-Square Game Thumbnail Frame */}
      <div className="aspect-square bg-zinc-900 border-2 border-zinc-800 group-hover:border-brand-fuchsia flex items-center justify-center overflow-hidden relative transition-colors duration-200">
        
        {/* Game Cover Image (if available) else Fallback to Big Bold Lettering Backdrop */}
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute text-5xl md:text-6xl lg:text-7xl font-sans font-black text-zinc-950 select-none group-hover:scale-110 group-hover:text-zinc-900 transition-all duration-300 pointer-events-none uppercase tracking-tighter">
            {abbrev}
          </div>
        )}

        {/* Dynamic theme accent border overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${game.themeColor} opacity-5 group-hover:opacity-20 transition-opacity duration-250 z-10`} />

        {/* Small Floating Icon to identify gameplay genre (rendered on top of overlay/cover for dynamic feel if no cover) */}
        {!game.coverUrl && (
          <div className="h-12 w-12 flex items-center justify-center text-zinc-400 group-hover:text-brand-fuchsia transition-all duration-200 z-10">
            <GameIcon name={game.iconName} className="h-8 w-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </div>
        )}

        {/* Favorite Hear Badge on corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id, e);
          }}
          className={`absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center border font-bold transition-all duration-150 rounded-none ${
            isFavorite 
              ? 'bg-brand-fuchsia border-white text-black font-black' 
              : 'bg-zinc-950/90 border-zinc-700 text-zinc-500 hover:text-rose-500 hover:border-zinc-500'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          id={`btn-fav-${game.id}`}
        >
          <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-2 left-2 z-10 bg-zinc-950/90 px-1.5 py-0.5 border border-zinc-800 text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
          <GameIcon name="Star" className="h-2.5 w-2.5 text-amber-500" />
          <span>{game.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Stark Bold Metadata and Labels */}
      <h3 className="mt-3 text-lg font-display font-black uppercase leading-tight tracking-tight text-white group-hover:text-brand-fuchsia transition-colors duration-200 line-clamp-1">
        {game.title}
      </h3>
      
      <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase mt-1 tracking-wider flex items-center justify-between">
        <span>{game.category}</span>
        <span className="text-[9px] text-zinc-600 font-normal">{game.plays.toLocaleString()} PLAYS</span>
      </p>

      {/* Slide-Up Accent Line */}
      <div className="w-0 group-hover:w-full h-0.5 bg-brand-fuchsia transition-all duration-250 mt-1" />
    </motion.div>
  );
}
