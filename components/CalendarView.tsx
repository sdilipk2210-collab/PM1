
import React, { useState } from 'react';
import { Task, Project, SubTask } from '../types';

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick?: (task: Task) => void;
}

interface CalendarDisplayItem {
  id: string;
  title: string;
  type: 'task' | 'subtask';
  status: string;
  rmiFocus: string;
  parentTask?: Task;
  originalTask: Task;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, projects, onTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const numDays = daysInMonth(year, month);
  const startOffset = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getItemsForDay = (day: number): CalendarDisplayItem[] => {
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : month + 1;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    const dayTasks: CalendarDisplayItem[] = tasks
      .filter(t => t.dueDate === dateStr)
      .map(t => ({
        id: t.id,
        title: t.title,
        type: 'task',
        status: t.status,
        rmiFocus: t.rmiFocus,
        originalTask: t
      }));

    const daySubtasks: CalendarDisplayItem[] = tasks.flatMap(t => 
      (t.subtasks || [])
        .filter(st => st.dueDate === dateStr)
        .map(st => ({
          id: st.id,
          title: st.title,
          type: 'subtask',
          status: st.status,
          rmiFocus: t.rmiFocus,
          parentTask: t,
          originalTask: t
        }))
    );

    return [...dayTasks, ...daySubtasks];
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
      <header className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{monthNames[month]} {year}</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Roadmap including tactical subtasks.</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={prevMonth} className="flex-1 sm:flex-none w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">◀</button>
          <button onClick={() => setCurrentDate(new Date())} className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">Today</button>
          <button onClick={nextMonth} className="flex-1 sm:flex-none w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600">▶</button>
        </div>
      </header>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-white sticky top-0 z-10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-3 sm:py-4 text-center text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-sm">
        {Array.from({ length: 42 }).map((_, i) => {
          const dayNumber = i - startOffset + 1;
          const isCurrentMonth = dayNumber > 0 && dayNumber <= numDays;
          const dayItems = isCurrentMonth ? getItemsForDay(dayNumber) : [];
          
          return (
            <div key={i} className={`min-h-[100px] sm:h-40 border-b border-r border-slate-100 p-2 sm:p-3 transition-all ${
              !isCurrentMonth ? 'bg-slate-50/30' : 'bg-white hover:bg-slate-50/20'
            }`}>
              {isCurrentMonth && (
                <>
                  <span className={`text-[10px] sm:text-xs font-black mb-1 sm:mb-2 inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-lg ${
                    dayNumber === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'text-slate-400'
                  }`}>
                    {dayNumber}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] sm:max-h-[120px] scrollbar-hide">
                    {dayItems.map(item => (
                      <div 
                        key={`${item.type}-${item.id}`} 
                        onClick={() => onTaskClick?.(item.originalTask)}
                        className={`text-[8px] sm:text-[9px] px-1.5 py-1 rounded-md truncate shadow-sm font-bold border-l-2 sm:border-l-4 cursor-pointer hover:translate-x-0.5 transition-transform ${
                          item.rmiFocus === 'React' ? 'bg-rose-50 text-rose-700 border-rose-500' :
                          item.rmiFocus === 'Improvise' ? 'bg-amber-50 text-amber-700 border-amber-500' :
                          'bg-indigo-50 text-indigo-700 border-indigo-500'
                        } ${item.status === 'Completed' ? 'opacity-50 line-through' : ''}`}
                        title={`${item.type === 'subtask' ? `[Subtask of ${item.parentTask?.title}] ` : ''}${item.title}`}
                      >
                        <div className="flex items-center gap-1">
                          {item.type === 'subtask' ? (
                            <span className="opacity-60 text-[7px] sm:text-[8px]">└</span>
                          ) : (
                            <span>{item.originalTask.projectId === 'p2' ? '🔷' : '🎵'}</span>
                          )}
                          <span className="truncate">{item.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
