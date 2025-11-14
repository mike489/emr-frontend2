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
    label: "Patient",
    path: "/front-desk",
    children: [
      { label: "All Patients", path: "/front-desk" },
      { label: "Add new patients", path: "/new-patient" },
      { label: "Checkout Patients", path: "/front-desk/checkout" },
      { label: "Archived patients", path: "/front-desk/archived-patients" },
    ],
  },
  {
    label: "Appointments",
    path: "/front-desk/appointments",
    children: [
      { label: "Appointment Lists", path: "/front-desk/appointments-lists" },
      { label: "Create appointment", path: "/front-desk/appointments-create" },
      { label: "Reschedule Appointment", path: "/front-desk/appointments-reschedule" },
      { label: "Doctors Availability", path: "/front-desk/appointments-doctors" },
    ],
  },
  {
    label: "Bills",
    path: "/front-desk/bills",
    children: [
      { label: "Patient Payments ", path: "/front-desk/patient-payments" },
      { label: "Pending Payments ", path: "/front-desk/pending-payments" },
      { label: "Requested Payments ", path: "/front-desk/requested-payments" },
    ],
  },
  {
    label: "Notifications",
    path: "/front-desk/notifications",
    children: [
      { label: "Appointment Reminders", path: "/front-desk/notifications/reminders" },
      { label: "Follow-Up Alerts", path: "/front-desk/notifications/followups" },
      { label: "System Updates", path: "/front-desk/notifications/updates" },
      { label: "Messages from Doctors", path: "/front-desk/notifications/messages" },
    ],
  },
  
  {
    label: "Settings",
    path: "/front-desk/settings",
    children: [
      { label: "User Profile", path: "/front-desk/profile" },
      { label: "Change Password", path: "/front-desk/change-password" },
      { label: "Logout ", path: "/" },
     
    ],
  },
  
];


// ───────────────────────────────────────────
// TRIAGE
// ───────────────────────────────────────────

export const TRIAGE_TABS: TabItem[] = [
  {
    label: "Patients",
    path: "/triage/patients",
    children: [
      { label: "Waiting Queue", path: "/triage/patients/waiting" },
      { label: "Under Assessment", path: "/triage/patients/assessment" },
      { label: "Completed Assessments", path: "/triage/patients/completed" },
      { label: "Escalated Cases", path: "/triage/patients/escalated" },
    ],
  },
  {
    label: "Vital Signs",
    path: "/triage/vitals",
    children: [
      { label: "Blood Pressure", path: "/triage/vitals/bp" },
      { label: "Heart Rate", path: "/triage/vitals/hr" },
      { label: "Temperature", path: "/triage/vitals/temp" },
      { label: "Oxygen Saturation (SpO₂)", path: "/triage/vitals/spo2" },
      { label: "Height & Weight", path: "/triage/vitals/hw" },
    ],
  },
  {
    label: "Chief Complaint",
    path: "/triage/complaint",
    children: [
      { label: "Eye Pain", path: "/triage/complaint/eye-pain" },
      { label: "Blurred Vision", path: "/triage/complaint/blurred" },
      { label: "Redness / Discharge", path: "/triage/complaint/redness" },
      { label: "Headache", path: "/triage/complaint/headache" },
      { label: "Injury or Trauma", path: "/triage/complaint/injury" },
    ],
  },
  {
    label: "Priority",
    path: "/triage/priority",
    children: [
      { label: "Emergency", path: "/triage/priority/emergency" },
      { label: "Urgent", path: "/triage/priority/urgent" },
      { label: "Routine", path: "/triage/priority/routine" },
      { label: "Follow-up / Revisit", path: "/triage/priority/followup" },
    ],
  },
  {
    label: "Assign To",
    path: "/triage/assign",
    children: [
      { label: "Dr. Ahmed", path: "/triage/assign/ahmed" },
      { label: "Dr. Sarah", path: "/triage/assign/sarah" },
      { label: "Dr. Khan", path: "/triage/assign/khan" },
      { label: "On-Call Specialist", path: "/triage/assign/specialist" },
    ],
  },
  {
    label: "Notifications",
    path: "/triage/notifications",
    children: [
      { label: "Critical Vital Alerts", path: "/triage/notifications/critical" },
      { label: "Pending Review", path: "/triage/notifications/pending" },
      { label: "Doctor Ready", path: "/triage/notifications/ready" },
      { label: "Follow-up Due", path: "/triage/notifications/followup" },
    ],
  },
  {
    label: "History",
    path: "/triage/history",
    children: [
      { label: "Previous Visits", path: "/triage/history/visits" },
      { label: "Allergies", path: "/triage/history/allergies" },
      { label: "Current Medications", path: "/triage/history/medications" },
      { label: "Family History", path: "/triage/history/family" },
      { label: "Surgical History", path: "/triage/history/surgical" },
    ],
  },
  {
    label: "Settings",
    path: "/triage/settings",
    children: [
      { label: "User Profile", path: "/triage/profile" },
      { label: "Quick Notes Templates", path: "/triage/templates" },
      { label: "Triage Preferences", path: "/triage/preferences" },
      { label: "Display Options", path: "/triage/display" },
    ],
  },
  { label: "Logout", path: "/logout" },
];


