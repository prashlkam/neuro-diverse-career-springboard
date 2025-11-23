import React, { useEffect, useState } from 'react';
import { CareerNode, User } from '../types';
import { CheckCircle, Lock, MapPin, Target, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { getMicroGoals } from '../services/geminiService';

interface CareerTabProps {
  path: CareerNode[];
  user: User;
}

interface ManualGoal {
  id: number;
  text: string;
  completed: boolean;
}

const CareerTab: React.FC<CareerTabProps> = ({ path, user }) => {
  const [aiGoals, setAiGoals] = useState<string[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  
  // Lazy initialization to read from localStorage immediately on mount
  const [manualGoals, setManualGoals] = useState<ManualGoal[]>(() => {
    try {
      const saved = localStorage.getItem('neurosync_manual_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: If legacy array of strings, convert to objects
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed.map((text, index) => ({
            id: Date.now() + index,
            text: text as string,
            completed: false
          }));
        }
        return parsed;
      }
      return [];
    } catch (e) {
      console.error("Failed to parse manual goals", e);
      return [];
    }
  });

  const [newGoalText, setNewGoalText] = useState('');

  // Save manual goals whenever they change
  useEffect(() => {
    localStorage.setItem('neurosync_manual_goals', JSON.stringify(manualGoals));
  }, [manualGoals]);

  // Fetch AI goals when user role or level changes
  useEffect(() => {
    let mounted = true;
    const fetchGoals = async () => {
      setLoadingGoals(true);
      const goals = await getMicroGoals(user);
      if (mounted) {
        setAiGoals(goals);
        setLoadingGoals(false);
      }
    };
    fetchGoals();
    
    return () => { mounted = false; };
  }, [user.level, user.role]); // Only re-fetch if level or role changes

  const handleAddGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoal: ManualGoal = {
      id: Date.now(),
      text: newGoalText.trim(),
      completed: false
    };
    setManualGoals([...manualGoals, newGoal]);
    setNewGoalText('');
  };

  const handleAddAiGoal = (text: string) => {
    const newGoal: ManualGoal = {
      id: Date.now(),
      text: text,
      completed: false
    };
    setManualGoals([...manualGoals, newGoal]);
    // Remove from AI list to prevent duplicate adding
    setAiGoals(prev => prev.filter(g => g !== text));
  };

  const handleToggleGoal = (id: number) => {
    setManualGoals(manualGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleDeleteGoal = (id: number) => {
    const updated = manualGoals.filter((goal) => goal.id !== id);
    setManualGoals(updated);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      
      {/* Metro Map (Left Col) */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-neuro-text mb-8">My Career Journey</h2>
        
        <div className="relative pl-4">
          {/* Vertical Line */}
          <div className="absolute left-8 top-4 bottom-4 w-2 bg-slate-200 rounded-full"></div>
          
          <div className="space-y-12 relative">
            {path.map((node, index) => {
              let statusColor = "bg-slate-200 text-slate-400"; // Locked
              let icon = <Lock size={20} />;
              
              if (node.isCompleted) {
                statusColor = "bg-emerald-500 text-white ring-4 ring-emerald-100";
                icon = <CheckCircle size={24} />;
              } else if (node.isUnlocked) {
                statusColor = "bg-neuro-blue-dark text-white ring-4 ring-neuro-blue animate-pulse";
                icon = <MapPin size={24} />;
              }

              return (
                <div key={node.id} className="flex gap-6 relative z-10 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${statusColor} shadow-md ml-3`}>
                    {icon}
                  </div>
                  
                  <div className={`flex-1 bg-white p-5 rounded-xl shadow-sm border transition-all ${
                      node.isUnlocked ? 'border-neuro-blue-dark scale-105' : 'border-slate-200 opacity-70 grayscale'
                  }`}>
                    <h3 className="text-lg font-bold text-neuro-text">{node.title}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-bold uppercase text-slate-400">Requirements:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {node.requirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${node.isCompleted ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Col: Goals & Next Step */}
      <div className="space-y-6">
        
        {/* Next Level Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold opacity-90 mb-1">Next Milestone</h3>
          <p className="text-2xl font-extrabold mb-4">Specialist</p>
          <div className="bg-white/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
             <div className="flex justify-between text-sm font-bold mb-1">
               <span>XP Progress</span>
               <span>{user.xp} / {user.nextLevelXp}</span>
             </div>
             <div className="h-2 bg-black/20 rounded-full overflow-hidden">
               <div className="h-full bg-white" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}></div>
             </div>
          </div>
          <p className="text-sm font-medium opacity-90">Keep focusing on accuracy to unlock the next badge!</p>
        </div>

        {/* Manual Goals */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-neuro-text mb-4 flex items-center gap-2">
             <Target size={20} className="text-pink-500" /> My Personal Goals
           </h3>
           
           <div className="flex gap-2 mb-4">
             <input 
               type="text" 
               value={newGoalText}
               onChange={(e) => setNewGoalText(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
               placeholder="Type a goal..."
               className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
             />
             <button 
                onClick={handleAddGoal}
                className="bg-pink-100 text-pink-700 p-2 rounded-lg hover:bg-pink-200 transition-colors"
                aria-label="Add goal"
             >
               <Plus size={20} />
             </button>
           </div>

           <ul className="space-y-3 mb-2">
               {manualGoals.length === 0 && (
                   <li className="text-sm text-slate-400 italic text-center py-2">No personal goals set yet.</li>
               )}
               {manualGoals.map((goal) => (
                   <li 
                     key={goal.id} 
                     className={`flex items-center justify-between gap-3 p-3 rounded-xl border group animate-fade-in transition-all duration-300 ${
                       goal.completed 
                         ? 'bg-slate-50 border-slate-200 opacity-60' 
                         : 'bg-pink-50 border-pink-100 shadow-sm'
                     }`}
                   >
                       <button 
                         className="flex items-center gap-3 flex-1 text-left focus:outline-none"
                         onClick={() => handleToggleGoal(goal.id)}
                         aria-label={goal.completed ? "Mark as incomplete" : "Mark as complete"}
                       >
                         <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                           goal.completed 
                             ? 'bg-emerald-500 border-emerald-500 text-white' 
                             : 'bg-white border-pink-200 text-transparent group-hover:border-pink-400'
                         }`}>
                           <Check size={16} strokeWidth={3} />
                         </div>
                         <span className={`text-sm font-medium transition-all break-words ${
                           goal.completed ? 'text-slate-400 line-through decoration-slate-400' : 'text-slate-700'
                         }`}>
                           {goal.text}
                         </span>
                       </button>
                       
                       <button 
                         onClick={() => handleDeleteGoal(goal.id)} 
                         className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                         aria-label="Delete goal"
                       >
                         <Trash2 size={18} />
                       </button>
                   </li>
               ))}
           </ul>
        </div>

        {/* AI Goals */}
        <div className="bg-indigo-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
           <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
             <Sparkles size={20} className="text-indigo-500" /> AI Suggested Goals
           </h3>
           <p className="text-xs text-indigo-700/70 mb-4 font-medium">
              Tailored suggestions for your {user.role} role.
           </p>

           {loadingGoals ? (
               <div className="space-y-3 animate-pulse">
                   {[1,2,3].map(i => <div key={i} className="h-10 bg-indigo-100/50 rounded-xl"></div>)}
               </div>
           ) : (
               <ul className="space-y-3">
                   {aiGoals.length === 0 && (
                     <li className="text-xs text-indigo-400 italic">No new suggestions at this time.</li>
                   )}
                   {aiGoals.map((goal, i) => (
                       <li key={i} className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-sm hover:border-indigo-300 transition-all group">
                           <span className="text-sm font-medium text-slate-700">{goal}</span>
                           <button 
                             onClick={() => handleAddAiGoal(goal)}
                             className="text-indigo-400 hover:text-white hover:bg-indigo-500 p-1.5 rounded-lg transition-colors"
                             title="Add to my goals"
                           >
                             <Plus size={18} />
                           </button>
                       </li>
                   ))}
               </ul>
           )}
        </div>

      </div>

    </div>
  );
};

export default CareerTab;