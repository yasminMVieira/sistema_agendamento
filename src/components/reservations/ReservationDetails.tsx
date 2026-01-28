import type { Reservation } from '../../types/reservation.types';
import { useReservations } from '../../hooks/useReservations';
import { formatDateTime } from '../../utils/dateHelpers';

interface ReservationDetailsProps {
  reservation: Reservation;
}

const iconMap: Record<string, string> = {
  Projector: 'pi-video',
  Monitor: 'pi-desktop',
  Laptop: 'pi-tablet',
  Presentation: 'pi-book',
  Video: 'pi-camera',
};

export const ReservationDetails = ({ reservation }: ReservationDetailsProps) => {
  const { equipment: allEquipment } = useReservations();

  const selectedEquipmentDetails = allEquipment.filter((eq) =>
    reservation.selectedEquipment.includes(eq.id)
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-600">Título</label>
        <p className="text-lg font-semibold text-gray-900">{reservation.title}</p>
      </div>

      {reservation.description && (
        <div>
          <label className="text-sm font-medium text-gray-600">Descrição</label>
          <p className="text-gray-800">{reservation.description}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Sala</label>
          <p className="text-gray-900 flex items-center gap-2">
            <i className="pi pi-building" />
            {reservation.roomName}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Responsável</label>
          <p className="text-gray-900 flex items-center gap-2">
            <i className="pi pi-user" />
            {reservation.username}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Início</label>
          <p className="text-gray-900 flex items-center gap-2">
            <i className="pi pi-calendar-plus" />
            {formatDateTime(new Date(reservation.startTime))}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Término</label>
          <p className="text-gray-900 flex items-center gap-2">
            <i className="pi pi-calendar-minus" />
            {formatDateTime(new Date(reservation.endTime))}
          </p>
        </div>
      </div>

      {selectedEquipmentDetails.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Equipamentos Reservados
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedEquipmentDetails.map((eq) => {
              const iconClass = iconMap[eq.icon || ''] || 'pi-box';
              return (
                <div
                  key={eq.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                >
                  <i className={`pi ${iconClass} text-primary-600`} />
                  <span className="text-sm text-gray-800">{eq.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
