import { useEffect, useState } from "react";
import api from "../api/axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const statusChart = {
    labels: dashboard?.status_tugas.map((item) => item.status_tugas),

    datasets: [
      {
        data: dashboard?.status_tugas.map((item) => item.total),

        backgroundColor: ["#6c757d", "#ffc107", "#198754", "#dc3545"],

        borderWidth: 1,
      },
    ],
  };

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data);
    } catch (error) {
      console.error(error);

      alert("Gagal mengambil data dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid">
        <p>Memuat Dashboard...</p>
      </div>
    );
  }

  const bebanChart = {
    labels: ["Rendah", "Sedang", "Tinggi"],

    datasets: [
      {
        data: [
          dashboard?.beban_kerja.rendah,
          dashboard?.beban_kerja.sedang,
          dashboard?.beban_kerja.tinggi,
        ],

        backgroundColor: ["#198754", "#ffc107", "#dc3545"],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Dashboard Admin</h3>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6>Total Karyawan</h6>

              <h2 className="text-primary">
                {dashboard.statistik.total_karyawan}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6>Total Tugas</h6>

              <h2 className="text-success">
                {dashboard.statistik.total_tugas}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6>Total Jadwal</h6>

              <h2 className="text-warning">
                {dashboard.statistik.total_jadwal}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6>Tugas Selesai</h6>

              <h2 className="text-danger">
                {dashboard.statistik.tugas_selesai}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Status Tugas</h5>

              <div
                style={{
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie data={statusChart} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Beban Kerja</h5>
              <div
                style={{
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie data={bebanChart} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="mb-3">Top 5 Karyawan dengan Beban Kerja Tertinggi</h5>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "70px" }}>Peringkat</th>
                  <th>Nama Karyawan</th>
                  <th>Tugas Aktif</th>
                  <th>Nilai Beban</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.top_beban.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.nama_karyawan}</td>

                    <td>
                      <span className="badge bg-primary">
                        {item.tugas_aktif}
                      </span>
                    </td>

                    <td>
                      <span className="badge bg-info">{item.nilai_beban}</span>
                    </td>

                    <td>
                      {Number(item.nilai_beban) >= 4 ? (
                        <span className="badge bg-danger">Tinggi</span>
                      ) : Number(item.nilai_beban) >= 3 ? (
                        <span className="badge bg-warning text-dark">
                          Sedang
                        </span>
                      ) : (
                        <span className="badge bg-success">Rendah</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
