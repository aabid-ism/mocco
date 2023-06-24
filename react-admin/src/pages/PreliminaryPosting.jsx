// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import PreliminaryPostingForm from "../components/PreliminaryPostingForm";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  // function to notify successful upload
  const handleSubmitFunc = (response) => {
    if (response.status === 200) {
      toast.success(response.data.message, {
        theme: "dark",
        onClose: () => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      });
    } else {
      toast.error(response.data.message, {
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
                <PreliminaryPostingForm handleSubmitFunc={handleSubmitFunc} />
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
  );
};

export default PreliminaryPosting;
