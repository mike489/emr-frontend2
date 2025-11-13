import {
  Hospital,
  Users,
  User,
  FlaskConical,
  Pill,
  Glasses,
  Bed,
  Beaker,
  ClipboardList,
  Eye,
  Salad,
  Stethoscope,
  ClipboardPlus,
} from 'lucide-react';

export const CLINIC_MODULES = [
  { title: 'FRONT DESK', Icon: Users, entryRoute: '/front-desk' },
  { title: 'Triage', Icon: ClipboardPlus, entryRoute: '/triage' },
  { title: 'Refraction', Icon: ClipboardPlus, entryRoute: '/refraction' },
  { title: 'OPHTHALMOLOGY', Icon: Hospital, entryRoute: '/clinic-lists' },
  { title: 'COUNSELOR', Icon: User, entryRoute: '/counselor' },
  { title: 'DIAGNOSTIC', Icon: FlaskConical, entryRoute: '/diagnostic' },
  { title: 'PHARMACY', Icon: Pill, entryRoute: '/pharmacy' },
  { title: 'OPTICALS', Icon: Glasses, entryRoute: '/opticals' },
  { title: 'IN PATIENT', Icon: Bed, entryRoute: '/inpatient' },
  { title: 'CLINICAL RESEARCH', Icon: Beaker, entryRoute: '/research' },
  { title: 'CLINICAL AUDIT', Icon: ClipboardList, entryRoute: '/audit' },
  { title: 'VISION TECHNICIAN', Icon: Eye, entryRoute: '/vision-tech' },
  { title: 'VISION GUARDIAN', Icon: Users, entryRoute: '/vision-guardian' },
  { title: 'NUTRITION & DIETETICS', Icon: Salad, entryRoute: '/nutrition' },
  { title: 'ANAESTHETIST', Icon: Stethoscope, entryRoute: '/anaesthetist' },
] as const;

export type ClinicModule = (typeof CLINIC_MODULES)[number];
