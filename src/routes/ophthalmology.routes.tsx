import Retina from '../pages/ophthalmology/retina/retina';
import Glaucoma from '../pages/ophthalmology/glaucoma/glaucoma';
import Pediatric from '../pages/ophthalmology/pediatric/pediatric';
import Opd1 from '../pages/ophthalmology/opd1/opd1';
import Opd2 from '../pages/ophthalmology/opd2/opd2';
import Opd3 from '../pages/ophthalmology/opd3/opd3';
import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';

export const ophthalmologyRoutes: RouteCollection = {
  retina: {
    path: '/retina',
    element: (
      <PrivateRoute>
        <Retina />
      </PrivateRoute>
    ),
  },
  glaucoma: {
    path: '/glaucoma',
    element: (
      <PrivateRoute>
        <Glaucoma />
      </PrivateRoute>
    ),
  },
  pediatric: {
    path: '/pediatric',
    element: (
      <PrivateRoute>
        <Pediatric />
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
  opd2: {
    path: '/opd-two',
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
};