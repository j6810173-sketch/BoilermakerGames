import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Film, 
  Globe, 
  Settings, 
  Home,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Search,
  Sparkles,
  LayoutGrid,
  Link,
  Check
} from 'lucide-react';
import PurduePeteAI from './components/PurduePeteAI';
import AppsList from './components/AppsList';
import GamesList from './components/GamesList';

type Tab = 'home' | 'games' | 'movies' | 'browser' | 'ai' | 'apps';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [browserUrl, setBrowserUrl] = useState('https://learn.texasmath.org/');
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, color: 'purdue-gold' },
    { id: 'games', label: 'Games', icon: Gamepad2, color: 'purdue-gold' },
    { id: 'apps', label: 'Apps', icon: LayoutGrid, color: 'purdue-gold' },
    { id: 'movies', label: 'Movies & TV', icon: Film, color: 'purdue-gold', url: 'https://hideoutt.vercel.app/movies.html' },
    { id: 'browser', label: 'Browser', icon: Globe, color: 'purdue-gold', url: 'https://learn.texasmath.org/' },
    { id: 'ai', label: 'AI', icon: Sparkles, color: 'purdue-gold', url: 'https://purdue-pete-ai.zapier.app' },
  ];

  const handleLaunchApp = (url: string) => {
    setBrowserUrl(url);
    setActiveTab('browser');
  };

  const copyWebsiteLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    });
  };

  const renderContent = () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    const displayUrl = activeTab === 'browser' ? browserUrl : currentTab?.url;
    
    if (activeTab === 'home') {
      return (
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-7xl font-black tracking-tighter text-purdue-gold italic uppercase">
                Boilermaker <span className="text-white">Games</span>
              </h1>
              <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-light">
                The ultimate Purdue-themed entertainment hub. Games, movies, and browsing, all in one place.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full max-w-7xl">
              {tabs.slice(1).map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02, translateY: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-left transition-all hover:border-purdue-gold/50"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <tab.icon size={120} />
                  </div>
                  <tab.icon className="text-purdue-gold mb-4" size={32} />
                  <h3 className="text-2xl font-bold text-white mb-2">{tab.label}</h3>
                  <p className="text-zinc-500 text-sm">Access your favorite {tab.label.toLowerCase()} instantly.</p>
                  <div className="mt-6 flex items-center text-purdue-gold text-sm font-semibold">
                    Launch Now <ChevronRight size={16} className="ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-8 pb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-zinc-800"></div>
              <h2 className="text-2xl font-black uppercase italic text-purdue-gold flex items-center gap-3">
                <Gamepad2 size={24} /> Featured Games
              </h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <GamesList onLaunch={handleLaunchApp} />

            <div className="flex items-center gap-4 my-12">
              <div className="h-px flex-1 bg-zinc-800"></div>
              <h2 className="text-2xl font-black uppercase italic text-purdue-gold flex items-center gap-3">
                <LayoutGrid size={24} /> Featured Apps
              </h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <AppsList onLaunch={handleLaunchApp} />
          </div>

          <div className="mt-auto py-12 text-zinc-600 text-xs text-center uppercase tracking-widest font-bold">
            Purdue University • Boiler Up • Hammer Down
          </div>
        </div>
      );
    }

    if (activeTab === 'ai') {
      return <PurduePeteAI />;
    }

    if (activeTab === 'games') {
      return (
        <div className="flex flex-col h-full overflow-hidden bg-black">
          <div className="p-6 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase italic text-purdue-gold">Boilermaker Games</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">The ultimate entertainment hub</p>
            </div>
            <div className="flex items-center bg-black border border-zinc-800 rounded-full px-4 py-2 w-96">
              <Search size={14} className="text-zinc-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search games..." 
                className="bg-transparent border-none text-xs text-zinc-400 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <GamesList onLaunch={handleLaunchApp} />
          </div>
        </div>
      );
    }

    if (activeTab === 'apps') {
      return (
        <div className="flex flex-col h-full overflow-hidden bg-black">
          <div className="p-6 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase italic text-purdue-gold">Boilermaker Apps</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Your favorite tools, integrated</p>
            </div>
            <div className="flex items-center bg-black border border-zinc-800 rounded-full px-4 py-2 w-96">
              <Search size={14} className="text-zinc-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search apps..." 
                className="bg-transparent border-none text-xs text-zinc-400 focus:outline-none w-full"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AppsList onLaunch={handleLaunchApp} />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-black">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center space-x-4">
            <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400">
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400">
              <ChevronRight size={18} />
            </button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400">
              <RotateCcw size={18} />
            </button>
            <div className="flex items-center bg-black border border-zinc-800 rounded-full px-4 py-1.5 w-96">
              <Globe size={14} className="text-zinc-500 mr-2" />
              <span className="text-xs text-zinc-400 truncate">{displayUrl}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href={displayUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-3 py-1.5 bg-purdue-gold text-black text-xs font-bold rounded-md hover:bg-white transition-colors"
            >
              <ExternalLink size={14} className="mr-1.5" />
              Open External
            </a>
          </div>
        </div>
        <iframe 
          src={displayUrl} 
          className="flex-1 w-full border-none bg-white"
          title={currentTab?.label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-purdue-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="relative flex flex-col bg-zinc-950 border-r border-zinc-900 z-20"
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div 
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-purdue-gold rounded-lg flex items-center justify-center font-black text-black">P</div>
                <span className="font-black tracking-tighter text-xl italic uppercase">Boilermaker</span>
              </motion.div>
            ) : (
              <motion.div 
                key="logo-small"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-8 h-8 bg-purdue-gold rounded-lg flex items-center justify-center font-black text-black mx-auto"
              >
                P
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`w-full flex items-center rounded-xl transition-all duration-200 group ${
                activeTab === tab.id 
                  ? 'bg-purdue-gold text-black shadow-lg shadow-purdue-gold/10' 
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              } ${isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-black' : 'group-hover:text-purdue-gold'} />
              {isSidebarOpen && (
                <span className="ml-3 font-bold text-sm tracking-wide uppercase">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button 
            onClick={copyWebsiteLink}
            className={`w-full flex items-center rounded-xl transition-all ${
              isLinkCopied 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
            } ${isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
            title="Copy Website Link"
          >
            {isLinkCopied ? <Check size={20} /> : <Link size={20} />}
            {isSidebarOpen && (
              <span className="ml-3 font-bold text-sm uppercase">
                {isLinkCopied ? 'Copied!' : 'Copy Link'}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-full flex items-center rounded-xl text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all ${isSidebarOpen ? 'px-4 py-3' : 'p-3 justify-center'}`}
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft size={20} />
                <span className="ml-3 font-bold text-sm uppercase">Collapse</span>
              </>
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#CEB888 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="flex-1 relative z-10 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
