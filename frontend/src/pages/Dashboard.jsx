import React, { useEffect, useState } from "react";
import UserDashboard from "../components/user/UserDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          throw new Error("Token scaduto");
        }

        setUserRole(decoded.role);
      } catch (error) {
        console.error("Errore di autenticazione:", error);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      ></Box>
    );
  }

  return userRole === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
