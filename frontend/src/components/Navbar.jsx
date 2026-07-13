import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const nama = localStorage.getItem("nama");

  const titles = {
    "/dashboard": "Dashboard Admin",

    "/karyawan": "Halaman Data Karyawan",

    "/karyawan/tambah": "Tambah Data Karyawan",

    "/tugas": "Halaman Data Tugas",

    "/tugas/tambah": "Tambah Data Tugas",

    "/jadwal": "Halaman Generate Jadwal",

    "/monitoringkinerja": "Halaman Monitoring Kinerja",
  };

  let title = titles[location.pathname];

  if (!title) {
    if (location.pathname.startsWith("/karyawan/edit")) {
      title = "Edit Karyawan";
    } else if (location.pathname.startsWith("/tugas/edit")) {
      title = "Edit Tugas";
    } else if (location.pathname.startsWith("/monitoringkinerja/")) {
      title = "Detail Monitoring";
    } else {
      title = "E-Schedule";
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom px-4">
      <span className="navbar-brand fw-bold">{title}</span>

      <div className="ms-auto d-flex align-items-center">
        <div className="text-end">
          <div className="fw-semibold">{nama}</div>

          <small className="text-muted">Administrator</small>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
