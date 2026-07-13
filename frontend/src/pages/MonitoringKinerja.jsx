import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function MonitoringKinerja() {
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // const nilaiBeban = Number(item.nilai_beban);

  const fetchMonitoring = async () => {
    try {
      const response = await api.get("/riwayat-beban");

      setMonitoring(response.data);
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data monitoring");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  const filteredMonitoring = monitoring.filter((item) => {
    const cocokNama = item.nama_karyawan
      .toLowerCase()
      .includes(search.toLowerCase());

    let cocokBeban = true;

    if (statusFilter === "Rendah") {
      cocokBeban = item.nilai_beban <= 2;
    } else if (statusFilter === "Sedang") {
      cocokBeban = item.nilai_beban === 3;
    } else if (statusFilter === "Tinggi") {
      cocokBeban = item.nilai_beban >= 4;
    }

    return cocokNama && cocokBeban;
  });

  const indexOfLast = currentPage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentItems = filteredMonitoring.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredMonitoring.length / itemsPerPage);

  const totalKaryawan = monitoring.length;

  const bebanRendah = monitoring.filter(
    (item) => Number(item.nilai_beban) <= 2,
  ).length;

  const bebanSedang = monitoring.filter(
    (item) => Number(item.nilai_beban) === 3,
  ).length;

  const bebanTinggi = monitoring.filter(
    (item) => Number(item.nilai_beban) >= 4,
  ).length;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Monitoring Kinerja</h3>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h6>Total Karyawan</h6>
              <h3>{totalKaryawan}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h6>Beban Rendah</h6>
              <h3>{bebanRendah}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <h6>Beban Sedang</h6>
              <h3>{bebanSedang}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-danger shadow-sm">
            <div className="card-body text-center">
              <h6>Beban Tinggi</h6>
              <h3>{bebanTinggi}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3 align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama karyawan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* <div className="col-md-2 ms-auto">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Semua Beban</option>
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
            </div> */}
          </div>

          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Nama Karyawan</th>
                    <th>Total Tugas</th>
                    <th>Tugas Aktif</th>
                    <th>Tugas Selesai</th>
                    <th>Beban Kerja</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={item.id_karyawan}>
                        <td>{indexOfFirst + index + 1}</td>

                        <td>{item.nama_karyawan}</td>

                        <td>
                          <span className="badge bg-primary">
                            {item.total_tugas}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-warning text-dark">
                            {item.tugas_aktif}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-success">
                            {item.tugas_selesai}
                          </span>
                        </td>

                        <td>
                          {Number(item.nilai_beban) <= 2 ? (
                            <span className="badge bg-success">
                              Rendah ({item.nilai_beban})
                            </span>
                          ) : Number(item.nilai_beban) === 3 ? (
                            <span className="badge bg-warning text-dark">
                              Sedang ({item.nilai_beban})
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              Tinggi ({item.nilai_beban})
                            </span>
                          )}
                        </td>

                        <td>
                          <Link
                            to={`/monitoringkinerja/${item.id_karyawan}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonitoringKinerja;
