import { useEffect, useState } from "react";
import api from "../api/axios";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

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
    const result = await Swal.fire({
      title: "Generate Jadwal?",
      text: "Sistem akan mendistribusikan seluruh tugas secara otomatis.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Generate",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Sedang Generate...",
      text: "Mohon tunggu beberapa saat",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.post("/jadwal/generate");

      await loadData();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Generate jadwal berhasil.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Generate Gagal",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan saat generate jadwal.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Jadwal?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Menghapus...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await api.delete(`/jadwal/${id}`);

      await loadData();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jadwal berhasil dihapus.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus jadwal.",
      });
    }
  };

  const handleDetail = async (id) => {
    try {
      const res = await api.get(`/jadwal/${id}`);

      setDetailJadwal(res.data);

      const modal = new bootstrap.Modal(document.getElementById("detailModal"));

      modal.show();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengambil detail jadwal.",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selesai":
        return "success";

      case "Proses":
        return "warning";

      case "Belum Dikerjakan":
        return "secondary";

      case "Tertunda":
        return "danger";

      default:
        return "primary";
    }
  };

  const getValidasiBadge = (status) => {
    return status === "Valid" ? "success" : "danger";
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

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal);

    const hari = String(date.getDate()).padStart(2, "0");
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const tahun = date.getFullYear();

    return `${hari}-${bulan}-${tahun}`;
  };

  const formatJam = (jam) => {
    if (!jam) return "-";

    return jam.substring(0, 5);
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Jadwal Distribusi Tugas</h3>

      <div className="row g-4 mb-4">
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
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <button className="btn btn-success" onClick={handleGenerate}>
              Generate Jadwal
            </button>

            <input
              type="text"
              className="form-control"
              style={{ maxWidth: "320px" }}
              placeholder="Cari nama karyawan atau tugas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr className="align-middle">
                  <th style={{ width: "55px" }}>No</th>

                  <th style={{ width: "130px" }}>Nama Karyawan</th>

                  <th style={{ width: "330px" }}>Nama Tugas</th>

                  <th style={{ width: "120px" }}>Tanggal</th>

                  <th style={{ width: "120px" }}>Jam</th>

                  <th style={{ width: "110px" }}>Status</th>

                  <th style={{ width: "160px" }}>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id_jadwal}>
                    <td>{firstIndex + index + 1}</td>

                    <td className="fw-semibold">{item.nama_karyawan}</td>

                    <td>{item.nama_tugas}</td>

                    <td>{formatTanggal(item.tanggal_tugas)}</td>

                    <td>
                      {formatJam(item.jam_mulai)} -{" "}
                      {formatJam(item.jam_selesai)}
                    </td>

                    <td>
                      <span
                        className={`badge bg-${getStatusBadge(item.status_tugas)}`}
                      >
                        {item.status_tugas}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleDetail(item.id_jadwal)}
                        >
                          Detail
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(item.id_jadwal)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
              </li>
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
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </li>
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
                <>
                  <div className="text-center mb-4">
                    <h5 className="fw-bold">{detailJadwal.nama_tugas}</h5>

                    <p className="text-muted">{detailJadwal.nama_karyawan}</p>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <div className="border rounded p-3">
                        <small className="text-muted">Tanggal Mulai</small>

                        <h6 className="mt-2">
                          {detailJadwal.tanggal_tugas?.split("T")[0]}
                        </h6>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded p-3">
                        <small className="text-muted">Jam Kerja</small>

                        <h6 className="mt-2">
                          {detailJadwal.jam_mulai} - {detailJadwal.jam_selesai}
                        </h6>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded p-3">
                        <small className="text-muted">Status</small>

                        <div className="mt-2">
                          <span
                            className={`badge bg-${getStatusBadge(detailJadwal.status_tugas)}`}
                          >
                            {detailJadwal.status_tugas}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded p-3">
                        <small className="text-muted">Validasi</small>

                        <div className="mt-2">
                          <span
                            className={`badge bg-${getValidasiBadge(detailJadwal.hasil_validasi)}`}
                          >
                            {detailJadwal.hasil_validasi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="border rounded p-3">
                        <small className="text-muted">Score Greedy</small>

                        <h4 className="mt-2 text-success">
                          {detailJadwal.score_greedy}
                        </h4>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Jadwal;
