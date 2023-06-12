import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MenuItem, Stack, TextareaAutosize } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Chip from "@mui/material/Chip";

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

  return (
    <AppBar open={open}>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Box
            sx={{
              paddingTop: "10px",
              paddingLeft: "10px",
              paddingBottom: "10px",
            }}
          >
            <Card>
              <CardContent>
                <Formik>
                  <Form>
                    <Box sx={{ marginBottom: "2%" }}>
                      <label htmlFor="name">
                        <Typography fontWeight="bold">Name</Typography>
                      </label>
                      <Field
                        as={TextField}
                        id="name"
                        name="name"
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          style: {
                            padding: "10px",
                          },
                        }}
                      />
                      <ErrorMessage name="name" component="div" />
                    </Box>

                    <Box sx={{ marginBottom: "2%" }}>
                      <label htmlFor="textarea">
                        <Typography fontWeight="bold">
                          News Description
                        </Typography>
                      </label>
                      <Field
                        as={TextareaAutosize}
                        id="textarea"
                        name="textarea"
                        minRows={3}
                        maxRows={5}
                        placeholder="Enter text here..."
                        style={{
                          width: "100%",
                          padding: "20px",
                          resize: "none",
                          border: "1px solid #ccc",
                        }}
                      />
                      <ErrorMessage name="textarea" component="div" />
                    </Box>

                    <Box sx={{ marginBottom: "2%" }}>
                      <label htmlFor="file">
                        <Typography fontWeight="bold">
                          File Upload (JPG or PNG)
                        </Typography>
                      </label>
                      <TextField
                        id="file"
                        name="file"
                        type="file"
                        variant="outlined"
                        fullWidth
                        accept="image/jpeg, image/png"
                        inputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <ErrorMessage name="file" component="div" />
                    </Box>

                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ marginRight: "10px", width: "25%" }}>
                        <label htmlFor="dropdown1">
                          <Typography fontWeight="bold">Author</Typography>
                        </label>
                        <Field
                          as={TextField}
                          id="dropdown1"
                          name="dropdown1"
                          select
                          variant="outlined"
                          fullWidth
                        >
                          <MenuItem value="option1">Option 1</MenuItem>
                          <MenuItem value="option2">Option 2</MenuItem>
                          <MenuItem value="option3">Option 3</MenuItem>
                        </Field>
                        <ErrorMessage name="dropdown1" component="div" />
                      </Box>

                      <Box sx={{ marginBottom: "10px", width: "25%" }}>
                        <label htmlFor="dropdown2">
                          <Typography fontWeight="bold">News Tag</Typography>
                        </label>
                        <Field
                          as={TextField}
                          id="dropdown2"
                          name="dropdown2"
                          select
                          variant="outlined"
                          fullWidth
                        >
                          <MenuItem value="option1">Option 1</MenuItem>
                          <MenuItem value="option2">Option 2</MenuItem>
                          <MenuItem value="option3">Option 3</MenuItem>
                        </Field>
                        <ErrorMessage name="dropdown2" component="div" />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Button variant="contained" type="submit">
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{ backgroundColor: "red" }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Form>
                </Formik>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            <Box sx={{ marginBottom: 3, paddingLeft: 8 }}>
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
                  width: "8px",
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
              <Card sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                  <Chip
                    label="Chip Outlined"
                    variant="outlined"
                    sx={{ width: "250px", marginBottom: "6px" }}
                  />
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default ManageNewsHistory;
