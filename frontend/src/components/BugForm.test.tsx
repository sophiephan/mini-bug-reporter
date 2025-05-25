import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugForm } from './BugForm';
import { renderWithProviders } from '../test/utils';

describe('BugForm Component', () => {
  it('should render the form correctly', () => {
    renderWithProviders(<BugForm onSubmit={vi.fn()} />);
    
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Screenshot URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Bug Report/i })).toBeInTheDocument();
  });
  
  it('should not submit form when title is empty', async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn().mockResolvedValue(true);
    renderWithProviders(<BugForm onSubmit={onSubmitMock} />);
    
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    await user.click(submitButton);
    
    // Verify the form was not submitted
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
  
  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn().mockResolvedValue(true);
    
    renderWithProviders(<BugForm onSubmit={onSubmitMock} />);
    
    const titleInput = screen.getByLabelText(/Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    const screenshotInput = screen.getByLabelText(/Screenshot URL/i);
    const submitButton = screen.getByRole('button', { name: /Submit Bug Report/i });
    
    await user.type(titleInput, 'Test Bug');
    await user.type(descriptionInput, 'This is a test bug description');
    await user.type(screenshotInput, 'https://example.com/screenshot.png');
    await user.click(submitButton);
    
    expect(onSubmitMock).toHaveBeenCalledWith({
      title: 'Test Bug',
      description: 'This is a test bug description',
      screenshotUrl: 'https://example.com/screenshot.png'
    });
  });
  
  it('should show success message after successful submission', async () => {
    const user = userEvent.setup();
    const onSubmitMock = vi.fn().mockResolvedValue(true);
    
    renderWithProviders(<BugForm onSubmit={onSubmitMock} />);
    
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
}); 