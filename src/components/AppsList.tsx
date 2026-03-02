import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Rocket, Copy, Check } from 'lucide-react';

export interface AppItem {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export const appsData: AppItem[] = [
  {
    name: "Amazon",
    description: "Free shipping on millions of items. Get the best of Shopping and Entertainment with Prime.",
    url: "https://amazon.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Famazon.com"
  },
  {
    name: "ChatGPT",
    description: "We've trained a model called ChatGPT which interacts in a conversational way.",
    url: "https://ChatGPT.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FChatGPT.com"
  },
  {
    name: "Discord",
    description: "Discord is great for playing games and chilling with friends, or even building a worldwide community.",
    url: "https://Discord.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FDiscord.com"
  },
  {
    name: "ESPN",
    description: "Visit ESPN for live scores, highlights and sports news. Stream exclusive games on ESPN+.",
    url: "https://ESPN.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FESPN.com"
  },
  {
    name: "Facebook",
    description: "Connect with friends, family and other people you know. Share photos and videos.",
    url: "https://Facebook.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FFacebook.com"
  },
  {
    name: "GitHub",
    description: "Millions of developers and businesses call GitHub home. GitHub is where you belong.",
    url: "https://GitHub.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FGitHub.com"
  },
  {
    name: "Google",
    description: "Search the world's information, including webpages, images, videos and more.",
    url: "https://Google.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FGoogle.com"
  },
  {
    name: "Instagram",
    description: "Connect with friends, find other fans, and see what people around you are up to.",
    url: "https://Instagram.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FInstagram.com"
  },
  {
    name: "Pinterest",
    description: "Discover recipes, home ideas, style inspiration and other ideas to try.",
    url: "https://pinterest.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fpinterest.com"
  },
  {
    name: "Snapchat",
    description: "Chat, send Snaps, explore Stories, and try Lenses on desktop, or download the app!",
    url: "https://snapchat.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fsnapchat.com"
  },
  {
    name: "Soundcloud",
    description: "Discover and play over 320 million music tracks. Join the world's largest online community.",
    url: "https://soundcloud.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fsoundcloud.com"
  },
  {
    name: "Telegram",
    description: "Telegram lets you access your chats from multiple devices.",
    url: "https://telegram.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Ftelegram.com"
  },
  {
    name: "TikTok",
    description: "Trends start here. Viewers can watch and discover millions of personalized short videos.",
    url: "https://Tiktok.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FTiktok.com"
  },
  {
    name: "Twitch",
    description: "Twitch is an interactive livestreaming service for content spanning gaming and more.",
    url: "https://twitch.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Ftwitch.com"
  },
  {
    name: "X",
    description: "From breaking news and entertainment to sports and politics, get the full story.",
    url: "https://x.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2Fx.com"
  },
  {
    name: "YouTube",
    description: "Share your videos with friends, family, and the world.",
    url: "https://Youtube.com",
    icon: "https://www.google.com/s2/favicons?sz=256&domain_url=https%3A%2F%2FYoutube.com"
  }
];

export default function AppsList({ onLaunch }: { onLaunch?: (url: string) => void }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (url: string, name: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(name);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {appsData.map((app) => (
        <motion.div
          key={app.name}
          whileHover={{ y: -5 }}
          className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-purdue-gold/30 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800 p-3 flex items-center justify-center overflow-hidden group-hover:border-purdue-gold/50 transition-colors">
              <img 
                src={app.icon} 
                alt={app.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => copyToClipboard(app.url, app.name)}
                className="p-2 text-zinc-500 hover:text-purdue-gold transition-colors"
                title="Copy Link"
              >
                {copiedId === app.name ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
              </button>
              <a 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-zinc-500 hover:text-purdue-gold transition-colors"
                title="Open External"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
          <p className="text-zinc-400 text-sm line-clamp-3 mb-6 flex-1">
            {app.description}
          </p>
          
          <button
            onClick={() => onLaunch?.(app.url)}
            className="w-full py-3 bg-zinc-800 hover:bg-purdue-gold hover:text-black text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Rocket size={16} />
            Launch App
          </button>
        </motion.div>
      ))}
    </div>
  );
}
