export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'To Do' | 'Planning' | 'In Progress' | 'In Review' | 'Blocked' | 'Done';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  completed: boolean;
  createdAt: number;
  startDate?: number;
  dueDate?: number;
  assignees: string[]; // User IDs
  tags: string[];
  subtasks: Subtask[];
}

export type TaskFilter = 'all' | 'active' | 'completed' | Status;
