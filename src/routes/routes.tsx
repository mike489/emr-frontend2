import ClinicLists from '../layouts/ClinicLists';
import DashboardLayout from '../layouts/DashboardLayout';
import Administration from '../pages/Administration';
import Clinics from '../pages/Clinics';
import Home from '../pages/public/Home';
import LoginPage from '../pages/Login';
import NotFound from '../pages/NotFound';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Import route groups as VALUES (remove 'type' keyword)
import { triageRoutes } from './triage.routes';
import { doctorRoutes } from './doctor.routes';
import { refractionRoutes } from './refraction.routes';
import { ophthalmologyRoutes } from './ophthalmology.routes';
import { frontDeskRoutes } from './frontDesk.routes';
import { diagnosticRoutes } from './diagnostic.routes';
import { serviceRoutes } from './service.routes';
import { sharedRoutes } from './shared.routes';

import type { RoutesStructure } from './types';
import { managementRoutes } from './managment.routes';
import { chiefadminRoutes } from './chiefadmin.routes';
import { orRoutes } from './or.routes';
import { retinaRoutes } from './retina.routes';
import { glaucomaRoutes } from './glaucoma.route';
import { pediatricRoutes } from './pediatric.routes';

export const ROUTES: RoutesStructure = {
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
    // Main Layouts
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
      // ✅ ClinicLists page is public-like: it decides itself when to ask for login
      element: <ClinicLists />,
    },

    // Spread all route groups
    ...triageRoutes,
    ...doctorRoutes,
    ...refractionRoutes,
    ...ophthalmologyRoutes,
    ...frontDeskRoutes,
    ...diagnosticRoutes,
    ...orRoutes,
    ...managementRoutes,
    ...chiefadminRoutes,
    ...serviceRoutes,
    ...sharedRoutes,
    ...retinaRoutes,
    ...glaucomaRoutes,
    ...pediatricRoutes,
  },
  notFound: { path: '*', element: <NotFound /> },
};

// Export individual route groups for easier imports elsewhere
export {
  triageRoutes,
  doctorRoutes,
  refractionRoutes,
  ophthalmologyRoutes,
  frontDeskRoutes,
  diagnosticRoutes,
  orRoutes,
  managementRoutes,
  chiefadminRoutes,
  serviceRoutes,
  sharedRoutes,
  retinaRoutes,
  glaucomaRoutes,
  pediatricRoutes,
};

export type { RoutesStructure } from './types';
