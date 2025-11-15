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
      { label: 'Checkout Patients', path: '/front-desk/checkout' },
      { label: 'Archived patients', path: '/front-desk/archived-patients' },
    ],
  },
  {
    label: 'Appointments',
    path: '/front-desk/appointments',
    children: [
      { label: 'Appointment Lists', path: '/front-desk/appointments-lists' },
      { label: 'Create appointment', path: '/front-desk/appointments-create' },
      { label: 'Reschedule Appointment', path: '/front-desk/appointments-reschedule' },
      { label: 'Doctors Availability', path: '/front-desk/appointments-doctors' },
    ],
  },
  {
    label: 'Bills',
    path: '/front-desk/bills',
    children: [
      { label: 'Patient Payments ', path: '/front-desk/patient-payments' },
      { label: 'Pending Payments ', path: '/front-desk/pending-payments' },
      { label: 'Requested Payments ', path: '/front-desk/requested-payments' },
    ],
  },
  {
    label: 'Notifications',
    path: '/notifications',
    // children: [
    //   { label: 'Appointment Reminders', path: '/front-desk/notifications/reminders' },
    //   { label: 'Follow-Up Alerts', path: '/front-desk/notifications/followups' },
    //   { label: 'System Updates', path: '/front-desk/notifications/updates' },
    //   { label: 'Messages from Doctors', path: '/front-desk/notifications/messages' },
    // ],
  },

  {
    label: 'Settings',
    path: '/settings',
    // children: [
    //   { label: 'User Profile', path: '/front-desk/profile' },
    //   { label: 'Change Password', path: '/front-desk/change-password' },
    //   { label: 'Logout ', path: '/' },
    // ],
  },
];

// ───────────────────────────────────────────
// TRIAGE
// ───────────────────────────────────────────

export const TRIAGE_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/triage/patients',
    children: [
      { label: 'Referrals', path: '/triage/referrals' },
      { label: 'Checkout patients ', path: '/triage/checkout-patients' },
      { label: 'Emergency Patients', path: '/triage/emergency-patients' },
    ],
  },
  {
    label: 'Examinations',
    path: '/examinations',
  },
  {
    label: 'Discussion',
    path: '/triage/discussion',
  },

  {
    label: 'Notifications',
    path: '/notifications',
  },

  {
    label: 'Settings',
    path: '/settings',
  },
  // { label: "Logout", path: "/logout" },
];

// ───────────────────────────────────────────
// REFRACTION
// ───────────────────────────────────────────

export const REFRACTION_TABS: TabItem[] = [
  {
    label: 'Patients',
    path: '/refraction/patients',
    children: [
      { label: 'Referrals', path: '/refraction/referrals' },
      { label: 'Checkout patients ', path: '/refraction/checkout-patients' },
      { label: 'Emergency Patients', path: '/refraction/emergency-patients' },
    ],
  },
  {
    label: 'Examination',
    path: '/examinations',
  },
  {
    label: 'Discussion',
    path: '/refraction/discussion',
  },

  {
    label: 'Notifications',
    path: '/notifications',
  },

  {
    label: 'Settings',
    path: '/settings',
  },
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
      { label: 'Referrals', path: '/doctor/referrals' },
      { label: 'Checkout patients ', path: '/doctor/checkout-patients' },
      { label: 'Emergency Patients', path: '/doctor/emergency-patients' },
    ],
  },
  {
    label: 'Examination',
    path: '/examinations',
  },
  {
    label: 'Discussion',
    path: '/doctor/discussion',
  },

  {
    label: 'Notifications',
    path: '/notifications',
  },

  {
    label: 'Settings',
    path: '/settings',
  },
  // { label: "Logout", path: "/logout" },
];

// ───────────────────────────────────────────
// DIAGNOSIS / SPECIALIST
// ───────────────────────────────────────────

export const DIAGNOSIS_TABS: TabItem[] = [
  {
    label: 'Cases',
    path: '/diagnosis/cases',
    children: [{ label: 'Today’s Case', path: '/diagnosis/today-case' }],
  },
  {
    label: 'Laboratory',
    path: '/diagnosis/Laboratory',
  },
  {
    label: 'Radiology',
    path: '/diagnosis/radiology',
  },
  {
    label: 'Case History',
    path: '/diagnosis/case-history',
  },

  {
    label: 'Notifications',
    path: '/diagnosis/notifications',
  },
  {
    label: 'Settings',
    path: '/diagnosis/settings',
  },
  // { label: "Logout", path: "/logout" },
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
