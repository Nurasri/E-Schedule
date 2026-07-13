import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";

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

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Data karyawan gagal diambil",
      });
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

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data karyawan berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/karyawan");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.response?.data?.message || "Gagal memperbarui data.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Edit Karyawan</h3>
        <small className="text-muted">Perbarui informasi karyawan.</small>
      </div>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Nama Karyawan</label>

                <input
                  type="text"
                  className="form-control"
                  name="nama_karyawan"
                  value={formData.nama_karyawan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Jabatan</label>

                <input
                  type="text"
                  className="form-control"
                  name="jabatan"
                  value={formData.jabatan}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">No HP</label>

                <input
                  type="text"
                  className="form-control"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label fw-semibold">Skill</label>

                <textarea
                  className="form-control"
                  rows="3"
                  name="skill"
                  value={formData.skill}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  Status Ketersediaan
                </label>

                <select
                  className="form-select"
                  name="status_ketersediaan"
                  value={formData.status_ketersediaan}
                  onChange={handleChange}
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Sibuk">Sibuk</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Jumlah Tugas</label>

                <input
                  type="number"
                  className="form-control"
                  name="jumlah_tugas"
                  value={formData.jumlah_tugas}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Maksimal Tugas</label>

                <input
                  type="number"
                  className="form-control"
                  name="maksimal_tugas"
                  value={formData.maksimal_tugas}
                  onChange={handleChange}
                />
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/karyawan")}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Kembali
              </button>

              <button type="submit" className="btn btn-dark">
                <i className="bi bi-check-circle me-2"></i>
                Update Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditKaryawan;
