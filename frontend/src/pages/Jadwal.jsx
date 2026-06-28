import { useEffect, useState } from "react";
import api from "../api/axios";
import * as bootstrap from "bootstrap";

function Jadwal() {
  const [jadwal, setJadwal] = useState([]);

  const [detailJadwal, setDetailJadwal] = useState(null);

  const [karyawanTersedia, setKaryawanTersedia] = useState(0);

  const [tugasBelumDijadwalkan, setTugasBelumDijadwalkan] = useState(0);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const dataPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jadwalRes, karyawanRes, tugasRes] = await Promise.all([
        api.get("/jadwal"),
        api.get("/karyawan"),
        api.get("/tugas"),
      ]);

      setJadwal(jadwalRes.data);

      const tersedia = karyawanRes.data.filter(
        (k) => k.status_ketersediaan === "Tersedia",
      ).length;

      setKaryawanTersedia(tersedia);

      setTugasBelumDijadwalkan(tugasRes.data.length - jadwalRes.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    const confirmGenerate = window.confirm("Generate jadwal sekarang?");

    if (!confirmGenerate) return;

    try {
      await api.post("/jadwal/generate");

      alert("Generate jadwal berhasil");

      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Generate gagal");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Hapus jadwal ini?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/jadwal/${id}`);

      alert("Jadwal berhasil dihapus");

      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus");
    }
  };

  const handleDetail = async (id) => {
    try {
      const res = await api.get(`/jadwal/${id}`);

      setDetailJadwal(res.data);

      const modal = new bootstrap.Modal(document.getElementById("detailModal"));

      modal.show();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mengambil detail");
    }
  };

  const filteredData = jadwal.filter(
    (item) =>
      item.nama_karyawan?.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_tugas?.toLowerCase().includes(search.toLowerCase()),
  );

  const lastIndex = currentPage * dataPerPage;

  const firstIndex = lastIndex - dataPerPage;

  const currentData = filteredData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Jadwal Distribusi Tugas</h3>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h6>Karyawan Tersedia</h6>

              <h2>{karyawanTersedia}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <h6>Tugas Belum Dijadwalkan</h6>

              <h2>{tugasBelumDijadwalkan}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-success" onClick={handleGenerate}>
              Generate Jadwal
            </button>

            <input
              type="text"
              className="form-control w-25"
              placeholder="Cari nama karyawan dan tugas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Nama Karyawan</th>
                  <th>Tugas</th>
                  <th>Tanggal</th>
                  <th>Jam Mulai</th>
                  <th>Jam Selesai</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id_jadwal}>
                    <td>{firstIndex + index + 1}</td>

                    <td>{item.nama_karyawan}</td>

                    <td>{item.nama_tugas}</td>

                    <td>{item.tanggal_tugas?.split("T")[0]}</td>

                    <td>{item.jam_mulai}</td>

                    <td>{item.jam_selesai}</td>

                    <td>{item.status_tugas}</td>

                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => handleDetail(item.id_jadwal)}
                      >
                        Detail
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item.id_jadwal)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="modal fade" id="detailModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Detail Jadwal</h5>

              <button className="btn-close" data-bs-dismiss="modal" />
            </div>

            <div className="modal-body">
              {detailJadwal && (
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <th>Nama Karyawan</th>
                      <td>{detailJadwal.nama_karyawan}</td>
                    </tr>

                    <tr>
                      <th>Nama Tugas</th>
                      <td>{detailJadwal.nama_tugas}</td>
                    </tr>

                    <tr>
                      <th>Tanggal</th>
                      <td>{detailJadwal.tanggal_tugas?.split("T")[0]}</td>
                    </tr>

                    <tr>
                      <th>Jam Mulai</th>
                      <td>{detailJadwal.jam_mulai}</td>
                    </tr>

                    <tr>
                      <th>Jam Selesai</th>
                      <td>{detailJadwal.jam_selesai}</td>
                    </tr>

                    <tr>
                      <th>Status</th>
                      <td>{detailJadwal.status_tugas}</td>
                    </tr>

                    <tr>
                      <th>Score Greedy</th>
                      <td>{detailJadwal.score_greedy}</td>
                    </tr>

                    <tr>
                      <th>Validasi</th>
                      <td>{detailJadwal.hasil_validasi}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jadwal;
