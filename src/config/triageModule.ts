import OPD from '../assets/icons/Triage.svg';

export const TRIAGE_MODULES = [
  {
    title: 'Triage 1',
    icon: OPD,
    permission: 'triage_one_access',
    route: '/triage-one/patients-list',
  },
  {
    title: 'Triage 2',
    icon: OPD,
    permission: 'triage_two_access',
    route: '/triage-two/patients-list',
  },
  {
    title: 'Triage 3',
    icon: OPD,
    permission: 'triage_three_access',
    route: '/triage-three/patients-list',
  },
] as const;
