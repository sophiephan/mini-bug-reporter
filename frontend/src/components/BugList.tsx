import type { Bug } from '../types/bug';
import { formatDate } from '../utils/dateUtils';

interface BugListProps {
  bugs: Bug[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<boolean>;
}

export const BugList = ({ bugs, loading, error, onDelete }: BugListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No bugs reported yet. Create your first bug report!
      </div>
    );
  }

  const getStatusColor = (status: Bug['status']) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <div key={bug.id} className="border rounded-lg shadow-sm p-4 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{bug.title}</h3>
              <p className="text-sm text-gray-500">
                Reported on {formatDate(bug.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bug.status)}`}>
                {bug.status.replace('_', ' ')}
              </span>
              <button
                onClick={() => onDelete(bug.id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
                aria-label="Delete bug"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          {bug.description && (
            <p className="mt-2 text-sm text-gray-600">{bug.description}</p>
          )}
          {bug.screenshotUrl && (
            <a 
              href={bug.screenshotUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View Screenshot
            </a>
          )}
        </div>
      ))}
    </div>
  );
}; 