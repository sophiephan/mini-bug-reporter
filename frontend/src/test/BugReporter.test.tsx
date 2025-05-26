import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BugReporter } from '../components/BugReporter';
import axios from 'axios';
import { DEFAULT_CONFIG } from '../components/BugReporterConfig';

// Mock axios
vi.mock('axios');
// Create a proper mock with the required methods
const mockedAxios = {
  post: vi.fn()
};
// Override the axios import with our mock
vi.mocked(axios).post = mockedAxios.post;

describe('BugReporter Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default options', () => {
    render(<BugReporter />);
    
    // Check that default title is rendered
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
    
    // Check that all fields are visible by default
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/screenshot url/i)).toBeInTheDocument();
  });

  it('hides fields based on options', () => {
    const options = {
      showDescription: false,
      showPriority: false,
      showScreenshotUrl: false
    };
    
    render(<BugReporter options={options} />);
    
    // Title should always be visible
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    
    // These fields should be hidden
    expect(screen.queryByLabelText(/description/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/priority/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/screenshot url/i)).not.toBeInTheDocument();
  });

  it('customizes UI text', () => {
    const options = {
      title: 'Report an Issue',
      submitButtonText: 'Send Report'
    };
    
    render(<BugReporter options={options} />);
    
    expect(screen.getByText('Report an Issue')).toBeInTheDocument();
    expect(screen.getByText('Send Report')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<BugReporter />);
    
    // Submit without filling the required title field
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Use form validation instead of looking for text
    const titleInput = screen.getByLabelText(/title/i);
    await waitFor(() => {
      expect(titleInput).toBeInvalid();
    });
    
    // Axios post should not have been called
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('submits a bug report with metadata from getContextData', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    // Setup context data
    const contextData = {
      reportedBy: 'test@example.com',
      sourcePage: '/dashboard'
    };
    
    const options = {
      getContextData: () => contextData
    };
    
    render(<BugReporter options={options} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that axios.post was called with the right data
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: 'Test Bug',
          description: 'This is a test bug',
          // Check that context data was included as metadata
          metadata: {
            reportedBy: 'test@example.com',
            sourcePage: '/dashboard'
          }
        })
      );
    });
    
    // Check that success message is shown
    expect(screen.getByText(/bug report submitted successfully/i)).toBeInTheDocument();
  });

  it('handles async getContextData function', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    // Setup async context data function
    const asyncContextData = async () => {
      // Simulate an async operation
      return Promise.resolve({
        reportedBy: 'async@example.com',
        appVersion: '1.2.3',
        timestamp: Date.now()
      });
    };
    
    const options = {
      getContextData: asyncContextData
    };
    
    render(<BugReporter options={options} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that axios.post was called with the right data
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: 'Test Bug',
          // Check that context data was included as metadata
          metadata: expect.objectContaining({
            reportedBy: 'async@example.com',
            appVersion: '1.2.3',
            timestamp: expect.any(Number)
          })
        })
      );
    });
  });

  it('handles errors in getContextData gracefully', async () => {
    // Mock successful response for the bug submission
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    // Setup context data function that throws an error
    const errorContextData = () => {
      throw new Error('Failed to get context data');
    };
    
    const options = {
      getContextData: errorContextData
    };
    
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<BugReporter options={options} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting context data:',
        expect.any(Error)
      );
      
      // Check that the form was still submitted without metadata
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      // Use a more precise assertion with the exact endpoint and simplified object check
      expect(mockedAxios.post).toHaveBeenCalledWith(
        DEFAULT_CONFIG.apiEndpoint,
        {
          title: 'Test Bug',
          priority: 'MEDIUM'
        }
      );
    });
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it('handles submission errors', async () => {
    // Mock error response
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    
    // Setup error callback
    const onSubmitError = vi.fn();
    
    render(<BugReporter onSubmitError={onSubmitError} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to fail
    await waitFor(() => {
      // Check that error callback was called
      expect(onSubmitError).toHaveBeenCalledTimes(1);
      expect(onSubmitError).toHaveBeenCalledWith(expect.any(Error));
      
      // Check that error message is shown
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmitSuccess callback after successful submission', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    // Setup success callback
    const onSubmitSuccess = vi.fn();
    
    render(<BugReporter onSubmitSuccess={onSubmitSuccess} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(onSubmitSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('uses the default API endpoint when none is provided', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
    
    render(<BugReporter />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        DEFAULT_CONFIG.apiEndpoint,
        expect.any(Object)
      );
    });
  });

  it('uses a custom API endpoint when provided', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });
    
    const customEndpoint = 'https://custom-api.example.com/bugs';
    
    render(<BugReporter options={{ apiEndpoint: customEndpoint }} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        customEndpoint,
        expect.any(Object)
      );
    });
  });

  it('shows metadata fields when enabled', () => {
    const options = {
      showMetadataFields: true
    };
    
    render(<BugReporter options={options} />);
    
    // Check that metadata section is visible
    expect(screen.getByText('Custom Metadata')).toBeInTheDocument();
    expect(screen.getByText('Add Field')).toBeInTheDocument();
    
    // Should have inputs for key and value
    expect(screen.getByPlaceholderText('Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
  });

  it('allows adding and removing metadata fields', async () => {
    const options = {
      showMetadataFields: true
    };
    
    render(<BugReporter options={options} />);
    
    // Initially there should be one field
    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(1);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(1);
    
    // Add a field
    fireEvent.click(screen.getByText('Add Field'));
    
    // Now there should be two fields
    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(2);
    
    // Remove button should be visible for the second field
    const removeButtons = screen.getAllByRole('button', { name: 'Remove field' });
    expect(removeButtons).toHaveLength(2);
    
    // Remove the second field
    fireEvent.click(removeButtons[1]);
    
    // Back to one field
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Key')).toHaveLength(1);
      expect(screen.getAllByPlaceholderText('Value')).toHaveLength(1);
    });
  });

  it('submits a bug report with UI metadata fields', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    const options = {
      showMetadataFields: true
    };
    
    render(<BugReporter options={options} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Fill out metadata fields
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'browser' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'Chrome' } });
    
    // Add another metadata field and fill it
    fireEvent.click(screen.getByText('Add Field'));
    
    const keyInputs = screen.getAllByPlaceholderText('Key');
    const valueInputs = screen.getAllByPlaceholderText('Value');
    
    fireEvent.change(keyInputs[1], { target: { value: 'os' } });
    fireEvent.change(valueInputs[1], { target: { value: 'macOS' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that axios.post was called with the right data
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: 'Test Bug',
          metadata: {
            browser: 'Chrome',
            os: 'macOS'
          }
        })
      );
    });
  });

  it('combines UI metadata with getContextData metadata', async () => {
    // Mock successful response
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, title: 'Test Bug' } });
    
    // Setup context data
    const contextData = {
      reportedBy: 'test@example.com',
      timestamp: Date.now()
    };
    
    const options = {
      showMetadataFields: true,
      getContextData: () => contextData
    };
    
    render(<BugReporter options={options} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Fill out metadata fields
    fireEvent.change(screen.getByPlaceholderText('Key'), { target: { value: 'browser' } });
    fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: 'Chrome' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/submit bug report/i));
    
    // Wait for the form submission to complete
    await waitFor(() => {
      // Check that axios.post was called with metadata from both sources
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          title: 'Test Bug',
          metadata: {
            browser: 'Chrome',
            reportedBy: 'test@example.com',
            timestamp: expect.any(Number)
          }
        })
      );
    });
  });
}); 