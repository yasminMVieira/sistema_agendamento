import { ReservationForm } from './ReservationForm';
import { ReservationDetails } from './ReservationDetails';
import type { Reservation } from '../../types/reservation.types';
import { useReservations } from '../../hooks/useReservations';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { X, Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = reservation && user && reservation.userId === user.id;

  const handleSuccess = () => {
    onHide();
    setMode(initialMode);
  };

  const handleClose = () => {
    onHide();
    setMode(initialMode);
    setShowDeleteConfirm(false);
  };

  const handleDelete = () => {
    if (!reservation) return;
    deleteReservation(reservation.id);
    handleClose();
  };

  const getTitle = () => {
    if (mode === 'create') return 'Nova Reserva';
    if (mode === 'edit') return 'Editar Reserva';
    return 'Detalhes da Reserva';
  };

  const getIcon = () => {
    if (mode === 'create') return <Calendar className="w-5 h-5" />;
    if (mode === 'edit') return <Edit2 className="w-5 h-5" />;
    return <Calendar className="w-5 h-5" />;
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
              {getIcon()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  handleClose();
                }
              }}
              initialStartTime={initialStartTime}
              initialEndTime={initialEndTime}
            />
          )}
        </div>

        {/* Footer for view mode */}
        {mode === 'view' && isOwner && !showDeleteConfirm && (
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={() => setMode('edit')}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Editar Reserva
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-3 text-red-600 font-semibold bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">
                Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Cancelar Reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
