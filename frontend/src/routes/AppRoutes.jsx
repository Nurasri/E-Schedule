import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Karyawan from "../pages/Karyawan";
import Tugas from "../pages/Tugas";
import Jadwal from "../pages/Jadwal";
import RiwayatBeban from "../pages/RiwayatBeban";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/karyawan"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Karyawan />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tugas"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tugas />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jadwal"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Jadwal />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayatbeban"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RiwayatBeban />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
