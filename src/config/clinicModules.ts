import Front from '../assets/icons/Front-desk.svg';
import Triag from '../assets/icons/Triage.svg';

import Otham from '../assets/icons/Ophtamologist.svg';
import Optical from '../assets/icons/Opticals.svg';
import Pharmacy from '../assets/icons/Pharmacy.svg';

import InPatient from '../assets/icons/In-patient.svg';
import Ophthalmic from '../assets/icons/Ophthalmic.svg';
import Diagnosis from '../assets/icons/Diagnosis.svg';

export const CLINIC_MODULES = [
  { title: 'FRONT DESK', Icon: Front, entryRoute: '/front-desk' },
  { title: 'Triage', Icon: Triag, entryRoute: '/triage-lists' },
  { title: 'Refraction', Icon: Ophthalmic, entryRoute: '/refraction/patients-list' },
  { title: 'OPHTHALMOLOGY', Icon: Otham, entryRoute: '/clinic-lists' },
  { title: 'Diagnosis', Icon: Diagnosis, entryRoute: '/diagnosis/today-cases' },
  { title: 'OPTICALS', Icon: Optical, entryRoute: '/optical' },
  { title: 'PHARMACY', Icon: Pharmacy, entryRoute: '/pharmacy' },

  { title: 'IN PATIENT', Icon: InPatient, entryRoute: '/in-patient' },
  { title: 'OR', Icon: InPatient, entryRoute: '/or-list/today-cases' },
] as const;

export type ClinicModule = (typeof CLINIC_MODULES)[number];
