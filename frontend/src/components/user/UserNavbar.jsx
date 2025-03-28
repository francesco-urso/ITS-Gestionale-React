import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  paddingLeft: theme.spacing(2),
}));

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : theme.spacing(7),
  flexShrink: 0,
  whiteSpace: "nowrap",
  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : theme.spacing(7),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const UserNavbar = ({ onDrawerChange = () => {} }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const email = localStorage.getItem("email") || "email@email.com";
  const username = localStorage.getItem("user") || "User";

  const toggleDrawer = () => {
    setOpen(!open);
    onDrawerChange(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ...(open ? {} : { display: "none" }),
          }}
        >
          <MonitorHeartIcon fontSize="large" color="primary" />
          <Typography variant="h5" component="div">
            Gestionale
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          ...(open ? {} : { display: "none" }),
        }}
      >
        <Typography variant="body1">{email}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: "700" }}>
            {username}
          </Typography>
          <IconButton color="error" size="small" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      <List>
        <StyledListItem onClick={() => navigate("/Dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </StyledListItem>
      </List>
    </StyledDrawer>
  );
};

export default UserNavbar;
