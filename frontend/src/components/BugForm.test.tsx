import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugForm } from './BugForm';
import { renderWithProviders } from '../test/utils';
import '@testing-library/jest-dom';

describe('BugForm Component', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(true);
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });
  
  it('should render the form correctly', () => {
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Screenshot URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Bug Report/i })).toBeInTheDocument();
  });
  
  it('should not submit form when title is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    await user.click(submitButton);
    
    // Verify the form was not submitted
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const screenshotInput = screen.getByLabelText(/Screenshot URL/i);
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    
    await user.type(titleInput, 'Test Bug');
    await user.type(descriptionInput, 'This is a test bug description');
    await user.type(screenshotInput, 'https://example.com/screenshot.png');
    await user.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: 'Test Bug',
      description: 'This is a test bug description',
      screenshotUrl: 'https://example.com/screenshot.png',
      priority: "MEDIUM"
    });
  });
  
  it('should show success message after successful submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    
    await user.type(titleInput, 'Test Bug');
    await user.click(submitButton);
    
    expect(screen.getByText(/Bug report submitted successfully/i)).toBeInTheDocument();
  });
  
  it('should not show success message if submission fails', async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn().mockResolvedValue(false);
    
    renderWithProviders(<BugForm onSubmit={onSubmitMock} />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    
    await user.type(titleInput, 'Test Bug');
    await user.click(submitButton);
    
    expect(screen.queryByText(/Bug report submitted successfully/i)).not.toBeInTheDocument();
  });
  
  it('submits the form with priority value', async () => {
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'This is a test bug' } });
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'HIGH' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit bug report/i }));
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'This is a test bug',
        priority: 'HIGH'
      });
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/bug report submitted successfully/i)).toBeInTheDocument();
    });
  });
  
  it('defaults to MEDIUM priority if not changed', async () => {
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form with just the required title
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit bug report/i }));
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        priority: 'MEDIUM'
      });
    });
  });
  
  it('resets the form after successful submission', async () => {
    renderWithProviders(<BugForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText(/priority/i), { target: { value: 'CRITICAL' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit bug report/i }));
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
    
    // Check that the form has been reset
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/priority/i)).toHaveValue('MEDIUM');
    });
  });
}); 