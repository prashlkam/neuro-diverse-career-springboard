import React, { useState, useEffect } from 'react';
import { User, Skill, SensoryProfile } from '../types';
import { Shield, Zap, Volume2, Sun, MessageSquare, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

interface ProfileTabProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  
  // Local state for adding new list items
  const [newTrigger, setNewTrigger] = useState('');
  const [newAccommodation, setNewAccommodation] = useState('');
  const [newStrength, setNewStrength] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(1);

  // Sync form data if user prop updates from outside (though unlikely during edit)
  useEffect(() => {
    if (!isEditing) {
      setFormData(user);
    }
  }, [user, isEditing]);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  // Helper to update simple fields
  const updateField = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to update sensory profile
  const updateSensory = (field: keyof SensoryProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      sensoryProfile: { ...prev.sensoryProfile, [field]: value }
    }));
  };

  // Array helpers
  const addItem = (field: 'triggers' | 'accommodations', value: string, setter: (s: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      sensoryProfile: {
        ...prev.sensoryProfile,
        [field]: [...prev.sensoryProfile[field], value.trim()]
      }
    }));
    setter('');
  };

  const removeItem = (field: 'triggers' | 'accommodations', index: number) => {
    setFormData(prev => ({
      ...prev,
      sensoryProfile: {
        ...prev.sensoryProfile,
        [field]: prev.sensoryProfile[field].filter((_, i) => i !== index)
      }
    }));
  };

  const addStrength = () => {
    if (!newStrength.trim()) return;
    setFormData(prev => ({ ...prev, strengths: [...prev.strengths, newStrength.trim()] }));
    setNewStrength('');
  };

  const removeStrength = (index: number) => {
    setFormData(prev => ({ ...prev, strengths: prev.strengths.filter((_, i) => i !== index) }));
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = { name: newSkillName.trim(), level: newSkillLevel, icon: 'circle' };
    setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setNewSkillName('');
    setNewSkillLevel(1);
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const updateSkillLevel = (index: number, level: number) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = { ...updatedSkills[index], level };
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto animate-fade-in pb-24 md:pb-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 relative">
        <div className="absolute top-4 right-4 flex gap-2">
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-neuro-blue hover:text-neuro-blue-dark transition-colors flex items-center gap-2 font-bold text-sm"
                >
                    <Edit2 size={16} /> Edit Profile
                </button>
            ) : (
                <>
                    <button 
                        onClick={handleCancel}
                        className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1 font-bold text-sm"
                    >
                        <X size={16} /> Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-1 font-bold text-sm shadow-md"
                    >
                        <Save size={16} /> Save
                    </button>
                </>
            )}
        </div>

        {isEditing ? (
            <div className="flex flex-col items-center justify-center w-full md:w-auto md:mr-4">
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile Avatar" 
                  className="w-32 h-32 rounded-full border-4 border-slate-200 bg-slate-100 mb-2 object-cover"
                />
                <input 
                    type="text" 
                    value={formData.avatarUrl}
                    onChange={(e) => updateField('avatarUrl', e.target.value)}
                    placeholder="Image URL"
                    className="text-xs p-2 border rounded-lg w-32 bg-slate-50"
                />
            </div>
        ) : (
            <img 
              src={user.avatarUrl} 
              alt="Profile Avatar" 
              className="w-32 h-32 rounded-full border-4 border-neuro-blue bg-neuro-blue object-cover"
            />
        )}

        <div className="text-center md:text-left flex-1 w-full">
            {isEditing ? (
                <div className="space-y-3 max-w-md mx-auto md:mx-0">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            className="text-2xl font-bold text-neuro-text w-full border-b-2 border-slate-200 focus:border-neuro-blue outline-none bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Job Role</label>
                        <input 
                            type="text" 
                            value={formData.role}
                            onChange={(e) => updateField('role', e.target.value)}
                            className="text-lg text-slate-600 font-medium w-full border-b-2 border-slate-200 focus:border-neuro-blue outline-none bg-transparent"
                        />
                    </div>
                </div>
            ) : (
                <>
                  <h1 className="text-3xl font-bold text-neuro-text">{user.name}</h1>
                  <p className="text-lg text-slate-500 font-medium mt-1">{user.role}</p>
                </>
            )}
            
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
        <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isEditing ? 'border-neuro-blue ring-1 ring-neuro-blue' : 'border-slate-100'} transition-all`}>
          <h2 className="text-xl font-bold text-neuro-text mb-6 flex items-center gap-2">
            <Shield className="text-neuro-green-dark" /> Sensory Passport
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="text-slate-500" />
                <span className="font-semibold">Sound Sensitivity</span>
              </div>
              {isEditing ? (
                  <select 
                    value={formData.sensoryProfile.soundSensitivity}
                    onChange={(e) => updateSensory('soundSensitivity', e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-neuro-blue"
                  >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                  </select>
              ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    user.sensoryProfile.soundSensitivity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200'
                  }`}>
                    {user.sensoryProfile.soundSensitivity}
                  </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Sun className="text-slate-500" />
                <span className="font-semibold">Light Sensitivity</span>
              </div>
              {isEditing ? (
                  <select 
                    value={formData.sensoryProfile.lightSensitivity}
                    onChange={(e) => updateSensory('lightSensitivity', e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-neuro-blue"
                  >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                  </select>
              ) : (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    user.sensoryProfile.lightSensitivity === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.sensoryProfile.lightSensitivity}
                  </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-slate-500" />
                <span className="font-semibold">Communication</span>
              </div>
              {isEditing ? (
                  <select 
                    value={formData.sensoryProfile.preferredCommunication}
                    onChange={(e) => updateSensory('preferredCommunication', e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:border-neuro-blue"
                  >
                      <option value="TEXT">TEXT</option>
                      <option value="VOICE">VOICE</option>
                      <option value="IN_PERSON">IN PERSON</option>
                  </select>
              ) : (
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                    {user.sensoryProfile.preferredCommunication.replace('_', ' ')}
                  </span>
              )}
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Triggers (Avoid)</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sensoryProfile.triggers.map((trigger, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100 flex items-center gap-2">
                            {trigger}
                            {isEditing && (
                                <button onClick={() => removeItem('triggers', i)} className="text-rose-400 hover:text-rose-700">
                                    <X size={14} />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                {isEditing && (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newTrigger}
                            onChange={(e) => setNewTrigger(e.target.value)}
                            placeholder="Add trigger..."
                            className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:border-neuro-blue outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && addItem('triggers', newTrigger, setNewTrigger)}
                        />
                        <button onClick={() => addItem('triggers', newTrigger, setNewTrigger)} className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg">
                            <Plus size={16} className="text-slate-600"/>
                        </button>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Accommodations (Required)</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.sensoryProfile.accommodations.map((acc, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-sm font-medium border border-emerald-100 flex items-center gap-2">
                            {acc}
                            {isEditing && (
                                <button onClick={() => removeItem('accommodations', i)} className="text-emerald-400 hover:text-emerald-700">
                                    <X size={14} />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                {isEditing && (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={newAccommodation}
                            onChange={(e) => setNewAccommodation(e.target.value)}
                            placeholder="Add accommodation..."
                            className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:border-neuro-blue outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && addItem('accommodations', newAccommodation, setNewAccommodation)}
                        />
                        <button onClick={() => addItem('accommodations', newAccommodation, setNewAccommodation)} className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg">
                            <Plus size={16} className="text-slate-600"/>
                        </button>
                    </div>
                )}
            </div>

          </div>
        </div>

        {/* Skills & Strengths */}
        <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isEditing ? 'border-neuro-blue ring-1 ring-neuro-blue' : 'border-slate-100'} transition-all`}>
          <h2 className="text-xl font-bold text-neuro-text mb-6 flex items-center gap-2">
            <Zap className="text-amber-500" /> Skills & Traits
          </h2>
          
          <div className="space-y-4 mb-8">
            {formData.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm font-semibold">
                        <span className="flex items-center gap-2">
                            {skill.name}
                            {isEditing && (
                                <button onClick={() => removeSkill(idx)} className="text-slate-300 hover:text-rose-500">
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </span>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">Lvl</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="5"
                                    value={skill.level}
                                    onChange={(e) => updateSkillLevel(idx, parseInt(e.target.value) || 1)}
                                    className="w-12 border border-slate-300 rounded px-1 text-center"
                                />
                            </div>
                        ) : (
                            <span>Level {skill.level}/5</span>
                        )}
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-neuro-blue-dark transition-all duration-500" 
                            style={{ width: `${(skill.level / 5) * 100}%`}}
                        ></div>
                    </div>
                </div>
            ))}
            
            {isEditing && (
                <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                    <input 
                        type="text" 
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="New skill..."
                        className="flex-1 text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:border-neuro-blue outline-none"
                    />
                    <input 
                        type="number" 
                        min="1" 
                        max="5"
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                        className="w-14 text-sm border border-slate-300 rounded-lg px-2 py-1.5 focus:border-neuro-blue outline-none text-center"
                    />
                    <button onClick={addSkill} className="bg-slate-100 hover:bg-slate-200 px-3 rounded-lg">
                        <Plus size={16} className="text-slate-600"/>
                    </button>
                </div>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Core Strengths</h3>
          <div className="grid grid-cols-1 gap-3">
             {formData.strengths.map((str, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                     <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                        <span className="font-semibold">{str}</span>
                     </div>
                     {isEditing && (
                        <button onClick={() => removeStrength(i)} className="text-indigo-400 hover:text-rose-500">
                            <X size={16} />
                        </button>
                     )}
                 </div>
             ))}
             {isEditing && (
                <div className="flex gap-2 mt-2">
                    <input 
                        type="text" 
                        value={newStrength}
                        onChange={(e) => setNewStrength(e.target.value)}
                        placeholder="Add strength..."
                        className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:border-neuro-blue outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && addStrength()}
                    />
                    <button onClick={addStrength} className="bg-slate-100 hover:bg-slate-200 px-3 rounded-lg">
                        <Plus size={16} className="text-slate-600"/>
                    </button>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileTab;