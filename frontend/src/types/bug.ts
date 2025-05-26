export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type BugPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Define acceptable metadata value types
export type MetadataValue = string | number | boolean | null;

// Interface for bug metadata
export interface BugMetadata {
  [key: string]: MetadataValue;
}

export interface Bug {
  id: number;
  title: string;
  description: string | null;
  screenshotUrl: string | null;
  createdAt: string;
  status: BugStatus;
  priority: BugPriority;
  metadata?: BugMetadata;
}

export interface CreateBugRequest {
  title: string;
  description?: string;
  screenshotUrl?: string;
  priority?: BugPriority;
  metadata?: BugMetadata;
}

export interface UpdateStatusRequest {
  status: BugStatus;
}

export interface UpdateMetadataRequest {
  metadata: BugMetadata;
}