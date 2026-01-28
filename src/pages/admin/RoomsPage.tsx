import { useState } from 'react';
import { useReservations } from '../../hooks/useReservations';
import type { Room } from '../../types/reservation.types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  DoorOpen,
  Users,
  MapPin,
  Package,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';

export const RoomsPage = () => {
  const { rooms, equipment, addRoom, updateRoom, deleteRoom } = useReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
    location: '',
    description: '',
    availableEquipment: [] as string[],
  });

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      capacity: 10,
      location: '',
      description: '',
      availableEquipment: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      location: room.location || '',
      description: room.description || '',
      availableEquipment: room.availableEquipment,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
    } else {
      addRoom(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteError(null);
    const success = deleteRoom(id);
    if (!success) {
      setDeleteError('Não é possível excluir uma sala com reservas ativas.');
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const toggleEquipment = (equipmentId: string) => {
    setFormData((prev) => ({
      ...prev,
      availableEquipment: prev.availableEquipment.includes(equipmentId)
        ? prev.availableEquipment.filter((id) => id !== equipmentId)
        : [...prev.availableEquipment, equipmentId],
    }));
  };

  const getEquipmentNames = (equipmentIds: string[]) => {
    return equipmentIds
      .map((id) => equipment.find((e) => e.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Salas</h1>
          <p className="text-gray-500 mt-1">
            Adicione, edite ou remova salas do sistema
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" />
          Nova Sala
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
            placeholder="Buscar por nome ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                <DoorOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(room)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
            
            {room.description && (
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{room.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>Capacidade: {room.capacity} pessoas</span>
              </div>
              
              {room.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{room.location}</span>
                </div>
              )}
              
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="line-clamp-2">
                  {room.availableEquipment.length > 0
                    ? getEquipmentNames(room.availableEquipment)
                    : 'Sem equipamentos'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <DoorOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma sala encontrada' : 'Nenhuma sala cadastrada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'Tente buscar com outros termos.'
              : 'Comece adicionando uma nova sala.'}
          </p>
          {!searchTerm && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Sala
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
                {editingRoom ? 'Editar Sala' : 'Nova Sala'}
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
                  Nome da Sala *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Sala de Conferência A"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Capacidade *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })
                    }
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Bloco A, 2º andar"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a sala..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Equipamentos Disponíveis
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {equipment.map((eq) => (
                    <button
                      key={eq.id}
                      type="button"
                      onClick={() => toggleEquipment(eq.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all text-left ${
                        formData.availableEquipment.includes(eq.id)
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                          : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {eq.name}
                    </button>
                  ))}
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
                  {editingRoom ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
