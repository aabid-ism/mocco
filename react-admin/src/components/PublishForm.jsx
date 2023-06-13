import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MenuItem, TextareaAutosize } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "../utils/axios.js";

const PublishForm = () => {
  const initialValues = {
    title: "",
    description: "",
    file: "",
    author: "",
    newsTag: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const response = await Axios.post("/add-news", values);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <Box sx={{ marginBottom: "2%" }}>
          <label htmlFor="name">
            <Typography fontWeight="bold">Title</Typography>
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
            <Typography fontWeight="bold">News Description</Typography>
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
            <Typography fontWeight="bold">File Upload (JPG or PNG)</Typography>
          </label>
          <Field
            as={TextField}
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
              <MenuItem value="option1">Sarah Johnson</MenuItem>
              <MenuItem value="option2">Michael Thompson</MenuItem>
              <MenuItem value="option3">Emily Davis</MenuItem>
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
              <MenuItem value="option1">Sports</MenuItem>
              <MenuItem value="option2">Politics</MenuItem>
              <MenuItem value="option3">Science and Technology</MenuItem>
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
            Publish
          </Button>
        </Box>
      </Form>
    </Formik>
  );
};

export default PublishForm;
