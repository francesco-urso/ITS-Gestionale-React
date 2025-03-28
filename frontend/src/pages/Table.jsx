import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const ProductTable = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orderBy, setOrderBy] = useState("prodotto");
  const [order, setOrder] = useState("asc");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Errore nel caricamento prodotti:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getSortedProducts = () => {
    return [...products].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return order === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Lista dei prodotti disponibili
          </Typography>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="product table">
            <TableHead>
              <TableRow>
                {["prodotto", "descrizione", "pezzi_magazzino", "prezzo"].map(
                  (column) => (
                    <TableCell
                      key={column}
                      onClick={() => handleSort(column)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedProducts().map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.prodotto}</TableCell>
                  <TableCell>{product.descrizione}</TableCell>
                  <TableCell>{product.pezzi_magazzino}</TableCell>
                  <TableCell>€ {Number(product.prezzo).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ProductTable;
