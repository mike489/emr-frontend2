// PatientDetailsWrapper.tsx
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { Patient } from '../shared/api/types/patient.types';

interface PatientDetailsState {
  patient: Patient;
  consultation_id: string;
}

export const usePatientDetailsState = () => {
  const location = useLocation();
  const [state, setState] = useState<PatientDetailsState | null>(null);

  useEffect(() => {
    // Get state from location or session storage
    if (location.state) {
      setState(location.state as PatientDetailsState);
      // Also store in session storage for persistence
      sessionStorage.setItem('patientDetailsState', JSON.stringify(location.state));
    } else {
      // Try to get from session storage
      const storedState = sessionStorage.getItem('patientDetailsState');
      if (storedState) {
        setState(JSON.parse(storedState));
      }
    }
  }, [location]);

  return state;
};

// Higher Order Component to wrap child components
export const withPatientDetailsState = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const state = usePatientDetailsState();
    return <Component {...props} patientDetailsState={state} />;
  };
};
