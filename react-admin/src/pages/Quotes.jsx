// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import QuotesForm from "../components/QuotesForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
import Axios from "../utils/axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import EventIcon from "@mui/icons-material/Event";
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

const Quotes = ({ open }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [quotesList, setQuotesList] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState([]);
  const [loader, setLoader] = useState(false); // state to handle page loader
  const [formEnabledToAddQuote, setFormEnabledToAddQuote] = useState(true);
  const [formEnabledToEditQuote, setFormEnabledToEditQuote] = useState(true);
  const { dispatch } = useAuthContext();

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

  const handleImageSize = (fileInputRef) => {
    toast.error("Image size should be less than 1MB", {
      autoClose: 1500,
      theme: "dark",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // function to handle loader close
  const handleLoaderClose = () => {
    setLoader(false);
  };

  const handlePublishValidation = () => {
    toast.error("Either Sinhala or English Quote should be entered", {
      autoClose: 1500,
      theme: "dark",
    });
  };

  // function to handle loader open
  const handleLoaderOpen = () => {
    setLoader(true);
  };

  useEffect(() => {
    async function getEventData() {
      try {
        // get bearer token
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const date = new Date(startDate);
        const formattedDate = date.toISOString().split("T")[0];

        // get published events from events collection
        const eventsResponse = await Axios.post(
          "/quotes/get-quotes",
          {
            date: formattedDate,
          },
          { headers }
        );

        const responseArrayList = [...eventsResponse.data];

        setQuotesList(responseArrayList);
      } catch (err) {
        console.error(err);
      }
    }

    getEventData();
  }, [startDate, selectedQuote]);

  function handleChipClick(item) {
    setSelectedQuote(item);
    setFormEnabledToAddQuote(true);
    setFormEnabledToEditQuote(false);
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
      console.log("hey");
      dispatch({ type: "LOGOUT" });
    }, 2000);
  };

  // JSX content for the sidebar specific to Quotes screen.
  const sideBarContent = (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          inline
        />
      </Box>
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
        <Box sx={{ display: "flex", marginY: "3%", justifyContent: "center" }}>
          <Button
            variant="outlined"
            type="submit"
            startIcon={<EventIcon />}
            sx={{
              borderColor: "red",
              color: "red",
              "&:hover": {
                borderColor: "red",
                color: "red",
              },
            }}
            onClick={() => {
              setFormEnabledToEditQuote(true);
              setFormEnabledToAddQuote((prev) => !prev);
            }}
          >
            Add Event
          </Button>
        </Box>
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
          {quotesList.map((item) => (
            <Chip
              key={item._id}
              label={item.quote}
              variant="outlined"
              title={item.quote}
              sx={{ marginBottom: "6px", width: "100%" }}
              onClick={() => handleChipClick(item)}
            />
          ))}
        </Box>
      </Box>
    </Stack>
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
                  <QuotesForm
                    setSelectedQuote={setSelectedQuote}
                    selectedQuote={selectedQuote}
                    handleSubmitFunc={handleSubmitFunc}
                    handleLoaderOpen={handleLoaderOpen}
                    handleLoaderClose={handleLoaderClose}
                    handleImageSize={handleImageSize}
                    formEnabledToAddQuote={formEnabledToAddQuote}
                    formEnabledToEditQuote={formEnabledToEditQuote}
                    startDate={startDate}
                    handlePublishValidation={handlePublishValidation}
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

export default Quotes;
