
import { Company, Project, Task, Idea, SOP, AppUser } from './types';

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Maktune Technologies',
    color: 'indigo',
    logo: '🚀',
  },
  {
    id: 'c2',
    name: 'DE',
    color: 'cyan',
    logo: '🛡️',
  }
];

export const USERS: AppUser[] = [
  { id: 'u1', name: 'Dilip Kumar', role: 'Admin' },
  { id: 'u2', name: 'Sarah Chen', role: 'Member' },
  { id: 'u3', name: 'Mark Sloan', role: 'Member' },
  { id: 'u4', name: 'Jordan Lee', role: 'Viewer' }
];

export const TEAM_MEMBERS = USERS.map(u => u.name);

export const MOCK_SOPS: SOP[] = [
  {
    id: 'sop1',
    companyId: 'c2',
    title: 'BOM Preparation Protocol',
    description: 'Standard procedure for preparing Bill of Materials for new injection molds.',
    content: '1. List all raw plastic granules required. 2. Define hardware components (screws, bushings). 3. Calculate gross weight vs net weight for wastage. 4. Sign off by Floor Manager.',
    rmiFocus: 'Maintain',
    lastUpdated: '2024-05-12',
    status: 'Active'
  },
  {
    id: 'sop2',
    companyId: 'c1',
    title: 'Amazon Listing Optimization',
    description: 'Checklist for maintaining high-conversion B2C chair part listings.',
    content: '1. Check Keyword density in titles. 2. Verify A+ content rendering. 3. Monitor daily buy-box percentage. 4. Respond to customer queries within 4 hours.',
    rmiFocus: 'Maintain',
    lastUpdated: '2024-05-14',
    status: 'Active'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    companyId: 'c1',
    name: 'Amazon B2C Scaling',
    description: 'Expanding office chair part sales from Amazon India to Global markets.',
    status: 'Active',
    progress: 45,
    startDate: '2024-03-01',
    endDate: '2024-09-30'
  },
  {
    id: 'p2',
    companyId: 'c2',
    name: 'DE Lead Generation Phase 1',
    description: 'Targeting major furniture manufacturers for bulk office chair part supply.',
    status: 'Active',
    progress: 30,
    startDate: '2024-04-15',
    endDate: '2024-12-01'
  },
  {
    id: 'p3',
    companyId: 'c1',
    name: '3D Printed Accessory Line',
    description: 'R&D for small ergonomic add-ons using the personal 3D printer.',
    status: 'Planning',
    progress: 15,
    startDate: '2024-05-01',
    endDate: '2024-08-01'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    projectId: 'p2',
    title: 'Dispatch: 2000 Units Lumbar Support',
    description: 'Urgent dispatch for the Chennai client. Check QC before packing.',
    dueDate: '2024-05-16',
    priority: 'High',
    status: 'In Progress',
    rmiFocus: 'React',
    assignee: 'Dilip Kumar',
    subtasks: [],
    comments: [],
    attachments: [],
    isRecurring: false,
    recurringInterval: 'None'
  },
  {
    id: 't2',
    projectId: 'p1',
    title: 'Weekly Amazon Keyword Audit',
    description: 'Reviewing search terms for chair wheels listing to optimize ad spend.',
    dueDate: '2024-05-20',
    priority: 'Medium',
    status: 'To Do',
    rmiFocus: 'Maintain',
    assignee: 'Sarah Chen',
    sopId: 'sop2',
    subtasks: [],
    comments: [],
    attachments: [],
    isRecurring: true,
    recurringInterval: 'Weekly'
  },
  {
    id: 't3',
    projectId: 'p3',
    title: '3D Prototype: Cable Management Clip',
    description: 'Print v1 of the ergonomic desk cable clip for Maktune store.',
    dueDate: '2024-05-18',
    priority: 'Low',
    status: 'To Do',
    rmiFocus: 'Improvise',
    assignee: 'Dilip Kumar',
    subtasks: [],
    comments: [],
    attachments: [],
    isRecurring: false,
    recurringInterval: 'None'
  }
];

export const MOCK_IDEAS: Idea[] = [
  {
    id: 'i1',
    companyId: 'c2',
    title: 'New Mold: Ergonomic Headrest',
    description: 'Designing a universal headrest attachment for standard office chairs.',
    impact: 9,
    confidence: 7,
    ease: 4,
    iceScore: 252,
    status: 'Validating'
  },
  {
    id: 'i2',
    companyId: 'c1',
    title: 'Subscription Model for B2B Spares',
    description: 'Monthly supply of wheels and gas lifts to co-working spaces.',
    impact: 7,
    confidence: 5,
    ease: 6,
    iceScore: 210,
    status: 'Backlog'
  }
];
