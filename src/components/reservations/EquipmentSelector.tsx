import type { Equipment } from '../../types/reservation.types';
import { 
  Monitor, 
  Laptop, 
  Projector, 
  Video, 
  Presentation, 
  Package,
  Check
} from 'lucide-react';

interface EquipmentSelectorProps {
  equipment: Equipment[];
  availableEquipment: string[];
  selectedEquipment: string[];
  onChange: (equipmentIds: string[]) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Projector: Projector,
  Monitor: Monitor,
  Laptop: Laptop,
  Presentation: Presentation,
  Video: Video,
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
        const IconComponent = iconMap[item.icon || ''] || Package;

        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
              !isAvailable
                ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                : isSelected
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:border-blue-300 cursor-pointer'
            }`}
            onClick={() => isAvailable && handleToggle(item.id)}
          >
            {/* Custom Checkbox */}
            <div
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                isSelected
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-2 border-gray-300'
              } ${!isAvailable ? 'opacity-50' : ''}`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            
            {/* Icon */}
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <IconComponent className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            
            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {item.name}
              </p>
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
