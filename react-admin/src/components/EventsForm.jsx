// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect, useRef, forwardRef, cloneElement } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Chip, TextareaAutosize, Tooltip } from "@mui/material";
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

const EventsForm = ({
  setSelectedEvents,
  selectedEvents,
  handleSubmitFunc,
  handleLoaderOpen,
  handleLoaderClose,
  handleImageSize,
  formEnabledToAddEvent,
  formEnabledToEditEvent,
  startDate,
  handlePublishValidation,
  handleUserUnauthorised,
}) => {
  const [editOpen, setEditOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [deleteOpen, setDeleteOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [publishOpen, setPublishOpen] = useState(false); // state used to manipulate the opening and closing of publish modal.
  const [data, setData] = useState([]); // state to store the data that has been submitted by form (edit or delete).
  const [imageUrlChip, setImageUrlChip] = useState(""); // state to track the image url chip.
  const [isPublishMode, setIsPublishMode] = useState(false); // state to track the publish button.
  const [isDeleteMode, setIsDeleteMode] = useState(false); // state to track the delete button.
  const [isEditMode, setIsEditMode] = useState(false); // state to track the delete button.
  const [imageUpload, setImageUpload] = useState(null); // state to store uploaded image.
  const [imageFormData, setImageFormData] = useState(null); // state to store form data of the uploaded image.
  const fileInputRef = useRef(); // useRef to reference the image upload component and reset after submit.
  const [formEnable, setFormEnable] = useState(true); //state to enable manipulation of form.
  const formikRef = useRef(null); // useRef to reference the form data of formik.

  useEffect(() => {
    setImageUrlChip(selectedEvents ? selectedEvents.imageUrl : "");
  }, [selectedEvents]);

  useEffect(() => {
    if (!formEnabledToAddEvent) {
      setSelectedEvents(null);
      setImageUrlChip("");
    }

    if (formEnabledToAddEvent || formEnabledToEditEvent) {
      setFormEnable(false);
    }
  }, [formEnabledToAddEvent, formEnabledToAddEvent]);

  // Initial values of the form data.
  const initialValues = {
    id: selectedEvents ? selectedEvents._id : "",
    name: selectedEvents ? selectedEvents.name : "",
    s_name: selectedEvents ? selectedEvents.s_name : "",
    desc: selectedEvents ? selectedEvents.desc : "",
    s_desc: selectedEvents ? selectedEvents.s_desc : "",
    imageUrl: formikRef.current
      ? formikRef.current.files
        ? formikRef.current.files[0]
        : null
      : null,
    srcUrl: selectedEvents ? selectedEvents.srcUrl : "",
  };

  // function to set the submitted form data to the state.
  const handleSubmit = async (values) => {
    if (values.name || values.s_name) {
      if (imageUpload) {
        const formData = new FormData();
        formData.append("image", imageUpload);
        setImageFormData(formData);
      }

      setData({
        ...values,
        imageUrl: imageUrlChip ? imageUrlChip : "",
      });

      if (isPublishMode) {
        setPublishOpen(true);
      } else if (isEditMode) {
        setEditOpen(true);
      } else if (isDeleteMode) {
        setDeleteOpen(true);
      }
    } else {
      if (isPublishMode) {
        setPublishOpen(false);
        handlePublishValidation();
      }
    }
  };

  // function to add the image upload to a state
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB (in bytes)

    if (file && file.size > maxSize) {
      handleImageSize(fileInputRef);
    } else {
      setImageUpload(file);
    }
  };

  // function that sends updated form data to the backend after confirmation from the pop up.
  const handleEditConfirm = async (resetForm) => {
    setEditOpen(false);
    handleLoaderOpen();
    let request = data;

    // get bearer token
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    //  if statement that checks if the image form data object is set.
    //  This is only set when a new image is uploaded or if an image is removed and a new image is added.
    if (imageFormData) {
      try {
        imageFormData.append(
          "imageUrl",
          selectedEvents ? selectedEvents.imageUrl : ""
        );

        // if statement to differentiate between an already existing post or a newly added post
        if (selectedEvents && selectedEvents.imageUrl) {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that the current image is removed and a new image has been uploaded.
          if (fileInputRef.current.value != "" && imageUpload) {
            let imageResponse = await Axios.post("/event-image", imageFormData);
            try {
              const imgUrl = selectedEvents.imageUrl;
              let deleteResponse = await Axios.post(
                "/event-image/delete-event-image",
                {
                  imgUrl,
                }
              );
              handleSubmitFunc(deleteResponse);
            } catch (err) {
              handleSubmitFunc(err);
              console.log(err);
            }
            request = { ...data, imageUrl: imageResponse.data };
          } else {
            // if file input ref is equal to "" and there is no imageUpload, the imageUrlChip
            //  is removed which indicates the user wants the image removed
            if (!imageUrlChip) {
              try {
                const imgUrl = selectedEvents.imageUrl;
                let deleteResponse = await Axios.post(
                  "/event-image/delete-event-image",
                  {
                    imgUrl,
                  }
                );
                handleSubmitFunc(deleteResponse);
              } catch (err) {
                handleSubmitFunc(err);
                console.log(err);
              }
            }
          }
        } else {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that a new image has been uploaded.
          if (fileInputRef.current.value != "" && imageUpload) {
            let imageResponse = await Axios.post("/event-image", imageFormData);
            request = { ...data, imageUrl: imageResponse.data };
          }
        }
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }
    // if a new image upload was made, a checking is carried out to check if current post already has an image.
    else if (selectedEvents && selectedEvents.imageUrl) {
      // if there is no imageUrlChip that means the user has removed the chip therefore intending to delete the image
      // the delete image execution is run.
      if (!imageUrlChip) {
        try {
          const imgUrl = selectedEvents.imageUrl;
          let deleteResponse = await Axios.post(
            "/event-image/delete-event-image",
            {
              imgUrl,
            }
          );
          handleSubmitFunc(deleteResponse);
        } catch (err) {
          handleSubmitFunc(err);
          console.log(err);
        }
      }
    }

    try {
      let response = await Axios.post(
        "/events/edit-event-data",
        {
          ...request,
        },
        { headers }
      );
      response && handleLoaderClose();
      setSelectedEvents(null);
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageUpload(null);
      handleSubmitFunc(response);
      setImageUrlChip("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleUserUnauthorised();
      } else {
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }
  };

  // function that deletes form data to the backend after confirmation from the pop up.
  const handleDeleteConfirm = async (resetForm) => {
    setDeleteOpen(false);
    handleLoaderOpen();

    try {
      // get bearer token
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await Axios.post("/events/delete-event-data", data, {
        headers,
      });
      response && handleLoaderClose();
      setSelectedEvents(null);
      resetForm();
      setImageUpload(null);
      setImageUrlChip("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      handleSubmitFunc(response);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleUserUnauthorised();
      } else {
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }

    if (data.imageUrl) {
      try {
        const imgUrl = data.imageUrl;
        await Axios.post("/event-image/delete-event-image", { imgUrl });
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }
  };

  // function that sends deleted form data to the backend after confirmation from the pop up.
  const handlePublishConfirm = async (resetForm) => {
    setPublishOpen(false);
    handleLoaderOpen();
    let request = data;
    // get bearer token
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (imageFormData) {
      try {
        let imageResponse = await Axios.post("/event-image", imageFormData);
        request = { ...data, imageUrl: imageResponse.data };
      } catch (err) {
        console.log(err);
      }
    }

    try {
      request = { ...request, date: startDate.toISOString() };
      // statement to check the new property change
      let response = await Axios.post(
        "/events/add-event-data",
        {
          ...request,
        },
        { headers }
      );
      response && handleLoaderClose();
      setSelectedEvents(response.data.value);
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImageUpload(null);
      handleSubmitFunc(response);
      setImageUrlChip("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleUserUnauthorised();
      } else {
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formProps) => {
        return (
          <Form>
            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="name">
                <Typography fontWeight="bold">Event Name</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="name"
                name="name"
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
                name="name"
                component="div"
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="s_name">
                <Typography fontWeight="bold">Event Name (Sinhala)</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="s_name"
                name="s_name"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                  maxLength: 100,
                }}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="desc">
                <Typography fontWeight="bold">Event Description</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextareaAutosize}
                id="desc"
                name="desc"
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
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="s_desc">
                <Typography fontWeight="bold">
                  Event Description (Sinhala)
                </Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextareaAutosize}
                id="s_desc"
                name="s_desc"
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
                  <Tooltip name={imageUrlChip} arrow>
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
                disabled={imageUrlChip ? true : formEnable ? true : false}
                component={TextField}
                name="imageUrl"
                type="file"
                variant="outlined"
                fullWidth
                inputProps={{ accept: "image/jpeg, image/png" }}
                onChange={(event) => handleFileChange(event)}
              />
            </Box>

            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="srcUrl">
                <Typography fontWeight="bold">Source URL</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="srcUrl"
                name="srcUrl"
                variant="outlined"
                fullWidth
                inputProps={{
                  style: {
                    padding: "10px",
                  },
                }}
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
                disabled={formEnabledToEditEvent}
                variant="contained"
                type="submit"
                onClick={() => {
                  setEditOpen(true);
                  setIsPublishMode(false);
                  setIsDeleteMode(false);
                  setIsEditMode(true);
                }}
              >
                Edit
              </Button>
              <Button
                disabled={formEnabledToEditEvent}
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "red",
                  "&:hover": {
                    backgroundColor: "red",
                  },
                }}
                onClick={() => {
                  setDeleteOpen(true);
                  setIsPublishMode(false);
                  setIsDeleteMode(true);
                  setIsEditMode(false);
                }}
              >
                Delete
              </Button>
              <Button
                disabled={formEnabledToAddEvent}
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "green",
                  "&:hover": {
                    backgroundColor: "green",
                  },
                }}
                onClick={() => {
                  setPublishOpen(true);
                  setIsPublishMode(true);
                  setIsDeleteMode(false);
                  setIsEditMode(false);
                }}
              >
                Publish
              </Button>
            </Box>
            {editOpen && (
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={editOpen}
                onClose={() => {
                  setEditOpen(false);
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

            {publishOpen && (
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={publishOpen}
                onClose={() => {
                  setPublishOpen(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    TransitionComponent: Fade,
                  },
                }}
              >
                <Fade in={publishOpen}>
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
                      Are you sure you want to publish this article?
                    </Typography>
                    <Button
                      sx={{ mt: 2, mx: "auto" }}
                      variant="contained"
                      onClick={handlePublishConfirm.bind(
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

export default EventsForm;
