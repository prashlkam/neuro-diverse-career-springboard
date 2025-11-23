import React from 'react';
import { User } from '../types';
import { Shield, Zap, Volume2, Sun, MessageSquare, AlertTriangle } from 'lucide-react';

interface ProfileTabProps {
  user: User;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
        <img 
          src={user.avatarUrl} 
          alt="Profile Avatar" 
          className="w-32 h-32 rounded-full border-4 border-neuro-blue bg-neuro-blue"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-neuro-text">{user.name}</h1>
          <p className="text-lg text-slate-500 font-medium mt-1">{user.role}</p>
          <div className="flex gap-3 mt-4 justify-center md:justify-start">
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Zap size={16} /> Level {user.level}
            </div>
            <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
              {user.xp} / {user.nextLevelXp} XP
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sensory Passport */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-neuro-text mb-6 flex items-center gap-2">
            <Shield className="text-neuro-green-dark" /> Sensory Passport
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="text-slate-500" />
                <span className="font-semibold">Sound Sensitivity</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                user.sensoryProfile.soundSensitivity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200'
              }`}>
                {user.sensoryProfile.soundSensitivity}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sun className="text-slate-500" />
                <span className="font-semibold">Light Sensitivity</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                user.sensoryProfile.lightSensitivity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.sensoryProfile.lightSensitivity}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-slate-500" />
                <span className="font-semibold">Communication</span>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                {user.sensoryProfile.preferredCommunication}
              </span>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Triggers (Avoid)</h3>
                <div className="flex flex-wrap gap-2">
                    {user.sensoryProfile.triggers.map((trigger, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
                            {trigger}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Accommodations (Required)</h3>
                <div className="flex flex-wrap gap-2">
                    {user.sensoryProfile.accommodations.map((acc, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100">
                            {acc}
                        </span>
                    ))}
                </div>
            </div>

          </div>
        </div>

        {/* Skills & Strengths */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-neuro-text mb-6 flex items-center gap-2">
            <Zap className="text-amber-500" /> Skills & Traits
          </h2>
          
          <div className="space-y-4 mb-8">
            {user.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                        <span>{skill.name}</span>
                        <span>Level {skill.level}/5</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-neuro-blue-dark transition-all duration-500" 
                            style={{ width: `${(skill.level / 5) * 100}%`}}
                        ></div>
                    </div>
                </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Core Strengths</h3>
          <div className="grid grid-cols-1 gap-3">
             {user.strengths.map((str, i) => (
                 <div key={i} className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                     <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                     <span className="font-semibold">{str}</span>
                 </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileTab;