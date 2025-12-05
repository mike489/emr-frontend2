// PatientDetailsWrapper.tsx
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Patient } from '../shared/api/types/patient.types';

interface PatientDetailsState {
  patient: Patient;
  consultation_id: string;
  visit_type?: string;
  flags?: {
    is_locked?: boolean;
  };
  visits?: {
    visit_type?: string;
    flags?: {
      is_locked?: boolean;
    };
  };
}

export const usePatientDetailsState = () => {
  const location = useLocation();
  const [state, setState] = useState<PatientDetailsState | null>(null);

  useEffect(() => {
    if (location.state) {
      setState(location.state as PatientDetailsState);
      sessionStorage.setItem('patientDetailsState', JSON.stringify(location.state));
    } else {
      const storedState = sessionStorage.getItem('patientDetailsState');
      if (storedState) {
        setState(JSON.parse(storedState));
      }
    }
  }, [location]);

  return state;
};

export const withPatientDetailsState = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const state = usePatientDetailsState();
    return <Component {...props} patientDetailsState={state} />;
  };
};
