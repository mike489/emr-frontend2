export interface TabItem {
  label: string;
  path: string;
  children?: {
    label: string;
    path: string;
  }[];
}

// ───────────────────────────────────────────
// FRONT DESK
// ───────────────────────────────────────────
export const FRONT_DESK_TABS: TabItem[] = [
  {
    label: 'Patient',
    path: '/front-desk',
    children: [
      { label: 'All Patients', path: '/front-desk' },
      { label: 'Add new patients', path: '/new-patient' },
      { label: 'Emergency Patients', path: '/front-desk/emergency-patients' },
      { label: 'Add New Emergency Patients', path: '/front-desk/add-new-emergency-patients' },
      // { label: 'Patient Details', path: '/front-desk/patient-detail' },

      { label: 'Checkout Patients', path: '/front-desk/checkout' },
      { label: 'Archived patients', path: '/front-desk/archived-patients' },
    ],
  },
  {
    label: 'Appointments',
    path: '/front-desk/appointments',
    children: [
      { label: 'Appointment Lists', path: '/front-desk/appointments-lists' },
      { label: 'Appointment Calendars', path: '/front-desk/appointments-calendars' },
      { label: 'Create appointment', path: '/front-desk/appointments-create' },
      // { label: 'Reschedule Appointment', path: '/front-desk/appointments-reschedule' },
      { label: 'Doctors Availability', path: '/front-desk/appointments-doctors' },
    ],
  },
  {
    label: 'Bills',
    path: '/front-desk/bills',
    children: [
      { label: 'Investigation Payments ', path: '/front-desk/requested-payments' },
      // { label: 'Card Payments ', path: '/front-desk/patient-payments' },
      { label: 'Operational Payments ', path: '/front-desk/operational-payments' },
      // { label: 'Pending Payments ', path: '/front-desk/pending-payments' },
    ],
  },
];

// ───────────────────────────────────────────
// TRIAGE
// ───────────────────────────────────────────

export const PATIENTDETILES_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/triage/patient-details',
  },
  {
    label: 'Follow Ups',
    path: '/triage/follow-ups',
  },
];

export const PATIENTDETILES_TRIAGE_TABS_TWO: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/triage-two/patient-details',
  },
  {
    label: 'Follow Ups',
    path: '/triage-two/follow-ups',
  },
];
export const PATIENTDETILES_TRIAGE_TABS_THREE: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/triage-three/patient-details',
  },
  {
    label: 'Follow Ups',
    path: '/triage-three/follow-ups',
  },
];

export const PATIENTDETILES_REFRACTION_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/refraction/patient-details',
  },
  {
    label: 'Follow Ups',
    path: '/refraction/follow-ups',
  },
];
export const PATIENTDETILES_RETINA_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/retina/patients-detail',
  },
  {
    label: 'Follow Ups',
    path: '/retina/follow-ups',
  },
];
export const PATIENTDETILES_GLAUCOMA_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/glaucoma/patients-detail',
  },
  {
    label: 'Follow Ups',
    path: '/glaucoma/follow-ups',
  },
];

export const PATIENTDETILES_PEDIATRIC_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/pediatric/patients-detail',
  },
  {
    label: 'Follow Ups',
    path: '/pediatric/follow-ups',
  },
];

export const PATIENTDETILES_OPD1_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/opd-one/patients-detail',
  },
  {
    label: 'Follow Ups',
    path: '/opd-one/follow-ups',
  },
];
export const PATIENTDETILES_OPD3_TABS: TabItem[] = [
  {
    label: 'Visit Patient',
    path: '/opd-three/patients-detail',
  },
  {
    label: 'Follow Ups',
    path: '/opd-three/follow-ups',
  },
];

