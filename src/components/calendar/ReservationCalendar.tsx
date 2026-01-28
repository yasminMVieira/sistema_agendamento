import { useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReservations } from '../../hooks/useReservations';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useAuth } from '../../hooks/useAuth';
import type { CalendarEvent } from '../../types/calendar.types';
import { ReservationModal } from '../reservations/ReservationModal';
import type { Reservation } from '../../types/reservation.types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'pt-BR': ptBR },
});

const messages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Não há reservas neste período',
  showMore: (total: number) => `+ Ver mais (${total})`,
};

// Custom Toolbar Component
const CustomToolbar = ({ label, onNavigate, onView, view }: {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: View) => void;
  view: View;
}) => {
  const viewOptions: { key: View; label: string }[] = [
    { key: 'month', label: 'Mês' },
    { key: 'week', label: 'Semana' },
    { key: 'day', label: 'Dia' },
    { key: 'agenda', label: 'Agenda' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Hoje
        </button>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onNavigate('PREV')}
            className="p-2 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="p-2 hover:bg-gray-50 transition-colors border-l border-gray-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 capitalize ml-2">
          {label}
        </h2>
      </div>

      <div className="flex items-center bg-gray-100 p-1 rounded-xl">
        {viewOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onView(option.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              view === option.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ReservationCalendar = () => {
  const { reservations } = useReservations();
  const { user } = useAuth();
  const events = useCalendarEvents(reservations);

  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create');
  const [newReservationTime, setNewReservationTime] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedReservation(undefined);
    setModalMode('create');
    setNewReservationTime({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setModalVisible(true);
  }, []);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      const reservation = reservations.find(
        (r) => r.id === event.resource?.reservationId
      );
      if (reservation) {
        setSelectedReservation(reservation);
        setModalMode('view');
        setNewReservationTime(null);
        setModalVisible(true);
      }
    },
    [reservations]
  );

  const eventStyleGetter = useCallback(
    (event: CalendarEvent) => {
      const isMyReservation = event.resource?.username === user?.username;

      return {
        style: {
          backgroundColor: isMyReservation ? '#2563eb' : '#6b7280',
          borderRadius: '8px',
          opacity: 1,
          color: 'white',
          border: 'none',
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          padding: '2px 8px',
        },
      };
    },
    [user]
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          selectable
          messages={messages}
          culture="pt-BR"
          style={{ height: '100%' }}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>

      <ReservationModal
        visible={modalVisible}
        onHide={() => {
          setModalVisible(false);
          setNewReservationTime(null);
        }}
        reservation={selectedReservation}
        mode={modalMode}
        initialStartTime={newReservationTime?.start}
        initialEndTime={newReservationTime?.end}
      />
    </>
  );
};