// ───────────────────────────────────────────
// REFRACTION
// ───────────────────────────────────────────

export const REFRACTION_TABS: TabItem[] = [
  {
    label: "Patients",
    path: "/refraction/patients",
    children: [
      { label: "Waiting Queue", path: "/refraction/patients/waiting" },
      { label: "In Progress", path: "/refraction/patients/in-progress" },
      { label: "Completed Refractions", path: "/refraction/patients/completed" },
      { label: "Referred Cases", path: "/refraction/patients/referred" },
    ],
  },
  {
    label: "Vision Assessment",
    path: "/refraction/vision",
    children: [
      { label: "Visual Acuity", path: "/refraction/vision/acuity" },
      { label: "Near Vision", path: "/refraction/vision/near" },
      { label: "Pinhole Test", path: "/refraction/vision/pinhole" },
      { label: "Contrast Sensitivity", path: "/refraction/vision/contrast" },
      { label: "Color Vision", path: "/refraction/vision/color" },
    ],
  },
  {
    label: "Objective Refraction",
    path: "/refraction/objective",
    children: [
      { label: "Auto Refractometer", path: "/refraction/objective/auto" },
      { label: "Retinoscopy", path: "/refraction/objective/retinoscopy" },
      { label: "Keratometry", path: "/refraction/objective/keratometry" },
      { label: "Cycloplegic Refraction", path: "/refraction/objective/cycloplegic" },
    ],
  },
  {
    label: "Subjective Refraction",
    path: "/refraction/subjective",
    children: [
      { label: "Trial Lens Test", path: "/refraction/subjective/trial" },
      { label: "Refinement", path: "/refraction/subjective/refinement" },
      { label: "Final Prescription", path: "/refraction/subjective/final" },
      { label: "Binocular Balance", path: "/refraction/subjective/binocular" },
    ],
  },
  {
    label: "Lens Prescription",
    path: "/refraction/prescription",
    children: [
      { label: "Distance Glasses", path: "/refraction/prescription/distance" },
      { label: "Reading Glasses", path: "/refraction/prescription/reading" },
      { label: "Bifocal / Progressive", path: "/refraction/prescription/bifocal" },
      { label: "Contact Lens Trial", path: "/refraction/prescription/contact-lens" },
      { label: "Prescription Print", path: "/refraction/prescription/print" },
    ],
  },
  {
    label: "Patient Counseling",
    path: "/refraction/counseling",
    children: [
      { label: "Frame Selection", path: "/refraction/counseling/frame" },
      { label: "Lens Type Advice", path: "/refraction/counseling/lens-type" },
      { label: "Contact Lens Care", path: "/refraction/counseling/care" },
      { label: "Visual Hygiene Tips", path: "/refraction/counseling/hygiene" },
    ],
  },
  {
    label: "Notifications",
    path: "/refraction/notifications",
    children: [
      { label: "Pending Refractions", path: "/refraction/notifications/pending" },
      { label: "Doctor Ready", path: "/refraction/notifications/ready" },
      { label: "Follow-up Due", path: "/refraction/notifications/followup" },
      { label: "Urgent Recheck", path: "/refraction/notifications/urgent" },
    ],
  },
  {
    label: "History",
    path: "/refraction/history",
    children: [
      { label: "Previous Refractions", path: "/refraction/history/previous" },
      { label: "Old Prescriptions", path: "/refraction/history/old" },
      { label: "Lens Usage History", path: "/refraction/history/usage" },
      { label: "Patient Remarks", path: "/refraction/history/remarks" },
    ],
  },
  {
    label: "Settings",
    path: "/refraction/settings",
    children: [
      { label: "User Profile", path: "/refraction/settings/profile" },
      { label: "Refraction Preferences", path: "/refraction/settings/preferences" },
      { label: "Device Integration", path: "/refraction/settings/devices" },
      { label: "Printer Settings", path: "/refraction/settings/printer" },
    ],
  },
  { label: "Logout", path: "/logout" },
];


