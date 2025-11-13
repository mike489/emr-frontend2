import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './routes';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { PublicLayout } from '../layouts/PublicLayout';
import PrivateRoute from './PrivateRoute';
import ClinicLists from '../layouts/ClinicLists';
import FrontDesk from '../pages/front_desk/frontDesk';
import PatientRegistration from '../pages/new_patient/AddNewPatient';
import Triage from '../pages/triage/Triage';
import Refraction from '../pages/refraction/refraction';
import Retina from '../pages/ophthalmology/retina/retina';

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
    <CircularProgress />
  </Box>
);

const router = createBrowserRouter([
  // 🔹 Public Routes
  {
    element: <PublicLayout />,
    children: [
      {
        path: ROUTES.public.home.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.public.home.element}</Suspense>,
      },
      {
        path: ROUTES.public.clinics.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.public.clinics.element}</Suspense>,
      },
      {
        path: ROUTES.public.administration.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.public.administration.element}</Suspense>,
      },
      {
        path: ROUTES.auth.login.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.auth.login.element}</Suspense>,
      },
    ],
  },

  // 🔹 Protected Routes (with ClinicLists as layout)
  {
    element: (
      <PrivateRoute>
        <ClinicLists />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.eyeSmart.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.eyeSmart.element}</Suspense>,
      },
      {
        path: ROUTES.protected.examinations.path,
        element: (
          <Suspense fallback={<Loading />}>{ROUTES.protected.examinations.element}</Suspense>
        ),
      },
      {
        path: ROUTES.protected.dashboard.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.dashboard.element}</Suspense>,
      },
    ],
  },

  {
    element: (
      <PrivateRoute>
        <FrontDesk />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.frontDesk.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.frontDesk.element}</Suspense>,
      },
    ],
  },

  {
    element: (
      <PrivateRoute>
        <PatientRegistration />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.newPatient.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.newPatient.element}</Suspense>,
      },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <Triage />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.triage.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.triage.element}</Suspense>,
      },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <Refraction />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.refraction.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.refraction.element}</Suspense>,
      },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <Retina />
      </PrivateRoute>
    ),
    children: [
      {
        path: ROUTES.protected.retina.path,
        element: <Suspense fallback={<Loading />}>{ROUTES.protected.retina.element}</Suspense>,
      },
    ],
  },

  // 🔹 404 fallback
  {
    path: ROUTES.notFound.path,
    element: ROUTES.notFound.element,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
