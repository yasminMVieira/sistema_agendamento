import { useContext } from 'react';
import { ReservationContext } from '../contexts/ReservationContext';

export const useReservations = () => {
  const context = useContext(ReservationContext);

  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }

  return context;
};
