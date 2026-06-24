import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/auth/me");

      setAdmin(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h2>Dashboard</h2>

      <hr />

      <h5>Selamat Datang, {admin?.nama || "-"}</h5>
    </>
  );
}

export default Dashboard;
