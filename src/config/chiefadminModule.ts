import OPD from '../assets/icons/Triage.svg';

export const CHIEFADMIN_MODULES = [
  {
    title: 'General Mananger',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/chiefadmin/Generalmanager',
  },
  {
    title: 'Clinial Director',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/chiefadmin/Clinicaldirector',
  },
  
] as const;
