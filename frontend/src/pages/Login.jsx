import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import TwoFactorAuth from "./TwoFactorAuth";

const CSRF_TOKEN = import.meta.env.VITE_CSRF_SECRET;

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [show2FA, setShow2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            navigate("/Dashboard", { replace: true });
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          localStorage.removeItem("token", error);
        }
      }
    }
  }, [location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": CSRF_TOKEN,
          },
        }
      );

      if (response.data.isDisabled) {
        setError("Account disabilitato. Contattare l'amministratore.");
        return;
      }

      if (response.data.requires2FA) {
        setUserId(response.data.userId);
        localStorage.setItem("temp_token", response.data.tempToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        setShow2FA(true);
      } else {
        const { token, refreshToken, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", user.name);
        localStorage.setItem("email", user.email);
        navigate("/Dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Email o password errate");
      console.error("Login error:", error);
    }
  };

  const handle2FAVerified = (response) => {
    try {
      localStorage.removeItem("temp_token");
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", response.user.name);
      localStorage.setItem("email", response.user.email);
      setShow2FA(false);
      navigate("/Dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Verifica 2FA fallita");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h1" variant="h4">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <Box
            display={"flex"}
            justifyContent="flex-end"
            gap={"5px"}
            sx={{ mt: 2 }}
          >
            <Button type="submit" fullWidth variant="contained">
              Accedi
            </Button>
            <Button
              onClick={() => navigate("/")}
              color="primary"
              fullWidth
              variant="contained"
            >
              Torna alla home
            </Button>
          </Box>
        </Box>
      </Box>

      <TwoFactorAuth
        open={show2FA}
        onClose={() => setShow2FA(false)}
        userId={userId}
        onVerified={handle2FAVerified}
      />
    </Container>
  );
};

export default Login;
