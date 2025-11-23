import React from 'react';
import { Tab } from '../types';
import { User, Briefcase, Map, Gamepad2, BrainCircuit } from 'lucide-react';

interface NavigationProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: Tab.PROFILE, label: 'My Profile', icon: User },
    { id: Tab.WORK, label: 'My Tasks', icon: Briefcase },
    { id: Tab.CAREER, label: 'Journey', icon: Map },
    { id: Tab.GAME, label: 'Arcade', icon: Gamepad2 },
    { id: Tab.ANALYTICS, label: 'The Brain', icon: BrainCircuit },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 md:relative md:w-24 md:h-screen md:flex-col md:border-t-0 md:border-r md:justify-start z-50">
      <div className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-8 md:pt-8 h-16 md:h-full">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center w-full md:w-auto md:h-20 md:px-2 transition-colors duration-200
                ${isActive ? 'text-neuro-blue-dark bg-neuro-blue/20' : 'text-slate-400 hover:text-slate-600'}
              `}
              aria-label={item.label}
            >
              <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-semibold md:text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;