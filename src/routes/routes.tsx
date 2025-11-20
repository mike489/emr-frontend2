import ClinicLists from '../layouts/ClinicLists';
import DashboardLayout from '../layouts/DashboardLayout'; // Fixed: was Dashboard
import Administration from '../pages/Administration';
import Clinics from '../pages/Clinics';
import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import AppointmentsLists from '../pages/front_desk/appointments-lists/AppointmentsLists';
import CreateAppointment from '../pages/front_desk/appointments-lists/CreateAppointment';
import ArchivedPatients from '../pages/front_desk/archived-patients/PrchivedPatients';
import Checkout from '../pages/front_desk/checkout/checkout';
import FrontDesk from '../pages/front_desk/frontDesk';
import LoginPage from '../pages/Login'; // Fixed: was Login
import PatientRegistration from '../pages/new_patient/AddNewPatient';
import NotFound from '../pages/NotFound';
import Glaucoma from '../pages/ophthalmology/glaucoma/glaucoma';
import Opd1 from '../pages/ophthalmology/opd1/opd1';
import Opd2 from '../pages/ophthalmology/opd2/opd2';
import Opd3 from '../pages/ophthalmology/opd3/opd3';
import Pediatric from '../pages/ophthalmology/pediatric/pediatric';
import Retina from '../pages/ophthalmology/retina/retina';
import Home from '../pages/public/Home';
import Refraction from '../pages/refraction/refraction';
import Triage from '../pages/triage/Triage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Referrals from '../pages/triage/patients/Referrals';
import Discussion from '../pages/triage/Discussion';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import TodayCases from '../pages/diagnosis/cases/TodayCase';
import Laboratory from '../pages/diagnosis/laboratory/Laboratory';
import Radiology from '../pages/diagnosis/radiology/Radiology';
import CaseHistory from '../pages/diagnosis/case_histories/CaseHistory';
import PharmacyTodayCases from '../pages/pharmacy/cases/TodayCase';
import PharmacyResults from '../pages/pharmacy/results/Results';
import { OpticalTodayCases } from '../pages/opticals';
import OpticalResults from '../pages/opticals/results/Results';
import InPatients from '../pages/in_patient/patients/InPateint';
import WardManagement from '../pages/in_patient/ward_management/WardManagement';
import PatientBeds from '../pages/in_patient/patient_beds/PatientBeds';
import DoctorSchedule from '../pages/front_desk/appointments-lists/DoctorAvailability';
import RescheduleLayout from '../pages/front_desk/appointments-lists/RescheduleLayout';
import PatientPayments from '../pages/front_desk/bills/PatientPayments';
import PendingPayments from '../pages/front_desk/bills/PendingPayments';
import RequestedPayments from '../pages/front_desk/bills/RequestedPayments';
import AppointmentsCalendars from '../pages/front_desk/appointments-lists/AppointmentsCalendars';
import FollowUp from '../pages/follow_up/FollowUp';
import TriageLists from '../layouts/TriageLists';
import TriageTwo from '../pages/triage/TriageTwo';
import TriageThree from '../pages/triage/TriageThree';
import EmergencyLists from '../pages/front_desk/emergency/EmergencyList';
import EmergencyPatientForm from '../pages/front_desk/emergency/EmergencyPatientForm';




export const ROUTES = {
  public: {
    home: { path: '/', element: <Home /> },
    clinics: { path: '/clinics', element: <Clinics /> },
    administration: { path: '/administration', element: <Administration /> },
  },
  auth: {
    login: {
      path: '/login',
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
  },
  protected: {
    dashboard: {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      ),
    },
    eyeSmart: {
      path: '/clinic-lists',
      element: (
        <PrivateRoute>
          <ClinicLists />
        </PrivateRoute>
      ),
    },
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
     examinationsDoctor: {
      path: '/doctor/examinations',
      element: (
        <PrivateRoute>
          <PatientTabsLayout />
        </PrivateRoute>
      ),
    },
    examinationsRefraction: {
      path: '/refraction/examinations',
      element: (
        <PrivateRoute>
          <PatientTabsLayout />
        </PrivateRoute>
      ),
    },
    frontDesk: {
      path: '/front-desk',
      element: (
        <PrivateRoute>
          <FrontDesk />
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
    triagePatients: {
      path: '/triage-one/patients-list',
      element: (
        <PrivateRoute>
          <Triage />
        </PrivateRoute>
      ),
    },
    doctorPatients: {
      path: '/doctor/patients-list',
      element: (
        <PrivateRoute>
          <Retina />
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
          <Discussion />
        </PrivateRoute>
      ),
    },
    emergencyPatient: {
      path: '/triage-one/emergency-patients',
      element: (
        <PrivateRoute>
          <Discussion />
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
          <Discussion />
        </PrivateRoute>
      ),
    },
    emergencyRefraction: {
      path: '/refraction/emergency-patients',
      element: (
        <PrivateRoute>
          <Discussion />
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
    retina: {
      path: '/retina',
      element: (
        <PrivateRoute>
          <Retina />
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
          <Discussion />
        </PrivateRoute>
      ),
    },
    emergencyDoctor: {
      path: '/doctor/emergency-patients',
      element: (
        <PrivateRoute>
          <Discussion />
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
    diagnosis: {
      path: '/diagnosis',
      element: (
        <PrivateRoute>
          <TodayCases />
        </PrivateRoute>
      ),
    },
    todayCases: {
      path: '/diagnosis/today-cases',
      element: (
        <PrivateRoute>
          <TodayCases />
        </PrivateRoute>
      ),
    },
    laboratory: {
      path: '/diagnosis/laboratory',
      element: (
        <PrivateRoute>
          <Laboratory />
        </PrivateRoute>
      ),
    },
    radiology: {
      path: '/diagnosis/radiology',
      element: (
        <PrivateRoute>
          <Radiology />
        </PrivateRoute>
      ),
    },
    caseHistories: {
      path: '/diagnosis/case-history',
      element: (
        <PrivateRoute>
          <CaseHistory />
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

    pharmacy: {
      path: '/pharmacy/',
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
    pediatric: {
      path: '/pediatric',
      element: (
        <PrivateRoute>
          <Pediatric />
        </PrivateRoute>
      ),
    },
    opd1: {
      path: '/opd-one',
      element: (
        <PrivateRoute>
          <Opd1 />
        </PrivateRoute>
      ),
    },
    opd2: {
      path: '/opd-two',
      element: (
        <PrivateRoute>
          <Opd2 />
        </PrivateRoute>
      ),
    },

    opd3: {
      path: '/opd-three',
      element: (
        <PrivateRoute>
          <Opd3 />
        </PrivateRoute>
      ),
    },
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
          <EmergencyLists/>
        </PrivateRoute>
      ),
    },
    createEmergencyPatients: {
      path: '/front-desk/add-new-emergency-patients',
      element: (
        <PrivateRoute>
          <EmergencyPatientForm/>
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
    notifications: {
      path: '/notifications',
      element: (
        <PrivateRoute>
          <Notifications />
        </PrivateRoute>
      ),
    },
    settings: {
      path: '/settings',
      element: (
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      ),
    },
  },
  notFound: { path: '*', element: <NotFound /> },
} as const;
