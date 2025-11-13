


export interface TabItem {
  label: string;
  children?: string[];
}

// ──────────────────────────────────────────────────────────────
//  FRONT DESK – Patient Flow & Admin
// ──────────────────────────────────────────────────────────────


export const FRONT_DESK_TABS: TabItem[] = [
  {
    label: "Today's Patients",
    children: [
      "Add New Patient",
      "Add Emergency Patient",
      "Attach Documents",
      "Patient Search",
    ],
  },
  {
    label: "Patient Flow",
    children: [
      "Time Spent in Hospital",
      "Patient Search",
      "Patients Without Appointment",
      "Upload ID",
    ],
  },
  {
    label: "Appointments",
    children: [
      "Book Appointment",
      "Reschedule Appointment",
      "Cancel Appointment",
      "View Calendar",
      "Check-In / Check-Out",
    ],
  },
  {
    label: "Patient Data",
    children: [
      "Medical Records",
      "Lab Results",
      "Prescriptions",
      "Insurance Details",
      "Emergency Contacts",
    ],
  },
  {
    label: "Notifications",
    children: [
      "Appointment Reminders",
      "Follow-Up Alerts",
      "System Updates",
      "Messages from Doctors",
    ],
  },
  {
    label: "Patient Checkout",
    children: [
      "Generate Bill",
      "Process Payment",
      "Print Receipt",
      "Discharge Summary",
      "Export CSV",
    ],
  },
  {
    label: "Settings",
    children: [
      "User Profile",
      "Printer Settings",
      "Department Preferences",
      "Change Password",
      "Notification Settings",
    ],
  },
  {
    label: "Logout",
  },
];

// ──────────────────────────────────────────────────────────────
//  TRIAGE – Quick Assessment
// ──────────────────────────────────────────────────────────────

export const TRIAGE_TABS: TabItem[] = [
  {
    label: "Patients",
    children: [
      "Waiting Queue",
      "Under Assessment",
      "Completed Assessments",
      "Escalated Cases",
    ],
  },
  {
    label: "Vital Signs",
    children: [
      "Blood Pressure",
      "Heart Rate",
      "Temperature",
      "Oxygen Saturation (SpO₂)",
      "Height & Weight",
    ],
  },
  {
    label: "Chief Complaint",
    children: [
      "Eye Pain",
      "Blurred Vision",
      "Redness / Discharge",
      "Headache",
      "Injury or Trauma",
    ],
  },
  {
    label: "Priority",
    children: [
      "Emergency",
      "Urgent",
      "Routine",
      "Follow-up / Revisit",
    ],
  },
  {
    label: "Assign To",
    children: [
      "Dr. Ahmed",
      "Dr. Sarah",
      "Dr. Khan",
      "On-Call Specialist",
    ],
  },
  {
    label: "Notifications",
    children: [
      "Critical Vital Alerts",
      "Pending Review",
      "Doctor Ready",
      "Follow-up Due",
    ],
  },
  {
    label: "History",
    children: [
      "Previous Visits",
      "Allergies",
      "Current Medications",
      "Family History",
      "Surgical History",
    ],
  },
  {
    label: "Settings",
    children: [
      "User Profile",
      "Quick Notes Templates",
      "Triage Preferences",
      "Display Options",
    ],
  },
  {
    label: "Logout",
  },
];



