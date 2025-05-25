import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBugs } from './useBugs';
import * as bugApi from '../api/bugApi';
import { mockBugs } from '../test/mocks/handlers';
import type { CreateBugRequest } from '../types/bug';

// Mock the API module
vi.mock('../api/bugApi', () => ({
  fetchBugs: vi.fn(),
  createBug: vi.fn(),
  deleteBug: vi.fn(),
}));

describe('useBugs Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should fetch bugs on mount', async () => {
    const mockFetchBugs = vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
    
    const { result } = renderHook(() => useBugs());
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(mockFetchBugs).toHaveBeenCalledTimes(1);
    expect(result.current.bugs).toEqual(mockBugs);
    expect(result.current.error).toBeNull();
  });
  
  it('should handle fetch error', async () => {
    const errorMessage = 'Network error';
    vi.mocked(bugApi.fetchBugs).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useBugs());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.bugs).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch bugs. Please try again later.');
  });
  
  it('should add a new bug', async () => {
    vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
    
    const newBug = {
      id: 4,
      title: 'New Bug',
      description: 'New bug description',
      screenshotUrl: null,
      createdAt: '2023-06-20T10:00:00',
      status: 'OPEN' as const
    };
    
    const createBugRequest: CreateBugRequest = {
      title: 'New Bug',
      description: 'New bug description'
    };
    
    vi.mocked(bugApi.createBug).mockResolvedValue(newBug);
    
    const { result } = renderHook(() => useBugs());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    let success;
    await act(async () => {
      success = await result.current.addBug(createBugRequest);
    });
    
    expect(bugApi.createBug).toHaveBeenCalledWith(createBugRequest);
    expect(success).toBe(true);
    expect(result.current.bugs[0]).toEqual(newBug); // New bug should be at the beginning
  });
  
  it('should handle add bug error', async () => {
    vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
    vi.mocked(bugApi.createBug).mockRejectedValue(new Error('Failed to create bug'));
    
    const { result } = renderHook(() => useBugs());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const initialBugs = [...result.current.bugs];
    let success;
    await act(async () => {
      success = await result.current.addBug({ title: 'New Bug' });
    });
    
    expect(success).toBe(false);
    expect(result.current.error).toBe('Failed to create bug. Please try again.');
    expect(result.current.bugs).toEqual(initialBugs);
  });
  
  it('should remove a bug', async () => {
    vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
    vi.mocked(bugApi.deleteBug).mockResolvedValue();
    
    const { result } = renderHook(() => useBugs());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const bugIdToDelete = mockBugs[0].id;
    let success;
    await act(async () => {
      success = await result.current.removeBug(bugIdToDelete);
    });
    
    expect(bugApi.deleteBug).toHaveBeenCalledWith(bugIdToDelete);
    expect(success).toBe(true);
    expect(result.current.bugs.find(bug => bug.id === bugIdToDelete)).toBeUndefined();
  });
  
  it('should handle remove bug error', async () => {
    vi.mocked(bugApi.fetchBugs).mockResolvedValue(mockBugs);
    vi.mocked(bugApi.deleteBug).mockRejectedValue(new Error('Failed to delete bug'));
    
    const { result } = renderHook(() => useBugs());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const initialBugs = [...result.current.bugs];
    let success;
    await act(async () => {
      success = await result.current.removeBug(mockBugs[0].id);
    });
    
    expect(success).toBe(false);
    expect(result.current.error).toBe('Failed to delete bug. Please try again.');
    expect(result.current.bugs).toEqual(initialBugs);
  });
}); 