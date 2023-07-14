// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import { Button, ListItemIcon } from "@mui/material";
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
  backgroundColor: "white",
  color: "black",
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAuthContext();
  const [activeItem, setActiveItem] = useState(""); // state to handle the selected tab
  const [pageText, setPageText] = useState(""); // state to set the page headline
  const { user } = useAuthContext();

  const tabs = [
    { label: "Create a post", url: "/create-post" },
    { label: "Edit and Publish", url: "/edit-and-publish-post" },
    { label: "Manage News History", url: "/manage-news-history" },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItemClick = (item) => {
    setActiveItem(item.label);
    navigate(item.url);
    setPageText(item.label);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  function getLabelByUrl(url) {
    const tab = tabs.find((tab) => tab.url === url);
    setActiveItem(tab ? tab.label : null);
  }

  useEffect(() => {
    let currentUrl = location.pathname;
    getLabelByUrl(currentUrl);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {pageText}
          </Typography>
          <Box sx={{ ml: "auto", display: "flex", gap: 3 }}>
            <Box>
              <Typography variant="h6">
                {user ? user.username : null}
              </Typography>
            </Box>
            <Box>
              <Button
                edge="end"
                onClick={handleLogoutClick}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            padding: "3%",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  activeItem === "Create a post" ? "#e2e8f0" : "transparent",
              }}
              onClick={() => handleListItemClick(tabs[0])}
            >
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary={"Create a post"} />
            </ListItemButton>
          </ListItem>
        </List>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  activeItem === "Edit and Publish" ? "#e2e8f0" : "transparent",
              }}
              onClick={() => handleListItemClick(tabs[1])}
            >
              <ListItemIcon>
                <BorderColorIcon />
              </ListItemIcon>
              <ListItemText primary={"Edit and Publish"} />
            </ListItemButton>
          </ListItem>
        </List>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                backgroundColor:
                  activeItem === "Manage News History"
                    ? "#e2e8f0"
                    : "transparent",
              }}
              onClick={() => handleListItemClick(tabs[2])}
            >
              <ListItemIcon>
                <ManageHistoryIcon />
              </ListItemIcon>
              <ListItemText primary={"Manage News History"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
