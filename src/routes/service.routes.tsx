import PharmacyTodayCases from '../pages/pharmacy/cases/TodayCase';
import PharmacyResults from '../pages/pharmacy/results/Results';
import { OpticalTodayCases } from '../pages/opticals';
import OpticalResults from '../pages/opticals/results/Results';
import InPatients from '../pages/in_patient/patients/InPateint';
import WardManagement from '../pages/in_patient/ward_management/WardManagement';
import PatientBeds from '../pages/in_patient/patient_beds/PatientBeds';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import GlassPrescriptionDetailPage from '../pages/opticals/GlassPrescriptionDetail';

export const serviceRoutes: RouteCollection = {
  pharmacy: {
    path: '/pharmacy/patients',
    element: (
      <PrivateRoute>
        <PharmacyTodayCases />
      </PrivateRoute>
    ),
  },
  pharmacyCases: {
    path: '/pharmacy/today-cases',
    element: (
      <PrivateRoute>
        <PharmacyTodayCases />
      </PrivateRoute>
    ),
  },
  pharmacyResults: {
    path: '/pharmacy/results',
    element: (
      <PrivateRoute>
        <PharmacyResults />
      </PrivateRoute>
    ),
  },
  pharmacyNotifications: {
    path: '/pharmacy/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  pharmacySettings: {
    path: '/pharmacy/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  optical: {
    path: '/optical/',
    element: (
      <PrivateRoute>
        <OpticalTodayCases />
      </PrivateRoute>
    ),
  },
  opticalCases: {
    path: '/optical/today-cases',
    element: (
      <PrivateRoute>
        <OpticalTodayCases />
      </PrivateRoute>
    ),
  },
  opticalOrderDetail: {
    path: '/optical/details',
    element: (
      <PrivateRoute>
        <GlassPrescriptionDetailPage />
      </PrivateRoute>
    ),
  },
  opticalResults: {
    path: '/optical/results',
    element: (
      <PrivateRoute>
        <OpticalResults />
      </PrivateRoute>
    ),
  },
  opticalNotifications: {
    path: '/optical/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
  opticalSettings: {
    path: '/optical/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  inPatient: {
    path: '/in-patient/',
    element: (
      <PrivateRoute>
        <InPatients />
      </PrivateRoute>
    ),
  },
  inPatientCases: {
    path: '/in-patient/in-patients',
    element: (
      <PrivateRoute>
        <InPatients />
      </PrivateRoute>
    ),
  },
  wardManagement: {
    path: '/in-patient/ward-management',
    element: (
      <PrivateRoute>
        <WardManagement />
      </PrivateRoute>
    ),
  },
  patientBeds: {
    path: '/in-patient/patient-beds',
    element: (
      <PrivateRoute>
        <PatientBeds />
      </PrivateRoute>
    ),
  },
  inPatientSettings: {
    path: '/in-patient/settings',
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  inPatientNotifications: {
    path: '/in-patient/notifications',
    element: (
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    ),
  },
};
