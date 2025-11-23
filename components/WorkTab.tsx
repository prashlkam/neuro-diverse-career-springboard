import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { Play, CheckCircle, Clock, AlertCircle, Plus, X, Save, MessageSquarePlus } from 'lucide-react';

interface WorkTabProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Task) => void;
  setPanicMode: (val: boolean) => void;
}

const WorkTab: React.FC<WorkTabProps> = ({ tasks, onTaskUpdate, onTaskCreate, setPanicMode }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTime, setNewTaskTime] = useState(30);
  const [newTaskXP, setNewTaskXP] = useState(50);
  const [newTaskCoins, setNewTaskCoins] = useState(10);

  useEffect(() => {
    const running = tasks.find(t => t.status === TaskStatus.IN_PROGRESS);
    setActiveTask(running || null);
  }, [tasks]);

  const startTask = (task: Task) => {
    onTaskUpdate(task.id, { status: TaskStatus.IN_PROGRESS });
  };

  const toggleChecklistItem = (task: Task, itemId: string) => {
    const newChecklist = task.checklist.map(item => 
      item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
    );
    onTaskUpdate(task.id, { checklist: newChecklist });
  };

  const completeTask = (task: Task) => {
    const allChecked = task.checklist.every(i => i.isChecked);
    if (!allChecked) {
        alert("Please complete all checklist items first."); 
        return;
    }
    onTaskUpdate(task.id, { status: TaskStatus.DONE });
  };

  const requestFeedback = (task: Task) => {
      onTaskUpdate(task.id, { status: TaskStatus.REVIEW });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: newTaskDesc || 'No description provided.',
        status: TaskStatus.TODO,
        timeEstimateMinutes: newTaskTime,
        xpReward: newTaskXP,
        coinReward: newTaskCoins,
        checklist: [{ id: 'cl-1', text: 'Complete the task steps', isChecked: false }]
    };

    onTaskCreate(newTask);
    setIsModalOpen(false);
    
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskTime(30);
    setNewTaskXP(50);
    setNewTaskCoins(10);
  };

  // Active Task View (The Cockpit)
  if (activeTask) {
    const progress = (activeTask.checklist.filter(i => i.isChecked).length / activeTask.checklist.length) * 100;

    return (
      <div className="p-6 max-w-3xl mx-auto h-full flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neuro-text">Current Task</h2>
            <button 
                onClick={() => setPanicMode(true)}
                className="bg-neuro-alert text-neuro-alert-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-200 transition-colors"
            >
                <AlertCircle size={24} />
                I Need Help
            </button>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border-2 border-neuro-blue overflow-hidden flex-1 flex flex-col">
            {/* Visual Header */}
            <div className="bg-neuro-blue/30 p-6 border-b border-neuro-blue">
                <h1 className="text-3xl font-extrabold text-neuro-text mb-2">{activeTask.title}</h1>
                <p className="text-lg text-slate-600">{activeTask.description}</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                
                {activeTask.visualGuideUrl && (
                    <div className="mb-6 rounded-xl overflow-hidden border border-slate-200">
                        <img src={activeTask.visualGuideUrl} alt="Visual Guide" className="w-full h-48 object-cover" />
                        <p className="bg-slate-50 p-2 text-center text-sm font-medium text-slate-500">Reference Image: Success looks like this</p>
                    </div>
                )}

                <h3 className="text-xl font-bold text-slate-700 mb-4">Checklist</h3>
                <div className="space-y-4">
                    {activeTask.checklist.map(item => (
                        <button
                            key={item.id}
                            onClick={() => toggleChecklistItem(activeTask, item.id)}
                            className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                                item.isChecked 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                                : 'bg-white border-slate-200 hover:border-neuro-blue-dark'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                item.isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                            }`}>
                                {item.isChecked && <CheckCircle size={20} />}
                            </div>
                            <span className="text-lg font-medium text-left">{item.text}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-200">
                <div className="mb-4">
                    <div className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{width: `${progress}%`}}></div>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={() => requestFeedback(activeTask)}
                        className="flex-1 py-4 rounded-xl font-bold text-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <MessageSquarePlus size={20} /> Request Feedback
                    </button>

                    <button 
                        onClick={() => completeTask(activeTask)}
                        disabled={progress < 100}
                        className={`flex-1 py-4 rounded-xl font-extrabold text-xl flex items-center justify-center gap-2 transition-colors ${
                            progress === 100 
                            ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-700' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {progress === 100 ? 'Complete' : 'Finish List'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Task Queue (Kanban/List)
  const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO);
  const doneTasks = tasks.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.REVIEW);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-neuro-text">My Tasks</h2>
            <div className="bg-neuro-blue px-3 py-1 rounded-full text-neuro-blue-dark font-bold text-sm">
                {todoTasks.length} To Do
            </div>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
            <Plus size={20} /> New Task
        </button>
      </div>

      <div className="grid gap-4">
        {todoTasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">No tasks available. Use "New Task" to create one!</p>
            </div>
        )}

        {todoTasks.map(task => (
            <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-neuro-blue transition-colors group">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-neuro-text mb-2">{task.title}</h3>
                        <p className="text-slate-500 mb-4 max-w-xl">{task.description}</p>
                        
                        <div className="flex gap-4 text-sm font-medium text-slate-400">
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                <Clock size={14} /> {task.timeEstimateMinutes} mins
                            </span>
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-100">
                                +{task.xpReward} XP
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => startTask(task)}
                        className="bg-neuro-blue text-neuro-blue-dark h-14 w-14 rounded-full flex items-center justify-center hover:bg-neuro-blue-dark hover:text-white transition-all shadow-sm"
                    >
                        <Play size={28} fill="currentColor" className="ml-1" />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {doneTasks.length > 0 && (
          <div className="opacity-60 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-400 mb-4">Recently Completed / In Review</h3>
              <div className="space-y-3">
                  {doneTasks.map(task => (
                      <div key={task.id} className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                          <div className="flex items-center gap-3">
                              {task.status === TaskStatus.REVIEW ? (
                                  <div className="bg-indigo-100 text-indigo-600 p-1 rounded-full"><MessageSquarePlus size={16} /></div>
                              ) : (
                                  <CheckCircle size={20} className="text-emerald-500" />
                              )}
                              <div>
                                <span className={`font-medium ${task.status === TaskStatus.DONE ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</span>
                                {task.status === TaskStatus.REVIEW && <span className="ml-2 text-xs font-bold text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded">In Review</span>}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-up border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-neuro-text flex items-center gap-2">
                        <Plus className="text-emerald-500" /> Create New Task
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Task Title</label>
                        <input 
                            type="text" 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g. Sort Mail" 
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-neuro-blue focus:ring-0 outline-none font-bold text-neuro-text"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-2">Description</label>
                        <textarea 
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                            placeholder="Describe what needs to be done..."
                            className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-neuro-blue focus:ring-0 outline-none h-24 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Minutes</label>
                             <input 
                                type="number" 
                                value={newTaskTime}
                                onChange={(e) => setNewTaskTime(Number(e.target.value))}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-neuro-blue outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-amber-500 mb-1">XP Reward</label>
                             <input 
                                type="number" 
                                value={newTaskXP}
                                onChange={(e) => setNewTaskXP(Number(e.target.value))}
                                className="w-full p-3 border-2 border-amber-100 bg-amber-50 rounded-xl focus:border-amber-300 outline-none"
                             />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-400 mb-1">Coins</label>
                             <input 
                                type="number" 
                                value={newTaskCoins}
                                onChange={(e) => setNewTaskCoins(Number(e.target.value))}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-neuro-blue outline-none"
                             />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                    <button onClick={() => setIsModalOpen(false)} className="px-5 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                    <button 
                        onClick={handleCreateTask}
                        disabled={!newTaskTitle.trim()}
                        className="px-6 py-3 font-bold text-white bg-neuro-blue-dark hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save size={18} /> Save Task
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default WorkTab;