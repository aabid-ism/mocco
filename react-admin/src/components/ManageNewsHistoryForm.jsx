// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect, useRef, forwardRef, cloneElement } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  Chip,
  MenuItem,
  TextareaAutosize,
  Tooltip,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Axios from "../utils/axios.js";
import Backdrop from "@mui/material/Backdrop";
import { useSpring, animated } from "@react-spring/web";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";
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

const ManageNewsHistoryForm = ({
  setSelectedNews,
  selectedNews,
  handleSubmitFunc,
  handleLoaderOpen,
  handleLoaderClose,
}) => {
  const [editOpen, setEditOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [deleteOpen, setDeleteOpen] = useState(false); // state used to manipulate the opening and closing of delete modal.
  const [valid, setValid] = useState(false); // state to check if form has passed validation.
  const [data, setData] = useState([]); // state to store the data that has been submitted by form (edit or delete).
  const [dropDownList, setDropDownList] = useState(); // state to store the data return of the dropdown values from the api.
  const [imageUrlChip, setImageUrlChip] = useState(""); // state to track the image url chip.
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSecondaryTags, setSelectedSecondaryTags] = useState([]);
  const [imageUpload, setImageUpload] = useState(null); // state to store uploaded image.
  const [imageFormData, setImageFormData] = useState(null); // state to store form data of the uploaded image.
  const [lifeStyle, setLifeStyle] = useState(false); // state to track the lifestyle toggle.
  const fileInputRef = useRef(); // useRef to reference the image upload component and reset after submit.

  useEffect(() => {
    async function getDropDowns() {
      handleLoaderOpen();
      try {
        const response = await Axios.get("/get-drop-downs");
        response && handleLoaderClose();
        setDropDownList(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    getDropDowns();
  }, []);

  useEffect(() => {
    if (selectedNews && selectedNews.secondaryTags) {
      let temp = selectedNews.secondaryTags;
      setSelectedSecondaryTags(temp);
      setImageUrlChip(selectedNews.imageUrl);
      setLifeStyle(
        selectedNews
          ? selectedNews.typeOfPost === "lifestyle"
            ? true
            : false
          : false
      );
    }
  }, [selectedNews]);

  // Initial values of the form data.
  const initialValues = {
    id: selectedNews ? selectedNews._id : "",
    title: selectedNews ? selectedNews.title : "",
    sinhalaTitle: selectedNews ? selectedNews.sinhalaTitle : "",
    description: selectedNews ? selectedNews.description : "",
    sinhalaDescription: selectedNews ? selectedNews.sinhalaDescription : "",
    imageUrl: imageUpload ? imageUpload : null,
    sourceName: selectedNews ? selectedNews.sourceName : "",
    sourceUrl: selectedNews ? selectedNews.sourceUrl : "",
    author:
      selectedNews && selectedNews.author !== undefined
        ? selectedNews.author
        : "",
    mainTag:
      selectedNews && selectedNews.mainTag !== undefined
        ? selectedNews.mainTag
        : "",
    secondaryTags: [],
    locality:
      selectedNews && selectedNews.locality !== undefined
        ? selectedNews.locality
        : "",
  };

  // function to set the submitted form data to the state.
  const handleSubmit = async (values) => {
    if (imageUpload) {
      const formData = new FormData();
      formData.append("image", imageUpload);
      setImageFormData(formData);
    }

    setData({
      ...values,
      secondaryTags: selectedSecondaryTags ? selectedSecondaryTags : [],
      imageUrl: imageUrlChip ? imageUrlChip : "",
      typeOfPost: selectedNews ? selectedNews.typeOfPost : "",
    });
    if (isDeleteMode) {
      setDeleteOpen(true);
    } else {
      setEditOpen(true);
    }
  };

  // function to add the image upload to a state
  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
  };

  // function that sends updated form data to the backend after confirmation from the pop up.
  const handleEditConfirm = async (resetForm) => {
    setEditOpen(false);
    handleLoaderOpen();
    let request = data;
    if (imageFormData) {
      try {
        imageFormData.append(
          "imageUrl",
          selectedNews ? selectedNews.imageUrl : ""
        );

        // checking to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.imageUrl) {
          let imageResponse = await Axios.post("/image", imageFormData);
          try {
            const imgUrl = selectedNews.imageUrl;
            let deleteResponse = await Axios.post("/image/delete-image", {
              imgUrl,
            });
            handleSubmitFunc(deleteResponse);
          } catch (err) {
            handleSubmitFunc(err);
            console.log(err);
          }
          request = { ...data, imageUrl: imageResponse.data };
        } else {
          let imageResponse = await Axios.post("/image", imageFormData);
          request = { ...data, imageUrl: imageResponse.data };
        }
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }

    try {
      if (lifeStyle) {
        if (request.typeOfPost === "news") {
          let response = await Axios.post("/add-news-to-lifestyle", {
            ...request,
            typeOfPost: "lifestyle",
          });
          response && handleLoaderClose();
          setSelectedNews(null);
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setImageUpload(null);
          setValid(false);
          handleSubmitFunc(response);
          setImageUrlChip("");
          setLifeStyle(false);
          setSelectedSecondaryTags([]);
        } else {
          let response = await Axios.post("/edit-lifestyle-news", request);
          response && handleLoaderClose();
          setSelectedNews(response.data.value);
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setImageUpload(null);
          setValid(false);
          handleSubmitFunc(response);
        }
      } else {
        if (request.typeOfPost === "lifestyle") {
          let response = await Axios.post("/add-lifestyle-to-news", {
            ...request,
            typeOfPost: "news",
          });
          response && handleLoaderClose();
          setSelectedNews(null);
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setImageUpload(null);
          setValid(false);
          handleSubmitFunc(response);
          setImageUrlChip("");
          setLifeStyle(false);
          setSelectedSecondaryTags([]);
        } else {
          let response = await Axios.post("/edit-news", request);
          response && handleLoaderClose();
          setSelectedNews(response.data.value);
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setImageUpload(null);
          setValid(false);
          handleSubmitFunc(response);
        }
      }
    } catch (err) {
      handleSubmitFunc(err);
      console.error(err);
    }
  };

  // function that sends deleted form data to the backend after confirmation from the pop up.
  const handleDeleteConfirm = async (resetForm) => {
    setDeleteOpen(false);
    handleLoaderOpen();
    try {
      if (selectedNews && selectedNews.typeOfPost === "lifestyle") {
        const response = await Axios.post("/delete-lifestyle-news", data);
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setLifeStyle(false);
        setImageUpload(null);
        setSelectedSecondaryTags([]);
        setValid(false);
        setImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      } else {
        const response = await Axios.post("/delete-news", data);
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setImageUpload(null);
        setSelectedSecondaryTags([]);
        setValid(false);
        setImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      }

      if (data.imageUrl) {
        try {
          const imgUrl = data.imageUrl;
          await Axios.post("/image/delete-image", { imgUrl });
        } catch (err) {
          handleSubmitFunc(err);
          console.log(err);
        }
      }
    } catch (err) {
      handleSubmitFunc(err);
      console.error(err);
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
    sinhalaTitle: Yup.string().required("Sinhala News Title is required"),
    description: Yup.string().required("News Description is required"),
    sinhalaDescription: Yup.string().required(
      "Sinhala News Description is required"
    ),
    imageUrl:
      imageUrlChip.length === 0 &&
      Yup.string().required("Image URL is required"),
    sourceName: Yup.string().required("Source Name is required"),
    sourceUrl: Yup.string().required("Source URL is required"),
    author: Yup.string().required("Author is required"),
    mainTag: Yup.string().required("Main News Tags are required"),
    locality: Yup.string().required("Locality is required"),
  });

  // function to handle the secondary news tag drop down
  const handleSecondaryTagChange = (e, values) => {
    const selectedValues = values.map(({ topic }) => topic);
    setSelectedSecondaryTags(selectedValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validate={isValidationPassed}
      enableReinitialize={true}
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
                minRows={3}
                maxRows={5}
                placeholder="Enter text here..."
                style={{
                  width: "100%",
                  padding: "20px",
                  resize: "none",
                  border: "1px solid #ccc",
                }}
                inputProps={{
                  maxLength: 350,
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
                minRows={3}
                maxRows={5}
                placeholder="Enter text here..."
                style={{
                  width: "100%",
                  padding: "20px",
                  resize: "none",
                  border: "1px solid #ccc",
                }}
                inputProps={{
                  maxLength: 350,
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
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <label htmlFor="image">
                  <Typography fontWeight="bold">
                    Choose Image (JPG or PNG)
                  </Typography>
                </label>
                {imageUrlChip ? (
                  <Tooltip title={imageUrlChip} arrow>
                    <Chip
                      id="image"
                      name="image"
                      label={imageUrlChip}
                      size="small"
                      onClick={() => {
                        window.open(imageUrlChip, "_blank");
                      }}
                      onDelete={() => setImageUrlChip("")}
                      deleteIcon={<CancelIcon />}
                      sx={{
                        maxWidth: "150px",
                        marginLeft: "2%",
                        marginBottom: "2%",
                        backgroundColor: "orange",
                        color: "white",
                      }}
                    />
                  </Tooltip>
                ) : null}
              </Box>

              <Field
                inputRef={fileInputRef}
                disabled={imageUrlChip ? true : false}
                component={TextField}
                name="imageUrl"
                type="file"
                variant="outlined"
                fullWidth
                inputProps={{ accept: "image/jpeg, image/png" }}
                onChange={(event) => handleFileChange(event)}
              />
              <ErrorMessage
                name="imageUrl"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
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
                  select
                  id="author"
                  name="author"
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
                  valid && setEditOpen(true);
                  setIsDeleteMode(false);
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
                onClick={() => {
                  valid && setDeleteOpen(true);
                  setIsDeleteMode(true);
                }}
              >
                Delete
              </Button>
            </Box>
            {editOpen ? (
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={editOpen}
                onClose={() => {
                  setEditOpen(false);
                  setValid(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    TransitionComponent: Fade,
                  },
                }}
              >
                <Fade in={editOpen}>
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
                      Are you sure you want to edit this article?
                    </Typography>
                    <Button
                      sx={{ mt: 2, mx: "auto" }}
                      variant="contained"
                      onClick={handleEditConfirm.bind(
                        null,
                        formProps.resetForm
                      )}
                    >
                      Yes
                    </Button>
                  </Box>
                </Fade>
              </Modal>
            ) : (
              deleteOpen && (
                <Modal
                  aria-labelledby="spring-modal-title"
                  aria-describedby="spring-modal-description"
                  open={deleteOpen}
                  onClose={() => {
                    setDeleteOpen(false);
                    setValid(false);
                  }}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      TransitionComponent: Fade,
                    },
                  }}
                >
                  <Fade in={deleteOpen}>
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
                        Are you sure you want to delete this article?
                      </Typography>
                      <Button
                        sx={{ mt: 2, mx: "auto" }}
                        variant="contained"
                        onClick={handleDeleteConfirm.bind(
                          null,
                          formProps.resetForm
                        )}
                      >
                        Yes
                      </Button>
                    </Box>
                  </Fade>
                </Modal>
              )
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default ManageNewsHistoryForm;
