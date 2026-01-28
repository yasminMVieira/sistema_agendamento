import { useState } from 'react';
import { useReservations } from '../../hooks/useReservations';
import type { Equipment } from '../../types/reservation.types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Save,
  AlertCircle,
  Monitor,
  Laptop,
  Projector,
  Video,
  Presentation,
  Mic,
  Speaker,
  Wifi,
} from 'lucide-react';

const iconOptions = [
  { value: 'Monitor', icon: Monitor, label: 'Monitor' },
  { value: 'Laptop', icon: Laptop, label: 'Laptop' },
  { value: 'Projector', icon: Projector, label: 'Projetor' },
  { value: 'Video', icon: Video, label: 'Vídeo' },
  { value: 'Presentation', icon: Presentation, label: 'Apresentação' },
  { value: 'Mic', icon: Mic, label: 'Microfone' },
  { value: 'Speaker', icon: Speaker, label: 'Som' },
  { value: 'Wifi', icon: Wifi, label: 'WiFi' },
  { value: 'Package', icon: Package, label: 'Outros' },
];

const getIconComponent = (iconName?: string) => {
  const found = iconOptions.find((o) => o.value === iconName);
  return found?.icon || Package;
};

export const EquipmentPage = () => {
  const { equipment, rooms, addEquipment, updateEquipment, deleteEquipment } =
    useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Package',
    quantity: 1,
  });

  const filteredEquipment = equipment.filter((eq) =>
    eq.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingEquipment(null);
    setFormData({
      name: '',
      description: '',
      icon: 'Package',
      quantity: 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (eq: Equipment) => {
    setEditingEquipment(eq);
    setFormData({
      name: eq.name,
      description: eq.description || '',
      icon: eq.icon || 'Package',
      quantity: eq.quantity || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEquipment) {
      updateEquipment(editingEquipment.id, formData);
    } else {
      addEquipment(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteError(null);
    const success = deleteEquipment(id);
    if (!success) {
      setDeleteError('Não é possível excluir um equipamento vinculado a salas.');
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const getRoomsUsingEquipment = (equipmentId: string) => {
    return rooms.filter((r) => r.availableEquipment.includes(equipmentId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Equipamentos</h1>
          <p className="text-gray-500 mt-1">
            Adicione, edite ou remova equipamentos do sistema
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Novo Equipamento
        </button>
      </div>

      {/* Error Message */}
      {deleteError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{deleteError}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredEquipment.map((eq) => {
          const IconComponent = getIconComponent(eq.icon);
          const roomsUsing = getRoomsUsingEquipment(eq.id);

          return (
            <div
              key={eq.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(eq)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(eq.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{eq.name}</h3>

              {eq.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {eq.description}
                </p>
              )}

              {eq.quantity && eq.quantity > 1 && (
                <p className="text-sm text-gray-600 mb-2">
                  Quantidade: {eq.quantity}
                </p>
              )}

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Usado em {roomsUsing.length} sala(s)
                </p>
                {roomsUsing.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {roomsUsing.slice(0, 3).map((room) => (
                      <span
                        key={room.id}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg"
                      >
                        {room.name}
                      </span>
                    ))}
                    {roomsUsing.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg">
                        +{roomsUsing.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Nenhum equipamento encontrado' : 'Nenhum equipamento cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Tente buscar com outros termos.'
              : 'Comece adicionando um novo equipamento.'}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Equipamento
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEquipment ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Equipamento *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Projetor Multimídia"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descreva o equipamento..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
                  }
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ícone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {iconOptions.map((option) => {
                    const IconComp = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: option.value })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.icon === option.value
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 text-gray-700 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingEquipment ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
