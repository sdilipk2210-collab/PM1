
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Completed';
export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Finished';
export type RMIFocus = 'React' | 'Maintain' | 'Improvise';
export type LayoutType = 'kanban' | 'table' | 'calendar';
export type UserRole = 'Admin' | 'Member' | 'Viewer';
export type RecurringInterval = 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';

export interface Company {
  id: string;
  name: string;
  color: string;
  logo: string;
}

export interface RMIMeta {
  color: string;
  icon: string;
  label: string;
  desc: string;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  endDate: string;
}

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface SubTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignee: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  rmiFocus: RMIFocus;
  assignee: string;
  sopId?: string;
  subtasks: SubTask[];
  comments: Comment[];
  attachments: Attachment[];
  isRecurring: boolean;
  recurringInterval: RecurringInterval;
}

export interface SOP {
  id: string;
  companyId: string;
  title: string;
  description: string;
  content: string;
  rmiFocus: RMIFocus;
  lastUpdated: string;
  status: 'Draft' | 'Active' | 'Review Required';
}

export interface Idea {
  id: string;
  companyId: string;
  title: string;
  description: string;
  impact: number;      // 1-10
  confidence: number;  // 1-10
  ease: number;        // 1-10
  iceScore: number;    // impact * confidence * ease
  status: 'Backlog' | 'Validating' | 'Promoted';
}

export interface AppNotification {
  id: string;
  text: string;
  type: 'mention' | 'update' | 'system';
  read: boolean;
  timestamp: string;
}

export type ViewType = 'dashboard' | 'tasks' | 'ideas' | 'sops' | 'settings';
