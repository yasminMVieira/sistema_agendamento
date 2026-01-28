import { useReservations } from '../hooks/useReservations';
import { useAuth } from '../hooks/useAuth';
import { useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  TrendingUp, 
  ChevronRight, 
  CalendarDays,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { reservations } = useReservations();
  const { user } = useAuth();

  const myReservations = useMemo(() => {
    return reservations.filter((r) => r.userId === user?.id);
  }, [reservations, user]);

  const upcomingReservations = useMemo(() => {
    const now = new Date();
    return myReservations
      .filter((r) => new Date(r.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  }, [myReservations]);

  const stats = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Minhas Reservas',
      value: myReservations.length,
      change: '+12%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Próximas Atividades',
      value: upcomingReservations.length,
      change: '+5%',
      trend: 'up',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: 'Total de Agendamentos',
      value: reservations.length,
      change: '+18%',
      trend: 'up',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    }
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">{getTimeOfDay()}</p>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              {user?.fullName} 👋
            </h1>
            <p className="text-blue-100 max-w-lg">
              Bem-vindo ao sistema de agendamento de espaços acadêmicos. Gerencie suas reservas de forma simples e eficiente.
            </p>
          </div>
          
          <Link 
            to="/calendar"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Calendar className="w-5 h-5" />
            Nova Reserva
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <div className={stat.textColor}>{stat.icon}</div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Próximas Reservas</h2>
              <p className="text-sm text-gray-500">Seus próximos agendamentos</p>
            </div>
          </div>
          <Link 
            to="/reservations"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {upcomingReservations.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum agendamento futuro
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Você não possui reservas agendadas. Acesse a agenda para reservar salas e laboratórios.
            </p>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Agendar agora
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {upcomingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{reservation.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {reservation.roomName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(reservation.startTime).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(reservation.startTime).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
