import type { BugPriority, BugMetadata } from '../types/bug';

export interface BugReporterOptions {
  // Feature toggles
  showDescription?: boolean;
  showPriority?: boolean;
  showScreenshotUrl?: boolean;
  showMetadataFields?: boolean;
  
  // Default values
  defaultPriority?: BugPriority;
  
  // Custom context
  getContextData?: () => Promise<BugMetadata> | BugMetadata;
  
  // API configuration
  apiEndpoint?: string;
  
  // UI customization
  title?: string;
  submitButtonText?: string;
  successMessage?: string;
}

// Default configuration - keep this minimal for tests
export const DEFAULT_CONFIG: BugReporterOptions = {
  showDescription: true,
  showPriority: true,
  showScreenshotUrl: true,
  showMetadataFields: false,
  defaultPriority: 'MEDIUM',
  title: 'Report a Bug',
  submitButtonText: 'Submit Bug Report',
  successMessage: 'Bug report submitted successfully!',
  apiEndpoint: 'http://localhost:8080/api/bugs',
};

// Custom configuration with metadata fields enabled
export const CUSTOM_CONFIG: BugReporterOptions = {
  ...DEFAULT_CONFIG,
  showMetadataFields: true,
  title: 'Report an Issue',
  submitButtonText: 'Submit Report',
  getContextData: async () => {
    return {
      reportedBy: 'user@example.com',
      environment: 'development',
      appVersion: '1.2.3',
      userAgent: navigator.userAgent,
      currentPage: window.location.pathname,
      timestamp: Date.now()
    };
  }
};