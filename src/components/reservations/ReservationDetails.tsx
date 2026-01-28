import type { Reservation } from '../../types/reservation.types';
import { useReservations } from '../../hooks/useReservations';
import { formatDateTime } from '../../utils/dateHelpers';
import { 
  Building2, 
  User, 
  CalendarPlus, 
  CalendarMinus, 
  Package,
  Monitor,
  Laptop,
  Projector,
  Video,
  Presentation
} from 'lucide-react';

interface ReservationDetailsProps {
  reservation: Reservation;
}

const iconComponents: Record<string, React.ReactNode> = {
  Projector: <Projector className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
  Presentation: <Presentation className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
};

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  const { equipment: allEquipment } = useReservations();

  const selectedEquipmentDetails = allEquipment.filter((eq) =>
    reservation.selectedEquipment.includes(eq.id)
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500">Título</label>
        <p className="text-xl font-semibold text-gray-900">{reservation.title}</p>
      </div>

      {reservation.description && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">Descrição</label>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{reservation.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Sala
          </label>
          <p className="text-gray-900 font-medium">{reservation.roomName}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <User className="w-4 h-4" />
            Responsável
          </label>
          <p className="text-gray-900 font-medium">{reservation.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-4 rounded-xl space-y-2">
          <label className="text-sm font-medium text-emerald-700 flex items-center gap-2">
            <CalendarPlus className="w-4 h-4" />
            Início
          </label>
          <p className="text-emerald-900 font-medium">
            {formatDateTime(new Date(reservation.startTime))}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl space-y-2">
          <label className="text-sm font-medium text-red-700 flex items-center gap-2">
            <CalendarMinus className="w-4 h-4" />
            Término
          </label>
          <p className="text-red-900 font-medium">
            {formatDateTime(new Date(reservation.endTime))}
          </p>
        </div>
      </div>

      {selectedEquipmentDetails.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Equipamentos Reservados
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedEquipmentDetails.map((eq) => {
              const icon = iconComponents[eq.icon || ''] || <Package className="w-5 h-5" />;
              return (
                <div
                  key={eq.id}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div className="text-blue-600">{icon}</div>
                  <span className="text-sm font-medium text-blue-900">{eq.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
