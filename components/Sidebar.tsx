
import React, { useState } from 'react';
import { ViewType, AppNotification, AppUser } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (v: ViewType) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  currentUser: AppUser;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView,
  isSidebarOpen,
  setIsSidebarOpen,
  currentUser,
  notifications,
  onMarkRead,
  onDismissNotification
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Portfolio Health', icon: '📊' },
    { id: 'tasks', label: 'Task Manager', icon: '⚡' },
    { id: 'sops', label: 'SOP Library', icon: '📜' },
    { id: 'ideas', label: 'Idea Bank', icon: '💡' },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col h-screen z-[100] transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-6 flex items-center justify-between">
          <h1 className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 flex-shrink-0">
              <span className="text-lg font-black tracking-tighter">DK</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-slate-900 font-black text-sm uppercase tracking-tight">Dilip's Workspace</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold font-mono">Portfolio Control</span>
            </div>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <div className="mb-6 px-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:bg-slate-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔔</span>
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Activity Logs</p>
                    <button onClick={() => setShowNotifications(false)} className="text-[9px] font-black text-indigo-600 hover:text-indigo-800">CLOSE</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-slate-400 italic">Queue clear.</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 group relative hover:bg-slate-50 transition-all ${!n.read ? 'bg-indigo-50/30' : ''}`}
                        >
                          <div onClick={() => onMarkRead(n.id)} className="cursor-pointer pr-6">
                            <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{n.text}</p>
                            <p className="text-[9px] text-slate-400 mt-1 uppercase font-black">{n.timestamp}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDismissNotification(n.id); }}
                            className="absolute top-4 right-3 text-slate-300 hover:text-rose-500 transition-colors"
                            title="Dismiss notification"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Operations</p>
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  activeView === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:translate-x-1'
                }`}
              >
                <span className="text-xl flex-shrink-0 w-6 text-center">{item.icon}</span>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-4">Executive</p>
            <button
              onClick={() => setActiveView('settings')}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                activeView === 'settings' 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl flex-shrink-0 w-6 text-center">⚙️</span>
              <span className="font-bold text-sm tracking-tight">System Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-black text-slate-800 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                  currentUser.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 
                  currentUser.role === 'Member' ? 'bg-emerald-100 text-emerald-700' : 
                  'bg-slate-200 text-slate-600'
                }`}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
