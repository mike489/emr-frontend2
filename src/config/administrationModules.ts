// import Front from '../assets/icons/Front-desk.svg';
import Triag from '../assets/icons/Triage.svg';

import Otham from '../assets/icons/Ophtamologist.svg';
import Ophthalmic from '../assets/icons/Ophthalmic.svg';
// import Diagnosis from '../assets/icons/Diagnosis.svg';

export const ADMIN_MODULES = [
  // { title: 'USER MANAGMENT', Icon: Front, entryRoute: '/managment' },
  { title: 'SYSTEM ADMIN', Icon: Triag, entryRoute: '/systemadmin-lists' },
  { title: 'CHIEF ADMIN', Icon: Ophthalmic, entryRoute: '/chiefadmin-lists' },
  { title: 'CHIEF FINANCE', Icon: Otham, entryRoute: '/chieffinance' },
  //   { title: 'REPORT', Icon: Diagnosis, entryRoute: '/report' },
] as const;

export type ClinicModule = (typeof ADMIN_MODULES)[number];
