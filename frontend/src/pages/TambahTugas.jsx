import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function TambahTugas() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_tugas: "",
    deskripsi: "",
    prioritas: "Sedang",
    skill_dibutuhkan: "",
    deadline: "",
    durasi: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tugas", formData);

      alert("Tugas berhasil ditambahkan");

      navigate("/tugas");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal menambahkan tugas");
    }
  };

  return (
    <div className="container-fluid">
      {" "}
      <div className="card shadow-sm">
        {" "}
        <div className="card-header">
          {" "}
          <h4>Tambah Tugas</h4>{" "}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Tugas</label>

              <input
                type="text"
                name="nama_tugas"
                className="form-control"
                value={formData.nama_tugas}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Deskripsi</label>

              <textarea
                name="deskripsi"
                className="form-control"
                rows="3"
                value={formData.deskripsi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prioritas</label>

              <select
                name="prioritas"
                className="form-select"
                value={formData.prioritas}
                onChange={handleChange}
              >
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Skill Dibutuhkan</label>

              <input
                type="text"
                name="skill_dibutuhkan"
                className="form-control"
                value={formData.skill_dibutuhkan}
                onChange={handleChange}
                placeholder="Contoh: Audit, Administrasi"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Deadline</label>

              <input
                type="date"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Durasi</label>

              <input
                type="text"
                name="durasi"
                className="form-control"
                value={formData.durasi}
                onChange={handleChange}
                placeholder="Contoh: 4 Jam"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Simpan
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/tugas")}
            >
              Kembali
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahTugas;