// ───────────────────────────────────────────
// DOCTOR
// ───────────────────────────────────────────

export const DOCTOR_TABS: TabItem[] = [
  {
    label: "My Patients",
    path: "/doctor/my-patients",
    children: [
      { label: "My Patient", path: "/doctor/my-patients/mine" },
      { label: "Today's List", path: "/doctor/my-patients/today" },
      { label: "Follow-up", path: "/doctor/my-patients/followup" },
    ],
  },
  {
    label: "Examination",
    path: "/doctor/examination",
  },
  {
    label: "Checkout Patient",
    path: "/doctor/checkout",
    children: [
      { label: "Glasses", path: "/doctor/checkout/glasses" },
      { label: "Medications", path: "/doctor/checkout/medications" },
      { label: "Drops", path: "/doctor/checkout/drops" },
      { label: "Print Rx", path: "/doctor/checkout/print" },
    ],
  },
  {
    label: "Discussion",
    path: "/doctor/discussion",
    children: [
      { label: "Voice Notes", path: "/doctor/discussion/voice" },
      { label: "Dictate", path: "/doctor/discussion/dictate" },
      { label: "Share Case", path: "/doctor/discussion/share" },
    ],
  },
  {
    label: "Notifications",
    path: "/doctor/notifications",
    children: [
      { label: "Lab Results", path: "/doctor/notifications/labs" },
      { label: "Patient Arrived", path: "/doctor/notifications/arrived" },
      { label: "Urgent", path: "/doctor/notifications/urgent" },
    ],
  },
  {
    label: "Settings",
    path: "/doctor/settings",
    children: [
      { label: "Signature", path: "/doctor/settings/signature" },
      { label: "Favorites", path: "/doctor/settings/favorites" },
      { label: "Profile", path: "/doctor/settings/profile" },
    ],
  },
  { label: "Logout", path: "/logout" },
];


// ───────────────────────────────────────────
// DIAGNOSIS / SPECIALIST
// ───────────────────────────────────────────

