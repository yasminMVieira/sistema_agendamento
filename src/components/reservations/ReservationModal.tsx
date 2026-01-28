import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { ReservationForm } from './ReservationForm';
import { ReservationDetails } from './ReservationDetails';
import type { Reservation } from '../../types/reservation.types';
import { useReservations } from '../../hooks/useReservations';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

interface ReservationModalProps {
  visible: boolean;
  onHide: () => void;
  reservation?: Reservation;
  mode: 'create' | 'view' | 'edit';
  initialStartTime?: Date;
  initialEndTime?: Date;
}

export const ReservationModal = ({
  visible,
  onHide,
  reservation,
  mode: initialMode,
  initialStartTime,
  initialEndTime,
}: ReservationModalProps) => {
  const { deleteReservation } = useReservations();
  const { user } = useAuth();
  const [mode, setMode] = useState(initialMode);

  const isOwner = reservation && user && reservation.userId === user.id;

  const handleSuccess = () => {
    onHide();
    setMode(initialMode);
  };

  const handleDelete = () => {
    if (!reservation) return;

    confirmDialog({
      message: 'Tem certeza que deseja cancelar esta reserva?',
      header: 'Confirmar Cancelamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, cancelar',
      rejectLabel: 'Não',
      acceptClassName: 'p-button-danger',
      accept: () => {
        deleteReservation(reservation.id);
        onHide();
      },
    });
  };

  const getTitle = () => {
    if (mode === 'create') return 'Nova Reserva';
    if (mode === 'edit') return 'Editar Reserva';
    return 'Detalhes da Reserva';
  };

  const renderFooter = () => {
    if (mode === 'view' && isOwner) {
      return (
        <div className="flex gap-2">
          <Button
            label="Editar"
            icon="pi pi-pencil"
            onClick={() => setMode('edit')}
          />
          <Button
            label="Cancelar Reserva"
            icon="pi pi-trash"
            severity="danger"
            outlined
            onClick={handleDelete}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog
      header={getTitle()}
      visible={visible}
      onHide={() => {
        onHide();
        setMode(initialMode);
      }}
      style={{ width: '50vw' }}
      breakpoints={{ '960px': '75vw', '641px': '95vw' }}
      footer={renderFooter()}
    >
      {mode === 'view' && reservation ? (
        <ReservationDetails reservation={reservation} />
      ) : (
        <ReservationForm
          reservation={mode === 'edit' ? reservation : undefined}
          onSuccess={handleSuccess}
          onCancel={() => {
            if (mode === 'edit' && reservation) {
              setMode('view');
            } else {
              onHide();
              setMode(initialMode);
            }
          }}
          initialStartTime={initialStartTime}
          initialEndTime={initialEndTime}
        />
      )}
    </Dialog>
  );
};
