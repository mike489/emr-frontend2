
import { create } from 'zustand';

export const useNotificationsStore = create((set) => ({
  unreadCount: 3,
  notifications: [
    { title: 'New Patient Registered', time: '2 min ago' },
    { title: 'Lab Results Available', time: '10 min ago' },
    { title: 'New Appointment Scheduled', time: '1 hour ago' },
  ],

  setUnread: (count: any) => set({ unreadCount: count }),
  setNotifications: (data: any) => set({ notifications: data }),
}));
