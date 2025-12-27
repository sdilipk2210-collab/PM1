
import React, { useState } from 'react';
import { ViewType, Project, Task, Idea, SOP, Company, RMIFocus, RMIMeta, AppUser, AppNotification } from './types';
import { COMPANIES as INITIAL_COMPANIES, MOCK_PROJECTS, MOCK_TASKS, MOCK_IDEAS, MOCK_SOPS, TEAM_MEMBERS as INITIAL_TEAM, USERS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import IdeaBank from './components/IdeaBank';
import SOPLibrary from './components/SOPLibrary';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showStatusToast, setShowStatusToast] = useState(true);
  
  // User & Collaboration State
  const [currentUser] = useState<AppUser>(USERS[0]); 
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', text: 'Mark Sloan mentioned you in "Atmos Metadata Fix"', type: 'mention', read: false, timestamp: '10m ago' },
    { id: 'n2', text: 'Sarah Chen completed "Isolate encoding bug"', type: 'update', read: false, timestamp: '1h ago' }
  ]);

  // Global Configurable State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [teamMembers, setTeamMembers] = useState<string[]>(INITIAL_TEAM);
  const [rmiConfig, setRmiConfig] = useState<Record<RMIFocus, RMIMeta>>({
    React: { color: 'rose', icon: '⚡', label: 'Reactive', desc: 'Critical Firefighting & Patches' },
    Maintain: { color: 'indigo', icon: '🛡️', label: 'Maintain', desc: 'Core Scalability & Compliance' },
    Improvise: { color: 'amber', icon: '🚀', label: 'Improvise', desc: 'Innovative Feature Prototypes' }
  });

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [ideas, setIdeas] = useState<Idea[]>(MOCK_IDEAS);
  const [sops, setSops] = useState<SOP[]>(MOCK_SOPS);

  const handleAddTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: `t${Date.now()}`,
      projectId: newTask.projectId || 'p1',
      title: newTask.title || 'New Objective',
      description: newTask.description || '',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority || 'Medium',
      status: 'To Do',
      rmiFocus: newTask.rmiFocus || 'Maintain',
      assignee: newTask.assignee || 'Unassigned',
      sopId: newTask.sopId || undefined,
      subtasks: [],
      comments: [],
      attachments: [],
      isRecurring: newTask.isRecurring || false,
      recurringInterval: newTask.recurringInterval || 'None',
      ...newTask
    } as Task;
    setTasks([...tasks, task]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleAddNotification = (text: string, type: 'mention' | 'update' | 'system') => {
    setNotifications([
      { id: `n${Date.now()}`, text, type, read: false, timestamp: 'Just now' },
      ...notifications
    ]);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard projects={projects} tasks={tasks} ideas={ideas} />;
      case 'tasks':
        return (
          <TaskManager 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            companies={companies}
            sops={sops}
            teamMembers={teamMembers}
            rmiConfig={rmiConfig}
            currentUser={currentUser}
            onNotify={handleAddNotification}
          />
        );
      case 'sops':
        return (
          <SOPLibrary 
            sops={sops} 
            companies={companies} 
            onAddSOP={(sop) => {
              const s: SOP = {
                id: `sop${Date.now()}`,
                companyId: sop.companyId || companies[0].id,
                title: sop.title || 'Standard Process',
                description: sop.description || '',
                content: sop.content || '',
                rmiFocus: sop.rmiFocus || 'Maintain',
                lastUpdated: new Date().toISOString().split('T')[0],
                status: sop.status || 'Draft'
              } as SOP;
              setSops([...sops, s]);
            }} 
            onUpdateSOP={(sop) => setSops(sops.map(s => s.id === sop.id ? sop : s))} 
          />
        );
      case 'ideas':
        return (
          <IdeaBank 
            ideas={ideas}
            onAddIdea={(newIdea) => {
              const idea: Idea = {
                id: `i${Date.now()}`,
                companyId: newIdea.companyId || companies[0].id,
                title: newIdea.title || 'New Concept',
                description: newIdea.description || '',
                impact: newIdea.impact || 5,
                confidence: newIdea.confidence || 5,
                ease: newIdea.ease || 5,
                iceScore: (newIdea.impact || 5) * (newIdea.confidence || 5) * (newIdea.ease || 5),
                status: 'Backlog'
              } as Idea;
              setIdeas([...ideas, idea]);
            }}
            onUpdateIdea={(idea) => setIdeas(ideas.map(i => i.id === idea.id ? idea : i))}
            onPromoteToTask={(idea, rmi) => {
              handleAddTask({
                title: idea.title,
                description: idea.description,
                rmiFocus: rmi,
                projectId: idea.companyId === 'c1' ? 'p1' : 'p2',
                priority: 'Medium'
              });
              setIdeas(ideas.map(i => i.id === idea.id ? { ...i, status: 'Promoted' } : i));
              setActiveView('tasks');
            }}
            companies={companies}
          />
        );
      case 'settings':
        return (
          <Settings 
            companies={companies}
            setCompanies={setCompanies}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            rmiConfig={rmiConfig}
            setRmiConfig={setRmiConfig}
            projects={projects}
            setProjects={setProjects}
          />
        );
      default:
        return <Dashboard projects={projects} tasks={tasks} ideas={ideas} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] font-sans text-slate-900">
      <Sidebar 
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentUser={currentUser}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onDismissNotification={handleDismissNotification}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-12 xl:p-16 overflow-y-auto max-h-screen">
        <div className="lg:hidden flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-sm font-black tracking-tighter">DK</span>
             </div>
             <span className="text-slate-900 font-black text-sm uppercase tracking-tight">Dilip's Workspace</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {showStatusToast && (
        <div className="hidden sm:flex fixed bottom-10 right-10 flex-col gap-3 pointer-events-none z-[60]">
          <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 animate-slideUp pointer-events-auto border border-slate-800 relative group">
            <button 
              onClick={() => setShowStatusToast(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
              title="Close status"
            >
              ✕
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">⚙️</div>
            <div className="pr-10 min-w-[200px]">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">SYSTEM SYNC</p>
               <p className="text-sm font-bold text-slate-200 leading-tight">Dilip's Workspace Online.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
