import { useEffect, useState } from "react";
import api from "../api/axios";

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

  return (
    <div className="container-fluid">
      {" "}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {" "}
        <h3>Data Karyawan</h3>
        <button className="btn btn-primary">+ Tambah Karyawan</button>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Jabatan</th>
                    <th>No HP</th>
                    <th>Skill</th>
                    <th>Status</th>
                    <th>Tugas</th>
                    <th>Maksimal</th>
                  </tr>
                </thead>

                <tbody>
                  {karyawan.length > 0 ? (
                    karyawan.map((item) => (
                      <tr key={item.id_karyawan}>
                        <td>{item.id_karyawan}</td>
                        <td>{item.nama_karyawan}</td>
                        <td>{item.email}</td>
                        <td>{item.jabatan}</td>
                        <td>{item.no_hp}</td>
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
                        <td>{item.jumlah_tugas}</td>
                        <td>{item.maksimal_tugas}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
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
