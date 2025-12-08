// import TodayCases from '../pages/diagnosis/cases/TodayCase';
// import Laboratory from '../pages/diagnosis/laboratory/Laboratory';
// import Radiology from '../pages/diagnosis/radiology/Radiology';
// import CaseHistory from '../pages/diagnosis/case_histories/CaseHistory';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import DiagnosisList from '../layouts/DiagnosisList';
import OrTodayCases from '../pages/operational/cases/OrTodayCases';

export const orRoutes: RouteCollection = {
  orList: {
    path: '/or-list/cases',
    element: (
      <PrivateRoute>
        <DiagnosisList />
      </PrivateRoute>
    ),
  },
  or: {
    path: '/or-list/today-cases',
    element: (
      <PrivateRoute>
        <OrTodayCases />
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