export const PATIENTDETILES_TABS_TWO: TabItem[] = [
  {
    label: 'Examination',
    path: '/triage/examinations',
  },
  {
    label: 'Follow Up',
    path: '/follow-up',
  },
  {
    label: 'Investigations',
    path: '/orders',
  },
  {
    label: 'Operations',
    path: '/operations',
  },
  // {
  //   label: 'Results',
  //   path: '/results',
  //   children: [
  //     { label: 'Lab Results', path: '/results' },
  //     { label: 'Operations Results', path: '/triage/operations-results' },
  //   ],
  // },
  {
    label: 'Medications',
    path: '/medications',
  },
  {
    label: 'Optical',
    path: '/opticals',
  },
];

export const PATIENTDETAILS_TRIAGE_MINIMAL_TABS: TabItem[] = [
  {
    label: 'Examination',
    path: '/triages/examinations',
  },
  {
    label: 'Follow Up',
    path: '/triages/follow-up',
  },
];

export const TRIAGE_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/triage/patients',
    children: [
      { label: 'Patient List', path: '/triage/patients-list' },
      { label: 'Referrals', path: '/triage/referrals' },
      { label: 'Checkout patients ', path: '/triage/checkout-patients' },
      { label: 'Follow up', path: '/triage/follow-up' },
      { label: 'Emergency Patients', path: '/triage/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examinations',
  //   path: '/triage/examinations',
  // },
  {
    label: 'Discussion',
    path: '/triage/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];

export const TRIAGE_TABS_TWO: TabItem[] = [
  {
    label: 'Patients',
    path: '/triage-two/patients',
    children: [
      { label: 'Patient List', path: '/triage-two/patients-list' },
      { label: 'Referrals', path: '/triage-two/referrals' },
      { label: 'Checkout patients ', path: '/triage-two/checkout-patients' },
      { label: 'Follow up', path: '/triage-two/follow-up' },
      { label: 'Emergency Patients', path: '/triage-two/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examinations',
  //   path: '/triage-two/examinations',
  // },
  {
    label: 'Discussion',
    path: '/triage-two/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];

export const TRIAGE_TABS_ONE: TabItem[] = [
  {
    label: 'Patients',
    path: '/triage-one/patients',
    children: [
      { label: 'Patient List', path: '/triage-one/patients-list' },
      { label: 'Referrals', path: '/triage-one/referrals' },
      { label: 'Checkout patients ', path: '/triage-one/checkout-patients' },
      // { label: 'Follow up', path: '/triage-one/follow-up' },
      { label: 'Emergency Patients', path: '/triage-one/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examinations',
  //   path: '/triage-one/examinations',
  // },
  {
    label: 'Discussion',
    path: '/triage-one/discussion',
  },
];
export const TRIAGE_TABS_THREE: TabItem[] = [
  {
    label: 'Patients',
    path: '/triage-three/patients',
    children: [
      { label: 'Patient List', path: '/triage-three/patients-list' },
      { label: 'Referrals', path: '/triage-three/referrals' },
      { label: 'Checkout patients ', path: '/triage-three/checkout-patients' },
      { label: 'Follow up', path: '/triage-three/follow-up' },
      { label: 'Emergency Patients', path: '/triage-three/emergency-patients' },
    ],
  },
  {
    label: 'Examinations',
    path: '/triage-three/examinations',
  },
  {
    label: 'Discussion',
    path: '/triage-three/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];

// ───────────────────────────────────────────
// REFRACTION
// ───────────────────────────────────────────
export const MANAGMENT: TabItem[] = [
  {
    label: 'Management',
    path: '/management/management',
  },
];
export const REFRACTION_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/refraction/patients',
    children: [
      { label: 'Patient List', path: '/refraction/patients-list' },

      { label: 'Referrals', path: '/refraction/referrals' },
      { label: 'Checkout patients ', path: '/refraction/checkout-patients' },
      { label: 'Emergency Patients', path: '/refraction/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examination',
  //   path: '/refraction/examinations',
  // },
  {
    label: 'Discussion',
    path: '/refraction/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];

// ───────────────────────────────────────────
// DOCTOR
// ───────────────────────────────────────────

export const DOCTOR_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/doctor/patients',
    children: [
      { label: 'Patient List', path: '/doctor/patients-list' },
      { label: 'Referrals', path: '/doctor/referrals' },
      { label: 'Checkout patients ', path: '/doctor/checkout-patients' },
      { label: 'Emergency Patients', path: '/doctor/emergency-patients' },
    ],
  },

  {
    label: 'Discussion',
    path: '/doctor/discussion',
  },
];

export const PEDIATRIC_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/pediatric',
  },

  {
    label: 'Discussion',
    path: '/pediatric/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];
export const RETINA_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/retina',
    // children: [
    //   { label: 'Patient List', path: '/retina/patients' },
    //   { label: 'Referrals', path: '/retina/referrals' },
    //   { label: 'Checkout patients', path: '/retina/checkout-patients' },
    //   { label: 'Emergency Patients', path: '/retina/emergency-patients' },
    // ],
  },
  {
    label: 'Discussion',
    path: '/retina/discussion',
  },
];

export const GLAUCOMA_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/glaucoma',
  },

  {
    label: 'Discussion',
    path: '/glaucoma/discussion',
  },
];

export const OPD_ONE_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/opd-one/patients',
    children: [
      { label: 'Patient List', path: '/opd-one/patients-list' },
      { label: 'Referrals', path: '/opd-one/referrals' },
      { label: 'Checkout patients ', path: '/opd-one/checkout-patients' },
      { label: 'Emergency Patients', path: '/opd-one/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examination',
  //   path: '/opd-one/examinations',
  // },
  {
    label: 'Discussion',
    path: '/opd-one/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];
export const OPD_TWO_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/opd-two/patients',
    children: [
      { label: 'Patient List', path: '/opd-two/patients-list' },
      { label: 'Referrals', path: '/opd-two/referrals' },
      { label: 'Checkout patients ', path: '/opd-two/checkout-patients' },
      { label: 'Emergency Patients', path: '/opd-two/emergency-patients' },
    ],
  },
  {
    label: 'Examination',
    path: '/opd-two/examinations',
  },
  {
    label: 'Discussion',
    path: '/opd-two/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];
export const OPD_THREE_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/opd-three/patients',
    children: [
      { label: 'Patient List', path: '/opd-three/patients-list' },
      { label: 'Referrals', path: '/opd-three/referrals' },
      { label: 'Checkout patients ', path: '/opd-three/checkout-patients' },
      { label: 'Emergency Patients', path: '/opd-three/emergency-patients' },
    ],
  },
  // {
  //   label: 'Examination',
  //   path: '/opd-three/examinations',
  // },
  {
    label: 'Discussion',
    path: '/opd-three/discussion',
  },

  // {
  //   label: 'Notifications',
  //   path: '/notifications',
  // },

  // {
  //   label: 'Settings',
  //   path: '/settings',
  // },
  // { label: "Logout", path: "/logout" },
];
// ───────────────────────────────────────────
// DIAGNOSIS / SPECIALIST
// ───────────────────────────────────────────

export const DIAGNOSIS_TABS: TabItem[] = [
  {
    label: 'Cases',
    path: '/diagnosis/cases',
    children: [{ label: 'Today’s Case', path: '/diagnosis/today-cases' }],
  },

  {
    label: 'Case History',
    path: '/diagnosis/case-history',
  },
];

export const OPERATIONAL_TABS: TabItem[] = [
  {
    label: 'Cases',
    path: '/or-list/cases',
    children: [{ label: 'Today’s Case', path: '/or-list/today-cases' }],
  },

  {
    label: 'Case History',
    path: '/or/case-history',
  },
];

export const MANAGMENT_TABS: TabItem[] = [
  {
    label: 'User Management',
    path: '/managment',
    children: [
      { label: 'All Users', path: '/managment' },
      { label: 'Create User', path: '/managment/Createusers' },
    ],
  },
  {
    label: 'Reports',
    path: '/managment',
    children: [
      { label: 'Financial Report', path: '/managment/Financialreport' },
      { label: 'User Report', path: '/managment/userreport' },
    ],
  },
  {
    label: 'Discussion',
    path: '/managment/Disscussion',
  },
];

//chiefadmin tabs
export const CHIEFADMIN_TABS: TabItem[] = [
  {
    label: 'User Management',
    path: '/managment',
    children: [
      { label: 'All Users', path: '/managment' },
      { label: 'Create User', path: '/managment/Createusers' },
    ],
  },
  {
    label: 'Reports',
    path: '/managment',
    children: [
      { label: 'Financial Report', path: '/managment/Financialreport' },
      { label: 'User Report', path: '/managment/userreport' },
    ],
  },
  {
    label: 'Discussion',
    path: '/managment/Discussion',
  },
];
// Results
//
export const PHARMACY_TABS: TabItem[] = [
  {
    label: 'Cases',
    path: '/pharmacy/cases',
    children: [{ label: 'Today’s Case', path: '/pharmacy/patients' }],
  },
  {
    label: 'Results',
    path: '/pharmacy/results',
  },

  // { label: "Logout", path: "/logout" },
];

export const OPTICAL_TABS: TabItem[] = [
  {
    label: 'Cases',
    path: '/optical/cases',
    children: [
      { label: 'Today’s Case', path: '/optical/today-cases' },
      { label: 'Details', path: '/optical/details' },
    ],
  },
  {
    label: 'Results',
    path: '/optical/results',
  },
  // { label: "Logout", path: "/logout" },
];
export const IN_PATIENT_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/in-patient/patients',
    children: [{ label: 'In Patients', path: '/in-patient/in-patients' }],
  },
  {
    label: 'Ward Management',
    path: '/in-patient/ward-management',
  },
  {
    label: 'Patient Beds',
    path: '/in-patient/patient-beds',
  },
];

export const COUNSELOR_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/counselor/patients',
    // children: [{ label: 'Today’s Case', path: '/counselor/today-cases' }],
  },
];
// ───────────────────────────────────────────
// DEFAULT TABS
// ───────────────────────────────────────────

export const DEFAULT_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/default/patients',
    children: [
      { label: 'All Patients', path: '/default/patients/all' },
      { label: 'New Patient', path: '/default/patients/new' },
      { label: 'Follow-up', path: '/default/patients/followup' },
    ],
  },
  {
    label: 'Examinations',
    path: '/default/exams',
    children: [
      { label: 'Visual Acuity', path: '/default/exams/acuity' },
      { label: 'Refraction', path: '/default/exams/refraction' },
      { label: 'Fundus', path: '/default/exams/fundus' },
      { label: 'Reports', path: '/default/exams/reports' },
    ],
  },
  {
    label: 'Referrals',
    path: '/default/referrals',
    children: [
      { label: 'To Specialist', path: '/default/referrals/specialist' },
      { label: 'Vision Guardian', path: '/default/referrals/guardian' },
      { label: 'Teleophthalmology', path: '/default/referrals/teleophth' },
    ],
  },
  {
    label: 'Checkedout Patients',
    path: '/default/checkedout',
    children: [
      { label: 'Today', path: '/default/checkedout/today' },
      { label: 'This Week', path: '/default/checkedout/week' },
    ],
  },
  {
    label: 'Notifications',
    path: '/default/notifications',
    children: [
      { label: 'Critical', path: '/default/notifications/critical' },
      { label: 'Reminders', path: '/default/notifications/reminders' },
    ],
  },
  {
    label: 'Discussion',
    path: '/default/discussion',
    children: [
      { label: 'Voice Notes', path: '/default/discussion/voice' },
      { label: 'Dictations', path: '/default/discussion/dictations' },
    ],
  },
  {
    label: 'Settings',
    path: '/default/settings',
    children: [
      { label: 'Profile', path: '/default/settings/profile' },
      { label: 'Preferences', path: '/default/settings/preferences' },
    ],
  },
  { label: 'Logout', path: '/logout' },
];
