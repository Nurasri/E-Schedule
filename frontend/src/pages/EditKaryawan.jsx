import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditKaryawan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nama_karyawan: "",
    email: "",
    jabatan: "",
    no_hp: "",
    skill: "",
    status_ketersediaan: "Tersedia",
    jumlah_tugas: 0,
    maksimal_tugas: 5,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchKaryawan = async () => {
    try {
      const response = await api.get(`/karyawan/${id}`);

      setFormData(response.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/karyawan/${id}`, formData);

      alert("Karyawan berhasil diperbarui");

      navigate("/karyawan");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal memperbarui data");
    }
  };

  if (loading) {
    return <p>Memuat data...</p>;
  }

  return (
    <div className="container-fluid">
      {" "}
      <div className="card shadow-sm">
        {" "}
        <div className="card-header">
          {" "}
          <h4>Edit Karyawan</h4>{" "}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Karyawan</label>

              <input
                type="text"
                name="nama_karyawan"
                className="form-control"
                value={formData.nama_karyawan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Jabatan</label>

              <input
                type="text"
                name="jabatan"
                className="form-control"
                value={formData.jabatan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">No HP</label>

              <input
                type="text"
                name="no_hp"
                className="form-control"
                value={formData.no_hp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Skill</label>

              <input
                type="text"
                name="skill"
                className="form-control"
                value={formData.skill}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status Ketersediaan</label>

              <select
                name="status_ketersediaan"
                className="form-select"
                value={formData.status_ketersediaan}
                onChange={handleChange}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Sibuk">Sibuk</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Jumlah Tugas</label>

              <input
                type="number"
                name="jumlah_tugas"
                className="form-control"
                value={formData.jumlah_tugas}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Maksimal Tugas</label>

              <input
                type="number"
                name="maksimal_tugas"
                className="form-control"
                value={formData.maksimal_tugas}
                onChange={handleChange}
                disabled
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Update
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/karyawan")}
            >
              Kembali
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditKaryawan;
