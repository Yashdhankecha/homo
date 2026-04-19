import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/patient/LandingPage";
import LoginPage from "./components/admin/LoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminAppointments from "./components/admin/AdminAppointments";
import AdminMessages from "./components/admin/AdminMessages";
import AdminSettings from "./components/admin/AdminSettings";
import { getToken } from "./lib/auth";

function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
