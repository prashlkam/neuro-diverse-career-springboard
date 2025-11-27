import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ProfileTab from './components/ProfileTab';
import WorkTab from './components/WorkTab';
import CareerTab from './components/CareerTab';
import GamificationTab from './components/GamificationTab';
import AnalyticsTab from './components/AnalyticsTab';
import { Tab, User, Task } from './types';
import { MOCK_USER, MOCK_TASKS, CAREER_PATH } from './constants';
import { X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.PROFILE);
  const [panicMode, setPanicMode] = useState(false);

  // Initialize user from localStorage or fall back to MOCK_USER
  const [user, setUser] = useState<User>(() => {
    try {
      const savedUser = localStorage.getItem('neurosync_user');
      return savedUser ? JSON.parse(savedUser) : MOCK_USER;
    } catch (error) {
      console.error('Error loading user from localStorage', error);
      return MOCK_USER;
    }
  });

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('neurosync_user', JSON.stringify(user));
  }, [user]);

  // Initialize tasks from localStorage or fall back to MOCK_TASKS
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('neurosync_tasks');
      return savedTasks ? JSON.parse(savedTasks) : MOCK_TASKS;
    } catch (error) {
      console.error('Error loading tasks from localStorage', error);
      return MOCK_TASKS;
    }
  });

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('neurosync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // Task Updater Handler
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        
        const updated = { ...t, ...updates };
        
        // Handle XP/Coin Logic if task is completed
        if (updates.status === 'DONE' && t.status !== 'DONE') {
            setUser(u => ({
                ...u,
                xp: u.xp + t.xpReward,
                coins: u.coins + t.coinReward
            }));
        }
        return updated;
    }));
  };

  const createTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neuro-bg font-sans text-neuro-text">
      
      {/* Navigation */}
      <Navigation currentTab={currentTab} setTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative pb-20 md:pb-0">
        {/* Panic Modal Overlay */}
        {panicMode && (
            <div className="fixed inset-0 z-[60] bg-red-500/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in">
                    <h2 className="text-3xl font-black text-red-600 mb-4">HELP REQUESTED</h2>
                    <p className="text-xl text-slate-700 mb-8 font-medium">
                        A supervisor has been alerted. <br/>
                        Please stay calm. Help is coming to your desk.
                    </p>
                    <button 
                        onClick={() => setPanicMode(false)}
                        className="bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <X size={20} /> Cancel Alert
                    </button>
                </div>
            </div>
        )}

        <div className="max-w-7xl mx-auto w-full pt-4 md:pt-8">
             {/* Tab Rendering */}
             {currentTab === Tab.PROFILE && <ProfileTab user={user} onUpdateUser={updateUser} />}
             {currentTab === Tab.WORK && (
                <WorkTab 
                    tasks={tasks} 
                    onTaskUpdate={updateTask}
                    onTaskCreate={createTask}
                    setPanicMode={setPanicMode} 
                />
             )}
             {currentTab === Tab.CAREER && <CareerTab path={CAREER_PATH} user={user} />}
             {currentTab === Tab.GAME && <GamificationTab user={user} bounties={tasks.filter(t => t.status === 'TODO').slice(0, 2)} />}
             {currentTab === Tab.ANALYTICS && <AnalyticsTab user={user} tasks={tasks} />}
        </div>
      </main>
    </div>
  );
}