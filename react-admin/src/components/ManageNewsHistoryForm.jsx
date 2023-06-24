// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect, forwardRef, cloneElement } from "react";
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

const ManageNewsHistoryForm = ({ selectedNews, handleSubmitFunc }) => {
  const [editOpen, setEditOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [deleteOpen, setDeleteOpen] = useState(false); // state used to manipulate the opening and closing of delete modal.
  const [valid, setValid] = useState(false); // state to check if form has passed validation.
  const [data, setData] = useState([]); // state to store the data that has been submitted by form (edit or delete).
  const [dropDownList, setDropDownList] = useState(); // state to store the data return of the dropdown values from the api.
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSecondaryTags, setSelectedSecondaryTags] = useState([]);

  useEffect(() => {
    async function getDropDowns() {
      try {
        const response = await Axios.get("/get-drop-downs");
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
    }
  }, [selectedNews]);

  // Initial values of the form data.
  const initialValues = {
    id: selectedNews ? selectedNews._id : "",
    title: selectedNews ? selectedNews.title : "",
    description: selectedNews ? selectedNews.description : "",
    // imageUrl: "https://example.com/default-image.jpg",
    sourceName: selectedNews ? selectedNews.sourceName : "",
    sourceUrl: selectedNews ? selectedNews.sourceUrl : "",
    author:
      selectedNews && selectedNews.author !== undefined
        ? selectedNews.author
        : "",
    mainTags:
      selectedNews && selectedNews.mainTag !== undefined
        ? selectedNews.mainTag
        : "",
    secondaryTags: selectedSecondaryTags ? selectedSecondaryTags : [],
    locality:
      selectedNews && selectedNews.locality !== undefined
        ? selectedNews.locality
        : "",
  };

  // function to set the submitted form data to the state.
  const handleSubmit = async (values) => {
    setData(values);
    if (isDeleteMode) {
      setDeleteOpen(true);
    } else if (isEditMode) {
      setEditOpen(true);
    }
  };

  // function that sends updated form data to the backend after confirmation from the pop up.
  const handleEditConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        let response = await Axios.post("/edit-news", data);
        setEditOpen(false);
        handleSubmitFunc(response);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // function that sends deleted form data to the backend after confirmation from the pop up.
  const handleDeleteConfirm = async (confirmed) => {
    if (confirmed) {
      try {
        const response = await Axios.post("/delete-news", data);
        setDeleteOpen(false);
        handleSubmitFunc(response);
      } catch (err) {
        console.error(err);
      }
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
    // imageUrl: Yup.string().required("Image URL is required"),
    sourceName: Yup.string().required("Source Name is required"),
    sourceUrl: Yup.string().required("Source URL is required"),
    author: Yup.string().required("Author is required"),
    mainTags: Yup.string().required("Main News Tags are required"),
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
            <Typography fontWeight="bold">News Headline (Sinhala)</Typography>
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
            <label htmlFor="imageUrl">
              <Typography fontWeight="bold">
                Choose Image (JPG or PNG)
              </Typography>
            </label>
            {selectedNews && selectedNews.imageUrl ? (
              <Tooltip title={selectedNews.imageUrl} arrow>
                <Chip
                  id="imageUrl"
                  name="imageUrl"
                  label={selectedNews.imageUrl}
                  size="small"
                  onDelete={() => console.log(selectedNews.imageUrl)}
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
            as={TextField}
            id="imageUrl"
            name="imageUrl"
            type="file"
            variant="outlined"
            fullWidth
            accept="imageUrl/jpeg, imageUrl/png"
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
            <label htmlFor="mainTags">
              <Typography fontWeight="bold">Main News Tags</Typography>
            </label>
            <Field
              as={TextField}
              id="mainTags"
              name="mainTags"
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
            open={open}
            onClose={() => setEditOpen(false)}
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
                  Are you sure you want to edit this article?
                </Typography>
                <Button
                  sx={{ mt: 2, mx: "auto" }}
                  variant="contained"
                  onClick={() => handleEditConfirm(true)}
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
              open={open}
              onClose={() => setDeleteOpen(false)}
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
                    Are you sure you want to delete this article?
                  </Typography>
                  <Button
                    sx={{ mt: 2, mx: "auto" }}
                    variant="contained"
                    onClick={() => handleDeleteConfirm(true)}
                  >
                    Yes
                  </Button>
                </Box>
              </Fade>
            </Modal>
          )
        )}
      </Form>
    </Formik>
  );
};

export default ManageNewsHistoryForm;
