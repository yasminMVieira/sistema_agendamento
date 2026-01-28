import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  BookMarked, 
  GraduationCap,
  ChevronLeft,
  DoorOpen,
  Package,
  Settings
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Menu',
    items: [
      { 
        label: 'Painel Inicial', 
        icon: <LayoutDashboard className="w-5 h-5" />, 
        path: '/dashboard'
      },
      { 
        label: 'Agenda', 
        icon: <Calendar className="w-5 h-5" />, 
        path: '/calendar'
      },
      { 
        label: 'Minhas Reservas', 
        icon: <BookMarked className="w-5 h-5" />, 
        path: '/reservations'
      },
    ],
  },
  {
    title: 'Administração',
    items: [
      { 
        label: 'Gerenciar Salas', 
        icon: <DoorOpen className="w-5 h-5" />, 
        path: '/admin/rooms'
      },
      { 
        label: 'Equipamentos', 
        icon: <Package className="w-5 h-5" />, 
        path: '/admin/equipment'
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          bg-white border-r border-gray-200 
          flex flex-col
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className={`p-4 border-b border-gray-100 ${isCollapsed ? 'lg:px-3' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}`}>
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                Agendamento
              </h1>
              <p className="text-xs text-gray-500 whitespace-nowrap">Espaços Acadêmicos</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:h-0 lg:mb-0 lg:overflow-hidden' : ''}`}>
                {section.title}
              </p>
              
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onMobileClose}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-200 relative
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                        ${isCollapsed ? 'lg:justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : ''}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                      )}
                      
                      <span className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {item.icon}
                      </span>
                      
                      <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
                        {item.label}
                      </span>

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <span className="
                          hidden lg:group-hover:flex
                          absolute left-full ml-2 px-2 py-1 
                          bg-gray-900 text-white text-sm rounded-lg
                          whitespace-nowrap z-50
                        ">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings Link */}
        <div className={`p-3 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <NavLink
            to="/admin/rooms"
            onClick={onMobileClose}
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200
              text-gray-600 hover:bg-gray-50 hover:text-gray-900
              ${isCollapsed ? 'lg:justify-center' : ''}
            `}
            title={isCollapsed ? 'Configurações' : ''}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
              Configurações
            </span>
            {isCollapsed && (
              <span className="
                hidden lg:group-hover:flex
                absolute left-full ml-2 px-2 py-1 
                bg-gray-900 text-white text-sm rounded-lg
                whitespace-nowrap z-50
              ">
                Configurações
              </span>
            )}
          </NavLink>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t border-gray-100 ${isCollapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center gap-3 px-3 py-2 ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className={`transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="text-xs text-gray-500">Sistema Educacional</p>
              <p className="text-xs font-semibold text-gray-700">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Collapse Button - Desktop Only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>
    </>
  );
};
