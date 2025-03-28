import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";

const CSRF_TOKEN = import.meta.env.VITE_CSRF_SECRET;

const TwoFactorAuth = ({ open, onClose, userId, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    try {
      if (!otp) {
        setError("Inserisci il codice OTP");
        return;
      }

      const tempToken = localStorage.getItem("temp_token");
      const formattedOtp = otp.replace(/\s/g, "").padStart(6, "0");

      const response = await axios.post(
        "http://localhost:3000/auth/verify-2fa",
        {
          userId,
          token: formattedOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            "Content-Type": "application/json",
            "x-csrf-token": CSRF_TOKEN,
          },
        }
      );

      if (response.data.success) {
        onVerified(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Verifica 2FA fallita");
      console.error("Errore durante la verifica 2FA:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verifica Autenticazione a Due Fattori</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Inserisci il codice OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
              setOtp(value);
            }}
            type="text"
            inputProps={{
              maxLength: 6,
              pattern: "[0-9]*",
              inputMode: "numeric",
              autoComplete: "one-time-code",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          color="primary"
          disabled={otp.length !== 6}
        >
          Verifica
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoFactorAuth;
