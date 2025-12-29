import Front from '../assets/icons/Front-desk.svg';
import Triag from '../assets/icons/Triage.svg';

import Otham from '../assets/icons/Ophtamologist.svg';
import Optical from '../assets/icons/Opticals.svg';
import Pharmacy from '../assets/icons/Pharmacy.svg';

import InPatient from '../assets/icons/In-patient.svg';
import Ophthalmic from '../assets/icons/Ophthalmic.svg';
import Diagnosis from '../assets/icons/Diagnosis.svg';

export const CLINIC_MODULES = [
  { title: 'FRONT DESK', Icon: Front, entryRoute: '/front-desk', permission: 'front_desk_access' },
  { title: 'Triage', Icon: Triag, entryRoute: '/triage-lists', permission: 'front_desk_access' },
  {
    title: 'Refraction',
    Icon: Ophthalmic,
    entryRoute: '/refraction/patients-list',
    permission: 'refraction_access',
  },
  {
    title: 'OPHTHALMOLOGY',
    Icon: Otham,
    entryRoute: '/clinic-lists',
    permission: 'front_desk_access',
  },
  {
    title: 'Diagnosis',
    Icon: Diagnosis,
    entryRoute: '/diagnosis/today-cases',
    permission: 'diagnostic_access',
  },
  {
    title: 'OPTICALS',
    Icon: Optical,
    entryRoute: '/optical/today-cases',
    permission: 'optical_access',
  },
  {
    title: 'PHARMACY',
    Icon: Pharmacy,
    entryRoute: '/pharmacy/patients',
    permission: 'pharmacy_access',
  },

  {
    title: 'IN PATIENT',
    Icon: InPatient,
    entryRoute: '/in-patient/in-patients',
    permission: 'inpatient_access',
  },
  {
    title: 'OR',
    Icon: InPatient,
    entryRoute: '/or-list/today-cases',
    permission: 'surgery_access',
  },
] as const;

export type ClinicModule = (typeof CLINIC_MODULES)[number];
