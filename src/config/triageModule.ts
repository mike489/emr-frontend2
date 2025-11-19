import OPD from '../assets/icons/Triage.svg';


export const TRIAGE_MODULES = [

  { title: 'Triage 1', icon: OPD, permission: 'read_adnexa_examination', route: '/triage-one/patients-list' },
  {
    title: 'Triage 2',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/triage-two/patients-list',
  },
  {
    title: 'Triage 3',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/triage-three/patients-list',
  },

] as const;
