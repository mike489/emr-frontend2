import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';

export const sharedRoutes: RouteCollection = {
  notifications: {
    path: '/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  settings: {
    path: '/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
};