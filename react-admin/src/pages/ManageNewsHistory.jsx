import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../components/Sidebar";
import ManageNewsHistoryForm from "../components/ManageNewsHistoryForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chip from "@mui/material/Chip";
import { Stack } from "@mui/material";
import Axios from "../utils/axios.js";

const drawerWidth = 240;

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

const ManageNewsHistory = ({ open }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState([]);

  useEffect(() => {
    async function getHeadlines() {
      try {
        const date = new Date(startDate);
        const formattedDate = date.toISOString().split("T")[0];
        const response = await Axios.post("/get-news-by-date", {
          date: formattedDate,
        });
        setNewsList(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getHeadlines();
  }, [startDate]);

  const data = [
    {
      id: 1,
      text: "New Study Shows Benefits of Exercise for Mental Health",
    },
    {
      id: 2,
      text: "Global Stock Market Reaches All-Time High",
    },
    {
      id: 3,
      text: "Scientists Discover Potential Treatment for Alzheimer's",
    },
    {
      id: 4,
      text: "Record-Breaking Heatwave Sweeps Across Europe",
    },
    {
      id: 5,
      text: "Government Announces Plan to Reduce Carbon Emissions",
    },
    {
      id: 6,
      text: "Major Tech Company Unveils Groundbreaking Innovation",
    },
    {
      id: 7,
      text: "World Leaders Gather for Climate Change Summit",
    },
    {
      id: 8,
      text: "COVID-19 Vaccination Efforts Expand Globally",
    },
    {
      id: 9,
      text: "Breaking News: Earthquake Strikes Coastal Region",
    },
    {
      id: 10,
      text: "Local Hero Saves Child from Burning Building",
    },
  ];

  function handleChipClick(item) {
    setSelectedNews(item);
  }

  const sideBarContent = (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
      }}
    >
      <Box sx={{ marginBottom: 3 }}>
        <label htmlFor="datepicker">Select a date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          open={true}
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
    </Stack>
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
                <ManageNewsHistoryForm selectedNews={selectedNews} />
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Sidebar>{sideBarContent}</Sidebar>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default ManageNewsHistory;
