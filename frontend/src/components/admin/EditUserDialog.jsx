import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const EditUserDialog = ({ open, onClose, editForm, setEditForm, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifica Utente</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nome"
          fullWidth
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Email"
          fullWidth
          value={editForm.email}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={editForm.password}
          onChange={(e) =>
            setEditForm({ ...editForm, password: e.target.value })
          }
          placeholder="Inserisci la password nuova"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Ruolo</InputLabel>
          <Select
            value={editForm.role}
            label="Ruolo"
            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annulla</Button>
        <Button onClick={onSubmit} color="primary">
          Salva
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
