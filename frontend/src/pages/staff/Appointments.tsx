import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppointmentList } from './appointments/AppointmentList';
import { AppointmentDetail } from './appointments/AppointmentDetail';

export const Appointments = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  
  const isDoctor = user?.role === 'DOCTOR';

  if (id) {
    return <AppointmentDetail isDoctor={isDoctor} />;
  }

  return <AppointmentList isDoctor={isDoctor} />;
};
