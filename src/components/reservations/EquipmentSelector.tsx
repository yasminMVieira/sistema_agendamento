import { Checkbox } from 'primereact/checkbox';
import type { Equipment } from '../../types/reservation.types';

interface EquipmentSelectorProps {
  equipment: Equipment[];
  availableEquipment: string[];
  selectedEquipment: string[];
  onChange: (equipmentIds: string[]) => void;
}

const iconMap: Record<string, string> = {
  Projector: 'pi-video',
  Monitor: 'pi-desktop',
  Laptop: 'pi-tablet',
  Presentation: 'pi-book',
  Video: 'pi-camera',
};

export const EquipmentSelector = ({
  equipment,
  availableEquipment,
  selectedEquipment,
  onChange,
}: EquipmentSelectorProps) => {
  const handleToggle = (equipmentId: string) => {
    if (selectedEquipment.includes(equipmentId)) {
      onChange(selectedEquipment.filter((id) => id !== equipmentId));
    } else {
      onChange([...selectedEquipment, equipmentId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {equipment.map((item) => {
        const isAvailable = availableEquipment.includes(item.id);
        const isSelected = selectedEquipment.includes(item.id);
        const iconClass = iconMap[item.icon || ''] || 'pi-box';

        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              !isAvailable
                ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                : isSelected
                ? 'bg-primary-50 border-primary-500'
                : 'bg-white border-gray-200 hover:border-primary-300 cursor-pointer'
            }`}
            onClick={() => isAvailable && handleToggle(item.id)}
          >
            <Checkbox
              checked={isSelected}
              disabled={!isAvailable}
              onChange={() => handleToggle(item.id)}
            />
            <i className={`pi ${iconClass} text-2xl text-gray-700`} />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              {!isAvailable && (
                <p className="text-xs text-gray-500">Indisponível nesta sala</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
