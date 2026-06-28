import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Karyawan from "../pages/Karyawan";
import TambahKaryawan from "../pages/TambahKaryawan";
import EditKaryawan from "../pages/EditKaryawan";

import Tugas from "../pages/Tugas";
import TambahTugas from "../pages/TambahTugas";
import EditTugas from "../pages/EditTugas";

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
          path="/karyawan/tambah"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TambahKaryawan />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/karyawan/edit/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EditKaryawan />
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
          path="/tugas/tambah"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TambahTugas />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tugas/edit/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EditTugas />
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