export const DIAGNOSIS_TABS: TabItem[] = [
  {
    label: "Cases",
    path: "/diagnosis/cases",
    children: [
      { label: "Pending Review", path: "/diagnosis/cases/pending" },
      { label: "In Progress", path: "/diagnosis/cases/in-progress" },
      { label: "Completed", path: "/diagnosis/cases/completed" },
      { label: "Flagged", path: "/diagnosis/cases/flagged" },
    ],
  },
  {
    label: "Diagnosis",
    path: "/diagnosis/list",
    children: [
      { label: "Cataract", path: "/diagnosis/list/cataract" },
      { label: "Glaucoma", path: "/diagnosis/list/glaucoma" },
      { label: "DR", path: "/diagnosis/list/dr" },
      { label: "AMD", path: "/diagnosis/list/amd" },
      { label: "Cornea", path: "/diagnosis/list/cornea" },
      { label: "Pediatric", path: "/diagnosis/list/pediatric" },
      { label: "Neuro", path: "/diagnosis/list/neuro" },
    ],
  },
  {
    label: "Investigations",
    path: "/diagnosis/investigations",
    children: [
      { label: "OCT", path: "/diagnosis/investigations/oct" },
      { label: "VF", path: "/diagnosis/investigations/vf" },
      { label: "Corneal Topo", path: "/diagnosis/investigations/topo" },
      { label: "Blood Tests", path: "/diagnosis/investigations/blood" },
      { label: "Reports", path: "/diagnosis/investigations/reports" },
    ],
  },
  {
    label: "Management",
    path: "/diagnosis/management",
    children: [
      { label: "Medical", path: "/diagnosis/management/medical" },
      { label: "Laser", path: "/diagnosis/management/laser" },
      { label: "Surgery", path: "/diagnosis/management/surgery" },
      { label: "Injection", path: "/diagnosis/management/injection" },
      { label: "Observation", path: "/diagnosis/management/observation" },
    ],
  },
  {
    label: "OR List",
    path: "/diagnosis/or",
    children: [
      { label: "Today's OR", path: "/diagnosis/or/today" },
      { label: "My Cases", path: "/diagnosis/or/my-cases" },
      { label: "GA List", path: "/diagnosis/or/ga" },
      { label: "Schedule", path: "/diagnosis/or/schedule" },
    ],
  },
  {
    label: "Research",
    path: "/diagnosis/research",
    children: [
      { label: "Power BI", path: "/diagnosis/research/powerbi" },
      { label: "Patient Search", path: "/diagnosis/research/search" },
      { label: "Cross Info", path: "/diagnosis/research/cross-info" },
      { label: "Export", path: "/diagnosis/research/export" },
    ],
  },
  {
    label: "Referrals",
    path: "/diagnosis/referrals",
    children: [
      { label: "To Surgeon", path: "/diagnosis/referrals/surgeon" },
      { label: "From Clinic", path: "/diagnosis/referrals/clinic" },
      { label: "Telemedicine", path: "/diagnosis/referrals/telemedicine" },
    ],
  },
  {
    label: "Templates",
    path: "/diagnosis/templates",
    children: [
      { label: "Consent", path: "/diagnosis/templates/consent" },
      { label: "Discharge", path: "/diagnosis/templates/discharge" },
      { label: "Referral Letter", path: "/diagnosis/templates/referral" },
    ],
  },
  {
    label: "Settings",
    path: "/diagnosis/settings",
    children: [
      { label: "Profile", path: "/diagnosis/settings/profile" },
      { label: "Dashboard", path: "/diagnosis/settings/dashboard" },
      { label: "Alerts", path: "/diagnosis/settings/alerts" },
    ],
  },
  { label: "Logout", path: "/logout" },
];


// ───────────────────────────────────────────
// DEFAULT TABS
// ───────────────────────────────────────────

export const DEFAULT_TABS: TabItem[] = [
  {
    label: "Patients",
    path: "/default/patients",
    children: [
      { label: "All Patients", path: "/default/patients/all" },
      { label: "New Patient", path: "/default/patients/new" },
      { label: "Follow-up", path: "/default/patients/followup" },
    ],
  },
  {
    label: "Examinations",
    path: "/default/exams",
    children: [
      { label: "Visual Acuity", path: "/default/exams/acuity" },
      { label: "Refraction", path: "/default/exams/refraction" },
      { label: "Fundus", path: "/default/exams/fundus" },
      { label: "Reports", path: "/default/exams/reports" },
    ],
  },
  {
    label: "Referrals",
    path: "/default/referrals",
    children: [
      { label: "To Specialist", path: "/default/referrals/specialist" },
      { label: "Vision Guardian", path: "/default/referrals/guardian" },
      { label: "Teleophthalmology", path: "/default/referrals/teleophth" },
    ],
  },
  {
    label: "Checkedout Patients",
    path: "/default/checkedout",
    children: [
      { label: "Today", path: "/default/checkedout/today" },
      { label: "This Week", path: "/default/checkedout/week" },
    ],
  },
  {
    label: "Notifications",
    path: "/default/notifications",
    children: [
      { label: "Critical", path: "/default/notifications/critical" },
      { label: "Reminders", path: "/default/notifications/reminders" },
    ],
  },
  {
    label: "Discussion",
    path: "/default/discussion",
    children: [
      { label: "Voice Notes", path: "/default/discussion/voice" },
      { label: "Dictations", path: "/default/discussion/dictations" },
    ],
  },
  {
    label: "Settings",
    path: "/default/settings",
    children: [
      { label: "Profile", path: "/default/settings/profile" },
      { label: "Preferences", path: "/default/settings/preferences" },
    ],
  },
  { label: "Logout", path: "/logout" },
];
