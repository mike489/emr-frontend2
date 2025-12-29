import Retina from '../assets/icons/Retina.svg';
import OPD from '../assets/icons/OPD.svg';

import Glacoma from '../assets/icons/Glacoma.svg';
import Periatic from '../assets/icons/Pediatrics-Ophtamology.svg';

export const DOCTOR_MODULES = [
  {
    title: 'RETINA',
    icon: Retina,
    permission: 'retina_access',
    route: '/retina/patients-list',
  },
  {
    title: 'GLAUCOMA',
    icon: Glacoma,
    permission: 'glaucoma_access',
    route: '/glaucoma',
  },

  {
    title: 'PEDIATRIC OPHTHALMOLOGY',
    icon: Periatic,
    permission: 'pediatric_access',
    route: '/pediatric',
  },

  { title: 'OPD 1', icon: OPD, permission: 'opd_one_access', route: '/opd-one' },
  {
    title: 'OPD 2',
    icon: OPD,
    permission: 'opd_two_access',
    route: '/opd-two',
  },
  {
    title: 'OPD 3',
    icon: OPD,
    permission: 'opd_three_access',
    route: '/opd-three',
  },
] as const;
