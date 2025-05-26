import type { BugPriority } from '../types/bug';

export interface BugReporterOptions {
  // Feature toggles
  showDescription?: boolean;
  showPriority?: boolean;
  showScreenshotUrl?: boolean;
  
  // Default values
  defaultPriority?: BugPriority;
  
  // Custom context
  getContextData?: () => Promise<Record<string, unknown>> | Record<string, unknown>;
  
  // API configuration
  apiEndpoint?: string;
  
  // UI customization
  title?: string;
  submitButtonText?: string;
  successMessage?: string;
}

// Default configuration
export const DEFAULT_CONFIG: BugReporterOptions = {
  showDescription: true,
  showPriority: true,
  showScreenshotUrl: true,
  defaultPriority: 'MEDIUM',
  title: 'Report a Bug',
  submitButtonText: 'Submit Bug Report',
  successMessage: 'Bug report submitted successfully!',
  apiEndpoint: 'http://localhost:8080/api/bugs',
}; 