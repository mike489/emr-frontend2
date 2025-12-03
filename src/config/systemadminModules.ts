import OPD from '../assets/icons/Triage.svg';

export const SYSTEMADMIN_MODULES = [
  {
    title: 'User Management',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/managment',
  },
  {
    title: 'Roles and Permissions',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/roles-permissions',
  },
  
] as const;

