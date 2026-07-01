import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  if (loading) {
    return (
      <div className="container-fluid">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {info && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h4>{info.nama_karyawan}</h4>

            <hr />

            <div className="row">
              <div className="col-md-3">
                <b>Total Tugas</b>

                <h4>{info.total_tugas}</h4>
              </div>

              <div className="col-md-3">
                <b>Tugas Aktif</b>

                <h4>{info.tugas_aktif}</h4>
              </div>

              <div className="col-md-3">
                <b>Tugas Selesai</b>

                <h4>{info.tugas_selesai}</h4>
              </div>

              <div className="col-md-3">
                <b>Nilai Beban</b>

                <h4>{info.nilai_beban}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>No</th>

            <th>Nama Tugas</th>

            <th>Tanggal</th>

            <th>Progress</th>

            <th>Status</th>

            <th>Catatan</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id_jadwal}>
              <td>{index + 1}</td>

              <td>{item.nama_tugas}</td>

              <td>{item.tanggal_tugas}</td>

              <td style={{ minWidth: "50px" }}>
                <div className="d-flex align-items-center gap-2">
                  <div className="progress flex-grow-1">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <span>{item.progress}%</span>
                </div>
              </td>

              <td>
                <span
                  className={
                    item.status_tugas === "Selesai"
                      ? "badge bg-success"
                      : item.status_tugas === "Proses"
                        ? "badge bg-warning text-dark"
                        : item.status_tugas === "Tertunda"
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                  }
                >
                  {item.status_tugas}
                </span>
              </td>

              <td>{item.catatan_tugas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailMonitoring;
