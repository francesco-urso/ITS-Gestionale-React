import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Box, Button, Typography, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "./Navbar";
import CreateProdotto from "./CreateProdotto";
import ProdottiList from "./ProdottiList";

const drawerWidth = 240;

const Prodotti = ({ isAdmin }) => {
  const theme = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orderBy, setOrderBy] = useState("prodotto");
  const [order, setOrder] = useState("asc");
  const [formData, setFormData] = useState({
    prodotto: "",
    descrizione: "",
    pezzi_magazzino: 0,
    prezzo: 0,
  });

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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Errore nel caricamento prodotti:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/api/products/${editingProduct.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:3000/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setOpen(false);
      setEditingProduct(null);
      setFormData({
        prodotto: "",
        descrizione: "",
        pezzi_magazzino: 0,
        prezzo: 0,
      });
      fetchProducts();
    } catch (error) {
      console.error("Errore durante l'aggiunta di un nuovo prodotto:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Errore durante la cancellazione di un prodotto: ", error);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isAdmin && <Navbar onDrawerChange={setIsNavOpen} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isNavOpen
            ? `calc(100% - ${drawerWidth}px)`
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              Lista Prodotti
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  prodotto: "",
                  descrizione: "",
                  pezzi_magazzino: 0,
                  prezzo: 0,
                });
                setOpen(true);
              }}
              sx={{ alignSelf: "flex-start" }}
            >
              Aggiungi Prodotto
            </Button>

            <ProdottiList
              products={getSortedProducts()}
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          </Box>

          <CreateProdotto
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={handleSubmit}
            editingProduct={editingProduct}
            formData={formData}
            setFormData={setFormData}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default Prodotti;
