import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Sidebar() {
  const navigate = useNavigate();

  const nama = localStorage.getItem("nama");

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
      confirmButtonColor: "#000",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");

    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#111827",
      }}
    >
      {/* Logo */}
      <div className="text-center py-4 border-bottom border-secondary">
        <i
          className="bi bi-calendar2-week-fill"
          style={{
            fontSize: "35px",
          }}
        ></i>

        <h4 className="mt-3 mb-1 fw-bold">E-Schedule</h4>

        <small className="text-secondary">Sistem Penjadwalan</small>

        <div className="mt-3">
          <span className="badge bg-light text-dark">{nama}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-grow-1 p-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link mb-2 rounded px-3 py-2 ${
              isActive ? "bg-white text-dark" : "text-white"
            }`
          }
        >
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/karyawan"
          className={({ isActive }) =>
            `nav-link mb-2 rounded px-3 py-2 ${
              isActive ? "bg-white text-dark" : "text-white"
            }`
          }
        >
          <i className="bi bi-people me-2"></i>
          Data Karyawan
        </NavLink>

        <NavLink
          to="/tugas"
          className={({ isActive }) =>
            `nav-link mb-2 rounded px-3 py-2 ${
              isActive ? "bg-white text-dark" : "text-white"
            }`
          }
        >
          <i className="bi bi-journal-text me-2"></i>
          Data Tugas
        </NavLink>

        <NavLink
          to="/jadwal"
          className={({ isActive }) =>
            `nav-link mb-2 rounded px-3 py-2 ${
              isActive ? "bg-white text-dark" : "text-white"
            }`
          }
        >
          <i className="bi bi-calendar-check me-2"></i>
          Generate Jadwal
        </NavLink>

        <NavLink
          to="/monitoringkinerja"
          className={({ isActive }) =>
            `nav-link mb-2 rounded px-3 py-2 ${
              isActive ? "bg-white text-dark" : "text-white"
            }`
          }
        >
          <i className="bi bi-bar-chart me-2"></i>
          Monitoring Kinerja
        </NavLink>
      </div>

      {/* Logout */}
      <div className="p-3 border-top border-secondary">
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
