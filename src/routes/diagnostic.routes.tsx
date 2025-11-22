import TodayCases from '../pages/diagnosis/cases/TodayCase';
import Laboratory from '../pages/diagnosis/laboratory/Laboratory';
import Radiology from '../pages/diagnosis/radiology/Radiology';
import CaseHistory from '../pages/diagnosis/case_histories/CaseHistory';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';

export const diagnosticRoutes: RouteCollection = {
  diagnosis: {
    path: '/diagnosis',
    element: (
      <PrivateRoute>
        <TodayCases />
      </PrivateRoute>
    ),
  },
  todayCases: {
    path: '/diagnosis/today-cases',
    element: (
      <PrivateRoute>
        <TodayCases />
      </PrivateRoute>
    ),
  },
  laboratory: {
    path: '/diagnosis/laboratory',
    element: (
      <PrivateRoute>
        <Laboratory />
      </PrivateRoute>
    ),
  },
  radiology: {
    path: '/diagnosis/radiology',
    element: (
      <PrivateRoute>
        <Radiology />
      </PrivateRoute>
    ),
  },
  caseHistories: {
    path: '/diagnosis/case-history',
    element: (
      <PrivateRoute>
        <CaseHistory />
      </PrivateRoute>
    ),
  },
  diagnosisNotifications: {
    path: '/diagnosis/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  diagnosisSettings: {
    path: '/diagnosis/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
};