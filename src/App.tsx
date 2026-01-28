import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReservationProvider } from './contexts/ReservationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { RoomsPage } from './pages/admin/RoomsPage';
import { EquipmentPage } from './pages/admin/EquipmentPage';
import { initializeStorage } from './utils/localStorage';

// Initialize localStorage with default data
initializeStorage();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/reservations" element={<ReservationsPage />} />
                {/* Admin Routes */}
                <Route path="/admin/rooms" element={<RoomsPage />} />
                <Route path="/admin/equipment" element={<EquipmentPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReservationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
