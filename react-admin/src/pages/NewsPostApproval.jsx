// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid, TextField, Typography } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import NewsPostApprovalForm from "../components/NewsPostApprovalForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
import Axios from "../utils/axios.js";
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

const NewsPostApproval = ({ open }) => {
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);

  // function to notify successful edit or delete
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

  useEffect(() => {
    async function getHeadlines() {
      try {
        const response = await Axios.get("/get-unpublished-news");
        setNewsList(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getHeadlines();
  }, []);

  function handleChipClick(item) {
    setSelectedNews(item);
  }

  // JSX content for the sidebar specific to NewsPostApprovalForm screen.
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
        {newsList.map((item) => (
          <Chip
            key={item._id}
            label={item.title}
            variant="outlined"
            title={item.title}
            sx={{ marginBottom: "6px", width: "100%" }}
            onClick={() => handleChipClick(item)}
          />
        ))}
      </Box>
    </Box>
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
                <NewsPostApprovalForm
                  selectedNews={selectedNews}
                  handleSubmitFunc={handleSubmitFunc}
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
  );
};

export default NewsPostApproval;