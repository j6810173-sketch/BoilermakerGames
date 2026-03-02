import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Rocket, Gamepad2 } from 'lucide-react';

export interface GameItem {
  name: string;
  description: string;
  url: string;
  icon?: string;
}

export const gamesData: GameItem[] = [
  {
    name: "5 Nights at Epsteins",
    description: "A mysterious and challenging game experience.",
    url: "https://d3rtzzzsiu7gdr.cloudfront.net/files/fiveepsteins/index.html",
  },
  {
    name: "Sprinter",
    description: "A fast-paced running game where speed is everything.",
    url: "https://d3rtzzzsiu7gdr.cloudfront.net/files/sprinter/index.html",
  },
  {
    name: "Classic Games",
    description: "Access a collection of classic math and logic games.",
    url: "https://learn.texasmath.org/g",
  }
];

export default function GamesList({ onLaunch }: { onLaunch?: (url: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {gamesData.map((game) => (
        <motion.div
          key={game.name}
          whileHover={{ y: -5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-purdue-gold/30 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800 p-3 flex items-center justify-center overflow-hidden group-hover:border-purdue-gold/50 transition-colors">
              {game.icon ? (
                <img 
                  src={game.icon} 
                  alt={game.name} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Gamepad2 className="text-purdue-gold" size={32} />
              )}
            </div>
            <a 
              href={game.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-purdue-gold transition-colors"
              title="Open External"
            >
              <ExternalLink size={18} />
            </a>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
          <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
            {game.description}
          </p>
          
          <button
            onClick={() => onLaunch?.(game.url)}
            className="w-full py-3 bg-zinc-800 hover:bg-purdue-gold hover:text-black text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Rocket size={16} />
            Launch Game
          </button>
        </motion.div>
      ))}
    </div>
  );
}
