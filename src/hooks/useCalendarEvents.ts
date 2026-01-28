import { useMemo } from 'react';
import type { Reservation } from '../types/reservation.types';
import type { CalendarEvent } from '../types/calendar.types';

export const useCalendarEvents = (reservations: Reservation[]): CalendarEvent[] => {
  return useMemo(() => {
    return reservations.map((reservation) => ({
      id: reservation.id,
      title: `${reservation.title} - ${reservation.roomName}`,
      start: new Date(reservation.startTime),
      end: new Date(reservation.endTime),
      resource: {
        reservationId: reservation.id,
        roomName: reservation.roomName,
        username: reservation.username,
        equipment: reservation.selectedEquipment,
      },
    }));
  }, [reservations]);
};
