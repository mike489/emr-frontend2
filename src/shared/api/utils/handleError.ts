import { AxiosError } from 'axios';

export const handleError = (error: AxiosError<{ message?: string }>) => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'Server Error',
      status: error.response.status,
      data: error.response.data,
    };
  }
  if (error.request) {
    return { message: 'No response from server. Check your connection.' };
  }
  return { message: error.message || 'Request failed' };
};