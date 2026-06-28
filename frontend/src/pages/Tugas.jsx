import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Tugas() {
  const [tugas, setTugas] = useState([]);
  const [search, setSearch] = useState("");

  const fetchTugas = async () => {
    try {
      const response = await api.get("/tugas");

      setTugas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus tugas ini?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/tugas/${id}`);

      alert("Tugas berhasil dihapus");

      fetchTugas();
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus tugas");
    }
  };

  const filteredTugas = tugas.filter((item) =>
    item.nama_tugas.toLowerCase().includes(search.toLowerCase()),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentTugas = filteredTugas.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTugas.length / itemsPerPage);

  return (
    <div className="container-fluid">
      {" "}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Data Tugas</h4>

          <Link to="/tugas/tambah" className="btn btn-primary">
            + Tambah Tugas
          </Link>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Cari tugas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>No.</th>
                  <th>Nama Tugas</th>
                  <th>Deskripsi</th>
                  <th>Prioritas</th>
                  <th>Deadline</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredTugas.length > 0 ? (
                  currentTugas.map((item, index) => (
                    <tr key={item.id_tugas}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{item.nama_tugas}</td>
                      <td title={item.deskripsi}>
                        {item.deskripsi.length > 50
                          ? item.deskripsi.slice(0, 50) + "..."
                          : item.deskripsi}
                      </td>
                      <td>{item.prioritas}</td>
                      {/* <td>{item.skill_dibutuhkan}</td> */}
                      <td>{new Date(item.deadline).toLocaleDateString()}</td>
                      {/* <td>{item.durasi}</td> */}

                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/tugas/edit/${item.id_tugas}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>

                          <button
                            className="btn btn-danger btn-sm"
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
                    <td colSpan="6" className="text-center">
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <nav>
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
        </div>
      </div>
    </div>
  );
}

export default Tugas;
