import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
// import Management from '../pages/management/management';
// import Createusers from '../pages/management/Createusers';
// import Financialreport from '../pages/management/Financialreport';
import ChiefadminLists from '../layouts/Chiefadminlist';
// import Userreport from '../pages/management/Userreport';
import Generalmanager from '../pages/chiefadmin/Generalmanager';
import Clinicaldirector from '../pages/chiefadmin/Clinicaldirector';

export const chiefadminRoutes: RouteCollection = {
  chiefadminLists: {
    path: '/chiefadmin-lists',
    element: (
      <PrivateRoute>
        <ChiefadminLists />
      </PrivateRoute>
    ),
  },
  
  Generalmanager: {
    path: '/chiefadmin/Generalmanager',
    element: (
      <PrivateRoute>
        <Generalmanager />
      </PrivateRoute>
    ),
  },
  Clinicaldirector: {
    path: '/chiefadmin/Clinicaldirector',
    element: (
      <PrivateRoute>
        <Clinicaldirector />
      </PrivateRoute>
    ),
  },

//   Financialreport: {
//     path: '/managment/Financialreport',
//     element: (
//       <PrivateRoute>
//         <Financialreport />
//       </PrivateRoute>
//     ),
//   },
//   Userreport: {
//     path: '/managment/Userreport',
//     element: (
//       <PrivateRoute>
//         <Userreport />
//       </PrivateRoute>
//     ),
//   },
};
