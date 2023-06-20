// <------------------------ IMPORTS ------------------------------->
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Sidebar = ({ children }) => {
  return (
    <Box sx={{ padding: "4%" }}>
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;
