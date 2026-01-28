import { ReservationCalendar } from '../components/calendar/ReservationCalendar';
import { Calendar, Info } from 'lucide-react';

export const CalendarPage = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-200">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agenda de Espaços
              </h1>
              <p className="text-gray-500 mt-0.5">
                Visualize e gerencie agendamentos de salas e laboratórios
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Minhas reservas</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl border border-gray-200">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Outros usuários</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Dica rápida</p>
            <p className="text-sm text-amber-700">
              Clique e arraste em um horário vazio para criar uma nova reserva rapidamente.
            </p>
          </div>
        </div>
      </div>

      <ReservationCalendar />
    </div>
  );
};
