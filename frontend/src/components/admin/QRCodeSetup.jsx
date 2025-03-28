import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

const QRCodeSetup = ({ open, onClose, qrCode, secret }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Configurazione Autenticazione a Due Fattori</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
            Scansiona questo codice QR con Google Authenticator o un'app simile,{" "}
            <br />
            una volta chiuso questo popup non sarà possibile riaprirlo.
          </Typography>
          <img src={qrCode} alt="QR Code" style={{ maxWidth: "100%" }} />
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "success.main",
            }}
          >
            Utente registrato con successo.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
            In alternativa, inserisci manualmente questo codice nell'app:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "monospace",
              bgcolor: "grey.100",
              p: 1,
              borderRadius: 1,
            }}
          >
            {secret}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Ho configurato l'app
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeSetup;
