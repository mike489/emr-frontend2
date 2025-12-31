import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import PatientDetailPediatric from '../pages/ophthalmology/pediatric/PatientDetailPediatric';
import Pediatric from '../pages/ophthalmology/pediatric/pediatric';
import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Discussion from '../pages/triage/Discussion';
import FollowUpList from '../features/follow_up/FollowUpList';

export const pediatricRoutes: RouteCollection = {
  examinationsPediatric: {
    path: '/pediatric/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  pediatric: {
    path: '/pediatric',
    element: (
      <PrivateRoute>
        <Pediatric />
      </PrivateRoute>
    ),
  },
  pediatricPatientDetail: {
    path: '/pediatric/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailPediatric />
      </PrivateRoute>
    ),
  },

  discussionPediatric: {
    path: '/pediatric/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  followUpPediatric: {
    path: '/pediatric/follow-ups',
    element: (
      <PrivateRoute>
        <FollowUpList />
      </PrivateRoute>
    ),
  },
};
