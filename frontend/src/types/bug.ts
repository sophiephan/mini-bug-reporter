export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type BugPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Bug {
  id: number;
  title: string;
  description: string | null;
  screenshotUrl: string | null;
  createdAt: string;
  status: BugStatus;
  priority: BugPriority;
}

export interface CreateBugRequest {
  title: string;
  description?: string;
  screenshotUrl?: string;
  priority?: BugPriority;
}

export interface UpdateStatusRequest {
  status: BugStatus;
}