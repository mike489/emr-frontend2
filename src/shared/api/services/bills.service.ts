import { createApiClient } from '../interceptors';

const billsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const BillsService = {
  

   pay: (id: string, data: any) => billsApi.post(`/bills/${id}/pay`, data),

};
