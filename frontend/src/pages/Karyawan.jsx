import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

function Karyawan() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchKaryawan = async () => {
    try {
      setLoading(true);

      const response = await api.get("/karyawan");

      setKaryawan(response.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data karyawan",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Karyawan?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/karyawan/${id}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data karyawan berhasil dihapus.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchKaryawan();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menghapus data",
      });
    }
  };

  const filteredKaryawan = karyawan.filter((item) =>
    item.nama_karyawan.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentKaryawan = filteredKaryawan.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredKaryawan.length / itemsPerPage);

  return (
    <div className="container-fluid py-3">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Data Karyawan</h3>

          <small className="text-muted">
            Kelola seluruh data karyawan perusahaan.
          </small>
        </div>

        <Link to="/karyawan/tambah" className="btn btn-dark rounded-pill px-4">
          <i className="bi bi-plus-circle me-2"></i>
          Tambah Karyawan
        </Link>
      </div>

      {/* Card */}

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nama karyawan..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-dark"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>No.</th>
                    <th>Nama</th>
                    <th>Jabatan</th>
                    <th>Skill</th>
                    <th>Status</th>
                    <th>Beban</th>
                    <th width="170">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredKaryawan.length > 0 ? (
                    currentKaryawan.map((item, index) => (
                      <tr key={item.id_karyawan}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">{item.nama_karyawan}</td>

                        <td>{item.jabatan}</td>

                        <td>{item.skill}</td>

                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              item.status_ketersediaan === "Tersedia"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {item.status_ketersediaan}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              item.jumlah_tugas >= item.maksimal_tugas
                                ? "bg-danger"
                                : item.jumlah_tugas >= item.maksimal_tugas * 0.8
                                  ? "bg-warning text-dark"
                                  : "bg-success"
                            }`}
                          >
                            {item.jumlah_tugas}/{item.maksimal_tugas}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/karyawan/edit/${item.id_karyawan}`}
                              className="btn btn-warning btn-sm"
                            >
                              <i className="bi bi-pencil-square me-1"></i>
                              Edit
                            </Link>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item.id_karyawan)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        <i className="bi bi-people fs-1 d-block mb-2"></i>
                        Tidak ada data karyawan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <nav className="mt-3">
                <ul className="pagination justify-content-end">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Karyawan;
