import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";

function TambahKaryawan() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      await api.post("/karyawan", formData);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data karyawan berhasil ditambahkan.",
        confirmButtonColor: "#212529",
      });

      navigate("/karyawan");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.response?.data?.message || "Gagal menambahkan data karyawan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Tambah Karyawan</h3>
        <small className="text-muted">
          Tambahkan data karyawan baru ke dalam sistem.
        </small>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nama Karyawan</label>

                <input
                  type="text"
                  name="nama_karyawan"
                  className="form-control"
                  value={formData.nama_karyawan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Password</label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Jabatan</label>

                <input
                  type="text"
                  name="jabatan"
                  className="form-control"
                  value={formData.jabatan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nomor HP</label>

                <input
                  type="text"
                  name="no_hp"
                  className="form-control"
                  value={formData.no_hp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Skill</label>

                <input
                  type="text"
                  name="skill"
                  className="form-control"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">Maksimal Tugas</label>

                <input
                  type="number"
                  name="maksimal_tugas"
                  className="form-control"
                  value={formData.maksimal_tugas}
                />

                <small className="text-muted">
                  Nilai default ditentukan oleh sistem.
                </small>
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate("/karyawan")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </button>

              <button
                type="submit"
                className="btn btn-dark px-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TambahKaryawan;
