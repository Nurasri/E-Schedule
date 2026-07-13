import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data tugas berhasil ditambahkan.",
        confirmButtonColor: "#212529",
      });

      navigate("/tugas");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal menambahkan tugas.",
        confirmButtonColor: "#212529",
      });
    }
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom">
          <h4 className="fw-bold mb-0">Tambah Tugas</h4>
          <small className="text-muted">Tambah tugas karyawan</small>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nama Tugas</label>

                <input
                  type="text"
                  name="nama_tugas"
                  className="form-control"
                  value={formData.nama_tugas}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Prioritas</label>

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

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Skill Dibutuhkan
                </label>

                <input
                  type="text"
                  name="skill_dibutuhkan"
                  className="form-control"
                  value={formData.skill_dibutuhkan}
                  onChange={handleChange}
                  placeholder="Contoh : Administrasi, Audit, Excel"
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Deadline</label>

                <input
                  type="date"
                  name="deadline"
                  className="form-control"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Durasi</label>

                <input
                  type="text"
                  name="durasi"
                  className="form-control"
                  value={formData.durasi}
                  onChange={handleChange}
                  placeholder="Contoh : 4 Jam"
                  required
                />
              </div>

              <div className="col-12 mb-4">
                <label className="form-label fw-semibold">Deskripsi</label>

                <textarea
                  name="deskripsi"
                  rows="5"
                  className="form-control"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi tugas..."
                  required
                />
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/tugas")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </button>

              <button type="submit" className="btn btn-dark">
                <i className="bi bi-check-circle me-2"></i>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahTugas;
