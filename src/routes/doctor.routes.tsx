import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Retina from '../pages/ophthalmology/retina/retina';
import Referrals from '../pages/triage/patients/Referrals';
import Discussion from '../pages/triage/Discussion';
import Checkout from '../pages/front_desk/checkout/checkout';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import EmergencyTriage from '../pages/triage/emergency/EmergencyTriage';
import PatientDetailRetina from '../pages/ophthalmology/retina/PatientDetailRetina';

export const doctorRoutes: RouteCollection = {
  examinationsDoctor: {
    path: '/doctor/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  doctorPatients: {
    path: '/retina/patients-list',
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
  referralsDoctor: {
    path: '/doctor/referrals',
    element: (
      <PrivateRoute>
        <Referrals />
      </PrivateRoute>
    ),
  },
  discussionDoctor: {
    path: '/doctor/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  checkoutDoctor: {
    path: '/doctor/checkout-patients',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
  emergencyDoctor: {
    path: '/doctor/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyTriage />
      </PrivateRoute>
    ),
  },
};
