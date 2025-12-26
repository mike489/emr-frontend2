import type { ReactNode } from 'react';

export interface RouteConfig {
  path: string;
  element: ReactNode;
}

export interface RouteCollection {
  [key: string]: RouteConfig;
}

export interface RoutesStructure {
  public: RouteCollection;
  auth: RouteCollection;
  protected: RouteCollection;
  notFound: RouteConfig;
}

export type ClinicPermission =
  | 'front_desk_access'
  | 'triage_one_access'
  | 'triage_two_access'
  | 'triage_three_access'
  | 'refraction_access'
  | 'retina_access'
  | 'diagnostic_access'
  | 'optical_access'
  | 'pharmacy_access'
  | 'inpatient_access'
  | 'surgery_access';

export interface ClinicModule {
  title: string;
  Icon: string;
  entryRoute: string;
  permission: ClinicPermission;
}
