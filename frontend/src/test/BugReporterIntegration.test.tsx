import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BugReporterIntegration } from '../examples/BugReporterIntegration';

// Mock BugReporter component to simplify testing the integration
vi.mock('../components/BugReporter', () => ({
  BugReporter: vi.fn(({ options, onSubmitSuccess, onSubmitError }) => {
    // Store the options for testing
    const optionsString = JSON.stringify({
      ...options,
      // Convert function to string to verify it exists
      getContextData: options.getContextData ? 'function' : undefined
    });
    
    return (
      <div data-testid="bug-reporter-mock">
        <div data-testid="options">{optionsString}</div>
        <button data-testid="success-btn" onClick={onSubmitSuccess}>Success</button>
        <button data-testid="error-btn" onClick={() => onSubmitError(new Error('Test error'))}>Error</button>
      </div>
    );
  })
}));

describe('BugReporterIntegration', () => {
  it('renders the BugReporter with correct options', () => {
    render(<BugReporterIntegration />);
    
    // Check that the integration component renders
    expect(screen.getByTestId('bug-reporter-mock')).toBeInTheDocument();
    
    // Get the options passed to BugReporter
    const optionsJson = screen.getByTestId('options').textContent;
    const options = JSON.parse(optionsJson || '{}');
    
    // Verify the options are set correctly
    expect(options.showScreenshotUrl).toBe(false);
    expect(options.title).toBe('Report an Issue');
    expect(options.submitButtonText).toBe('Send Report');
    expect(options.successMessage).toBe('Thank you for your feedback!');
    expect(options.apiEndpoint).toContain('your-app-api.example.com');
    
    // Verify the getContextData function exists
    expect(options.getContextData).toBe('function');
  });

  it('handles success and error callbacks', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<BugReporterIntegration />);
    
    // Test success callback
    fireEvent.click(screen.getByTestId('success-btn'));
    expect(consoleSpy).toHaveBeenCalledWith('Bug report submitted successfully');
    
    // Test error callback
    fireEvent.click(screen.getByTestId('error-btn'));
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to submit bug report:', expect.any(Error));
    
    // Cleanup
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
}); 