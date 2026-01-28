import { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { useReservations } from '../../hooks/useReservations';
import { EquipmentSelector } from './EquipmentSelector';
import type { ReservationFormData, Reservation } from '../../types/reservation.types';
import { validateReservationTime } from '../../utils/validation';

interface ReservationFormProps {
  reservation?: Reservation;
  onSuccess: () => void;
  onCancel: () => void;
  initialStartTime?: Date;
  initialEndTime?: Date;
}

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errors.length > 0 && (
        <div className="flex flex-col gap-2">
          {errors.map((error, index) => (
            <Message key={index} severity="error" text={error} />
          ))}
        </div>
      )}

      {isAvailable === true && (
        <Message severity="success" text="✓ Horário disponível" />
      )}

      {isAvailable === false && (
        <Message severity="warn" text="✗ Horário indisponível - escolha outro horário" />
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="roomId" className="font-medium">
          Sala <span className="text-red-500">*</span>
        </label>
        <Dropdown
          id="roomId"
          value={formData.roomId}
          options={rooms}
          onChange={(e) => setFormData({ ...formData, roomId: e.value, selectedEquipment: [] })}
          optionLabel="name"
          optionValue="id"
          placeholder="Selecione uma sala"
          required
        />
        {selectedRoom && (
          <small className="text-gray-600">
            Capacidade: {selectedRoom.capacity} pessoas
          </small>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-medium">
          Título <span className="text-red-500">*</span>
        </label>
        <InputText
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Reunião de planejamento"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-medium">
          Descrição
        </label>
        <InputTextarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detalhes adicionais sobre a reserva..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="startTime" className="font-medium">
            Data/Hora Início <span className="text-red-500">*</span>
          </label>
          <Calendar
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.value as Date })}
            showTime
            hourFormat="24"
            stepMinute={15}
            dateFormat="dd/mm/yy"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="endTime" className="font-medium">
            Data/Hora Fim <span className="text-red-500">*</span>
          </label>
          <Calendar
            id="endTime"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.value as Date })}
            showTime
            hourFormat="24"
            stepMinute={15}
            dateFormat="dd/mm/yy"
            required
          />
        </div>
      </div>

      {selectedRoom && (
        <div className="flex flex-col gap-2">
          <label className="font-medium">Equipamentos</label>
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

      <div className="flex gap-2 justify-end mt-4">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          outlined
          onClick={onCancel}
        />
        <Button
          type="submit"
          label={reservation ? 'Atualizar' : 'Criar Reserva'}
          loading={loading}
          disabled={isAvailable === false}
        />
      </div>
    </form>
  );
};
