// <------------------------ IMPORTS ------------------------------->
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import CreatePostForm from "../components/CreatePostForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

const CreatePost = ({ open }) => {
  const [loader, setLoader] = useState(false); // state to handle page loader
  const { dispatch } = useAuthContext();

  // function to handle loader close
  const handleLoaderClose = () => {
    setLoader(false);
  };

  // function to handle entry of atleast one title (english or sinhala)
  const handleHeadline = (fileInputRef) => {
    toast.error(
      "Either English Headline or Sinhala Headline should be entered",
      {
        autoClose: 1500,
        theme: "dark",
      }
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // function to handle image size
  const handleImageSize = (fileInputRef) => {
    toast.error("Image size should be less than 1MB", {
      autoClose: 1500,
      theme: "dark",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // function to handle loader open
  const handleLoaderOpen = () => {
    setLoader(true);
  };

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

  const handleWordLimit = () => {
    toast.error("Description word count should be greater than 25", {
      autoClose: 1500,
      theme: "dark",
    });
  };

  const sideBarContent = (
    <Box sx={{ padding: "4%" }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            <b>How to use the Admin Panel</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <b>Create a post: </b>Push a news post for the first time.
            <hr />
            <b>Edit and publish: </b> <br></br>
            Edit, translate, add an image, add tags to a post that has been
            pushed.<br></br>Publish and Approve a news post that has been
            pushed.
            <hr />
            <b>Manage News History: </b>
            Edit or Delete published news posts.
          </Typography>
        </AccordionDetails>
      </Accordion>
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
                  <CreatePostForm
                    handleSubmitFunc={handleSubmitFunc}
                    handleLoaderOpen={handleLoaderOpen}
                    handleLoaderClose={handleLoaderClose}
                    handleImageSize={handleImageSize}
                    handleHeadline={handleHeadline}
                    handleWordLimit={handleWordLimit}
                    handleUserUnauthorised={handleUserUnauthorised}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={4}>
            {sideBarContent}
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

export default CreatePost;
