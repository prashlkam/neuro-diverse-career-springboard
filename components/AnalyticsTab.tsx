import React, { useEffect, useState } from 'react';
import { User, Task } from '../types';
import { generateEmployeeReport } from '../services/geminiService';
import { BrainCircuit, TrendingUp, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalyticsTabProps {
  user: User;
  tasks: Task[];
}

interface AIReport {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  burnoutRisk: string;
  recommendation: string;
}

const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ user, tasks }) => {
  const [report, setReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const rawJson = await generateEmployeeReport(user, tasks);
    try {
        // Clean markdown code blocks if present
        const cleanJson = rawJson.replace(/```json|```/g, '');
        const parsed = JSON.parse(cleanJson);
        setReport(parsed);
    } catch (e) {
        console.error("Failed to parse AI report", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  // Mock performance data for the chart
  const chartData = [
    { name: 'Mon', performance: 80 },
    { name: 'Tue', performance: 65 },
    { name: 'Wed', performance: 90 },
    { name: 'Thu', performance: 85 },
    { name: 'Fri', performance: 70 },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto animate-fade-in space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-neuro-text flex items-center gap-3">
                <BrainCircuit className="text-purple-600" /> The Brain: Performance Analytics
            </h1>
            <p className="text-slate-500 mt-1">AI-driven insights for {user.name}</p>
        </div>
        <button onClick={fetchReport} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <RefreshCcw size={20} className={loading ? 'animate-spin text-slate-500' : 'text-slate-600'} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Stats & Chart */}
        <div className="space-y-8">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} /> Output Consistency
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                            />
                            <Bar dataKey="performance" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-700 mb-4">Burnout Monitor</h3>
                {loading ? (
                    <div className="animate-pulse h-12 bg-slate-100 rounded"></div>
                ) : (
                    <div className={`flex items-center gap-4 p-4 rounded-xl border-l-4 ${
                        report?.burnoutRisk === 'High' ? 'bg-rose-50 border-rose-500 text-rose-800' :
                        report?.burnoutRisk === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-800' :
                        'bg-emerald-50 border-emerald-500 text-emerald-800'
                    }`}>
                        <AlertTriangle size={24} />
                        <div>
                            <span className="font-bold block text-lg">{report?.burnoutRisk || "Calculating..."} Risk</span>
                            <span className="text-sm opacity-80">Based on login patterns & error rates</span>
                        </div>
                    </div>
                )}
             </div>
        </div>

        {/* Middle/Right: AI SWOT Analysis */}
        <div className="lg:col-span-2 space-y-6">
            {loading ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                    <BrainCircuit className="mx-auto text-slate-300 animate-bounce mb-4" size={48} />
                    <p className="text-slate-500 font-medium">AI is analyzing cognitive patterns...</p>
                </div>
            ) : report ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                            <h4 className="font-bold text-emerald-800 mb-3 uppercase text-xs tracking-wider">Strengths</h4>
                            <ul className="space-y-2">
                                {report.swot.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900">
                                        <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                            <h4 className="font-bold text-rose-800 mb-3 uppercase text-xs tracking-wider">Challenges</h4>
                            <ul className="space-y-2">
                                {report.swot.weaknesses.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-rose-900">
                                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0"></span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                             <h4 className="font-bold text-blue-800 mb-3 uppercase text-xs tracking-wider">Opportunities</h4>
                             <ul className="space-y-2">
                                {report.swot.opportunities.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                             <h4 className="font-bold text-amber-800 mb-3 uppercase text-xs tracking-wider">Threats / Triggers</h4>
                             <ul className="space-y-2">
                                {report.swot.threats.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span> {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <BrainCircuit size={20} className="text-indigo-200" /> AI Recommendation
                        </h3>
                        <p className="text-indigo-100 leading-relaxed">
                            "{report.recommendation}"
                        </p>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 text-slate-400">Failed to load analysis. Check API configuration.</div>
            )}
        </div>

      </div>

    </div>
  );
};

export default AnalyticsTab;