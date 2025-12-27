
import React, { useMemo, useState } from 'react';
import { Project, Task, Company, Idea } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface DashboardProps {
  projects: Project[];
  tasks: Task[];
  ideas: Idea[];
}

const InfoButton = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-2">
      <button 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="w-4 h-4 rounded-full border border-slate-300 text-[10px] font-black flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all bg-white"
      >
        i
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-2xl z-[100] animate-fadeIn leading-relaxed text-center pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ projects, tasks, ideas }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const rmiCounts = useMemo(() => tasks.reduce((acc: any, task) => {
    acc[task.rmiFocus] = (acc[task.rmiFocus] || 0) + 1;
    return acc;
  }, { React: 0, Maintain: 0, Improvise: 0 }), [tasks]);

  const rmiPieData = useMemo(() => Object.keys(rmiCounts).map(focus => ({
    name: focus,
    value: rmiCounts[focus],
    percentage: Math.round((rmiCounts[focus] / (tasks.length || 1)) * 100)
  })), [rmiCounts, tasks.length]);

  const RMI_META = {
    React: { color: '#f43f5e', icon: '⚡', label: 'Reactive' },
    Maintain: { color: '#6366f1', icon: '🛡️', label: 'Maintenance' },
    Improvise: { color: '#f59e0b', icon: '🚀', label: 'Innovation' }
  };

  const overdueTasks = useMemo(() => 
    tasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr)
         .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  , [tasks, todayStr]);

  const todayTasks = useMemo(() => 
    tasks.filter(t => t.status !== 'Completed' && t.dueDate === todayStr)
  , [tasks, todayStr]);

  const companyStats = useMemo(() => [
    { 
      name: 'Maktune Technologies', 
      tasks: tasks.filter(t => t.projectId === 'p1' || t.projectId === 'p3').length,
      completed: tasks.filter(t => (t.projectId === 'p1' || t.projectId === 'p3') && t.status === 'Completed').length,
      efficiency: 88 
    },
    { 
      name: 'DE', 
      tasks: tasks.filter(t => t.projectId === 'p2').length,
      completed: tasks.filter(t => t.projectId === 'p2' && t.status === 'Completed').length,
      efficiency: 94 
    }
  ], [tasks]);

  const topIdeas = useMemo(() => 
    [...ideas].sort((a, b) => b.iceScore - a.iceScore).slice(0, 4)
  , [ideas]);

  return (
    <div className="space-y-10 animate-fadeIn pb-24 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">HQ Control</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">v2.5 Dashboard</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">Portfolio Pulse</h2>
          <p className="text-slate-500 font-medium text-base max-w-xl">Unified mission control for Maktune Technologies (Growth) and DE (Stability).</p>
        </div>

        <div className="flex items-center gap-8 bg-slate-50 px-8 py-6 rounded-[2.5rem] border border-slate-100 flex-shrink-0 relative z-10">
           <div className="text-center min-w-[100px]">
             <div className="flex items-center justify-center mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tasks</p>
                <InfoButton text="Total active operational units across both portfolios." />
             </div>
             <p className="text-4xl font-black text-slate-900">{tasks.length}</p>
           </div>
           <div className="w-px h-12 bg-slate-200" />
           <div className="text-center min-w-[100px]">
             <div className="flex items-center justify-center mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity</p>
                <InfoButton text="Units completed per 24h cycle." />
             </div>
             <p className="text-4xl font-black text-indigo-600">7.8</p>
           </div>
        </div>
      </header>

      {/* Grid Row for Equilibrium and Tactical Response - Fixed Alignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        
        {/* Left Card: Operational Equilibrium */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Operational Equilibrium</h3>
              <InfoButton text="RMI Framework: Firefighting vs Scaling vs Innovation." />
            </div>
            <span className="text-[9px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase">RMI Framework</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-10">
              <div className="h-56 w-56 flex items-center justify-center relative flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={rmiPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                      {rmiPieData.map((entry) => (
                        <Cell key={entry.name} fill={RMI_META[entry.name as keyof typeof RMI_META].color} className="cursor-pointer" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                   <span className="text-3xl font-black text-slate-900 leading-none">{tasks.length}</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Focus</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                {rmiPieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm border" 
                         style={{ backgroundColor: `${RMI_META[d.name as keyof typeof RMI_META].color}10`, borderColor: `${RMI_META[d.name as keyof typeof RMI_META].color}20`, color: RMI_META[d.name as keyof typeof RMI_META].color }}>
                      {RMI_META[d.name as keyof typeof RMI_META].icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                         <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{d.name}</p>
                         <p className="text-[10px] font-black text-slate-900">{d.percentage}%</p>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${d.percentage}%`, backgroundColor: RMI_META[d.name as keyof typeof RMI_META].color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span className="text-xl">🖨️</span>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">R&D Availability</p>
                 <p className="text-base font-black text-slate-900">3D Printer: Idle</p>
               </div>
             </div>
             <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 transition-colors">Start Print →</button>
          </div>
        </div>

        {/* Right Card: Tactical Response Center - Fixed Alignment */}
        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Tactical Response Center</h3>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase">Mission Queue</span>
              <InfoButton text="Immediate priorities for today." />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-8 h-full">
            {/* Overdue */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-5 px-2">
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Overdue</span>
                <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-lg border border-rose-100">{overdueTasks.length}</span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-hide min-h-0">
                {overdueTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 p-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">No Blockers</p>
                  </div>
                ) : (
                  overdueTasks.map(task => (
                    <div key={task.id} className="p-5 bg-rose-50/40 rounded-3xl border border-rose-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
                      <span className="text-[8px] font-black text-rose-500 uppercase block mb-2">EXPIRED {task.dueDate}</span>
                      <p className="text-xs font-black text-slate-900 leading-tight mb-2 line-clamp-2">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{task.assignee.charAt(0)}</div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{task.assignee}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Today */}
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-5 px-2">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Today</span>
                <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg border border-indigo-100">{todayTasks.length}</span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-hide min-h-0">
                {todayTasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 p-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Clear Schedule</p>
                  </div>
                ) : (
                  todayTasks.map(task => (
                    <div key={task.id} className="p-5 bg-indigo-50/40 rounded-3xl border border-indigo-100 hover:bg-white hover:shadow-lg transition-all group cursor-pointer">
                      <span className="text-[8px] font-black text-indigo-600 uppercase block mb-2">DUE TODAY</span>
                      <p className="text-xs font-black text-slate-900 leading-tight mb-2 line-clamp-2">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{task.assignee.charAt(0)}</div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{task.assignee}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Row */}
      <div className="bg-slate-900 p-12 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-transparent" />
        <div className="flex items-center gap-10 relative z-10">
           <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-5xl backdrop-blur-xl border border-white/10 shadow-2xl">🤖</div>
           <div className="max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Gemini Strategic Analysis</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399]" />
              </div>
              <p className="text-lg font-medium text-slate-300">
                DE dispatch throughput is optimal. <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-4">Strategic recommendation:</span> Prioritize Maktune Technologies R&D on the 3D printer for the new lumbar support headrest mold.
              </p>
           </div>
        </div>
        <button className="px-10 py-5 bg-white text-slate-900 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10">Full Strategy Report</button>
      </div>

      {/* Entity Matrix */}
      <div className="bg-white p-12 rounded-[5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-16">
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-widest">Entity Matrix</h3>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
           {companyStats.map(stat => (
             <div key={stat.name} className="p-10 bg-slate-50 rounded-[4rem] border border-slate-100 hover:bg-white hover:border-indigo-200 transition-all group">
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-3xl ${stat.name.includes('Maktune') ? 'bg-indigo-600' : 'bg-cyan-500'} flex items-center justify-center text-4xl text-white shadow-xl group-hover:rotate-6 transition-all`}>
                      {stat.name.includes('Maktune') ? '🚀' : '⚙️'}
                    </div>
                    <div>
                       <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.name}</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Entity Status</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-4xl font-black text-indigo-600">{stat.efficiency}%</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Health Score</p>
                  </div>
               </div>
               <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-8">
                 <div className={`h-full ${stat.name.includes('Maktune') ? 'bg-indigo-600' : 'bg-cyan-500'}`} style={{ width: `${stat.efficiency}%` }} />
               </div>
               <button className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[11px] shadow-xl">Audit Operations</button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
