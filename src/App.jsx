import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gamesData from './games.json';
import GameCard from './components/GameCard';
import GamePlay from './components/GamePlay';
import IntroScreen from './components/IntroScreen';
import GoogleSignIn from './components/GoogleSignIn';
import { HelpCircle } from 'lucide-react';

export default function App() {
  const games = gamesData;
  
  const [showIntro, setShowIntro] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load favorites and custom user from local storage on render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nova_arcade_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
      const savedUser = localStorage.getItem('nova_arcade_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading cache:', e);
    }
  }, []);

  const handleSignIn = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('nova_arcade_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving user session:', e);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('nova_arcade_user');
    } catch (e) {
      console.error('Error removing user session:', e);
    }
  };

  // Save favorites helper
  const toggleFavorite = (gameId, e) => {
    if (e) {
      e.stopPropagation();
    }

    let updatedFavorites;
    if (favorites.includes(gameId)) {
      updatedFavorites = favorites.filter(id => id !== gameId);
    } else {
      updatedFavorites = [...favorites, gameId];
    }
    
    setFavorites(updatedFavorites);
    try {
      localStorage.setItem('nova_arcade_favorites', JSON.stringify(updatedFavorites));
    } catch (err) {
      console.error('Error saving favorites:', err);
    }
  };

  // Filter games based on current searches & categories
  const filteredGames = games.filter((game) => {
    if (activeCategory === 'Favorites') {
      if (!favorites.includes(game.id)) return false;
    } else if (activeCategory !== 'All') {
      if (game.category !== activeCategory) return false;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = game.title.toLowerCase().includes(query);
      const matchDesc = game.description.toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }

    return true;
  });

  const totalPlaysCount = games.reduce((acc, current) => acc + current.plays, 0);

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro-screen-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <IntroScreen onComplete={() => setShowIntro(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="main-platform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-black text-white font-sans flex flex-col overflow-x-hidden selection:bg-brand-fuchsia selection:text-black"
          id="nova-arcade-root"
        >
          
          {/* Header Section */}
          <header className="flex flex-row items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-zinc-800 shrink-0 gap-3" id="app-site-header">
            <div 
              className="flex items-baseline gap-1.5 cursor-pointer select-none min-w-0"
              onClick={() => {
                setSelectedGame(null);
                setActiveCategory('All');
                setSearchQuery('');
              }}
            >
              <h1 className="text-xl sm:text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-fuchsia font-display whitespace-nowrap overflow-hidden">
                Nova Arcade
              </h1>
              <span className="text-[10px] font-bold bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 font-mono tracking-wider shrink-0">v2.0</span>
            </div>

            {/* Search Field & Custom badges */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
              <div className="flex bg-zinc-900 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-zinc-700 items-center">
                <span className="text-zinc-500 mr-2 text-[10px] sm:text-xs font-mono font-bold hidden xs:inline">SEARCH_GAMES:</span>
                <input 
                  type="text" 
                  placeholder="TYPING..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-[10px] sm:text-xs font-bold uppercase w-16 xs:w-24 sm:w-36 text-white placeholder-zinc-650 font-mono"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center border border-zinc-700 font-black text-xs text-zinc-300 font-mono cursor-pointer transition-colors" title="Nova Arcade Info">?</div>
                <GoogleSignIn 
                  onSignIn={handleSignIn}
                  onSignOut={handleSignOut}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </header>

          {/* Main Layout containing Sidebar and Game Grid */}
          <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Directories List */}
            <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-8 shrink-0">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black mb-4 font-mono">Categories</h2>
                <nav className="flex flex-row md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none font-display">
                  {['All', 'Arcade', 'Puzzle', 'Action', 'Strategy', 'Favorites'].map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setSelectedGame(null); // return to dashboard
                        }}
                        className={`text-left text-xl md:text-2xl font-black tracking-tight uppercase transition-colors whitespace-nowrap cursor-pointer hover:text-brand-fuchsia ${
                          isActive 
                            ? 'text-brand-fuchsia underline decoration-4 underline-offset-4' 
                            : 'text-zinc-400'
                        }`}
                      >
                        {cat}
                        {cat === 'Favorites' && favorites.length > 0 && (
                          <span className="ml-2 py-0.5 px-2 text-[10px] font-mono leading-none bg-zinc-800 text-zinc-300 border border-zinc-700 inline-block font-bold">
                            {favorites.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Status Widget */}
              <div className="mt-auto bg-zinc-900 p-4 rounded-lg border border-zinc-800 font-mono hidden md:block">
                <h3 className="text-xs font-bold mb-1 uppercase text-zinc-300">SYSTEM STATUS</h3>
                <p className="text-[10px] text-zinc-500 leading-tight uppercase">Platform loaded: {games.length} games available.</p>
                <p className="text-[10px] text-zinc-500 leading-tight uppercase mt-1">Plays count: {totalPlaysCount.toLocaleString()}</p>
                {currentUser ? (
                  <p className="text-[10px] text-emerald-400 font-bold leading-tight uppercase mt-2">
                    ● AUTHENTICATED: {currentUser.email}
                  </p>
                ) : (
                  <p className="text-[10px] text-amber-500 font-bold leading-tight uppercase mt-2">
                    ○ SESSION: UNREGISTERED (GUEST)
                  </p>
                )}
              </div>
            </aside>

            {/* Game Play Area or Grid Showcase */}
            <section className="flex-1 p-6 md:p-8 overflow-y-auto bg-zinc-950/20" id="main-content-section">
              <AnimatePresence mode="wait">
                {!selectedGame ? (
                  <motion.div
                    key="lobby"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                    id="lobby-view"
                  >
                    {currentUser && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/60 border border-brand-fuchsia/40 rounded-lg p-4 font-mono flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-2 shadow-[0_0_15px_rgba(217,70,239,0.05)]"
                      >
                        <div>
                          <span className="text-brand-fuchsia font-black text-xs uppercase block tracking-wider">WELCOME BACK, CHAMPION</span>
                          <span className="text-sm text-zinc-300 font-bold">Authenticated as <span className="text-white">{currentUser.name}</span> ({currentUser.email})</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase bg-zinc-950 px-2.5 py-1 border border-zinc-800 rounded">Session Secure</span>
                      </motion.div>
                    )}

                    {/* Active Category Display Bar */}
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                      <h2 className="text-2xl font-display font-black uppercase tracking-tight text-white flex items-center gap-2">
                        <span>{activeCategory} Section</span>
                        <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5">
                          {filteredGames.length} AVAILABLE
                        </span>
                      </h2>
                    </div>

                    {/* Game cards grid */}
                    {filteredGames.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="games-grid-layout">
                        {filteredGames.map((game) => (
                          <GameCard
                            key={game.id}
                            game={game}
                            isFavorite={favorites.includes(game.id)}
                            onSelect={setSelectedGame}
                            onToggleFavorite={toggleFavorite}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/40 border-2 border-dashed border-zinc-800 p-8 font-mono">
                        <HelpCircle className="h-10 w-10 text-zinc-600 mb-4" />
                        <h3 className="text-lg font-black uppercase text-zinc-300 tracking-tight">NO INDEX MATCHED</h3>
                        <p className="text-xs text-zinc-500 max-w-sm uppercase mt-2 leading-relaxed">
                          {activeCategory === 'Favorites' 
                            ? "You haven't marked any games as favorites yet. Click the heart icon on any game to save it!"
                            : "No assets found for the specified search keys. Search with another spelling or category!"}
                        </p>
                        {(searchQuery !== '' || activeCategory !== 'All') && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setActiveCategory('All');
                            }}
                            className="mt-6 px-4 py-2 border-2 border-zinc-700 hover:border-brand-fuchsia text-xs font-black uppercase tracking-wider text-zinc-200 transition-colors bg-black cursor-pointer"
                            id="reset-search-btn"
                          >
                            Reset Filters
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="play-focus"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full"
                    id="active-play-root"
                  >
                    <GamePlay
                      game={selectedGame}
                      onClose={() => setSelectedGame(null)}
                      isFavorite={favorites.includes(selectedGame.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </main>

          {/* Footer info bar */}
          <footer className="h-14 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between px-8 bg-zinc-950 shrink-0 gap-2 py-4 sm:py-0 font-mono">
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase">
              <span>Nova Arcade: <span className="text-green-500 font-black">READY</span></span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full hidden sm:inline"></span>
              <span className="hidden sm:inline">ARCADE NETWORK</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-700">VERSION 2.00</span>
              <div className="h-4 w-[1px] bg-zinc-800 latent-bar hidden sm:block" />
              <span className="text-[10px] font-black text-brand-fuchsia uppercase tracking-widest text-center">Pure Arcade Experience. Just Play.</span>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
