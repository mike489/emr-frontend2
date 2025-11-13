import ClinicLists from '../layouts/ClinicLists';
import DashboardLayout from '../layouts/DashboardLayout'; // Fixed: was Dashboard
import Administration from '../pages/Administration';
import Clinics from '../pages/Clinics';
import PatientTabsLayout from '../pages/examination/PatientTabsLayout';
import FrontDesk from '../pages/front_desk/frontDesk';
import LoginPage from '../pages/Login'; // Fixed: was Login
import PatientRegistration from '../pages/new_patient/AddNewPatient';
import NotFound from '../pages/NotFound';
import Glaucoma from '../pages/ophthalmology/glaucoma/glaucoma';
import Retina from '../pages/ophthalmology/retina/retina';
import Home from '../pages/public/Home';
import Refraction from '../pages/refraction/refraction';
import Triage from '../pages/triage/Triage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

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
    refraction: {
      path: '/refraction',
      element: (
        <PrivateRoute>
          <Refraction />
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

    glaucoma: {
      path: '/glaucoma',
      element: (
        <PrivateRoute>
          <Glaucoma />
        </PrivateRoute>
      ),
    },
  },
  notFound: { path: '*', element: <NotFound /> },
} as const;
