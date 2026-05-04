import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { TripsPage } from './pages/Trips';
import { NewTripPage } from './pages/NewTrip';
import { TripDetailsPage } from './pages/TripDetails';
import { ProfilePage } from './pages/Profile';
import { useAuthStore } from './store/auth';

function RootRedirect() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return <Navigate to={accessToken ? '/trips' : '/login'} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<NewTripPage />} />
            <Route path="/trips/:id" element={<TripDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
