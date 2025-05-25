import { http, HttpResponse } from 'msw';
import type { Bug, CreateBugRequest, UpdateStatusRequest } from '../../types/bug';

const API_URL = 'http://localhost:8080/api/bugs';

export const mockBugs: Bug[] = [
  {
    id: 1,
    title: 'Button not working',
    description: 'The submit button does not respond when clicked',
    screenshotUrl: 'https://example.com/screenshot1.png',
    createdAt: '2023-06-15T10:30:00',
    status: 'OPEN'
  },
  {
    id: 2,
    title: 'Form validation error',
    description: 'Form submits even with invalid data',
    screenshotUrl: null,
    createdAt: '2023-06-16T14:20:00',
    status: 'IN_PROGRESS'
  },
  {
    id: 3,
    title: 'Styling issue on mobile',
    description: null,
    screenshotUrl: 'https://example.com/screenshot2.png',
    createdAt: '2023-06-17T09:15:00',
    status: 'CLOSED'
  }
];

export const handlers = [
  http.get(API_URL, () => {
    return HttpResponse.json(mockBugs);
  }),
  
  http.get(`${API_URL}/:id`, ({ params }) => {
    const { id } = params;
    const bug = mockBugs.find(bug => bug.id === Number(id));
    
    if (!bug) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(bug);
  }),
  
  http.post(API_URL, async ({ request }) => {
    const newBug = await request.json() as CreateBugRequest;
    const createdBug: Bug = {
      id: mockBugs.length + 1,
      title: newBug.title,
      description: newBug.description || null,
      screenshotUrl: newBug.screenshotUrl || null,
      createdAt: new Date().toISOString(),
      status: 'OPEN'
    };
    
    return HttpResponse.json(createdBug, { status: 201 });
  }),
  
  http.delete(`${API_URL}/:id`, ({ params }) => {
    const { id } = params;
    const bugExists = mockBugs.some(bug => bug.id === Number(id));
    
    if (!bugExists) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
  
  http.put(`${API_URL}/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const bug = mockBugs.find(bug => bug.id === Number(id));
    
    if (!bug) {
      return new HttpResponse(null, { status: 404 });
    }
    
    const { status } = await request.json() as UpdateStatusRequest;
    const updatedBug = { ...bug, status };
    
    return HttpResponse.json(updatedBug);
  })
]; 