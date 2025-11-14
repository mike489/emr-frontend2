

import Front from '../assets/icons/Front-desk.svg';
import Triag from '../assets/icons/Triage.svg';

 import Otham from '../assets/icons/Ophtamologist.svg';
 import Optical from '../assets/icons/Opticals.svg';
import Pharmacy from '../assets/icons/Pharmacy.svg';

import InPatient from '../assets/icons/In-patient.svg';
import Ophthalmic from '../assets/icons/Ophthalmic.svg';
import  Diagnosis from '../assets/icons/Diagnosis.svg';




export const CLINIC_MODULES = [
  { title: 'FRONT DESK', Icon: Front, entryRoute: '/front-desk' },
  { title: 'Triage', Icon: Triag, entryRoute: '/triage' },
  { title: 'Refraction', Icon: Ophthalmic, entryRoute: '/refraction' },
  { title: 'OPHTHALMOLOGY', Icon: Otham, entryRoute: '/clinic-lists' },
  { title: 'Diagnosis', Icon: Diagnosis, entryRoute: '/diagnosis' },
  // { title: 'OPHTHALMIC', Icon: Ophthalmic, entryRoute: '/ophthalmic' },
  { title: 'OPTICALS', Icon: Optical, entryRoute: '/opticals' },
  { title: 'PHARMACY', Icon: Pharmacy, entryRoute: '/pharmacy' },

  // { title: 'Retina', Icon: Retina, entryRoute: '/retina' },
  // { title: 'Pediatrics Ophthalmology', Icon: Pediatrics, entryRoute: '/pediatrics-ophthalmology' },
  { title: 'IN PATIENT', Icon: InPatient, entryRoute: '/inpatient' },
  // { title: 'CLINICAL AUDIT', Icon: ClipboardList, entryRoute: '/audit' },
  // { title: 'VISION TECHNICIAN', Icon: Eye, entryRoute: '/vision-tech' },
  // { title: 'VISION GUARDIAN', Icon: Users, entryRoute: '/vision-guardian' },
  // { title: 'Glacoma', Icon: Glacoma, entryRoute: '/glacoma' },
  // { title: 'UVEA', Icon: UVEA, entryRoute: '/uvea' },
] as const;

export type ClinicModule = (typeof CLINIC_MODULES)[number];
