import { useState, useEffect, useCallback } from 'react';
import type { Bug, CreateBugRequest } from '../types/bug';
import { fetchBugs, createBug, deleteBug } from '../api/bugApi';

export const useBugs = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBugs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBugs();
      setBugs(data);
    } catch (err) {
      setError('Failed to fetch bugs. Please try again later.');
      console.error('Error fetching bugs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  const addBug = useCallback(async (newBug: CreateBugRequest) => {
    try {
      setError(null);
      const createdBug = await createBug(newBug);
      setBugs(prevBugs => [createdBug, ...prevBugs]);
      return true;
    } catch (err) {
      setError('Failed to create bug. Please try again.');
      console.error('Error creating bug:', err);
      return false;
    }
  }, []);

  const removeBug = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteBug(id);
      setBugs(prevBugs => prevBugs.filter(bug => bug.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete bug. Please try again.');
      console.error('Error deleting bug:', err);
      return false;
    }
  }, []);

  return {
    bugs,
    loading,
    error,
    loadBugs,
    addBug,
    removeBug
  };
}; 