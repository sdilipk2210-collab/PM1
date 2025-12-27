
import React, { useState, useMemo } from 'react';
import { Task, SubTask, RMIFocus, LayoutType, Priority, Company, Status, SOP, RMIMeta, AppUser, Comment, Attachment, RecurringInterval } from '../types';
import CalendarView from './CalendarView';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTask: (task: Task) => void;
  companies: Company[];
  sops: SOP[];
  teamMembers: string[];
  rmiConfig: Record<RMIFocus, RMIMeta>;
  currentUser: AppUser;
  onNotify: (text: string, type: 'mention' | 'update' | 'system') => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  companies, 
  sops, 
  teamMembers, 
  rmiConfig,
  currentUser,
  onNotify
}) => {
  const [activeRMI, setActiveRMI] = useState<RMIFocus>('Maintain');
  const [activeLayout, setActiveLayout] = useState<LayoutType>('kanban');
  const [companyFilter, setCompanyFilter] = useState<string | 'all'>('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeSopPreview, setActiveSopPreview] = useState<SOP | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'subtasks' | 'collab'>('details');

  // Modal Specific State
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newComment, setNewComment] = useState('');

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as Priority,
    assignee: teamMembers[0] || 'Unassigned',
    companyId: companies[0]?.id || '',
    rmiFocus: 'Maintain' as RMIFocus,
    status: 'To Do' as Status,
    sopId: '',
    isRecurring: false,
    recurringInterval: 'None' as RecurringInterval
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchRMI = t.rmiFocus === activeRMI;
      const isMaktune = t.projectId === 'p1' || t.projectId === 'p3';
      const taskCompanyId = isMaktune ? 'c1' : 'c2';
      const matchCompany = companyFilter === 'all' || companyFilter === taskCompanyId;
      return matchRMI && matchCompany;
    });
  }, [tasks, activeRMI, companyFilter]);

  const calculateProgress = (task: Task) => {
    if (!task.subtasks || task.subtasks.length === 0) {
      return task.status === 'Completed' ? 100 : (task.status === 'In Progress' ? 50 : 0);
    }
    const completed = task.subtasks.filter(s => s.status === 'Completed').length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const modalProgress = useMemo(() => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter(s => s.status === 'Completed').length;
    return Math.round((completed / subtasks.length) * 100);
  }, [subtasks]);

  const openCreateModal = () => {
    setEditingTask(null);
    setSubtasks([]);
    setComments([]);
    setAttachments([]);
    setTaskForm({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Medium',
      assignee: teamMembers[0] || 'Unassigned',
      companyId: companies[0]?.id || '',
      rmiFocus: activeRMI,
      status: 'To Do',
      sopId: '',
      isRecurring: false,
      recurringInterval: 'None'
    });
    setActiveModalTab('details');
    setShowTaskModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setSubtasks(task.subtasks || []);
    setComments(task.comments || []);
    setAttachments(task.attachments || []);
    const isMaktune = task.projectId === 'p1' || task.projectId === 'p3';
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      assignee: task.assignee,
      companyId: isMaktune ? 'c1' : 'c2',
      rmiFocus: task.rmiFocus,
      status: task.status,
      sopId: task.sopId || '',
      isRecurring: task.isRecurring,
      recurringInterval: task.recurringInterval || 'None'
    });
    setActiveModalTab('details');
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    if (currentUser.role === 'Viewer') return;
    const projectId = taskForm.companyId === 'c1' ? 'p1' : 'p2';
    const payload = { ...taskForm, projectId, subtasks, comments, attachments };

    if (editingTask) {
      onUpdateTask({ ...editingTask, ...payload });
    } else {
      onAddTask(payload);
    }
    setShowTaskModal(false);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (currentUser.role === 'Viewer') return;
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== targetStatus) {
      onUpdateTask({ ...task, status: targetStatus });
      onNotify(`Task "${task.title}" updated to ${targetStatus}`, 'update');
    }
  };

  const addSubtask = () => {
    if (currentUser.role === 'Viewer') return;
    const newSub: SubTask = {
      id: `st-${Date.now()}`,
      title: '',
      description: '',
      dueDate: taskForm.dueDate || new Date().toISOString().split('T')[0],
      priority: 'Medium',
      status: 'To Do',
      assignee: teamMembers[0] || 'Unassigned'
    };
    setSubtasks([...subtasks, newSub]);
  };

  const updateSubtask = (id: string, field: keyof SubTask, value: any) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const toggleSubtaskStatus = (id: string) => {
    if (currentUser.role === 'Viewer') return;
    setSubtasks(subtasks.map(s => {
      if (s.id === id) {
        const nextStatus: Status = s.status === 'Completed' ? 'To Do' : 'Completed';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `com-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      text: newComment,
      timestamp: new Date().toLocaleString()
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleFileUpload = () => {
    const fileName = prompt("Enter simulated file name (e.g. dispatch_slip.pdf)");
    if (!fileName) return;
    const att: Attachment = {
      id: `att-${Date.now()}`,
      name: fileName,
      url: '#',
      type: fileName.split('.').pop()?.toUpperCase() || 'FILE',
      size: '1.5MB'
    };
    setAttachments([...attachments, att]);
  };

  const CompanyLabel = ({ projectId }: { projectId: string }) => {
    const isMaktune = projectId === 'p1' || projectId === 'p3';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-tighter border ${
        isMaktune ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'
      }`}>
        <span className="text-xs leading-none">{isMaktune ? '🚀' : '🛡️'}</span>
        <span className="leading-none">{isMaktune ? 'Maktune' : 'DE'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="flex items-center gap-4 sm:gap-5 mb-4">
             <div className="flex -space-x-3 sm:-space-x-4">
               <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl sm:text-2xl shadow-xl border-2 sm:border-4 border-white">🚀</div>
               <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-cyan-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-xl border-2 sm:border-4 border-white">🛡️</div>
             </div>
             <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">Strategy Board</h2>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed text-xs sm:text-sm">Managing growth for Maktune and stability for DE. Drag tasks to update status.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 relative z-10">
          <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl border border-slate-200">
             <button onClick={() => setCompanyFilter('all')} className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${companyFilter === 'all' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>All</button>
             {companies.map(c => (
               <button key={c.id} onClick={() => setCompanyFilter(c.id)} className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${companyFilter === c.id ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}>{c.name}</button>
             ))}
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl sm:rounded-2xl border border-slate-800 shadow-xl">
             {(['kanban', 'table', 'calendar'] as LayoutType[]).map(type => (
               <button key={type} onClick={() => setActiveLayout(type)} className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeLayout === type ? 'bg-white text-slate-900' : 'text-slate-500'}`}>{type}</button>
             ))}
          </div>
        </div>
      </header>

      <div className="flex border-b border-slate-200 gap-6 sm:gap-10 px-2 sm:px-4 items-end overflow-x-auto scrollbar-hide">
        {(['React', 'Maintain', 'Improvise'] as RMIFocus[]).map(focus => (
          <button key={focus} onClick={() => setActiveRMI(focus)} className={`pb-4 sm:pb-5 px-1 transition-all relative group flex-shrink-0 ${activeRMI === focus ? `text-slate-900` : 'text-slate-400 hover:text-slate-600'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-sm transition-all ${activeRMI === focus ? `bg-${rmiConfig[focus].color}-600 text-white shadow-lg` : 'bg-slate-100'}`}>{rmiConfig[focus].icon}</span>
              <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.2em]">{focus}</span>
            </div>
            {activeRMI === focus && <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-${rmiConfig[focus].color}-600 rounded-t-full`} />}
          </button>
        ))}
      </div>

      <div className={`p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border-2 border-dashed bg-${rmiConfig[activeRMI].color}-50/30 border-${rmiConfig[activeRMI].color}-200 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8`}>
        <div className="flex items-center gap-4 sm:gap-6">
           <div className="w-12 h-12 sm:w-16 h-16 rounded-xl bg-white shadow-xl flex items-center justify-center text-2xl border border-slate-100">{rmiConfig[activeRMI].icon}</div>
           <div>
             <h4 className={`font-black text-[10px] sm:text-[11px] text-${rmiConfig[activeRMI].color}-800 uppercase tracking-[0.25em] mb-1`}>{rmiConfig[activeRMI].label} Mode</h4>
             <p className="text-xs text-slate-500 font-bold">{rmiConfig[activeRMI].desc}</p>
           </div>
        </div>
        <button 
          onClick={openCreateModal}
          disabled={currentUser.role === 'Viewer'}
          className={`w-full sm:w-auto bg-${rmiConfig[activeRMI].color}-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.03] shadow-xl disabled:opacity-50`}
        >
          + Deploy Mission
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeLayout === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {(['To Do', 'In Progress', 'Completed'] as Status[]).map(status => (
              <div 
                key={status} 
                className="flex flex-col h-full group/col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center justify-between mb-6 px-4">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{status}</h4>
                  <span className="text-[10px] font-black text-slate-300 group-hover/col:text-indigo-400 transition-colors">
                    {filteredTasks.filter(t => t.status === status).length} Units
                  </span>
                </div>
                <div className="flex-1 space-y-4 bg-slate-100/40 p-4 rounded-[2rem] border-2 border-dashed border-slate-200/60 min-h-[400px] group-hover/col:border-indigo-200 group-hover/col:bg-indigo-50/20 transition-all">
                  {filteredTasks.filter(t => t.status === status).map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => openEditModal(task)} 
                      draggable={currentUser.role !== 'Viewer'}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                           <CompanyLabel projectId={task.projectId} />
                           {task.isRecurring && (
                             <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-lg border border-indigo-100" title={`Recurring: ${task.recurringInterval}`}>🔁</span>
                           )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                           <span>💬</span>
                           <span>{task.comments.length}</span>
                        </div>
                      </div>
                      <h5 className="font-bold text-slate-800 text-sm mb-2">{task.title}</h5>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-4">
                        <div className={`h-full ${status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${calculateProgress(task)}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{task.assignee.charAt(0)}</div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeLayout === 'table' && (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Mission</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Cycle</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Lead</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(task => (
                  <tr key={task.id} onClick={() => openEditModal(task)} className="hover:bg-slate-50/50 cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <CompanyLabel projectId={task.projectId} />
                        <span className="font-bold text-slate-900">{task.title}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       {task.isRecurring ? (
                         <span className="text-[9px] font-black uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 flex items-center gap-1.5 w-fit">
                           <span className="text-xs">🔁</span> {task.recurringInterval}
                         </span>
                       ) : (
                         <span className="text-[9px] font-black uppercase px-2 py-1 bg-slate-50 text-slate-400 rounded-lg border border-slate-100">One-off</span>
                       )}
                    </td>
                    <td className="px-10 py-6">
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${
                         task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                         task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                       }`}>
                         {task.status}
                       </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 text-[10px] font-black text-slate-500 flex items-center justify-center border border-slate-200">{task.assignee.charAt(0)}</div>
                        <span className="text-xs font-bold">{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <span className="text-xs font-black text-indigo-600">{calculateProgress(task)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeLayout === 'calendar' && <CalendarView tasks={filteredTasks} projects={[]} onTaskClick={openEditModal} />}
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-6xl p-8 sm:p-12 shadow-2xl animate-scaleIn flex flex-col h-[90vh] overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl sm:text-4xl font-black text-slate-900">{editingTask ? 'Optimize Unit' : 'Deploy Unit'}</h3>
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${modalProgress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {modalProgress}% Global Progress
                  </span>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl w-fit border border-slate-100">
                   {(['details', 'subtasks', 'collab'] as const).map(tab => (
                     <button
                       key={tab}
                       onClick={() => setActiveModalTab(tab)}
                       className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeModalTab === tab ? 'bg-white shadow-md text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       {tab === 'details' ? '📝 Mission Info' : tab === 'subtasks' ? '🎯 Sequence' : '👥 Logs'}
                     </button>
                   ))}
                </div>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 rounded-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
              {activeModalTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn">
                   <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Portfolio Entity</label>
                        <div className="grid grid-cols-2 gap-3">
                          {companies.map(c => (
                            <button key={c.id} onClick={() => setTaskForm({...taskForm, companyId: c.id})} className={`p-4 rounded-2xl border-2 font-black text-xs flex flex-col items-center gap-2 transition-all ${taskForm.companyId === c.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                               <span className="text-2xl">{c.id === 'c1' ? '🚀' : '🛡️'}</span>
                               {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Cycle</label>
                           <button 
                             onClick={() => setTaskForm({...taskForm, isRecurring: !taskForm.isRecurring})}
                             className={`w-12 h-6 rounded-full transition-all relative ${taskForm.isRecurring ? 'bg-indigo-600' : 'bg-slate-300'}`}
                           >
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${taskForm.isRecurring ? 'left-7' : 'left-1'}`} />
                           </button>
                        </div>
                        {taskForm.isRecurring && (
                          <div className="space-y-3 animate-fadeIn">
                            <select 
                              value={taskForm.recurringInterval} 
                              onChange={e => setTaskForm({...taskForm, recurringInterval: e.target.value as RecurringInterval})}
                              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none"
                            >
                               <option value="Daily">Daily Execution</option>
                               <option value="Weekly">Weekly Sync</option>
                               <option value="Monthly">Monthly Audit</option>
                               <option value="Quarterly">Quarterly Roadmap</option>
                            </select>
                            <p className="text-[9px] text-slate-400 font-bold uppercase text-center">Auto-generates unit upon completion</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Lead Owner</label>
                        <select value={taskForm.assignee} onChange={e => setTaskForm({...taskForm, assignee: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none">
                           {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Unit Status</label>
                        <select 
                          value={taskForm.status} 
                          onChange={e => setTaskForm({...taskForm, status: e.target.value as Status})} 
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-indigo-500 transition-colors"
                        >
                           <option value="To Do">To Do</option>
                           <option value="In Progress">In Progress</option>
                           <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mission Headline</label>
                        <input type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none" placeholder="Primary objective..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Date</label>
                          <input type="date" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Priority</label>
                          <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value as Priority})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none">
                             <option>High</option><option>Medium</option><option>Low</option>
                          </select>
                        </div>
                      </div>
                      <textarea value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 font-medium h-36 outline-none" placeholder="Contextual logic..." />
                   </div>
                </div>
              )}

              {activeModalTab === 'subtasks' && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xl font-black text-slate-900">Sequence Steps</h4>
                      <button onClick={addSubtask} disabled={currentUser.role === 'Viewer'} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:opacity-50">+ Add Sequence</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {subtasks.map((sub) => (
                        <div key={sub.id} className={`p-6 rounded-3xl border border-slate-100 transition-all ${sub.status === 'Completed' ? 'bg-emerald-50/30' : 'bg-slate-50'}`}>
                           <div className="flex justify-between items-center mb-4">
                              <button onClick={() => toggleSubtaskStatus(sub.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${sub.status === 'Completed' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-slate-200 text-transparent'}`}>✓</button>
                              <button onClick={() => removeSubtask(sub.id)} className="text-slate-300 hover:text-rose-500">✕</button>
                           </div>
                           <input type="text" value={sub.title} onChange={e => updateSubtask(sub.id, 'title', e.target.value)} className="w-full bg-transparent border-b border-slate-200 mb-4 p-1 font-bold outline-none focus:border-indigo-500" placeholder="Step title..." />
                           <div className="flex gap-4">
                              <select value={sub.assignee} onChange={e => updateSubtask(sub.id, 'assignee', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-[10px] font-black outline-none uppercase">
                                 {teamMembers.map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                              <input type="date" value={sub.dueDate} onChange={e => updateSubtask(sub.id, 'dueDate', e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-[10px] font-bold outline-none" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeModalTab === 'collab' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fadeIn h-full">
                   <div className="lg:col-span-2 flex flex-col h-full bg-slate-50 rounded-[3rem] p-8 border border-slate-100">
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Mission Logs</h4>
                      <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 scrollbar-hide">
                         {comments.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-full opacity-30 italic">
                             <p className="text-sm font-bold">No logs for this mission.</p>
                           </div>
                         ) : (
                           comments.map(c => (
                             <div key={c.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black flex-shrink-0 shadow-lg">{c.authorName.charAt(0)}</div>
                                <div className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                                   <div className="flex justify-between items-center mb-2">
                                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{c.authorName}</span>
                                      <span className="text-[9px] font-black text-slate-300 uppercase">{c.timestamp}</span>
                                   </div>
                                   <p className="text-sm text-slate-700 font-medium leading-relaxed">{c.text}</p>
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                      <div className="relative">
                         <textarea 
                           value={newComment} 
                           onChange={e => setNewComment(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())}
                           className="w-full bg-white border-2 border-slate-200 rounded-[2rem] p-6 pr-20 outline-none focus:border-indigo-600 shadow-xl transition-all font-medium text-sm" 
                           placeholder="Add a log entry..." 
                         />
                         <button onClick={handleAddComment} className="absolute right-4 bottom-4 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-all text-xl">🚀</button>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                         <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Digital Assets</h4>
                         <button onClick={handleFileUpload} disabled={currentUser.role === 'Viewer'} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-50">📎</button>
                      </div>
                      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
                         {attachments.length === 0 ? (
                           <div className="flex flex-col items-center justify-center h-48 opacity-20 border-2 border-dashed border-white/20 rounded-[2rem]">
                              <p className="text-[10px] font-black uppercase tracking-widest">No assets</p>
                           </div>
                         ) : (
                           attachments.map(att => (
                             <div key={att.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group cursor-pointer">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl shadow-inner">{att.type === 'PDF' ? '📄' : '⚙️'}</div>
                                   <div className="flex-1 min-w-0">
                                      <p className="text-xs font-black truncate">{att.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{att.size} • {att.type}</p>
                                   </div>
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                   </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-10 border-t border-slate-100 mt-auto">
              <button onClick={() => setShowTaskModal(false)} className="flex-1 py-5 border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 text-[11px]">Cancel</button>
              {currentUser.role !== 'Viewer' && (
                <button onClick={handleSaveTask} className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] shadow-2xl transition-all text-[11px]">
                  Confirm Parameters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
