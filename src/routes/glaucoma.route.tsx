import Glaucoma from '../pages/ophthalmology/glaucoma/glaucoma';

import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import PatientDetailGlaucoma from '../pages/ophthalmology/glaucoma/PatientDetailGlaucoma';
import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Discussion from '../pages/triage/Discussion';
import FollowUpList from '../features/follow_up/FollowUpList';

export const glaucomaRoutes: RouteCollection = {
  examinationsGlaucoma: {
    path: '/glaucoma/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  glaucoma: {
    path: '/glaucoma',
    element: (
      <PrivateRoute>
        <Glaucoma />
      </PrivateRoute>
    ),
  },
  glaucomaPatientDetail: {
    path: '/glaucoma/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailGlaucoma />
      </PrivateRoute>
    ),
  },

  discussionGlaucoma: {
    path: '/glaucoma/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  followUpGlaucoma: {
    path: '/glaucoma/follow-ups',
    element: (
      <PrivateRoute>
        <FollowUpList />
      </PrivateRoute>
    ),
  },
};
