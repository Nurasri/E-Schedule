import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function DetailMonitoring() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get(`/riwayat-beban/${id}`);
      setData(response.data);
    } catch (error) {
      console.log(error);
      alert("Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const info = data[0];

  const progressKeseluruhan =
    info && info.total_tugas > 0
      ? Math.round((info.tugas_selesai / info.total_tugas) * 100)
      : 0;

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal);

    const hari = String(date.getDate()).padStart(2, "0");
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const tahun = date.getFullYear();

    return `${hari}-${bulan}-${tahun}`;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-success";

    if (progress >= 75) return "bg-primary";

    if (progress >= 50) return "bg-info";

    if (progress >= 25) return "bg-warning";

    return "bg-danger";
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Link to="/monitoringkinerja" className="btn btn-outline-secondary mb-4">
        Kembali
      </Link>

      {info && (
        <>
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h3 className="fw-bold mb-1">{info.nama_karyawan}</h3>

              <p className="text-muted mb-0">Monitoring Beban Kerja Karyawan</p>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <small className="text-muted">Total Tugas</small>

                  <h2 className="text-primary fw-bold mt-2">
                    {info.total_tugas}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <small className="text-muted">Tugas Aktif</small>

                  <h2 className="text-warning fw-bold mt-2">
                    {info.tugas_aktif}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <small className="text-muted">Tugas Selesai</small>

                  <h2 className="text-success fw-bold mt-2">
                    {info.tugas_selesai}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center">
                  <small className="text-muted">Nilai Beban</small>

                  <h2 className="text-danger fw-bold mt-2">
                    {info.nilai_beban}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <strong>Progress Keseluruhan</strong>

                <strong>{progressKeseluruhan}%</strong>
              </div>

              <div className="progress rounded-pill" style={{ height: "28px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{
                    width: `${progressKeseluruhan}%`,
                  }}
                >
                  {progressKeseluruhan}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "60px" }}>No</th>

                  <th style={{ minWidth: "180px" }}>Nama Tugas</th>

                  <th style={{ minWidth: "140px" }}>Tanggal Mulai</th>

                  <th style={{ minWidth: "140px" }}>Deadline</th>

                  <th style={{ minWidth: "180px" }}>Progress</th>

                  <th style={{ minWidth: "150px" }}>Status</th>

                  <th style={{ minWidth: "320px" }}>Catatan</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id_jadwal}>
                    <td className="text-center">{index + 1}</td>

                    <td className="fw-semibold">{item.nama_tugas}</td>

                    <td>{formatTanggal(item.tanggal_tugas)}</td>

                    <td>{formatTanggal(item.deadline)}</td>

                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="progress rounded-pill me-3"
                          style={{
                            width: "220px",
                            height: "18px",
                          }}
                        >
                          <div
                            className={`progress-bar ${getProgressColor(item.progress)}`}
                            style={{
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>

                        <small
                          className="fw-semibold text-nowrap"
                          style={{ width: "45px" }}
                        >
                          {item.progress}%
                        </small>
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          item.status_tugas === "Selesai"
                            ? "badge rounded-pill bg-success"
                            : item.status_tugas === "Proses"
                              ? "badge rounded-pill bg-warning text-dark"
                              : item.status_tugas === "Tertunda"
                                ? "badge rounded-pill bg-danger"
                                : "badge rounded-pill bg-secondary"
                        }
                      >
                        {item.status_tugas}
                      </span>
                    </td>

                    <td>
                      {item.catatan_tugas ? (
                        item.catatan_tugas
                      ) : (
                        <span className="text-muted">-</span>
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

export default DetailMonitoring;
