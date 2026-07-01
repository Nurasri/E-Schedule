import { Link } from "react-router-dom";

function Sidebar() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");

    window.location.href = "/";
  };

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >
      <h4>E-Schedule</h4>

      <hr />

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/karyawan" className="nav-link text-white">
            Data Karyawan
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/tugas" className="nav-link text-white">
            Data Tugas
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/jadwal" className="nav-link text-white">
            Generate Jadwal
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/monitoringkinerja" className="nav-link text-white">
            Monitoring Kinerja
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" onClick={logout}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
