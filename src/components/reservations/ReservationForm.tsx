import { useState, useEffect } from 'react';
import { useReservations } from '../../hooks/useReservations';
import { EquipmentSelector } from './EquipmentSelector';
import type { ReservationFormData, Reservation } from '../../types/reservation.types';
import { validateReservationTime } from '../../utils/validation';
import { 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle, 
  Save, 
  Loader2,
  Building2,
  FileText,
  Clock
} from 'lucide-react';

interface ReservationFormProps {
  reservation?: Reservation;
  onSuccess: () => void;
  onCancel: () => void;
  initialStartTime?: Date;
  initialEndTime?: Date;
}

const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const ReservationForm = ({
  reservation,
  onSuccess,
  onCancel,
  initialStartTime,
  initialEndTime,
}: ReservationFormProps) => {
  const { rooms, equipment, addReservation, updateReservation, isTimeSlotAvailable } = useReservations();

  const [formData, setFormData] = useState<ReservationFormData>({
    roomId: reservation?.roomId || '',
    title: reservation?.title || '',
    description: reservation?.description || '',
    startTime: reservation ? new Date(reservation.startTime) : initialStartTime || new Date(),
    endTime: reservation ? new Date(reservation.endTime) : initialEndTime || new Date(),
    selectedEquipment: reservation?.selectedEquipment || [],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const selectedRoom = rooms.find((r) => r.id === formData.roomId);

  // Check availability when time or room changes
  useEffect(() => {
    if (formData.roomId && formData.startTime && formData.endTime) {
      const available = isTimeSlotAvailable(
        formData.roomId,
        formData.startTime,
        formData.endTime,
        reservation?.id
      );
      setIsAvailable(available);
    } else {
      setIsAvailable(null);
    }
  }, [formData.roomId, formData.startTime, formData.endTime, isTimeSlotAvailable, reservation]);

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.roomId) {
      newErrors.push('Selecione uma sala');
    }

    if (!formData.title.trim()) {
      newErrors.push('Digite um título para a reserva');
    }

    const timeValidation = validateReservationTime(formData.startTime, formData.endTime);
    if (!timeValidation.valid && timeValidation.error) {
      newErrors.push(timeValidation.error);
    }

    if (isAvailable === false) {
      newErrors.push('Este horário não está disponível para a sala selecionada');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!validate()) {
      return;
    }

    setLoading(true);

    let success = false;
    if (reservation) {
      success = await updateReservation(reservation.id, formData);
    } else {
      success = await addReservation(formData);
    }

    setLoading(false);

    if (success) {
      onSuccess();
    } else {
      setErrors(['Erro ao salvar reserva. Verifique os dados e tente novamente.']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          ))}
        </div>
      )}

      {isAvailable === true && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Horário disponível para reserva</span>
        </div>
      )}

      {isAvailable === false && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Horário indisponível - escolha outro horário</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Sala <span className="text-red-500">*</span>
        </label>
        <select
          id="roomId"
          value={formData.roomId}
          onChange={(e) => setFormData({ ...formData, roomId: e.target.value, selectedEquipment: [] })}
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Selecione uma sala</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (Capacidade: {room.capacity})
            </option>
          ))}
        </select>
        {selectedRoom && (
          <p className="text-sm text-gray-500">
            Capacidade: {selectedRoom.capacity} pessoas
            {selectedRoom.location && ` • ${selectedRoom.location}`}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Reunião de planejamento"
          required
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detalhes adicionais sobre a reserva..."
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Início <span className="text-red-500">*</span>
          </label>
          <input
            id="startTime"
            type="datetime-local"
            value={formatDateTimeLocal(formData.startTime)}
            onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value) })}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Término <span className="text-red-500">*</span>
          </label>
          <input
            id="endTime"
            type="datetime-local"
            value={formatDateTimeLocal(formData.endTime)}
            onChange={(e) => setFormData({ ...formData, endTime: new Date(e.target.value) })}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {selectedRoom && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Equipamentos</label>
          <EquipmentSelector
            equipment={equipment}
            availableEquipment={selectedRoom.availableEquipment}
            selectedEquipment={formData.selectedEquipment}
            onChange={(equipmentIds) =>
              setFormData({ ...formData, selectedEquipment: equipmentIds })
            }
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || isAvailable === false}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {reservation ? 'Atualizar' : 'Criar Reserva'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
