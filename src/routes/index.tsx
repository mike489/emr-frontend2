import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './routes';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AppLayout from '../layouts/AppLayout';
import { FRONT_DESK_TABS, DOCTOR_TABS, TRIAGE_TABS, REFRACTION_TABS } from '../data/data';

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
    <CircularProgress />
  </Box>
);

const router = createBrowserRouter([
  // 🔹 Public
  {
    path: '/',
    element: <Suspense fallback={<Loading />}>{ROUTES.public.home.element}</Suspense>,
  },
  {
    path: '/clinics',
    element: <Suspense fallback={<Loading />}>{ROUTES.public.clinics.element}</Suspense>,
  },
  {
    path: '/administration',
    element: <Suspense fallback={<Loading />}>{ROUTES.public.administration.element}</Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<Loading />}>{ROUTES.auth.login.element}</Suspense>,
  },

  // 🔹 Protected routes with tabs
  {
    path: ROUTES.protected.frontDesk.path,
    element: <AppLayout tabsData={FRONT_DESK_TABS}>{ROUTES.protected.frontDesk.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.checkout.path,
    element: <AppLayout tabsData={FRONT_DESK_TABS}>{ROUTES.protected.checkout.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.archivedPatients.path,
    element: (
      <AppLayout tabsData={FRONT_DESK_TABS}>{ROUTES.protected.archivedPatients.element}</AppLayout>
    ),
  },
  {
    path: ROUTES.protected.appointmentsLists.path,
    element: (
      <AppLayout tabsData={FRONT_DESK_TABS}>{ROUTES.protected.appointmentsLists.element}</AppLayout>
    ),
  },
  {
    path: ROUTES.protected.createAppointment.path,
    element: (
      <AppLayout tabsData={FRONT_DESK_TABS}>{ROUTES.protected.createAppointment.element}</AppLayout>
    ),
  },
  {
    path: ROUTES.protected.examinations.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.examinations.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.triage.path,
    element: <AppLayout tabsData={TRIAGE_TABS}>{ROUTES.protected.triage.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.referrals.path,
    element: <AppLayout tabsData={TRIAGE_TABS}>{ROUTES.protected.referrals.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.checkoutPatients.path,
    element: <AppLayout tabsData={TRIAGE_TABS}>{ROUTES.protected.checkoutPatients.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.emergencyPatient.path,
    element: <AppLayout tabsData={TRIAGE_TABS}>{ROUTES.protected.emergencyPatient.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.discussion.path,
    element: <AppLayout tabsData={TRIAGE_TABS}>{ROUTES.protected.discussion.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.refraction.path,
    element: (
      <AppLayout tabsData={REFRACTION_TABS}>{ROUTES.protected.refraction.element}</AppLayout>
    ),
  },
   {
    path: ROUTES.protected.referralsRefraction.path,
    element: <AppLayout tabsData={REFRACTION_TABS}>{ROUTES.protected.referralsRefraction.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.checkoutRefraction.path,
    element: <AppLayout tabsData={REFRACTION_TABS}>{ROUTES.protected.checkoutRefraction.element}</AppLayout>,
  },
 {
    path: ROUTES.protected.discussionRefraction.path,
    element: <AppLayout tabsData={REFRACTION_TABS}>{ROUTES.protected.discussionRefraction.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.emergencyRefraction.path,
    element: <AppLayout tabsData={REFRACTION_TABS}>{ROUTES.protected.emergencyRefraction.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.referralsDoctor.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.referralsDoctor.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.checkoutDoctor.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.checkoutDoctor.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.emergencyDoctor.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.emergencyDoctor.element}</AppLayout>,
  },
   {
    path: ROUTES.protected.discussionDoctor.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.discussionDoctor.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.glaucoma.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.glaucoma.element}</AppLayout>,
  },
{
    path: ROUTES.protected.retina.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.retina.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.pediatric.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.pediatric.element}</AppLayout>,
  },

  {
    path: ROUTES.protected.opd1.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.opd1.element}</AppLayout>,
  },

  {
    path: ROUTES.protected.opd2.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.opd2.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.opd2.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.opd2.element}</AppLayout>,
  },
  {
    path: ROUTES.protected.opd3.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.opd3.element}</AppLayout>,
  },

  // 🔹 Dashboard and ClinicLists (no tabs)
  {
    path: ROUTES.protected.dashboard.path,
    element: <Suspense fallback={<Loading />}>{ROUTES.protected.dashboard.element}</Suspense>,
  },
  {
    path: ROUTES.protected.eyeSmart.path,
    element: <Suspense fallback={<Loading />}>{ROUTES.protected.eyeSmart.element}</Suspense>,
  },

  // 🔹 New Patient / Registration
  {
    path: ROUTES.protected.newPatient.path,
    element: <Suspense fallback={<Loading />}>{ROUTES.protected.newPatient.element}</Suspense>,
  },
// Setting Page
  {
    path: ROUTES.protected.settings.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.settings.element}</AppLayout>,
  },
  // Notifications Page
  {
    path: ROUTES.protected.notifications.path,
    element: <AppLayout tabsData={DOCTOR_TABS}>{ROUTES.protected.notifications.element}</AppLayout>,
  },
  // 🔹 404 fallback
  {
    path: ROUTES.notFound.path,
    element: ROUTES.notFound.element,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
