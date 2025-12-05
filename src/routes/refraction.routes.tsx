import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Refraction from '../pages/refraction/refraction';
import Referrals from '../pages/triage/patients/Referrals';
import Discussion from '../pages/triage/Discussion';
import EmergencyLists from '../pages/front_desk/emergency/EmergencyList';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import PatientDetailRefraction from '../pages/refraction/PatientDetailRefraction';

export const refractionRoutes: RouteCollection = {
  examinationsRefraction: {
    path: '/refraction/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  refraction: {
    path: '/refraction',
    element: (
      <PrivateRoute>
        <Refraction />
      </PrivateRoute>
    ),
  },
  refractionPatient: {
    path: '/refraction/patients-list',
    element: (
      <PrivateRoute>
        <Refraction />
      </PrivateRoute>
    ),
  },
  referralsRefraction: {
    path: '/refraction/referrals',
    element: (
      <PrivateRoute>
        <Referrals />
      </PrivateRoute>
    ),
  },
  discussionRefraction: {
    path: '/refraction/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  checkoutRefraction: {
    path: '/refraction/checkout-patients',
    element: (
      <PrivateRoute>
        <EmergencyLists />
      </PrivateRoute>
    ),
  },
  emergencyRefraction: {
    path: '/refraction/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyLists />
      </PrivateRoute>
    ),
  },
  patientDetailRefraction: {
    path: '/refraction/patient-detail',
    element: (
      <PrivateRoute>
        <PatientDetailRefraction />
      </PrivateRoute>
    ),
  },
};
