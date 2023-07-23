// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, Typography } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import EditAndPublishForm from "../components/EditAndPublishForm";
import "react-datepicker/dist/react-datepicker.css";
import Chip from "@mui/material/Chip";
import Axios from "../utils/axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthContext } from "../hooks/useAuthContext.js";

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

const EditAndPublish = ({ open }) => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);
  const [loader, setLoader] = useState(false); // state to handle page loader
  const [handleWordLimit, setHandleWordLimit] = useState(false);
  const { dispatch } = useAuthContext();

  // function to handle loader close
  const handleLoaderClose = () => {
    setLoader(false);
  };

  // function to handle loader open
  const handleLoaderOpen = () => {
    setLoader(true);
  };

  const handleImageSize = (fileInputRef) => {
    toast.error("Image size should be less than 1MB", {
      autoClose: 1500,
      theme: "dark",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // function to notify successful edit or delete
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

  useEffect(() => {
    async function getHeadlines() {
      try {
        const response = await Axios.get("/news/get-unpublished-news");
        setNewsList(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getHeadlines();
  }, [selectedNews]);

  useEffect(() => {
    if (handleWordLimit) {
      toast.error("Word count for description should be more than 25", {
        autoClose: 1500,
        theme: "dark",
      });
      setHandleWordLimit(false);
    }
  }, [handleWordLimit]);

  function handleChipClick(item) {
    setSelectedNews(item);
  }

  // function to handle 401 unauthorised error
  const handleUserUnauthorised = () => {
    setLoader(false);
    toast.error("Access token expired, login again", {
      autoClose: 2000,
      theme: "dark",
    });

    // Dispatch the action after 2 seconds
    setTimeout(() => {
      dispatch({ type: "LOGOUT" });
    }, 2000);
  };

  // JSX content for the sidebar specific to EditAndPublishForm screen.
  const sideBarContent = (
    <Box
      sx={{
        maxHeight: "475px",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "gray lightgray",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          borderRadius: "8px",
          background: "lightgray",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "8px",
          background: "gray",
        },
        paddingLeft: "10px",
      }}
    >
      <Typography component="span" variant="h5" color="black" fontWeight="bold">
        Unpublished News
      </Typography>
      <Box
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            borderRadius: "8px",
            background: "lightgray",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "8px",
            background: "gray",
          },
        }}
      >
        {newsList.length != 0 ? (
          newsList.map((item) => (
            <Chip
              key={item._id}
              label={item.title ? item.title : item.sinhalaTitle}
              variant="outlined"
              title={item.title ? item.title : item.sinhalaTitle}
              sx={{ marginBottom: "6px", width: "100%" }}
              onClick={() => handleChipClick(item)}
            />
          ))
        ) : (
          <Box sx={{ margin: "4%" }}>
            <Typography color="red">No unpublished news available !</Typography>
          </Box>
        )}
      </Box>
    </Box>
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
                  <EditAndPublishForm
                    setSelectedNews={setSelectedNews}
                    selectedNews={selectedNews}
                    handleSubmitFunc={handleSubmitFunc}
                    handleLoaderOpen={handleLoaderOpen}
                    handleLoaderClose={handleLoaderClose}
                    handleImageSize={handleImageSize}
                    setHandleWordLimit={setHandleWordLimit}
                    handleUserUnauthorised={handleUserUnauthorised}
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

export default EditAndPublish;
