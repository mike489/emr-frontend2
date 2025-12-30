import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Retina from '../pages/ophthalmology/retina/retina';
import Discussion from '../pages/triage/Discussion';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import PatientDetailRetina from '../pages/ophthalmology/retina/PatientDetailRetina';

export const retinaRoutes: RouteCollection = {
  examinationsRetina: {
    path: '/retina/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  retinaPatients: {
    path: '/retina/patients',
    element: (
      <PrivateRoute>
        <Retina />
      </PrivateRoute>
    ),
  },
  patientsDetailRetina: {
    path: '/retina/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailRetina />
      </PrivateRoute>
    ),
  },

  discussionRetina: {
    path: '/retina/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
};
