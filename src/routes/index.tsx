import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from './routes';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AppLayout from '../layouts/AppLayout';
import {
  FRONT_DESK_TABS,
  DOCTOR_TABS,
  REFRACTION_TABS,
  DIAGNOSIS_TABS,
  PHARMACY_TABS,
  OPTICAL_TABS,
  IN_PATIENT_TABS,
  TRIAGE_TABS_TWO,
  TRIAGE_TABS_THREE,
  TRIAGE_TABS_ONE,
  MANAGMENT_TABS,
  CHIEFADMIN_TABS,
  PATIENTDETILES_TABS,
  PATIENTDETILES_TRIAGE_TABS_TWO,
  PATIENTDETILES_TRIAGE_TABS_THREE,
  PATIENTDETILES_REFRACTION_TABS,
  PATIENTDETILES_RETINA_TABS,
  PATIENTDETILES_GLAUCOMA_TABS,
  PATIENTDETILES_PEDIATRIC_TABS,
  PATIENTDETILES_OPD1_TABS,
  PATIENTDETILES_TABS_TWO,
  OPERATIONAL_TABS,
  PATIENTDETILES_OPD3_TABS,
} from '../data/data';
import PrivateTopBar from '../layouts/PrivateTopBar';

import Home from '../pages/public/Home';
import Clinics from '../pages/Clinics';
import Administration from '../pages/Administration';

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
    <CircularProgress />
  </Box>
);

interface AppRouterProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  currentPath?: string;
}

// const getFilteredTabs = (pathname: string, tabs: TabItem[]): TabItem[] => {
//   if (pathname.includes('/triage/examinations')) {
//     return tabs.filter(tab => tab.label !== 'Follow Up');
//   }
//   return tabs;
// };

