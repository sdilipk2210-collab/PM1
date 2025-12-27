
import React, { useState } from 'react';
import { Project, Task, Company, Priority, RMIFocus } from '../types';

interface ProjectListProps {
  company: Company;
  projects: Project[];
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onAddProject: (project: Partial<Project>) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, tasks, onAddTask, onAddProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Task Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as Priority,
    rmiFocus: 'Maintain' as RMIFocus,
    assignee: ''
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  const handleCreateTask = () => {
    if (!selectedProjectId) return;
    onAddTask({
      ...newTask,
      projectId: selectedProjectId,
    });
    setShowTaskModal(false);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', rmiFocus: 'Maintain', assignee: '' });
  };

  const RMI_BADGES = {
    React: 'bg-rose-100 text-rose-700 border-rose-200',
    Maintain: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Improvise: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portfolio Focus</h2>
          <p className="text-slate-500">Executing strategic initiatives across RMI categories.</p>
        </div>
        <button 
          onClick={() => setShowProjectModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-all"
        >
          New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProjectId(project.id)}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              selectedProjectId === project.id 
                ? 'bg-white border-indigo-600 ring-4 ring-indigo-50 shadow-xl' 
                : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">{project.status}</span>
              <span className="text-[10px] text-slate-400 font-bold">{project.endDate}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{project.name}</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
              <div className="bg-indigo-600 h-full" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="text-right text-[10px] mt-1 font-bold text-slate-400">{project.progress}% Complete</p>
          </div>
        ))}
      </div>

      {selectedProjectId && (
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-slate-800">{selectedProject?.name} Tasks</h3>
              <p className="text-sm text-slate-500 font-medium">Balancing React, Maintain, and Improvise focus.</p>
            </div>
            <button 
              onClick={() => setShowTaskModal(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Add New Task
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {projectTasks.map(task => (
              <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${RMI_BADGES[task.rmiFocus]}`}>
                      {task.rmiFocus}
                    </span>
                    <h4 className="font-bold text-slate-800">{task.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      task.priority === 'High' ? 'text-rose-600 bg-rose-50' : 'text-slate-400 bg-slate-100'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
                </div>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800">{task.assignee}</p>
                    <p className="text-[10px] text-slate-400">Due: {task.dueDate}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    task.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'
                  }`}>
                    {task.status === 'Completed' ? '✓' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-scaleIn">
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">⚡</span> New RMI Task
            </h3>
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Task Category (RMI)</label>
                 <div className="grid grid-cols-3 gap-3">
                   {['React', 'Maintain', 'Improvise'].map((type) => (
                     <button
                       key={type}
                       onClick={() => setNewTask({...newTask, rmiFocus: type as RMIFocus})}
                       className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                         newTask.rmiFocus === type 
                           ? RMI_BADGES[type as RMIFocus] 
                           : 'border-slate-100 text-slate-400 hover:border-slate-200'
                       }`}
                     >
                       {type}
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Title</label>
                 <input 
                  type="text" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="The objective..." 
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assignee</label>
                   <input 
                    type="text" 
                    value={newTask.assignee}
                    onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</label>
                   <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                   />
                 </div>
               </div>

               <div className="flex gap-3 pt-6">
                 <button onClick={() => setShowTaskModal(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
                 <button onClick={handleCreateTask} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">Add Task</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
