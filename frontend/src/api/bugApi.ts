import axios from 'axios';
import type { Bug, CreateBugRequest, UpdateStatusRequest } from '../types/bug';

const API_URL = 'http://localhost:8080/api/bugs';

export const fetchBugs = async (): Promise<Bug[]> => {
  const response = await axios.get<Bug[]>(API_URL);
  return response.data;
};

export const fetchBugById = async (id: number): Promise<Bug> => {
  const response = await axios.get<Bug>(`${API_URL}/${id}`);
  return response.data;
};

export const createBug = async (bug: CreateBugRequest): Promise<Bug> => {
  const response = await axios.post<Bug>(API_URL, bug);
  return response.data;
};

export const updateBugStatus = async (id: number, statusRequest: UpdateStatusRequest): Promise<Bug> => {
  const response = await axios.put<Bug>(`${API_URL}/${id}/status`, statusRequest);
  return response.data;
};

export const deleteBug = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
}; 