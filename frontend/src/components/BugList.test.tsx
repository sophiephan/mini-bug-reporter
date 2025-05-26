import {describe, expect, it, vi} from 'vitest';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BugList} from './BugList';
import {renderWithProviders} from '../test/utils';
import '@testing-library/jest-dom';
import type {Bug} from '../types/bug';

describe('BugList Component', () => {
  const mockOnDelete = vi.fn().mockResolvedValue(true);
  
  const mockBugs: Bug[] = [
    {
      id: 1,
      title: 'Test Bug 1',
      description: 'Bug description',
      screenshotUrl: 'https://example.com/screenshot.png',
      createdAt: '2023-01-01T12:00:00Z',
      status: 'OPEN',
      priority: 'HIGH'
    },
    {
      id: 2,
      title: 'Test Bug 2',
      description: null,
      screenshotUrl: null,
      createdAt: '2023-01-02T12:00:00Z',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM'
    }
  ];
  
  it('should render bugs with their priorities', () => {
    renderWithProviders(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check that all bugs are rendered
    expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    
    // Check for bug 1 details
    expect(screen.getByText('Bug description')).toBeInTheDocument();
    expect(screen.getByText('View Screenshot')).toBeInTheDocument();
    
    // Check for status and priority badges
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });
  
  it('should display loading state', () => {
    renderWithProviders(
      <BugList 
        bugs={[]} 
        loading={true} 
        error={null} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should display error message', () => {
    const errorMessage = 'Failed to fetch bugs';
    renderWithProviders(
      <BugList 
        bugs={[]} 
        loading={false} 
        error={errorMessage} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('should display empty state message when no bugs', () => {
    renderWithProviders(
      <BugList 
        bugs={[]} 
        loading={false} 
        error={null} 
        onDelete={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('No bugs reported yet. Create your first bug report!')).toBeInTheDocument();
  });
  
  it('should display list of bugs', () => {
    renderWithProviders(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null} 
        onDelete={vi.fn()} 
      />
    );
    
    mockBugs.forEach(bug => {
      expect(screen.getByText(bug.title)).toBeInTheDocument();
      if (bug.description) {
        expect(screen.getByText(bug.description)).toBeInTheDocument();
      }
    });
  });
  
  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDeleteMock = vi.fn();
    
    renderWithProviders(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null} 
        onDelete={onDeleteMock} 
      />
    );
    
    const deleteButtons = screen.getAllByLabelText('Delete bug');
    await user.click(deleteButtons[0]);
    
    expect(onDeleteMock).toHaveBeenCalledWith(mockBugs[0].id);
  });

  it('renders bug with metadata correctly', () => {
    const bugsWithMetadata: Bug[] = [
      {
        ...mockBugs[0],
        metadata: {
          reportedBy: 'user@example.com',
          browser: 'Chrome',
          appVersion: '1.2.3'
        }
      }
    ];
    
    renderWithProviders(
      <BugList 
        bugs={bugsWithMetadata} 
        loading={false} 
        error={null} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Check if metadata section is rendered
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    
    // Check if metadata values are displayed
    expect(screen.getByText(/reportedBy:/)).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/browser:/)).toBeInTheDocument();
    expect(screen.getByText(/Chrome/)).toBeInTheDocument();
    expect(screen.getByText(/appVersion:/)).toBeInTheDocument();
    expect(screen.getByText(/1.2.3/)).toBeInTheDocument();
  });
  
  it('does not render metadata section when bug has no metadata', () => {
    renderWithProviders(
      <BugList 
        bugs={mockBugs} 
        loading={false} 
        error={null} 
        onDelete={mockOnDelete} 
      />
    );
    
    // Metadata section should not be present
    expect(screen.queryByText('Metadata')).not.toBeInTheDocument();
  });
}); 