import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
import UserProdotti from "./UserProdotti";
import UserNavbar from "./UserNavbar";

const drawerWidth = 240;

const UserDashboard = () => {
  const theme = useTheme();
  const [isNavOpen, setIsNavOpen] = useState(true);
  const username = localStorage.getItem("user");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <UserNavbar onDrawerChange={setIsNavOpen} />
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
              Benvenuto {username}
            </Typography>
            <Box sx={{ width: "100%" }}>
              <UserProdotti />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;