export const AppRouter = ({ darkMode, onToggleTheme }: AppRouterProps) => {
  const router = createBrowserRouter([
    // 🔹 Public Routes
    // {
    //   element: <PublicLayout />,
    //   children: [
    //     {
    //       path: '/',
    //       element: <Suspense fallback={<Loading />}>{ROUTES.public.home.element}</Suspense>,
    //     },
    //     {
    //       path: '/clinics',
    //       element: <Suspense fallback={<Loading />}>{ROUTES.public.clinics.element}</Suspense>,
    //     },
    //     {
    //       path: '/administration',
    //       element: (
    //         <Suspense fallback={<Loading />}>{ROUTES.public.administration.element}</Suspense>
    //       ),
    //     },
    //   ],
    // },
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/clinics',
      element: <Clinics />,
    },
    {
      path: '/administration',
      element: <Administration />,
    },
    {
      path: '/login',
      element: <Suspense fallback={<Loading />}>{ROUTES.auth.login.element}</Suspense>,
    },

    // 🔹 Front Desk Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={FRONT_DESK_TABS} />
      ),

      children: [
        {
          path: ROUTES.protected.frontDesk.path,
          element: ROUTES.protected.frontDesk.element,
        },
        {
          path: ROUTES.protected.checkout.path,
          element: ROUTES.protected.checkout.element,
        },
        {
          path: ROUTES.protected.archivedPatients.path,
          element: ROUTES.protected.archivedPatients.element,
        },
        {
          path: ROUTES.protected.rescheduleAppointment.path,
          element: ROUTES.protected.rescheduleAppointment.element,
        },
        {
          path: ROUTES.protected.appointmentsLists.path,
          element: ROUTES.protected.appointmentsLists.element,
        },
        {
          path: ROUTES.protected.createAppointment.path,
          element: ROUTES.protected.createAppointment.element,
        },
        {
          path: ROUTES.protected.doctorAvailability.path,
          element: ROUTES.protected.doctorAvailability.element,
        },
        {
          path: ROUTES.protected.patientPayments.path,
          element: ROUTES.protected.patientPayments.element,
        },
        {
          path: ROUTES.protected.operationalPayments.path,
          element: ROUTES.protected.operationalPayments.element,
        },
        {
          path: ROUTES.protected.requestedPayments.path,
          element: ROUTES.protected.requestedPayments.element,
        },
        {
          path: ROUTES.protected.pendingPayments.path,
          element: ROUTES.protected.pendingPayments.element,
        },
        {
          path: ROUTES.protected.appointmentsCalendars.path,
          element: ROUTES.protected.appointmentsCalendars.element,
        },
        {
          path: ROUTES.protected.emergencyPatients.path,
          element: ROUTES.protected.emergencyPatients.element,
        },
        {
          path: ROUTES.protected.createEmergencyPatients.path,
          element: ROUTES.protected.createEmergencyPatients.element,
        },
        {
          path: ROUTES.protected.newPatient.path,
          element: ROUTES.protected.newPatient.element,
        },
        // {
        //   path: ROUTES.protected.patientDetails.path,
        //   element: ROUTES.protected.patientDetails.element,
        // },

        // Child routes that won't show in topbar
        // {
        //   path: '/front-desk/medical-certificates',
        //   element: ROUTES.protected.medicalCertificates?.element || <div>Medical Certificates</div>,
        // },
      ],
    },

    // 🔹 chiefadmin Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={CHIEFADMIN_TABS} />
      ),
      children: [
        {
          path: ROUTES.protected.Generalmanager.path,
          element: ROUTES.protected.Generalmanager.element,
        },

        {
          path: ROUTES.protected.Clinicaldirector.path,
          element: ROUTES.protected.Clinicaldirector.element,
        },
      ],
    },

    // 🔹 Management Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={MANAGMENT_TABS} />
      ),
      children: [
        {
          path: ROUTES.protected.Managment.path,
          element: ROUTES.protected.Managment.element,
        },
        {
          path: ROUTES.protected.Createuser.path,
          element: ROUTES.protected.Createuser.element,
        },
        {
          path: ROUTES.protected.Financialreport.path,
          element: ROUTES.protected.Financialreport.element,
        },
        {
          path: ROUTES.protected.Userreport.path,
          element: ROUTES.protected.Userreport.element,
        },
        {
          path: ROUTES.protected.Disscussion.path,
          element: ROUTES.protected.Disscussion.element,
        },
      ],
    },

    // 🔹 Doctor Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={DOCTOR_TABS} />
      ),

      children: [
        {
          path: ROUTES.protected.examinationsDoctor.path,
          element: ROUTES.protected.examinationsDoctor.element,
        },
        {
          path: ROUTES.protected.retina.path,
          element: ROUTES.protected.retina.element,
        },
        {
          path: ROUTES.protected.referralsDoctor.path,
          element: ROUTES.protected.referralsDoctor.element,
        },
        {
          path: ROUTES.protected.discussionDoctor.path,
          element: ROUTES.protected.discussionDoctor.element,
        },
        {
          path: ROUTES.protected.checkoutDoctor.path,
          element: ROUTES.protected.checkoutDoctor.element,
        },
        {
          path: ROUTES.protected.emergencyDoctor.path,
          element: ROUTES.protected.emergencyDoctor.element,
        },
        {
          path: ROUTES.protected.glaucoma.path,
          element: ROUTES.protected.glaucoma.element,
        },
        {
          path: ROUTES.protected.pediatric.path,
          element: ROUTES.protected.pediatric.element,
        },
        {
          path: ROUTES.protected.opd1.path,
          element: ROUTES.protected.opd1.element,
        },
        {
          path: ROUTES.protected.opd2.path,
          element: ROUTES.protected.opd2.element,
        },
        {
          path: ROUTES.protected.opd3.path,
          element: ROUTES.protected.opd3.element,
        },
        {
          path: ROUTES.protected.doctorPatients.path,
          element: ROUTES.protected.doctorPatients.element,
        },
        {
          path: ROUTES.protected.settings.path,
          element: ROUTES.protected.settings.element,
        },
        {
          path: ROUTES.protected.notifications.path,
          element: ROUTES.protected.notifications.element,
        },
      ],
    },

    // 🔹 Triage Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={TRIAGE_TABS_ONE} />
      ),

      children: [
        {
          path: ROUTES.protected.examinationsTriage.path,
          element: ROUTES.protected.examinationsTriage.element,
        },
        {
          path: ROUTES.protected.triage.path,
          element: ROUTES.protected.triage.element,
        },
        {
          path: ROUTES.protected.referrals.path,
          element: ROUTES.protected.referrals.element,
        },
        {
          path: ROUTES.protected.followUp.path,
          element: ROUTES.protected.followUp.element,
        },
        {
          path: ROUTES.protected.discussion.path,
          element: ROUTES.protected.discussion.element,
        },
        {
          path: ROUTES.protected.checkoutPatients.path,
          element: ROUTES.protected.checkoutPatients.element,
        },
        {
          path: ROUTES.protected.emergencyPatient.path,
          element: ROUTES.protected.emergencyPatient.element,
        },
        {
          path: ROUTES.protected.triagePatients.path,
          element: ROUTES.protected.triagePatients.element,
        },
      ],
    },

    // 🔹 Refraction Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={REFRACTION_TABS} />
      ),

      children: [
        {
          path: ROUTES.protected.examinationsRefraction.path,
          element: ROUTES.protected.examinationsRefraction.element,
        },
        {
          path: ROUTES.protected.refraction.path,
          element: ROUTES.protected.refraction.element,
        },
        {
          path: ROUTES.protected.refractionPatient.path,
          element: ROUTES.protected.refractionPatient.element,
        },
        {
          path: ROUTES.protected.referralsRefraction.path,
          element: ROUTES.protected.referralsRefraction.element,
        },
        {
          path: ROUTES.protected.discussionRefraction.path,
          element: ROUTES.protected.discussionRefraction.element,
        },
        {
          path: ROUTES.protected.checkoutRefraction.path,
          element: ROUTES.protected.checkoutRefraction.element,
        },
        {
          path: ROUTES.protected.emergencyRefraction.path,
          element: ROUTES.protected.emergencyRefraction.element,
        },
      ],
    },

    // 🔹 Patient Details Routes Group
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.patientDetails.path,
          element: ROUTES.protected.patientDetails.element,
        },
        // {
        //   path: ROUTES.protected.examinationTab.path,
        //   element: ROUTES.protected.examinationTab.element,
        // },
        // {
        //   path: ROUTES.protected.followUpTab.path,
        //   element: ROUTES.protected.followUpTab.element,
        // },
      ],
    },

    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_TRIAGE_TABS_TWO}
        />
      ),

      children: [
        {
          path: ROUTES.protected.patientDetailsTriageTwo.path,
          element: ROUTES.protected.patientDetailsTriageTwo.element,
        },
      ],
    },

    // 🔹 Patient Details Routes Group Triage Three
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_TRIAGE_TABS_THREE}
        />
      ),

      children: [
        {
          path: ROUTES.protected.patientDetailsTriageThree.path,
          element: ROUTES.protected.patientDetailsTriageThree.element,
        },
      ],
    },

    // 🔹 Patient Details Routes Group Refraction
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_REFRACTION_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.patientDetailRefraction.path,
          element: ROUTES.protected.patientDetailRefraction.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group Refraction
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_RETINA_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.patientsDetailRetina.path,
          element: ROUTES.protected.patientsDetailRetina.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group Glaucoma
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_GLAUCOMA_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.glaucomaPatientDetail.path,
          element: ROUTES.protected.glaucomaPatientDetail.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group Pediatric
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_PEDIATRIC_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.pediatricPatientDetail.path,
          element: ROUTES.protected.pediatricPatientDetail.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group OPD1
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_OPD1_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.opd1PatientDetail.path,
          element: ROUTES.protected.opd1PatientDetail.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group OPD1
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_OPD3_TABS}
        />
      ),

      children: [
        {
          path: ROUTES.protected.opd3PatientDetail.path,
          element: ROUTES.protected.opd3PatientDetail.element,
        },
      ],
    },

    // 🔹 Patient Details Routes Group 2
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          // tabsData={getFilteredTabs(window.location.pathname, PATIENTDETILES_TABS_TWO)}
          tabsData={PATIENTDETILES_TABS_TWO}
        />
      ),
      children: [
        {
          path: ROUTES.protected.examinationTab.path,
          element: ROUTES.protected.examinationTab.element,
        },
        {
          path: ROUTES.protected.followUpTab.path,
          element: ROUTES.protected.followUpTab.element,
        },
        {
          path: ROUTES.protected.orderTab.path,
          element: ROUTES.protected.orderTab.element,
        },
        {
          path: ROUTES.protected.operationTab.path,
          element: ROUTES.protected.operationTab.element,
        },
        {
          path: ROUTES.protected.medicationsOrder.path,
          element: ROUTES.protected.medicationsOrder.element,
        },
        {
          path: ROUTES.protected.opticalOrder.path,
          element: ROUTES.protected.opticalOrder.element,
        },
        {
          path: ROUTES.protected.opticalOrderDetail.path,
          element: ROUTES.protected.opticalOrderDetail.element,
        },
      ],
    },
    // 🔹 Patient Details Routes Group Triage Two
    {
      element: (
        <AppLayout
          darkMode={darkMode}
          onToggleTheme={onToggleTheme}
          tabsData={PATIENTDETILES_TRIAGE_TABS_TWO}
        />
      ),
      children: [
        {
          path: ROUTES.protected.examinationTab.path,
          element: ROUTES.protected.examinationTab.element,
        },
        {
          path: ROUTES.protected.followUpTab.path,
          element: ROUTES.protected.followUpTab.element,
        },
        {
          path: ROUTES.protected.orderTab.path,
          element: ROUTES.protected.orderTab.element,
        },
        {
          path: ROUTES.protected.operationTab.path,
          element: ROUTES.protected.operationTab.element,
        },
      ],
    },

    // 🔹 Diagnosis Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={DIAGNOSIS_TABS} />
      ),

      children: [
        {
          path: ROUTES.protected.diagnosis.path,
          element: ROUTES.protected.diagnosis.element,
        },
        {
          path: ROUTES.protected.diagnosis.path,
          element: ROUTES.protected.diagnosis.element,
        },
        {
          path: ROUTES.protected.todayCases.path,
          element: ROUTES.protected.todayCases.element,
        },
        {
          path: ROUTES.protected.laboratory.path,
          element: ROUTES.protected.laboratory.element,
        },
        {
          path: ROUTES.protected.radiology.path,
          element: ROUTES.protected.radiology.element,
        },
        {
          path: ROUTES.protected.caseHistories.path,
          element: ROUTES.protected.caseHistories.element,
        },
        {
          path: ROUTES.protected.diagnosisNotifications.path,
          element: ROUTES.protected.diagnosisNotifications.element,
        },
        {
          path: ROUTES.protected.diagnosisSettings.path,
          element: ROUTES.protected.diagnosisSettings.element,
        },
      ],
    },

    // 🔹 Operational Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={OPERATIONAL_TABS} />
      ),

      children: [
        {
          path: ROUTES.protected.orList.path,
          element: ROUTES.protected.orList.element,
        },
        {
          path: ROUTES.protected.or.path,
          element: ROUTES.protected.or.element,
        },
        {
          path: ROUTES.protected.todayCases.path,
          element: ROUTES.protected.todayCases.element,
        },
        {
          path: ROUTES.protected.laboratory.path,
          element: ROUTES.protected.laboratory.element,
        },
        {
          path: ROUTES.protected.radiology.path,
          element: ROUTES.protected.radiology.element,
        },
        {
          path: ROUTES.protected.caseHistories.path,
          element: ROUTES.protected.caseHistories.element,
        },
        {
          path: ROUTES.protected.diagnosisNotifications.path,
          element: ROUTES.protected.diagnosisNotifications.element,
        },
        {
          path: ROUTES.protected.diagnosisSettings.path,
          element: ROUTES.protected.diagnosisSettings.element,
        },
      ],
    },

    // 🔹 Pharmacy Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={PHARMACY_TABS} />
      ),
      children: [
        {
          path: ROUTES.protected.pharmacy.path,
          element: ROUTES.protected.pharmacy.element,
        },
        {
          path: ROUTES.protected.pharmacyCases.path,
          element: ROUTES.protected.pharmacyCases.element,
        },
        {
          path: ROUTES.protected.pharmacyResults.path,
          element: ROUTES.protected.pharmacyResults.element,
        },
        {
          path: ROUTES.protected.pharmacyNotifications.path,
          element: ROUTES.protected.pharmacyNotifications.element,
        },
        {
          path: ROUTES.protected.pharmacySettings.path,
          element: ROUTES.protected.pharmacySettings.element,
        },
      ],
    },

    // 🔹 Optical Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={OPTICAL_TABS} />
      ),
      children: [
        {
          path: ROUTES.protected.optical.path,
          element: ROUTES.protected.optical.element,
        },
        {
          path: ROUTES.protected.opticalCases.path,
          element: ROUTES.protected.opticalCases.element,
        },
        {
          path: ROUTES.protected.opticalOrderDetail.path,
          element: ROUTES.protected.opticalOrderDetail.element,
        },
        {
          path: ROUTES.protected.opticalNotifications.path,
          element: ROUTES.protected.opticalNotifications.element,
        },
        {
          path: ROUTES.protected.opticalSettings.path,
          element: ROUTES.protected.opticalSettings.element,
        },
      ],
    },

    // 🔹 In-Patient Routes Group
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={IN_PATIENT_TABS} />
      ),
      children: [
        {
          path: ROUTES.protected.inPatient.path,
          element: ROUTES.protected.inPatient.element,
        },
        {
          path: ROUTES.protected.inPatientCases.path,
          element: ROUTES.protected.inPatientCases.element,
        },
        {
          path: ROUTES.protected.wardManagement.path,
          element: ROUTES.protected.wardManagement.element,
        },
        {
          path: ROUTES.protected.patientBeds.path,
          element: ROUTES.protected.patientBeds.element,
        },
        {
          path: ROUTES.protected.inPatientSettings.path,
          element: ROUTES.protected.inPatientSettings.element,
        },
        {
          path: ROUTES.protected.inPatientNotifications.path,
          element: ROUTES.protected.inPatientNotifications.element,
        },
      ],
    },

    // 🔹 Individual Routes (not in layout groups)
    {
      path: ROUTES.protected.eyeSmart.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.eyeSmart.element}</Suspense>
        </PrivateTopBar>
      ),
    },
    {
      path: ROUTES.protected.triageLists.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.triageLists.element}</Suspense>
        </PrivateTopBar>
      ),
    },

    {
      path: ROUTES.protected.systemadminLists.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.systemadminLists.element}</Suspense>
        </PrivateTopBar>
      ),
    },
    {
      path: ROUTES.protected.chiefadminLists.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.chiefadminLists.element}</Suspense>
        </PrivateTopBar>
      ),
    },
    {
      path: ROUTES.protected.diagnosisList.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.diagnosisList.element}</Suspense>
        </PrivateTopBar>
      ),
    },

    {
      path: ROUTES.protected.orList.path,
      element: (
        <PrivateTopBar darkMode={darkMode} onToggleTheme={onToggleTheme}>
          <Suspense fallback={<Loading />}>{ROUTES.protected.orList.element}</Suspense>
        </PrivateTopBar>
      ),
    },
    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={TRIAGE_TABS_TWO} />
      ),
      children: [
        {
          path: ROUTES.protected.triageOnePatientList.path,
          element: ROUTES.protected.triageOnePatientList.element,
        },
        {
          path: ROUTES.protected.referralsTwo.path,
          element: ROUTES.protected.referralsTwo.element,
        },
        {
          path: ROUTES.protected.followUpTwo.path,
          element: ROUTES.protected.followUpTwo.element,
        },
        {
          path: ROUTES.protected.triagePatientsTwo.path,
          element: ROUTES.protected.triagePatientsTwo.element,
        },
        {
          path: ROUTES.protected.emergencyPatientTriage2.path,
          element: ROUTES.protected.emergencyPatientTriage2.element,
        },
        {
          path: ROUTES.protected.checkoutPatientsTriage2.path,
          element: ROUTES.protected.checkoutPatientsTriage2.element,
        },
        {
          path: ROUTES.protected.discussionTriage2.path,
          element: ROUTES.protected.discussionTriage2.element,
        },
        {
          path: ROUTES.protected.emergencyPatientTriage3.path,
          element: ROUTES.protected.emergencyPatientTriage3.element,
        },
        {
          path: ROUTES.protected.examinationsTriage2.path,
          element: ROUTES.protected.examinationsTriage2.element,
        },
      ],
    },

    {
      element: (
        <AppLayout darkMode={darkMode} onToggleTheme={onToggleTheme} tabsData={TRIAGE_TABS_THREE} />
      ),
      children: [
        {
          path: ROUTES.protected.triageThree.path,
          element: ROUTES.protected.triageThree.element,
        },
        {
          path: ROUTES.protected.emergencyPatientTriage3.path,
          element: ROUTES.protected.emergencyPatientTriage3.element,
        },
        {
          path: ROUTES.protected.checkoutPatientsTriage3.path,
          element: ROUTES.protected.checkoutPatientsTriage3.element,
        },
        {
          path: ROUTES.protected.discussionTriage3.path,
          element: ROUTES.protected.discussionTriage3.element,
        },
        {
          path: ROUTES.protected.referrals3.path,
          element: ROUTES.protected.referrals3.element,
        },
        {
          path: ROUTES.protected.followUp3.path,
          element: ROUTES.protected.followUp3.element,
        },
        {
          path: ROUTES.protected.examinationsTriage3.path,
          element: ROUTES.protected.examinationsTriage3.element,
        },
      ],
    },

    {
      path: ROUTES.protected.dashboard.path,
      element: <Suspense fallback={<Loading />}>{ROUTES.protected.dashboard.element}</Suspense>,
    },

    // 🔹 404 fallback
    {
      path: ROUTES.notFound.path,
      element: ROUTES.notFound.element,
    },
  ]);

  return <RouterProvider router={router} />;
};
