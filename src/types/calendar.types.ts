import type { Event } from 'react-big-calendar';

export interface CalendarEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    reservationId: string;
    roomName: string;
    username: string;
    equipment: string[];
  };
}
