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
