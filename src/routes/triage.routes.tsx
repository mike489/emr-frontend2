import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import Triage from '../pages/triage/Triage';
import TriageTwo from '../pages/triage/TriageTwo';
import TriageThree from '../pages/triage/TriageThree';
import Referrals from '../pages/triage/patients/Referrals';
import Discussion from '../pages/triage/Discussion';
import FollowUp from '../pages/follow_up/FollowUp';
import Checkout from '../pages/front_desk/checkout/checkout';

import TriageLists from '../layouts/TriageLists';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import EmergencyTriage from '../pages/triage/emergency/EmergencyTriage';
import EmergencyTriage3 from '../pages/triage/emergency/EmergencyTriage3';
import EmergencyTriage2 from '../pages/triage/emergency/EmergencyTriage2';
import ExaminationTab from '../features/examination/ExaminationTab';
import FollowUpTab from '../features/follow_up/FollowUpTab';
import PatientDetails from '../pages/patients/PatientDetail';
import LabTab from '../features/case/LabTab';
import OperationTab from '../features/case/operationTab';

export const triageRoutes: RouteCollection = {
  triageLists: {
    path: '/triage-lists',
    element: (
      <PrivateRoute>
        <TriageLists />
      </PrivateRoute>
    ),
  },
  examinationsTriage: {
    path: '/triage-one/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  examinationsTriage2: {
    path: '/triage-two/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  examinationsTriage3: {
    path: '/triage-three/examinations',
    element: (
      <PrivateRoute>
        <PatientTabsLayout />
      </PrivateRoute>
    ),
  },
  triage: {
    path: '/triage-one/patients-list',
    element: (
      <PrivateRoute>
        <Triage />
      </PrivateRoute>
    ),
  },
  triageOnePatientList: {
    path: '/triage-two/patients-list',
    element: (
      <PrivateRoute>
        <TriageTwo />
      </PrivateRoute>
    ),
  },
  referralsTwo: {
    path: '/triage-two/referrals',
    element: (
      <PrivateRoute>
        <Referrals />
      </PrivateRoute>
    ),
  },
  followUpTwo: {
    path: '/triage-two/follow-up',
    element: (
      <PrivateRoute>
        <FollowUp />
      </PrivateRoute>
    ),
  },
  triagePatientsTwo: {
    path: '/triage-two/patients-list',
    element: (
      <PrivateRoute>
        <Triage />
      </PrivateRoute>
    ),
  },
  triageThree: {
    path: '/triage-three/patients-list',
    element: (
      <PrivateRoute>
        <TriageThree />
      </PrivateRoute>
    ),
  },
  referrals: {
    path: '/triage-one/referrals',
    element: (
      <PrivateRoute>
        <Referrals />
      </PrivateRoute>
    ),
  },
  followUp: {
    path: '/triage-one/follow-up',
    element: (
      <PrivateRoute>
        <FollowUp />
      </PrivateRoute>
    ),
  },
  referrals3: {
    path: '/triage-three/referrals',
    element: (
      <PrivateRoute>
        <Referrals />
      </PrivateRoute>
    ),
  },
  followUp3: {
    path: '/triage-three/follow-up',
    element: (
      <PrivateRoute>
        <FollowUp />
      </PrivateRoute>
    ),
  },
  triagePatients: {
    path: '/triage-one/patients-list',
    element: (
      <PrivateRoute>
        <Triage />
      </PrivateRoute>
    ),
  },
  discussion: {
    path: '/triage-one/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  checkoutPatients: {
    path: '/triage-one/checkout-patients',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
  emergencyPatient: {
    path: '/triage-one/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyTriage />
      </PrivateRoute>
    ),
  },
  emergencyPatientTriage3: {
    path: '/triage-three/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyTriage3 />
      </PrivateRoute>
    ),
  },
  emergencyPatientTriage2: {
    path: '/triage-two/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyTriage2 />
      </PrivateRoute>
    ),
  },
  discussionTriage2: {
    path: '/triage-two/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  checkoutPatientsTriage2: {
    path: '/triage-two/checkout-patients',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
  discussionTriage3: {
    path: '/triage-three/discussion',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  checkoutPatientsTriage3: {
    path: '/triage-three/checkout-patients',
    element: (
      <PrivateRoute>
        <Discussion />
      </PrivateRoute>
    ),
  },
  patientDetails: {
    path: '/triage/patient-details',
    element: (
      <PrivateRoute>
        <PatientDetails />
      </PrivateRoute>
    ),
  },
  examinationTab: {
    path: '/triage/examinations',
    element: (
      <PrivateRoute>
        <ExaminationTab />
      </PrivateRoute>
    ),
  },
  followUpTab: {
    path: '/triage/follow-up',
    element: (
      <PrivateRoute>
        <FollowUpTab />
      </PrivateRoute>
    ),
  },
  orderTab: {
    path: '/triage/orders',
    element: (
      <PrivateRoute>
        <LabTab />
      </PrivateRoute>
    ),
  },
  operationTab: {
    path: 'triage/operations',
    element: (
      <PrivateRoute>
        <OperationTab />
      </PrivateRoute>
    ),
  },
};
