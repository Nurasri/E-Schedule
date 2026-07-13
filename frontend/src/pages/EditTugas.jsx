import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

function EditTugas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nama_tugas: "",
    deskripsi: "",
    prioritas: "Sedang",
    skill_dibutuhkan: "",
    deadline: "",
    durasi: "",
    catatan_tugas: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTugas = async () => {
    try {
      const response = await api.get(`/tugas/${id}`);

      const data = response.data;

      setFormData({
        ...data,
        deadline: data.deadline ? data.deadline.split("T")[0] : "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal mengambil data tugas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTugas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tugas/${id}`, formData);

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data tugas berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/tugas");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal memperbarui tugas",
      });
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status" />
          <p className="mt-3">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom">
          <h4 className="fw-bold mb-0">Edit Tugas</h4>
          <small className="text-muted">Perbarui informasi tugas</small>
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

              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Deskripsi</label>

                <textarea
                  rows="4"
                  name="deskripsi"
                  className="form-control"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                />
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
                  placeholder="Contoh : 4 Jam"
                  value={formData.durasi}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mb-4">
                <label className="form-label fw-semibold">Catatan Tugas</label>

                <textarea
                  rows="4"
                  name="catatan_tugas"
                  className="form-control"
                  placeholder="Catatan dari karyawan..."
                  value={formData.catatan_tugas || ""}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-dark">
                <i className="bi bi-check-circle me-2"></i>
                Update
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/tugas")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTugas;
