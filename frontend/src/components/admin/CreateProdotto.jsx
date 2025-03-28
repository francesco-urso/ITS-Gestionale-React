import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

const CreateProdotto = ({
  open,
  onClose,
  onSubmit,
  editingProduct,
  formData,
  setFormData,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingProduct ? "Modifica Prodotto" : "Aggiungi Prodotto"}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Prodotto"
            margin="normal"
            value={formData.prodotto}
            onChange={(e) =>
              setFormData({ ...formData, prodotto: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Descrizione"
            margin="normal"
            multiline
            rows={4}
            value={formData.descrizione}
            onChange={(e) =>
              setFormData({ ...formData, descrizione: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Pezzi in Magazzino"
            margin="normal"
            type="number"
            value={formData.pezzi_magazzino}
            onChange={(e) =>
              setFormData({
                ...formData,
                pezzi_magazzino: parseInt(e.target.value),
              })
            }
          />
          <TextField
            fullWidth
            label="Prezzo €"
            margin="normal"
            type="number"
            value={formData.prezzo}
            onChange={(e) =>
              setFormData({
                ...formData,
                prezzo: parseFloat(e.target.value),
              })
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {editingProduct ? "Modifica" : "Aggiungi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateProdotto;
