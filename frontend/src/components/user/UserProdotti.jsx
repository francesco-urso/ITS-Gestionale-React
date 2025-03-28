import { Box } from "@mui/material";
import Prodotti from "../admin/Prodotti";

const UserProdotti = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box component="main">
        <Prodotti isAdmin={false} />
      </Box>
    </Box>
  );
};

export default UserProdotti;
