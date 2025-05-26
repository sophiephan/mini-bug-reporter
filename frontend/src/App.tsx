import { useState } from 'react';
import { Layout } from './components/Layout';
import { BugList } from './components/BugList';
import { BugForm } from './components/BugForm';
import { BugReporter } from './components/BugReporter';
import { useBugs } from './hooks/useBugs';
import { CUSTOM_CONFIG } from './components/BugReporterConfig';

function App() {
  const { bugs, loading, error, addBug, removeBug, loadBugs } = useBugs();
  const [showMetadataView, setShowMetadataView] = useState(false);

  // Handle successful submission from BugReporter
  const handleBugReporterSuccess = () => {
    // Refresh the bug list after submission
    loadBugs();
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bug Tracking System</h1>
        <button 
          onClick={() => setShowMetadataView(!showMetadataView)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showMetadataView ? 'Switch to Standard View' : 'Show Metadata Fields'}
        </button>
      </div>
      
      {showMetadataView ? (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata Fields Demo</h2>
          <p className="mb-4 text-gray-600">
            This view demonstrates the custom metadata fields feature. You can add key-value pairs that will be 
            stored as metadata with your bug report. The system also automatically collects additional context data.
          </p>
          <BugReporter 
            options={CUSTOM_CONFIG} 
            onSubmitSuccess={handleBugReporterSuccess} 
          />
        </div>
      ) : (
        <>
          <BugForm onSubmit={addBug} />
        </>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bug Reports</h2>
        <BugList 
          bugs={bugs} 
          loading={loading} 
          error={error} 
          onDelete={removeBug} 
        />
      </div>
    </Layout>
  );
}

export default App;
