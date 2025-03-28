import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { Box, Container, Typography, Button } from "@mui/material";
import UserList from "./UserList";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import EditUserDialog from "./EditUserDialog";
import { useTheme } from "@mui/material/styles";

const CSRF_TOKEN = import.meta.env.VITE_CSRF_SECRET;
const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const username = localStorage.getItem("user") || "Admin";
  const [isNavOpen, setIsNavOpen] = useState(true);
  const theme = useTheme();
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-csrf-token": CSRF_TOKEN,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Errore:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-csrf-token": CSRF_TOKEN,
        },
      });
      await fetchUsers();
    } catch (error) {
      console.error("Errore durante la disattivazione dell'utente:", error);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/auth/users/${userId}/reactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-csrf-token": CSRF_TOKEN,
          },
        }
      );
      await fetchUsers();
    } catch (error) {
      console.error("Errore riattivazione utente:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Sicuro di voler cancellare l'utente?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:3000/auth/users/${userId}/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-csrf-token": CSRF_TOKEN,
            },
          }
        );
        await fetchUsers();
      } catch (error) {
        console.error("Errore durante l'eliminazione dell'utente:", error);
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/auth/users/${editUser.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-csrf-token": CSRF_TOKEN,
          },
        }
      );
      setOpenDialog(false);
      await fetchUsers();
    } catch (error) {
      console.error("Errore durante la modifca dell'utente:", error);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setOpenDialog(true);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar onDrawerChange={setIsNavOpen} />
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
              Benvenuto nella dashboard {username}
            </Typography>
            <Typography variant="h5">Lista degli utenti registrati</Typography>
            <Button
              onClick={() => navigate("/create-user")}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              Aggiungi Utente
            </Button>
            <UserList
              users={users}
              onEdit={handleEditClick}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
              onDelete={handleDelete}
              orderBy={orderBy}
              order={order}
              onSort={handleSort}
            />
          </Box>
          <EditUserDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            editForm={editForm}
            setEditForm={setEditForm}
            onSubmit={handleEditSubmit}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
