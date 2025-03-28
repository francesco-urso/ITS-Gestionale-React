import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const UserList = ({
  users,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
  orderBy,
  order,
  onSort,
}) => {
  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      let aValue, bValue;

      switch (orderBy) {
        case "status":
          aValue = !a.isDeleted ? "attivo" : "disattivato";
          bValue = !b.isDeleted ? "attivo" : "disattivato";
          break;
        case "role":
          aValue = a.role || "";
          bValue = b.role || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        default:
          aValue = a[orderBy] || "";
          bValue = b[orderBy] || "";
      }

      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();

      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", margin: "0", maxWidth: "1200px" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 0.5,
                }}
                onClick={() => onSort("name")}
              >
                Nome
                {orderBy === "name" ? (
                  order === "asc" ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )
                ) : (
                  <ArrowDownwardIcon
                    fontSize="small"
                    sx={{ color: "grey.500" }}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 0.5,
                }}
                onClick={() => onSort("email")}
              >
                Email
                {orderBy === "email" ? (
                  order === "asc" ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )
                ) : (
                  <ArrowDownwardIcon
                    fontSize="small"
                    sx={{ color: "grey.500" }}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 0.5,
                }}
                onClick={() => onSort("role")}
              >
                Ruolo
                {orderBy === "role" ? (
                  order === "asc" ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )
                ) : (
                  <ArrowDownwardIcon
                    fontSize="small"
                    sx={{ color: "grey.500" }}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 0.5,
                }}
                onClick={() => onSort("status")}
              >
                Stato
                {orderBy === "status" ? (
                  order === "asc" ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )
                ) : (
                  <ArrowDownwardIcon
                    fontSize="small"
                    sx={{ color: "grey.500" }}
                  />
                )}
              </Box>
            </TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedUsers().map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "medium",
                  }}
                >
                  {user.role === "admin" ? "Amministratore" : "Utente"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  label={!user.isDeleted ? <CheckIcon /> : <ClearIcon />}
                  color={!user.isDeleted ? "success" : "error"}
                  size="small"
                >
                  {!user.isDeleted ? "Attivo" : "Disattivato"}
                </Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      size="medium"
                      onClick={() => onEdit(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    {user.isDeleted ? (
                      <IconButton
                        color="success"
                        size="medium"
                        onClick={() => onReactivate(user.id)}
                      >
                        <RestoreIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="error"
                        size="medium"
                        onClick={() => onDeactivate(user.id)}
                      >
                        <BlockIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="medium"
                      color="error"
                      onClick={() => onDelete(user.id)}
                      title="Elimina definitivamente"
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;
