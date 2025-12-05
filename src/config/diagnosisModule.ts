import OPD from '../assets/icons/Diagnosis.svg';

export const DIAGNOSIS_MODULES = [
  {
    title: 'Laboratory',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/diagnosis/today-cases',
  },
  {
    title: 'Radiology',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/diagnosis/today-cases',
  },
] as const;