export const REFRACTION_TABS: TabItem[] = [
  {
    label: "Patients",
    children: [
      "Waiting Queue",
      "In Progress",
      "Completed Refractions",
      "Referred Cases",
    ],
  },
  {
    label: "Vision Assessment",
    children: [
      "Visual Acuity",
      "Near Vision",
      "Pinhole Test",
      "Contrast Sensitivity",
      "Color Vision",
    ],
  },
  {
    label: "Objective Refraction",
    children: [
      "Auto Refractometer",
      "Retinoscopy",
      "Keratometry",
      "Cycloplegic Refraction",
    ],
  },
  {
    label: "Subjective Refraction",
    children: [
      "Trial Lens Test",
      "Refinement",
      "Final Prescription",
      "Binocular Balance",
    ],
  },
  {
    label: "Lens Prescription",
    children: [
      "Distance Glasses",
      "Reading Glasses",
      "Bifocal / Progressive",
      "Contact Lens Trial",
      "Prescription Print",
    ],
  },
  {
    label: "Patient Counseling",
    children: [
      "Frame Selection",
      "Lens Type Advice",
      "Contact Lens Care",
      "Visual Hygiene Tips",
    ],
  },
  {
    label: "Notifications",
    children: [
      "Pending Refractions",
      "Doctor Ready",
      "Follow-up Due",
      "Urgent Recheck",
    ],
  },
  {
    label: "History",
    children: [
      "Previous Refractions",
      "Old Prescriptions",
      "Lens Usage History",
      "Patient Remarks",
    ],
  },
  {
    label: "Settings",
    children: [
      "User Profile",
      "Refraction Preferences",
      "Device Integration",
      "Printer Settings",
    ],
  },
  {
    label: "Logout",
  },
];

// ──────────────────────────────────────────────────────────────
//  DOCTOR – Full Examination & Diagnosis
// ──────────────────────────────────────────────────────────────
export const DOCTOR_TABS: TabItem[] = [
  {
    label: "My Patients",
    children: ["My Patient","Today's List", "Follow-up"],
  },
  {
    label: "Examination",
    // children: [
    //   "Visual Acuity",
    //   "Refraction",
    //   "Slit Lamp",
    //   "Fundus",
    //   "IOP",
    //   "Diagnosis",
    // ],
  },
  {
    label: "Checkout Patient",
    children: ["Glasses", "Medications", "Drops", "Print Rx"],
  },
  
  
  {
    label: "Discussion",
    children: ["Voice Notes", "Dictate", "Share Case"],
  },
  {
    label: "Notifications",
    children: ["Lab Results", "Patient Arrived", "Urgent"],
  },
  {
    label: "Settings",
    children: ["Signature", "Favorites", "Profile"],
  },
  { label: "Logout" },
];

// ──────────────────────────────────────────────────────────────
//  DIAGNOSIS / SPECIALIST – Advanced Care
// ──────────────────────────────────────────────────────────────
export const DIAGNOSIS_TABS: TabItem[] = [
  {
    label: "Cases",
    children: ["Pending Review", "In Progress", "Completed", "Flagged"],
  },
  {
    label: "Diagnosis",
    children: [
      "Cataract",
      "Glaucoma",
      "DR",
      "AMD",
      "Cornea",
      "Pediatric",
      "Neuro",
    ],
  },
  {
    label: "Investigations",
    children: ["OCT", "VF", "Corneal Topo", "Blood Tests", "Reports"],
  },
  {
    label: "Management",
    children: ["Medical", "Laser", "Surgery", "Injection", "Observation"],
  },
  {
    label: "OR List",
    children: ["Today's OR", "My Cases", "GA List", "Schedule"],
  },
  {
    label: "Research",
    children: ["Power BI", "Patient Search", "Cross Info", "Export"],
  },
  {
    label: "Referrals",
    children: ["To Surgeon", "From Clinic", "Telemedicine"],
  },
  {
    label: "Templates",
    children: ["Consent", "Discharge", "Referral Letter"],
  },
  {
    label: "Settings",
    children: ["Profile", "Dashboard", "Alerts"],
  },
  { label: "Logout" },
];

// ──────────────────────────────────────────────────────────────
//  DEFAULT / MIXED (Fallback)
// ──────────────────────────────────────────────────────────────
export const DEFAULT_TABS: TabItem[] = [
  { label: "Patients", children: ["All Patients", "New Patient", "Follow-up"] },
  {
    label: "Examinations",
    children: ["Visual Acuity", "Refraction", "Fundus", "Reports"],
  },
  {
    label: "Referrals",
    children: ["To Specialist", "Vision Guardian", "Teleophthalmology"],
  },
  { label: "Checkedout Patients", children: ["Today", "This Week"] },
  { label: "Notifications", children: ["Critical", "Reminders"] },
  { label: "Discussion", children: ["Voice Notes", "Dictations"] },
  { label: "Settings", children: ["Profile", "Preferences"] },
  { label: "Logout" },
];