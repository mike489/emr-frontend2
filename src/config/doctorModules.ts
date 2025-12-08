import Retina from '../assets/icons/Retina.svg';
import OPD from '../assets/icons/OPD.svg';

import Glacoma from '../assets/icons/Glacoma.svg';
import Periatic from '../assets/icons/Pediatrics-Ophtamology.svg';

export const DOCTOR_MODULES = [
  // {
  //   title: 'Dashboard',
  //   icon: LayoutDashboard,
  //   permission: 'read_adnexa_examination',
  //   route: '/dashboard',
  // },
  // {
  //   title: 'Examinations',
  //   icon: BookCheck,
  //   permission: 'read_adnexa_examination',
  //   route: '/examinations',
  // },
  // {
  //   title: 'My Patients',
  //   icon: Activity,
  //   permission: 'read_adnexa_examination',
  //   route: '/glaucoma',
  // },
  // {
  //   title: 'Orders',
  //   icon: Microscope,
  //   permission: 'read_adnexa_examination',
  //   route: '/oculoplasty',
  // },
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
  // {
  //   title: 'COMPREHENSIVE OPHTHALMOLOGY',
  //   icon: Layers,
  //   permission: 'read_adnexa_examination',
  //   route: '/comprehensive',
  // },
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
  // {
  //   title: 'CATARACT',
  //   icon: FlaskConical,
  //   permission: 'read_adnexa_examination',
  //   route: '/cataract',
  // },
  // {
  //   title: 'EMERGENCY',
  //   icon: ShieldAlert,
  //   permission: 'read_adnexa_examination',
  //   route: '/emergency',
  // },
  // {
  //   title: 'OCULAR GENETICS',
  //   icon: Dna,
  //   permission: 'read_adnexa_examination',
  //   route: '/genetics',
  // },
  // {
  //   title: 'NEURO-OPHTHALMOLOGY',
  //   icon: Brain,
  //   permission: 'read_adnexa_examination',
  //   route: '/neuro',
  // },
  // {
  //   title: 'OCULAR PROSTHESIS',
  //   icon: Settings2,
  //   permission: 'read_adnexa_examination',
  //   route: '/prosthesis',
  // },
  // {
  //   title: 'ORTHOPTICS',
  //   icon: Users,
  //   permission: 'read_adnexa_examination',
  //   route: '/orthoptics',
  // },
  // {
  //   title: 'FELLOW CLINIC',
  //   icon: Microscope,
  //   permission: 'read_adnexa_examination',
  //   route: '/fellow',
  // },
  // {
  //   title: 'CALCLINIC FOR UNKNOWN',
  //   icon: FlaskConical,
  //   permission: 'read_adnexa_examination',
  //   route: '/calc-clinic',
  // },
  // {
  //   title: 'FIRST VISION',
  //   icon: Eye,
  //   permission: 'read_adnexa_examination',
  //   route: '/first-vision',
  // },
] as const;
