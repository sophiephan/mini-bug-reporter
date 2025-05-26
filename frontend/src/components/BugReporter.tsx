import type {FormEvent} from 'react';
import {useState} from 'react';
import axios from 'axios';
import type {BugPriority, CreateBugRequest, BugMetadata} from '../types/bug';
import type {BugReporterOptions} from './BugReporterConfig';
import {DEFAULT_CONFIG} from './BugReporterConfig';

interface BugReporterProps {
  options?: BugReporterOptions;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

interface MetadataField {
  id: string;
  key: string;
  value: string;
}

export const BugReporter = ({ 
  options = {}, 
  onSubmitSuccess,
  onSubmitError
}: BugReporterProps) => {
  // Merge default config with provided options
  const config = { ...DEFAULT_CONFIG, ...options };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [priority, setPriority] = useState<BugPriority>(config.defaultPriority || 'MEDIUM');
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([
    { id: crypto.randomUUID(), key: '', value: '' }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddMetadataField = () => {
    setMetadataFields([
      ...metadataFields,
      { id: crypto.randomUUID(), key: '', value: '' }
    ]);
  };

  const handleRemoveMetadataField = (id: string) => {
    setMetadataFields(metadataFields.filter(field => field.id !== id));
  };

  const handleMetadataChange = (id: string, field: 'key' | 'value', value: string) => {
    setMetadataFields(
      metadataFields.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const getMetadataFromFields = (): BugMetadata => {
    const metadata: BugMetadata = {};
    
    // Only include fields where both key and value are present
    metadataFields.forEach(field => {
      if (field.key.trim() && field.value.trim()) {
        metadata[field.key.trim()] = field.value.trim();
      }
    });
    
    return metadata;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationError(null);
    
    // Validate form
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const newBug: CreateBugRequest = {
        title: title.trim(),
        priority
      };
      
      if (config.showDescription && description.trim()) {
        newBug.description = description.trim();
      }
      
      if (config.showScreenshotUrl && screenshotUrl.trim()) {
        newBug.screenshotUrl = screenshotUrl.trim();
      }
      
      // Initialize metadata object
      newBug.metadata = {};
      
      // Add metadata from UI fields if enabled
      if (config.showMetadataFields) {
        const uiMetadata = getMetadataFromFields();
        newBug.metadata = { ...newBug.metadata, ...uiMetadata };
      }
      
      // Add custom context data as metadata if available
      if (config.getContextData) {
        try {
          const contextData = await Promise.resolve(config.getContextData());
          newBug.metadata = { ...newBug.metadata, ...contextData };
        } catch (contextError) {
          console.error('Error getting context data:', contextError);
          // Continue with submission even if context data fails
        }
      }
      
      // If metadata is empty, set it to undefined
      if (Object.keys(newBug.metadata).length === 0) {
        newBug.metadata = undefined;
      }
      
      // Submit the bug report
      await axios.post(config.apiEndpoint || DEFAULT_CONFIG.apiEndpoint!, newBug);
      
      setSuccess(true);
      // Reset form
      setTitle('');
      setDescription('');
      setScreenshotUrl('');
      setPriority(config.defaultPriority || 'MEDIUM');
      setMetadataFields([{ id: crypto.randomUUID(), key: '', value: '' }]);
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const error = err as Error;
      setError('An error occurred while submitting the form. Please try again.');
      console.error('Form submission error:', error);
      
      // Call error callback if provided
      if (onSubmitError) {
        onSubmitError(error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{config.title}</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {config.successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the bug"
            required
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
        </div>
        
        {config.showDescription && (
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed information about the bug"
            />
          </div>
        )}
        
        {config.showPriority && (
          <div className="mb-4">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as BugPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        )}
        
        {config.showScreenshotUrl && (
          <div className="mb-4">
            <label htmlFor="screenshotUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Screenshot URL
            </label>
            <input
              type="url"
              id="screenshotUrl"
              value={screenshotUrl}
              onChange={(e) => setScreenshotUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/screenshot.png"
            />
          </div>
        )}
        
        {config.showMetadataFields && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Custom Metadata
              </label>
              <button
                type="button"
                onClick={handleAddMetadataField}
                className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Field
              </button>
            </div>
            
            {metadataFields.map((field) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={field.key}
                  onChange={(e) => handleMetadataChange(field.id, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Key"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleMetadataChange(field.id, 'value', e.target.value)}
                  className="w-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Value"
                />
                {metadataFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMetadataField(field.id)}
                    className="px-2 py-1 text-gray-500 hover:text-red-500 focus:outline-none"
                    aria-label="Remove field"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">
              Add custom metadata as key-value pairs to provide additional context about the bug.
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              submitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              config.submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 