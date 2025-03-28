import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import QRCodeSetup from "./QRCodeSetup";
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 240;

const CreateUser = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const theme = useTheme();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [emailError, setEmailError] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    if (!userData.name) return "Name obligatorio";
    if (!userData.email) return "Email obligatoria";
    if (!userData.password) return "Password obligatoria";
    return null;
  };

  const CSRF_TOKEN = import.meta.env.VITE_CSRF_SECRET;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-csrf-token": CSRF_TOKEN,
          },
        }
      );

      if (response.data.qrCode && response.data.secret) {
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        setShowQR(true);
      }

      setUserData({ name: "", email: "", password: "", role: "user" });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Errore durante la creazione dell'utente"
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar onDrawerChange={setIsNavOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isNavOpen
            ? `${drawerWidth}px`
            : `calc(100% - ${theme.spacing(7)})`,
          ml: isNavOpen ? `${theme.spacing(7)}px` : `${theme.spacing(7)}px`,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            mt: 3,
            mb: 3,
            px: { xs: 1, sm: isNavOpen ? 2 : 3 },
            transition: theme.transitions.create("padding", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            maxWidth: isNavOpen ? "none" : "100vw",
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Crea un nuovo Utente
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                value={userData.name}
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value });
                  setErrorMessage("");
                }}
                required
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={userData.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setUserData({ ...userData, email });
                  if (email && !validateEmail(email)) {
                    setEmailError("Inserisci un indirizzo email valido");
                  } else {
                    setEmailError("");
                  }
                }}
                error={!!emailError}
                helperText={emailError}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Ruolo</InputLabel>
                <Select
                  value={userData.role}
                  label="Role"
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Crea nuovo User
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <QRCodeSetup
        open={showQR}
        onClose={() => setShowQR(false)}
        qrCode={qrCode}
        secret={secret}
      />
    </Box>
  );
};

export default CreateUser;
