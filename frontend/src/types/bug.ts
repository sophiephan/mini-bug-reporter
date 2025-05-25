export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface Bug {
  id: number;
  title: string;
  description: string | null;
  screenshotUrl: string | null;
  createdAt: string;
  status: BugStatus;
}

export interface CreateBugRequest {
  title: string;
  description?: string;
  screenshotUrl?: string;
}

export interface UpdateStatusRequest {
  status: BugStatus;
}