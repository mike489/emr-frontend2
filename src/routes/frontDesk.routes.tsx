import FrontDesk from '../pages/front_desk/frontDesk';
import PatientRegistration from '../pages/new_patient/AddNewPatient';
import Checkout from '../pages/front_desk/checkout/checkout';
import ArchivedPatients from '../pages/front_desk/archived-patients/PrchivedPatients';
import EmergencyLists from '../pages/front_desk/emergency/EmergencyList';
import EmergencyPatientForm from '../pages/front_desk/emergency/EmergencyPatientForm';
import AppointmentsLists from '../pages/front_desk/appointments-lists/AppointmentsLists';
import AppointmentsCalendars from '../pages/front_desk/appointments-lists/AppointmentsCalendars';
import CreateAppointment from '../pages/front_desk/appointments-lists/CreateAppointment';
import RescheduleLayout from '../pages/front_desk/appointments-lists/RescheduleLayout';
import DoctorSchedule from '../pages/front_desk/appointments-lists/DoctorAvailability';
import PatientPayments from '../pages/front_desk/bills/PatientPayments';
import PendingPayments from '../pages/front_desk/bills/PendingPayments';
import RequestedPayments from '../pages/front_desk/bills/RequestedPayments';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import OperationalPayments from '../pages/front_desk/bills/OperationalPayments';

export const frontDeskRoutes: RouteCollection = {
  frontDesk: {
    path: '/front-desk',
    element: (
      <PrivateRoute>
        <FrontDesk />
      </PrivateRoute>
    ),
  },
  newPatient: {
    path: '/new-patient',
    element: (
      <PrivateRoute>
        <PatientRegistration />
      </PrivateRoute>
    ),
  },
  // patientDetails: {
  //   path: '/front-desk/patient-details',
  //   element: (
  //     <PrivateRoute>
  //       <PatientDetails />
  //     </PrivateRoute>
  //   ),
  // },

  checkout: {
    path: '/front-desk/checkout',
    element: (
      <PrivateRoute>
        <Checkout />
      </PrivateRoute>
    ),
  },
  emergencyPatients: {
    path: '/front-desk/emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyLists />
      </PrivateRoute>
    ),
  },
  createEmergencyPatients: {
    path: '/front-desk/add-new-emergency-patients',
    element: (
      <PrivateRoute>
        <EmergencyPatientForm />
      </PrivateRoute>
    ),
  },
  archivedPatients: {
    path: '/front-desk/archived-patients',
    element: (
      <PrivateRoute>
        <ArchivedPatients />
      </PrivateRoute>
    ),
  },
  appointmentsLists: {
    path: '/front-desk/appointments-lists',
    element: (
      <PrivateRoute>
        <AppointmentsLists />
      </PrivateRoute>
    ),
  },
  appointmentsCalendars: {
    path: '/front-desk/appointments-calendars',
    element: (
      <PrivateRoute>
        <AppointmentsCalendars />
      </PrivateRoute>
    ),
  },
  createAppointment: {
    path: '/front-desk/appointments-create',
    element: (
      <PrivateRoute>
        <CreateAppointment />
      </PrivateRoute>
    ),
  },
  patientPayments: {
    path: '/front-desk/patient-payments',
    element: (
      <PrivateRoute>
        <PatientPayments />
      </PrivateRoute>
    ),
  },

  operationalPayments: {
    path: '/front-desk/operational-payments',
    element: (
      <PrivateRoute>
        <OperationalPayments />
      </PrivateRoute>
    ),
  },

  pendingPayments: {
    path: '/front-desk/pending-payments',
    element: (
      <PrivateRoute>
        <PendingPayments />
      </PrivateRoute>
    ),
  },
  requestedPayments: {
    path: '/front-desk/requested-payments',
    element: (
      <PrivateRoute>
        <RequestedPayments />
      </PrivateRoute>
    ),
  },
  rescheduleAppointment: {
    path: '/front-desk/appointments-reschedule',
    element: (
      <PrivateRoute>
        <RescheduleLayout />
      </PrivateRoute>
    ),
  },
  doctorAvailability: {
    path: '/front-desk/appointments-doctors',
    element: (
      <PrivateRoute>
        <DoctorSchedule />
      </PrivateRoute>
    ),
  },

  // examinationTab: {
  //   path: '/front-desk/examinations',
  //   element: (
  //     <PrivateRoute>
  //       <ExaminationTab />
  //     </PrivateRoute>
  //   ),
  // },
  // followUpTab: {
  //   path: '/front-desk/follow-up',
  //   element: (
  //     <PrivateRoute>
  //       <FollowUpTab />
  //     </PrivateRoute>
  //   ),
  // },
};
