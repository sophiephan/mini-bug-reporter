import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateBugRequest } from '../types/bug';

interface BugFormProps {
  onSubmit: (bug: CreateBugRequest) => Promise<boolean>;
}

export const BugForm = ({ onSubmit }: BugFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      };
      
      if (description.trim()) {
        newBug.description = description.trim();
      }
      
      if (screenshotUrl.trim()) {
        newBug.screenshotUrl = screenshotUrl.trim();
      }
      
      const result = await onSubmit(newBug);
      
      if (result) {
        setSuccess(true);
        // Reset form
        setTitle('');
        setDescription('');
        setScreenshotUrl('');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError('An error occurred while submitting the form. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Report a Bug</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Bug report submitted successfully!
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
              'Submit Bug Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}; 