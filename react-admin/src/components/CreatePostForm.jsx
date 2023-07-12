// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect, useRef, forwardRef, cloneElement } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Autocomplete, MenuItem, TextareaAutosize } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "../utils/axios.js";
import * as Yup from "yup";
import Backdrop from "@mui/material/Backdrop";
import { useSpring, animated } from "@react-spring/web";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// function used for smooth transitioning of the modal
const Fade = forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {cloneElement(children, { onClick })}
    </animated.div>
  );
});

const CreatePostForm = ({
  handleSubmitFunc,
  handleLoaderOpen,
  handleLoaderClose,
  handleImageSize,
}) => {
  const fileInputRef = useRef(); // useRef to reference the image upload component and reset after submit.
  const [open, setOpen] = useState(false); // state used to manipulate the opening and closing of modal.
  const [valid, setValid] = useState(false); // state to check if form has passed validation.
  const [data, setData] = useState({}); // state to store the data that has been submitted by form.
  const [dropDownList, setDropDownList] = useState(); // state to store the data return of the dropdown values from the api.
  const [selectedSecondaryTags, setSelectedSecondaryTags] = useState([]); // state to store selected secondary tags.
  const [imageUpload, setImageUpload] = useState(null); // state to store uploaded image.
  const [imageFormData, setImageFormData] = useState(null); // state to store form data of the uploaded image.
  const [lifeStyle, setLifeStyle] = useState(false); // boolean to set if lifestyle toggle is on or not.

  useEffect(() => {
    async function getDropDowns() {
      try {
        // get bearer token
        const token = localStorage.getItem("jwt");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await Axios.get("/news/get-drop-downs", { headers });
        setDropDownList(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getDropDowns();
  }, []);

  // Initial values of the form data.
  const initialValues = {
    title: "",
    sinhalaTitle: "",
    description: "",
    sinhalaDescription: "",
    imageUrl: "",
    sourceName: "",
    sourceUrl: "",
    author: "",
    mainTag: "",
    secondaryTags: [],
    locality: "",
  };

  // function to add the image upload to a state
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1MB (in bytes)

    if (file && file.size > maxSize) {
      handleImageSize(fileInputRef);
    } else {
      setImageUpload(file);
    }
  };

  // function to set the submitted form data to the state.
  const handleSubmit = async (values) => {
    if (imageUpload) {
      const formData = new FormData();
      formData.append("image", imageUpload);
      setImageFormData(formData);
    }
    const updatedObject = {
      ...values,
      secondaryTags: selectedSecondaryTags,
      typeOfPost: lifeStyle ? "lifestyle" : "news",
    };
    try {
      setData(updatedObject);
    } catch (error) {
      console.error(error);
    }
  };

  // function to handle the secondary news tag drop down
  const handleSecondaryTagChange = (e, values) => {
    const selectedValues = values.map(({ topic }) => topic);
    setSelectedSecondaryTags(selectedValues);
  };

  // function that sends updated form data to the backend after confirmation from the pop up.
  const handleConfirm = async (resetForm) => {
    setOpen(false);
    handleLoaderOpen();
    let request = data;
    if (imageFormData) {
      try {
        let imageResponse = await Axios.post("/image", imageFormData);
        request = { ...data, imageUrl: imageResponse.data };
      } catch (err) {
        console.log(err);
      }
    }
    try {
      // get bearer token
      const token = localStorage.getItem("jwt");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      let response = await Axios.post("/news/push-news", request, { headers });
      response && handleLoaderClose();
      resetForm();
      setLifeStyle(false);
      setSelectedSecondaryTags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      handleSubmitFunc(response);
    } catch (err) {
      console.error(err);
      err && handleLoaderClose();
      handleSubmitFunc(err);
    }
  };

  // function used to set state based on if the if the validation is passed.
  const isValidationPassed = (values) => {
    try {
      validationSchema.validateSync(values);
      setValid(true);
      return true;
    } catch (error) {
      setValid(false);
      return false;
    }
  };

  // validation schema to define the error message.
  const validationSchema = Yup.object({
    title: Yup.string().required("News Headline is required"),
    description: Yup.string().required("News Description is required"),
    sourceName: Yup.string().required("Source Name is required"),
    sourceUrl: Yup.string().required("Source URL is required"),
    author: Yup.string().required("Author is required"),
    mainTag: Yup.string().required("Tags are required"),
    locality: Yup.string().required("Locality is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validate={isValidationPassed}
      onSubmit={handleSubmit}
    >
      {(formProps) => {
        return (
          <Form>
            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="title">
                <Typography fontWeight="bold">News Headline</Typography>
              </label>
              <Field
                as={TextField}
                id="title"
                name="title"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                  maxLength: 100,
                }}
              />
              <ErrorMessage
                name="title"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="sinhalaTitle">
                <Typography fontWeight="bold">
                  News Headline (Sinhala)
                </Typography>
              </label>
              <Field
                as={TextField}
                id="sinhalaTitle"
                name="sinhalaTitle"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                  maxLength: 100,
                }}
              />
              <ErrorMessage
                name="sinhalaTitle"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="description">
                <Typography fontWeight="bold">News Description</Typography>
              </label>
              <Field
                as={TextareaAutosize}
                id="description"
                name="description"
                maxLength={25}
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
              <ErrorMessage
                name="description"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="sinhalaDescription">
                <Typography fontWeight="bold">
                  News Description (Sinhala)
                </Typography>
              </label>
              <Field
                as={TextareaAutosize}
                id="sinhalaDescription"
                name="sinhalaDescription"
                maxLength={25}
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
              <ErrorMessage
                name="sinhalaDescription"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="imageUrl">
                <Typography fontWeight="bold">
                  Choose Image (JPG or PNG)
                </Typography>
              </label>
              <Field
                inputRef={fileInputRef}
                component={TextField}
                id="imageUrl"
                name="imageUrl"
                type="file"
                variant="outlined"
                fullWidth
                accept="imageUrl/jpeg, imageUrl/png"
                onChange={handleFileChange}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="sourceName">
                <Typography fontWeight="bold">Source Name</Typography>
              </label>
              <Field
                as={TextField}
                id="sourceName"
                name="sourceName"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                  maxLength: 100,
                }}
              />
              <ErrorMessage
                name="sourceName"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="sourceUrl">
                <Typography fontWeight="bold">Source URL</Typography>
              </label>
              <Field
                as={TextField}
                id="sourceUrl"
                name="sourceUrl"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                }}
              />
              <ErrorMessage
                name="sourceUrl"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <Box sx={{ marginRight: "10px", width: "25%" }}>
                <label htmlFor="author">
                  <Typography fontWeight="bold">Author</Typography>
                </label>
                <Field
                  as={TextField}
                  id="author"
                  name="author"
                  select
                  variant="outlined"
                  fullWidth
                  children={
                    dropDownList && dropDownList.authors
                      ? dropDownList.authors.map((item) => (
                          <MenuItem key={item._id} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))
                      : []
                  }
                />
                <ErrorMessage
                  name="author"
                  component="div"
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                  }}
                />
              </Box>

              <Box sx={{ marginRight: "10px", width: "25%" }}>
                <label htmlFor="mainTag">
                  <Typography fontWeight="bold">Main News Tags</Typography>
                </label>
                <Field
                  as={TextField}
                  id="mainTag"
                  name="mainTag"
                  select
                  variant="outlined"
                  fullWidth
                  children={
                    dropDownList && dropDownList.mainTags
                      ? dropDownList.mainTags.map((item) => (
                          <MenuItem key={item._id} value={item.topic}>
                            {item.topic}
                          </MenuItem>
                        ))
                      : []
                  }
                />
                <ErrorMessage
                  name="mainTag"
                  component="div"
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                  }}
                />
              </Box>

              <Box sx={{ marginBottom: "10px", width: "25%" }}>
                <label htmlFor="locality">
                  <Typography fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                    Local or International
                  </Typography>
                </label>
                <Field
                  as={TextField}
                  id="locality"
                  name="locality"
                  select
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="local">Local</MenuItem>
                  <MenuItem value="international">International</MenuItem>
                </Field>
                <ErrorMessage
                  name="locality"
                  component="div"
                  style={{
                    color: "red",
                    fontSize: "0.8rem",
                  }}
                />
              </Box>

              <FormControlLabel
                sx={{ marginLeft: "10px" }}
                label="Lifestyle"
                control={<Switch />}
                checked={lifeStyle}
                onChange={() => setLifeStyle(!lifeStyle)}
              />
            </Box>

            <Box sx={{ marginTop: "10px", width: "75%" }}>
              <label htmlFor="secondaryTags">
                <Typography fontWeight="bold">Secondary News Tags</Typography>
              </label>
              <Autocomplete
                id="secondaryTags"
                name="secondaryTags"
                multiple
                options={dropDownList ? dropDownList.secondaryTags : []}
                getOptionLabel={(option) => option.topic}
                isOptionEqualToValue={(option, value) =>
                  option.topic === value.topic
                }
                renderInput={(params) => <TextField {...params} />}
                onChange={handleSecondaryTagChange}
                value={selectedSecondaryTags.map((value) => ({ topic: value }))}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                onClick={() => {
                  valid && setOpen(true);
                }}
              >
                Push
              </Button>
            </Box>

            <Modal
              aria-labelledby="spring-modal-title"
              aria-describedby="spring-modal-description"
              open={open}
              onClose={() => setOpen(false)}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  TransitionComponent: Fade,
                },
              }}
            >
              <Fade in={open}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                    Are you sure you want to push this post?
                  </Typography>
                  <Button
                    sx={{ mt: 2, mx: "auto" }}
                    variant="contained"
                    onClick={handleConfirm.bind(null, formProps.resetForm)}
                  >
                    Yes
                  </Button>
                </Box>
              </Fade>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreatePostForm;
