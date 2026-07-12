import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("nama", response.data.nama);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <div
        className="card shadow-lg border-0 p-3"
        style={{
          width: "500px",
          borderRadius: "20px",
        }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-5">
            <div
              className="mx-auto d-flex justify-content-center align-items-center shadow"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "24px",
                background: "linear-gradient(135deg,#0d6efd,#4f8cff)",
              }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-calendar2-week-fill"
                  style={{
                    fontSize: "48px",
                    color: "white",
                  }}
                ></i>

                <i
                  className="bi bi-check-circle-fill position-absolute"
                  style={{
                    fontSize: "18px",
                    color: "#22c55e",
                    right: "-6px",
                    bottom: "-2px",
                    background: "white",
                    borderRadius: "50%",
                  }}
                ></i>
              </div>
            </div>

            <h1 className="fw-bold mt-4 mb-1">E-Schedule</h1>

            <p className="text-muted">Sistem Penjadwalan Tugas Karyawan</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>

              <input
                type="email"
                name="email"
                className="form-control py-3"
                placeholder="Masukkan email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>

              <input
                type="password"
                name="password"
                className="form-control py-3"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
