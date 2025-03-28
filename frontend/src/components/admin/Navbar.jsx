import * as React from "react";
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
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ViewListIcon from "@mui/icons-material/ViewList";

const drawerWidth = 240;

const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "createUser",
    title: "Crea Utente",
    icon: <PersonAddIcon />,
  },
  {
    segment: "products",
    title: "Lista prodotti",
    icon: <ViewListIcon />,
  },
];

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

const Navbar = ({ onDrawerChange = () => {} }) => {
  const navigate = useNavigate();
  const [openReports, setOpenReports] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
    onDrawerChange(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleClick = (segment, hasChildren) => {
    if (hasChildren) {
      setOpenReports(!openReports);
    } else {
      switch (segment) {
        case "dashboard":
          navigate("/Dashboard");
          break;
        case "createUser":
          navigate("/create-user");
          break;
        case "products":
          navigate("/admin/products");
          break;
        default:
          break;
      }
    }
  };

  const email = localStorage.getItem("email") || "email@email.com";
  const username = localStorage.getItem("user") || "Admin";

  const renderNavItems = (items) => {
    return items.map((item, index) => {
      if (item.kind === "header") {
        return (
          <Typography
            key={index}
            variant="overline"
            sx={{ px: 3, py: 1.5, display: "block" }}
          >
            {item.title}
          </Typography>
        );
      }

      if (item.kind === "divider") {
        return (
          <Box
            key={index}
            sx={{ my: 1, borderBottom: 1, borderColor: "divider" }}
          />
        );
      }

      if (item.children) {
        return (
          <React.Fragment key={index}>
            <StyledListItem onClick={() => handleClick(item.segment, true)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              {openReports ? <ExpandLess /> : <ExpandMore />}
            </StyledListItem>
            <Collapse in={openReports} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child, childIndex) => (
                  <StyledListItem
                    key={childIndex}
                    onClick={() => handleClick(child.segment)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>{child.icon}</ListItemIcon>
                    <ListItemText primary={child.title} />
                  </StyledListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }

      return (
        <StyledListItem key={index} onClick={() => handleClick(item.segment)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </StyledListItem>
      );
    });
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
          {open ? (
            <ChevronLeftIcon />
          ) : (
            <MenuIcon fontSize="large" color="primary" />
          )}
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

      <List component="nav">{renderNavItems(NAVIGATION)}</List>
    </StyledDrawer>
  );
};

export default Navbar;
