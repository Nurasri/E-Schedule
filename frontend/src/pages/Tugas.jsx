import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

function Tugas() {
  const [tugas, setTugas] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchTugas = async () => {
    try {
      const response = await api.get("/tugas");
      setTugas(response.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data tugas",
      });
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Tugas?",
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
      await api.delete(`/tugas/${id}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data tugas berhasil dihapus.",
        timer: 1800,
        showConfirmButton: false,
      });

      fetchTugas();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus tugas.",
      });
    }
  };

  const filteredTugas = tugas.filter((item) =>
    item.nama_tugas.toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTugas = filteredTugas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTugas.length / itemsPerPage);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal);

    const hari = String(date.getDate()).padStart(2, "0");
    const bulan = String(date.getMonth() + 1).padStart(2, "0");
    const tahun = date.getFullYear();

    return `${hari}-${bulan}-${tahun}`;
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0 fw-bold">Data Tugas</h4>
            <small className="text-muted">
              Kelola seluruh data tugas perusahaan
            </small>
          </div>

          <Link to="/tugas/tambah" className="btn btn-dark">
            + Tambah Tugas
          </Link>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Cari nama tugas..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th width="70">No</th>
                  <th>Nama Tugas</th>
                  <th>Deskripsi</th>
                  <th width="120">Prioritas</th>
                  <th width="130">Deadline</th>
                  <th width="150" className="text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentTugas.length > 0 ? (
                  currentTugas.map((item, index) => (
                    <tr key={item.id_tugas}>
                      <td>{indexOfFirstItem + index + 1}</td>

                      <td className="fw-semibold">{item.nama_tugas}</td>

                      <td
                        style={{
                          maxWidth: "350px",
                        }}
                      >
                        {item.deskripsi.length > 70
                          ? item.deskripsi.substring(0, 70) + "..."
                          : item.deskripsi}
                      </td>

                      <td>
                        {item.prioritas === "Tinggi" && (
                          <span className="badge bg-danger">Tinggi</span>
                        )}

                        {item.prioritas === "Sedang" && (
                          <span className="badge bg-warning text-dark">
                            Sedang
                          </span>
                        )}

                        {item.prioritas === "Rendah" && (
                          <span className="badge bg-success">Rendah</span>
                        )}
                      </td>

                      <td>{formatTanggal(item.deadline)}</td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <Link
                            to={`/tugas/edit/${item.id_tugas}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-danger btn-sm "
                            onClick={() => handleDelete(item.id_tugas)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Tidak ada data tugas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Tugas;
