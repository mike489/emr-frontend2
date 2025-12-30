import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import PatientDetailGlaucoma from '../pages/ophthalmology/glaucoma/PatientDetailGlaucoma';
import Pediatric from '../pages/ophthalmology/pediatric/pediatric';
import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Discussion from '../pages/triage/Discussion';

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
        <PatientDetailGlaucoma />
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
};
