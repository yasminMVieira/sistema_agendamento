import { useState, useMemo } from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useReservations } from '../hooks/useReservations';
import { useAuth } from '../hooks/useAuth';
import { ReservationModal } from '../components/reservations/ReservationModal';
import type { Reservation } from '../types/reservation.types';
import { formatDateTime } from '../utils/dateHelpers';
import { 
  Plus, 
  Calendar, 
  Eye, 
  Clock, 
  MapPin, 
  Package,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ReservationsPage = () => {
  const { reservations } = useReservations();
  const { user } = useAuth();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('view');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const myReservations = useMemo(() => {
    return reservations
      .filter((r) => r.userId === user?.id)
      .filter((r) => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [reservations, user, searchTerm]);

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return myReservations.slice(start, start + itemsPerPage);
  }, [myReservations, currentPage]);

  const totalPages = Math.ceil(myReservations.length / itemsPerPage);

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleNewReservation = () => {
    setSelectedReservation(undefined);
    setModalMode('create');
    setModalVisible(true);
  };

  const getStatus = (reservation: Reservation) => {
    const now = new Date();
    const start = new Date(reservation.startTime);
    const end = new Date(reservation.endTime);

    if (now < start) {
      return { label: 'Agendada', color: 'bg-blue-100 text-blue-700' };
    } else if (now >= start && now <= end) {
      return { label: 'Em andamento', color: 'bg-green-100 text-green-700' };
    } else {
      return { label: 'Concluída', color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
            <p className="text-gray-500 mt-1">
              Gerencie todas as suas reservas de salas
            </p>
          </div>
          <button
            onClick={handleNewReservation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nova Reserva
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título ou sala..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {myReservations.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma reserva encontrada' : 'Você ainda não tem reservas'}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {searchTerm 
                  ? 'Tente buscar por outro termo.'
                  : 'Crie sua primeira reserva para começar a organizar seus espaços.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleNewReservation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Criar primeira reserva
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header - Desktop */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                <div className="col-span-4">Reserva</div>
                <div className="col-span-3">Período</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Equipamentos</div>
                <div className="col-span-1">Ações</div>
              </div>

              {/* Reservations */}
              <div className="divide-y divide-gray-50">
                {paginatedReservations.map((reservation) => {
                  const status = getStatus(reservation);
                  
                  return (
                    <div
                      key={reservation.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">
                        {/* Title & Room */}
                        <div className="col-span-4 flex items-center gap-4 mb-3 lg:mb-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{reservation.title}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {reservation.roomName}
                            </p>
                          </div>
                        </div>

                        {/* Period */}
                        <div className="col-span-3 mb-3 lg:mb-0">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {formatDateTime(new Date(reservation.startTime))}
                            </p>
                            <p className="text-gray-500 ml-5">
                              até {formatDateTime(new Date(reservation.endTime))}
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 mb-3 lg:mb-0">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* Equipment */}
                        <div className="col-span-2 mb-3 lg:mb-0">
                          {reservation.selectedEquipment.length === 0 ? (
                            <span className="text-sm text-gray-400">Nenhum</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-gray-600">
                                {reservation.selectedEquipment.length} item(s)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex justify-end lg:justify-start">
                          <button
                            onClick={() => handleViewReservation(reservation)}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, myReservations.length)} de {myReservations.length} reservas
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <ReservationModal
          visible={modalVisible}
          onHide={() => setModalVisible(false)}
          reservation={selectedReservation}
          mode={modalMode}
        />
      </div>
    </>
  );
};
