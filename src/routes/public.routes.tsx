import Home from '../pages/public/Home';
import Clinics from '../pages/Clinics';
import Administration from '../pages/Administration';

export const publicRoutes = {
  home: { path: '/', element: <Home /> },
  clinics: { path: '/clinics', element: <Clinics /> },
  administration: { path: '/administration', element: <Administration /> },
};
