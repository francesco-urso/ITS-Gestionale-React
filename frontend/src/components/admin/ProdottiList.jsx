import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const ProdottiList = ({
  products,
  orderBy,
  order,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "95%",
        margin: "0",
        maxWidth: "1000px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {["prodotto", "descrizione", "pezzi_magazzino", "prezzo"].map(
              (column) => (
                <TableCell key={column}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 0.5,
                    }}
                    onClick={() => onSort(column)}
                  >
                    {column.replace("_", " ").toUpperCase()}
                    {orderBy === column ? (
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
              )
            )}
            <TableCell>AZIONI</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{product.prodotto}</TableCell>
              <TableCell>{product.descrizione}</TableCell>
              <TableCell>{product.pezzi_magazzino}</TableCell>
              <TableCell>€ {product.prezzo}</TableCell>
              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEdit(product)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(product.id)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProdottiList;
