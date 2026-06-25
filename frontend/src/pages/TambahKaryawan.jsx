import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function TambahKaryawan() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_karyawan: "",
    email: "",
    password: "",
    jabatan: "",
    no_hp: "",
    skill: "",
    maksimal_tugas: 5,
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
      await api.post("/karyawan", formData);

      alert("Karyawan berhasil ditambahkan");

      navigate("/karyawan");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal menambahkan karyawan");
    }
  };

  return (
    <div className="container-fluid">
      {" "}
      <div className="card shadow-sm">
        {" "}
        <div className="card-header">
          {" "}
          <h4>Tambah Karyawan</h4>{" "}
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
              <label className="form-label">Password</label>

              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
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

            <div className="mb-4">
              <label className="form-label">Maksimal Tugas</label>

              <input
                type="number"
                name="maksimal_tugas"
                className="form-control"
                value={formData.maksimal_tugas}
                onChange={handleChange}
                min="1"
                disabled
                required
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Simpan
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

export default TambahKaryawan;
