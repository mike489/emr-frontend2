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
    examinations: {
      path: '/examinations',
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
      path: '/triage',
      element: (
        <PrivateRoute>
          <Triage />
        </PrivateRoute>
      ),
    },
    referrals: {
      path: '/triage/referrals',
      element: (
        <PrivateRoute>
           <Referrals />
        </PrivateRoute>
      ),
    },
    discussion: {
      path: '/triage/discussion',
      element: (
        <PrivateRoute>
          <Discussion />
        </PrivateRoute>
      ),
    },
    checkoutPatients: {  
path: '/triage/checkout-patients',
      element: (
        <PrivateRoute>
          <Discussion />
        </PrivateRoute>
      ),
    },
emergencyPatient:{
  path: '/triage/emergency-patients',
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
emergencyRefraction:{
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
emergencyDoctor:{
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
    createAppointment: {
      path: '/front-desk/appointments-create',
      element: (
        <PrivateRoute>
          <CreateAppointment />
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
