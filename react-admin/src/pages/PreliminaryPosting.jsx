// <------------------------ IMPORTS ------------------------------->
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import PreliminaryPostingForm from "../components/PreliminaryPostingForm";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const drawerWidth = 240;

// function used for smooth transitioning of the page based on the opening and closing of the navigation bar
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  color: "black",
  marginTop: "4%",
  height: "100%",
  backgroundColor: "#f3f4f6",
  boxShadow: "none",
  overflowY: "scroll",
  "&::-webkit-scrollbar": {
    width: "0.4em",
    backgroundColor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
  },
  paddingBottom: "5%",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const PreliminaryPosting = ({ open }) => {
  const [loader, setLoader] = useState(false); // state to handle page loader

  // function to handle loader close
  const handleLoaderClose = () => {
    setLoader(false);
  };

  // function to handle loader open
  const handleLoaderOpen = () => {
    setLoader(true);
  };

  // function to notify successful upload
  const handleSubmitFunc = (response) => {
    if (response.status === 200) {
      toast.success(response.data.message, {
        autoClose: 1500,
        theme: "dark",
      });
    } else {
      toast.error(response.message, {
        autoClose: 1500,
        theme: "dark",
      });
    }
  };

  const sideBarContent = (
    <>
      <h2>Preliminary Posting Sidebar Content...</h2>
    </>
  );

  return (
    <>
      <AppBar open={open}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box
              sx={{
                paddingTop: "2%",
                paddingLeft: "2%",
                paddingBottom: "2%",
              }}
            >
              <Card>
                <CardContent>
                  <PreliminaryPostingForm
                    handleSubmitFunc={handleSubmitFunc}
                    handleLoaderOpen={handleLoaderOpen}
                    handleLoaderClose={handleLoaderClose}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Sidebar>{sideBarContent}</Sidebar>
          </Grid>
        </Grid>
        <ToastContainer />
      </AppBar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default PreliminaryPosting;
