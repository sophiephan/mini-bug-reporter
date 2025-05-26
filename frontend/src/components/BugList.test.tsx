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
      description: 'This is test bug 1',
      screenshotUrl: null,
      createdAt: '2023-01-01T12:00:00Z',
      status: 'OPEN',
      priority: 'LOW'
    },
    {
      id: 2,
      title: 'Test Bug 2',
      description: null,
      screenshotUrl: 'https://example.com/screenshot.png',
      createdAt: '2023-01-02T12:00:00Z',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM'
    },
    {
      id: 3,
      title: 'Test Bug 3',
      description: 'Critical bug that needs immediate attention',
      screenshotUrl: null,
      createdAt: '2023-01-03T12:00:00Z',
      status: 'OPEN',
      priority: 'CRITICAL'
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
    expect(screen.getByText('Test Bug 3')).toBeInTheDocument();
    
    // Check that priorities are displayed
    expect(screen.getByText('LOW')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
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
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('should display error message', () => {
    const errorMessage = 'Failed to load bugs';
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
}); 