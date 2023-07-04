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

const NewsPostApprovalForm = ({
  setSelectedNews,
  selectedNews,
  handleSubmitFunc,
  handleLoaderClose,
  handleLoaderOpen,
}) => {
  const [editOpen, setEditOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [deleteOpen, setDeleteOpen] = useState(false); // state used to manipulate the opening and closing of delete modal.
  const [approveOpen, setApproveOpen] = useState(false); // state used to manipulate the opening and closing of approve modal.
  const [valid, setValid] = useState(false); // state to check if form has passed validation.
  const [data, setData] = useState([]); // state to store the data that has been submitted by form (edit or delete).
  const [dropDownList, setDropDownList] = useState(); // state to store the data return of the dropdown values from the api.
  const [isDeleteMode, setIsDeleteMode] = useState(false); // state to track the button clicked
  const [isEditMode, setIsEditMode] = useState(false); // state to track the button clicked
  const [isApproveMode, setIsApproveMode] = useState(false); // state to track the button clicked
  const [selectedSecondaryTags, setSelectedSecondaryTags] = useState([]); // state to track the selected secondary tags
  const [imageUrlChip, setImageUrlChip] = useState(""); // state to track the image url chip.
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
      setImageUrlChip(selectedNews ? selectedNews.imageUrl : "");
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
      typeOfPost: lifeStyle ? "lifestyle" : "news",
    });
    if (isDeleteMode) {
      setDeleteOpen(true);
    }

    if (isEditMode) {
      setEditOpen(true);
    }

    if (isApproveMode) {
      setApproveOpen(true);
    }
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
        let imageResponse = await Axios.post("/image", imageFormData);
        request = { ...data, imageUrl: imageResponse.data };
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }

    try {
      let response = await Axios.post("/edit-unpublished-news", request);
      response && handleLoaderClose();
      setSelectedNews(response.data.value);
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setValid(false);
      setImageUpload(null);
      handleSubmitFunc(response);
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
      const response = await Axios.post("/delete-unpublished-news", data);
      response && handleLoaderClose();
      setSelectedNews(null);
      resetForm();
      setImageUpload(null);
      setSelectedSecondaryTags([]);
      setValid(false);
      setLifeStyle(false);
      setImageUrlChip("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      handleSubmitFunc(response);
    } catch (err) {
      handleSubmitFunc(err);
      console.error(err);
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
  };

  const handleApproveConfirm = async (resetForm) => {
    setApproveOpen(false);
    handleLoaderOpen();
    let request = data;
    if (imageFormData) {
      try {
        let imageResponse = await Axios.post("/image", imageFormData);
        request = { ...data, imageUrl: imageResponse.data };
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }

    try {
      if (lifeStyle) {
        const response = await Axios.post("/approve-lifestyle-news", request);
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setImageUpload(null);
        setSelectedSecondaryTags([]);
        setLifeStyle(false);
        setImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      } else {
        const response = await Axios.post("/approve-news", request);
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setImageUpload(null);
        setSelectedSecondaryTags([]);
        setLifeStyle(false);
        setValid(false);
        setImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      }
    } catch (err) {
      handleSubmitFunc(err);
      console.error(err);
    }
  };

  // function to add the image upload to a state
  const handleFileChange = (event) => {
    setImageUpload(event.target.files[0]);
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
    sinhalaTitle:
      !isDeleteMode && Yup.string().required("Sinhala News Title is required"),
    description: Yup.string().required("News Description is required"),
    imageUrl:
      !isDeleteMode &&
      imageUrlChip.length === 0 &&
      Yup.string().required("Image URL is required"),
    sinhalaDescription:
      !isDeleteMode &&
      Yup.string().required("Sinhala News Description is required"),
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
                maxLength={350}
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
                maxLength={350}
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
                  name="mainTags"
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
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                onClick={() => {
                  valid && setEditOpen(true);
                  setIsEditMode(true);
                  setIsDeleteMode(false);
                  setIsApproveMode(false);
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
                  setIsEditMode(false);
                  setIsApproveMode(false);
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "green",
                  },
                }}
                onClick={() => {
                  valid && setApproveOpen(true);
                  setIsApproveMode(true);
                  setIsDeleteMode(false);
                  setIsEditMode(false);
                }}
              >
                Approve & Publish
              </Button>
            </Box>

            {editOpen && (
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
            )}

            {deleteOpen && (
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
            )}

            {approveOpen && (
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={approveOpen}
                onClose={() => {
                  setApproveOpen(false);
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
                <Fade in={approveOpen}>
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
                      Are you sure you want to approve this article?
                    </Typography>
                    <Button
                      sx={{ mt: 2, mx: "auto" }}
                      variant="contained"
                      onClick={handleApproveConfirm.bind(
                        null,
                        formProps.resetForm
                      )}
                    >
                      Yes
                    </Button>
                  </Box>
                </Fade>
              </Modal>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};

export default NewsPostApprovalForm;
