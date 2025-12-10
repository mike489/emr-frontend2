import Retina from '../assets/icons/Retina.svg';
import OPD from '../assets/icons/OPD.svg';

import Glacoma from '../assets/icons/Glacoma.svg';
import Periatic from '../assets/icons/Pediatrics-Ophtamology.svg';

export const DOCTOR_MODULES = [
  {
    title: 'RETINA',
    icon: Retina,
    permission: 'read_adnexa_examination',
    route: '/retina/patients-list',
  },
  {
    title: 'GLAUCOMA',
    icon: Glacoma,
    permission: 'read_adnexa_examination',
    route: '/glaucoma',
  },
  // { title: 'UVEA', icon: EyeOff, permission: 'read_adnexa_examination', route: '/uvea' },
  {
    title: 'PEDIATRIC OPHTHALMOLOGY',
    icon: Periatic,
    permission: 'read_adnexa_examination',
    route: '/pediatric',
  },

  { title: 'OPD 1', icon: OPD, permission: 'read_adnexa_examination', route: '/opd-one' },
  {
    title: 'OPD 2',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/opd-two',
  },
  {
    title: 'OPD 3',
    icon: OPD,
    permission: 'read_adnexa_examination',
    route: '/opd-three',
  },
] as const;
