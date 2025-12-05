// hooks/useFilteredTabs.ts
import { useLocation } from 'react-router-dom';
import type { TabItem } from '../data/data';

export const useFilteredTabs = (tabs: TabItem[]): TabItem[] => {
  const location = useLocation();
  const currentPath = location.pathname;

  // If we're on an examination route, filter out "Follow Up" tab
  if (currentPath.includes('/examinations')) {
    return tabs.filter(tab => tab.label !== 'Follow Up' && tab.path !== '/triage/follow-up');
  }

  return tabs;
};
