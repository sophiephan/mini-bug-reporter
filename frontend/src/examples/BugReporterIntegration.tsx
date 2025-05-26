import React from 'react';
import { BugReporter } from '../components/BugReporter';
import type { BugReporterOptions } from '../components/BugReporterConfig';

/**
 * Example of integrating the BugReporter into your own app
 */
export const BugReporterIntegration: React.FC = () => {
  // Configure the bug reporter options for your specific app
  const bugReporterOptions: BugReporterOptions = {
    // Hide features you don't need
    showScreenshotUrl: false,
    
    // Customize UI text
    title: 'Report an Issue',
    submitButtonText: 'Send Report',
    successMessage: 'Thank you for your feedback!',
    
    // Set a different API endpoint if needed
    apiEndpoint: 'https://your-app-api.example.com/api/bugs',
    
    // Automatically include user context with each bug report
    getContextData: () => {
      return {
        // User information from your app's auth system
        reportedBy: {
          userId: '12345',
          email: 'user@example.com',
          role: 'customer'
        },
        
        // Page/route information
        sourcePage: window.location.pathname,
        
        // App version
        appVersion: '1.2.3',
        
        // Browser information
        userAgent: navigator.userAgent,
        
        // Timestamp
        reportedAt: new Date().toISOString()
      };
    }
  };

  // Handle successful submission
  const handleSubmitSuccess = () => {
    console.log('Bug report submitted successfully');
    // You can add your own logic here, like showing a notification
  };

  // Handle submission errors
  const handleSubmitError = (error: Error) => {
    console.error('Failed to submit bug report:', error);
    // You can add your own error handling logic here
  };

  return (
    <div className="my-app-container">
      <h1>My Application</h1>
      
      {/* Your app content */}
      <div className="my-app-content">
        {/* ... your app's main content ... */}
      </div>
      
      {/* Bug reporter integration */}
      <div className="bug-reporter-container">
        <BugReporter 
          options={bugReporterOptions}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
        />
      </div>
    </div>
  );
}; 