import { createApiClient } from '../interceptors';
import type { ApiResponse } from '../types/api.types';

const workflowClient = createApiClient(import.meta.env.VITE_WORKFLOW_URL);


workflowClient.interceptors.request.use((config) => {
  config.headers['X-API-Key'] = import.meta.env.VITE_WORKFLOW_API_KEY;
  config.headers['X-Workflow-ID'] = import.meta.env.VITE_WORKFLOW_ID;
  return config;
});

export interface WorkflowTask {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
}

export const workflowApi = {
  getTasks: () => workflowClient.get<ApiResponse<WorkflowTask[]>>('/tasks'),
  completeTask: (taskId: string) =>
    workflowClient.post<ApiResponse<object>>(`/tasks/${taskId}/complete`),
};