// import Retina from '../pages/ophthalmology/retina/retina';
// import Glaucoma from '../pages/ophthalmology/glaucoma/glaucoma';
// import Pediatric from '../pages/ophthalmology/pediatric/pediatric';
import Opd1 from '../pages/ophthalmology/opd1/opd1';
import Opd2 from '../pages/ophthalmology/opd2/opd2';
import Opd3 from '../pages/ophthalmology/opd3/opd3';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
// import PatientDetailGlaucoma from '../pages/ophthalmology/glaucoma/PatientDetailGlaucoma';
import PatientDetailPediatric from '../pages/ophthalmology/pediatric/PatientDetailPediatric';
import PatientDetailOPD1 from '../pages/ophthalmology/opd1/PatientDetailOPD1';
import PatientDetailOPD3 from '../pages/ophthalmology/opd3/PatientDetailOPD3';
import ClinicLists from '../layouts/ClinicLists';
import OpthListRoute from './OpthListRoute';
import FollowUpList from '../features/follow_up/FollowUpList';

export const ophthalmologyRoutes: RouteCollection = {
  eyeSmart: {
    path: '/clinic-lists',

    element: (
      <OpthListRoute>
        <ClinicLists />,
      </OpthListRoute>
    ),
  },
  // retina: {
  //   path: '/retina',
  //   element: (
  //     <PrivateRoute>
  //       <Retina />
  //     </PrivateRoute>
  //   ),
  // },
  // glaucoma: {
  //   path: '/glaucoma',
  //   element: (
  //     <PrivateRoute>
  //       <Glaucoma />
  //     </PrivateRoute>
  //   ),
  // },
  // glaucomaPatientDetail: {
  //   path: '/glaucoma/patients-detail',
  //   element: (
  //     <PrivateRoute>
  //       <PatientDetailGlaucoma />
  //     </PrivateRoute>
  //   ),
  // },
  // pediatric: {
  //   path: '/pediatric',
  //   element: (
  //     <PrivateRoute>
  //       <Pediatric />
  //     </PrivateRoute>
  //   ),
  // },
  pediatricPatientDetail: {
    path: '/pediatric/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailPediatric />
      </PrivateRoute>
    ),
  },
  opd1: {
    path: '/opd-one',
    element: (
      <PrivateRoute>
        <Opd1 />
      </PrivateRoute>
    ),
  },
  opd1PatientDetail: {
    path: '/opd-one/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailOPD1 />
      </PrivateRoute>
    ),
  },
  followUpOpd1: {
    path: '/opd-one/follow-ups',
    element: (
      <PrivateRoute>
        <FollowUpList />
      </PrivateRoute>
    ),
  },
  opd2: {
    path: '/opd-two',
    element: (
      <PrivateRoute>
        <Opd2 />
      </PrivateRoute>
    ),
  },
  opd2PatientDetail: {
    path: '/opd-two/patients-detail',
    element: (
      <PrivateRoute>
        <Opd2 />
      </PrivateRoute>
    ),
  },
  opd3: {
    path: '/opd-three',
    element: (
      <PrivateRoute>
        <Opd3 />
      </PrivateRoute>
    ),
  },
  opd3PatientDetail: {
    path: '/opd-three/patients-detail',
    element: (
      <PrivateRoute>
        <PatientDetailOPD3 />
      </PrivateRoute>
    ),
  },
  followUpOpd3: {
    path: '/opd-three/follow-ups',
    element: (
      <PrivateRoute>
        <FollowUpList />
      </PrivateRoute>
    ),
  },
};
