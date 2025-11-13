import { createApiClient } from '../interceptors';

const sendToApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const sendToTriageService = {
  sendToTriage: (id: string) => sendToApi.post(`/send-to-triage/${id}`),
};

export const UploadService = {
  uploadFiles: (patientId: string, files: File[]) => {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files[]', file); // Important: "files[]" matches backend expectation
    });

    return sendToApi.post(`/patients/${patientId}/upload-files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const sendToDepartmentService = {
  sendToDepartment: (
    id: string,
    payload: { department: string; doctor_id: string; from: string }
  ) => sendToApi.post(`/send-to-department/${id}`, payload),
};
