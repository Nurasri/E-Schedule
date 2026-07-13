import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Swal from "sweetalert2";

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

      const { token, role, nama } = response.data;

      // hanya admin yang boleh masuk
      if (role !== "admin") {
        await Swal.fire({
          icon: "error",
          title: "Akses Ditolak",
          text: "Hanya Admin yang dapat mengakses website ini.",
          confirmButtonColor: "#0d6efd",
        });

        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("nama", nama);

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang Admin",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/dashboard");

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Login gagal",
        confirmButtonColor: "#0d6efd",
      });
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
              className="mx-auto d-flex justify-content-center align-items-center shadow-lg"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20px",
                background: "#f4f6f9",
              }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-calendar2-week-fill text-dark"
                  style={{
                    fontSize: "48px",
                    color: "white",
                  }}
                ></i>

                <i
                  className="bi bi-check-circle-fill position-absolute text-dark"
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
                className="form-control form-control-lg"
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
                className="form-control form-control-lg"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn btn-dark btn-lg w-100 py-3 fw-semibold"
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
