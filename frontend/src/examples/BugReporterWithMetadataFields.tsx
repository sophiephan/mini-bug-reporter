import { BugReporter } from '../components/BugReporter';
import type { BugReporterOptions } from '../components/BugReporterConfig';

export function BugReporterWithMetadataFieldsExample() {
  // Configure the bug reporter with metadata fields and automatic context data
  const options: BugReporterOptions = {
    // Show the metadata UI fields
    showMetadataFields: true,
    
    // Customize UI elements
    title: 'Report an Issue',
    submitButtonText: 'Submit Report',
    
    // Automatically collect context data
    getContextData: async () => {
      // This can be used alongside the UI fields
      // Any UI fields with the same key will override these values
      return {
        // Automatically add user info
        reportedBy: 'user@example.com',
        
        // Add environment details
        environment: 'development', // In a real app, get this from your environment config
        appVersion: '1.2.3',
        
        // Add browser info
        userAgent: navigator.userAgent,
        
        // Add current URL
        currentPage: window.location.pathname,
        
        // Add timestamp
        timestamp: Date.now()
      };
    }
  };
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bug Reporter with Metadata Fields</h1>
      <p className="mb-4">
        This example shows how to use the Bug Reporter with custom metadata fields.
        Users can add their own key-value pairs while the system also collects automatic context data.
      </p>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Usage Example:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
{`// Enable metadata fields UI
const options = {
  showMetadataFields: true,
  getContextData: () => ({
    // Automatic context data
    reportedBy: getCurrentUser().email,
    appVersion: '1.2.3'
  })
};

<BugReporter options={options} />`}
        </pre>
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold mb-4">Live Demo:</h2>
        <BugReporter 
          options={options}
          onSubmitSuccess={() => alert('Bug report submitted successfully!')}
          onSubmitError={(error) => console.error('Error submitting bug report:', error)}
        />
      </div>
    </div>
  );
} 