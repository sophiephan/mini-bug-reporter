import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugList } from './BugList';
import { mockBugs } from '../test/mocks/handlers';
import { renderWithProviders } from '../test/utils';

describe('BugList Component', () => {
  it('should display loading state', () => {
    renderWithProviders(
      <BugList 
        bugs={[]} 
        loading={true} 
        error={null} 
        onDelete={vi.fn()} 
      />
    );
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('should display error message', () => {
    const errorMessage = 'Failed to fetch bugs';
    renderWithProviders(
      <BugList 
        bugs={[]} 
        loading={false} 
        error={errorMessage} 
        onDelete={vi.fn()} 
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
        onDelete={vi.fn()} 
      />
    );
    
    expect(screen.getByText(/No bugs reported yet/i)).toBeInTheDocument();
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