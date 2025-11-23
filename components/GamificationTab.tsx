import React from 'react';
import { User, Task } from '../types';
import { Coins, ShoppingBag, Star, Trophy, Users } from 'lucide-react';

interface GamificationTabProps {
  user: User;
  bounties: Task[]; // Tasks that others can pick up
}

const GamificationTab: React.FC<GamificationTabProps> = ({ user, bounties }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-slate-800 text-white p-8 overflow-hidden mb-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <div className="relative">
                 <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-amber-400" />
                 <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 font-extrabold px-3 py-1 rounded-full text-sm">
                    Lvl {user.level}
                 </div>
              </div>
              <div>
                 <h1 className="text-3xl font-black tracking-tight">The Arcade</h1>
                 <p className="text-slate-300">Complete tasks to earn upgrades</p>
              </div>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600 text-center min-w-[100px]">
                 <Coins className="mx-auto text-amber-400 mb-1" />
                 <span className="block text-2xl font-bold">{user.coins}</span>
                 <span className="text-xs text-slate-400 uppercase font-bold">Coins</span>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600 text-center min-w-[100px]">
                 <Star className="mx-auto text-indigo-400 mb-1" />
                 <span className="block text-2xl font-bold">{user.xp}</span>
                 <span className="text-xs text-slate-400 uppercase font-bold">XP</span>
              </div>
           </div>
        </div>
        
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Bounty Board */}
         <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                  <Users size={24} className="text-neuro-blue-dark" /> Team Bounties
               </h2>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Help Colleagues</span>
            </div>
            <div className="p-4 space-y-3">
               {bounties.map((task, i) => (
                   <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-neuro-blue hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white group">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-neuro-text group-hover:text-neuro-blue-dark">{task.title}</h3>
                          <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                             +{task.coinReward} <Coins size={12} />
                          </div>
                       </div>
                       <p className="text-sm text-slate-500 mb-3">{task.description}</p>
                       <button className="w-full py-2 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold text-sm group-hover:bg-neuro-blue group-hover:text-neuro-blue-dark group-hover:border-neuro-blue transition-colors">
                          Accept Bounty
                       </button>
                   </div>
               ))}
               {bounties.length === 0 && (
                  <div className="text-center py-8 text-slate-400">No bounties available right now.</div>
               )}
            </div>
         </div>

         {/* Rewards Store */}
         <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
             <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                  <ShoppingBag size={24} className="text-pink-500" /> Rewards Shop
               </h2>
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Spend Coins</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
               {[
                 { name: 'Dark Mode Theme', price: 50, icon: '🌑' },
                 { name: 'Golden Avatar Frame', price: 200, icon: '🖼️' },
                 { name: 'Quiet Corner Pass', price: 20, icon: '🤫' },
                 { name: 'Early Friday', price: 500, icon: '⏰' },
               ].map((item, i) => (
                  <button key={i} className="flex flex-col items-center p-4 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50 transition-all disabled:opacity-50" disabled={user.coins < item.price}>
                      <span className="text-3xl mb-2">{item.icon}</span>
                      <span className="font-bold text-sm text-slate-700 text-center">{item.name}</span>
                      <span className={`text-xs font-bold mt-2 px-2 py-1 rounded-full ${user.coins >= item.price ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                         {item.price} Coins
                      </span>
                  </button>
               ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default GamificationTab;