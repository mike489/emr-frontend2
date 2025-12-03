import PrivateRoute from './PrivateRoute';
import type { RouteCollection } from './types';
import Management from '../pages/management/management';
import Createusers from '../pages/management/Createusers';
import Financialreport from '../pages/management/Financialreport';
import SystemadminLists from '../layouts/Systemadminlist';
import Userreport from '../pages/management/Userreport';
import Disscussion from '../pages/management/Disscussion';



export const managementRoutes: RouteCollection = {
  systemadminLists: {
    path: '/systemadmin-lists',
    element: (
      <PrivateRoute>
        <SystemadminLists />
      </PrivateRoute>
    ),
  },  
  Managment: {
    path: '/managment',
    element: (
      <PrivateRoute>
        <Management />
      </PrivateRoute>
    ),
  },
  Createuser: {
    path: '/managment/Createusers',
    element: (
      <PrivateRoute>
        <Createusers />
      </PrivateRoute>
    ),
  },

  Financialreport: {
    path: '/managment/Financialreport',
    element: (
      <PrivateRoute>
        <Financialreport />
      </PrivateRoute>
    ),
  },
  Userreport: {
    path: '/managment/Userreport',
    element: (
      <PrivateRoute>
        <Userreport />
      </PrivateRoute>
    ),
  },
  Disscussion: {
    path: '/managment/Disscussion',
    element: (
      <PrivateRoute>
        <Disscussion />
      </PrivateRoute>
    ),
  },
};
