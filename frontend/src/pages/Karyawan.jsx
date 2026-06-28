import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Karyawan() {
  const [karyawan, setKaryawan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKaryawan = async () => {
    try {
      const response = await api.get("/karyawan");

      setKaryawan(response.data);
    } catch (error) {
      console.error(error);

      alert("Gagal mengambil data karyawan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawan();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus karyawan ini?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/karyawan/${id}`);

      alert("Karyawan berhasil dihapus");

      fetchKaryawan();
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus karyawan");
    }
  };

  const [search, setSearch] = useState("");

  const filteredKaryawan = karyawan.filter((item) =>
    item.nama_karyawan.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="container-fluid">
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {" "}
        <h3>Data Karyawan</h3>
        <Link to="/karyawan/tambah" className="btn btn-primary">
          + Tambah Karyawan
        </Link>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <div className="table-responsive">
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari nama karyawan..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nama</th>
                    {/* <th>Email</th> */}
                    <th>Jabatan</th>
                    {/* <th>No HP</th> */}
                    <th>Skill</th>
                    <th>Status</th>
                    <th>Beban</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {karyawan.length > 0 ? (
                    filteredKaryawan.map((item) => (
                      <tr key={item.id_karyawan}>
                        <td>{item.nama_karyawan}</td>
                        {/* <td>{item.email}</td> */}
                        <td>{item.jabatan}</td>
                        {/* <td>{item.no_hp}</td> */}
                        <td>{item.skill}</td>
                        <td>
                          <span
                            className={
                              item.status_ketersediaan === "Tersedia"
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {item.status_ketersediaan}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              item.jumlah_tugas >= item.maksimal_tugas
                                ? "badge bg-danger"
                                : item.jumlah_tugas >= item.maksimal_tugas * 0.8
                                  ? "badge bg-warning text-dark"
                                  : "badge bg-success"
                            }
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
                              Edit
                            </Link>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item.id_karyawan)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Karyawan;
