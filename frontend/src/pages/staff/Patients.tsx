import { useParams } from 'react-router-dom';
import { PatientList } from './patients/PatientList';
import { PatientDetail } from './patients/PatientDetail';

export const Patients = () => {
  const { id } = useParams<{ id?: string }>();
  
  if (id) {
    return <PatientDetail />;
  }

  return <PatientList />;
};
