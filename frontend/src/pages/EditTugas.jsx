import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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
      console.error(error);

      alert("Gagal mengambil data tugas");
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

      alert("Tugas berhasil diperbarui");

      navigate("/tugas");
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Gagal memperbarui tugas");
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
          <h4>Edit Tugas</h4>{" "}
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

            <div className="mb-3">
              <label className="form-label">Durasi</label>

              <input
                type="text"
                name="durasi"
                className="form-control"
                value={formData.durasi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Catatan Tugas</label>

              <textarea
                name="catatan_tugas"
                className="form-control"
                rows="3"
                value={formData.catatan_tugas || ""}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary me-2">
              Update
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

export default EditTugas;
