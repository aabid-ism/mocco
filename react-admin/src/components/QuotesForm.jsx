// <------------------------ IMPORTS ------------------------------->
import { useState, useEffect, forwardRef, cloneElement } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "../utils/axios.js";
import Backdrop from "@mui/material/Backdrop";
import { useSpring, animated } from "@react-spring/web";
import Modal from "@mui/material/Modal";

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

const QuotesForm = ({
  setSelectedQuote,
  selectedQuote,
  handleSubmitFunc,
  handleLoaderOpen,
  handleLoaderClose,
  formEnabledToAddQuote,
  formEnabledToEditQuote,
  startDate,
  handlePublishValidation,
  handleUserUnauthorised,
}) => {
  const [editOpen, setEditOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [deleteOpen, setDeleteOpen] = useState(false); // state used to manipulate the opening and closing of edit modal.
  const [publishOpen, setPublishOpen] = useState(false); // state used to manipulate the opening and closing of publish modal.
  const [data, setData] = useState([]); // state to store the data that has been submitted by form (edit or delete).
  const [isPublishMode, setIsPublishMode] = useState(false); // state to track the publish button.
  const [isDeleteMode, setIsDeleteMode] = useState(false); // state to track the delete button.
  const [isEditMode, setIsEditMode] = useState(false); // state to track the delete button.
  const [formEnable, setFormEnable] = useState(true); //state to enable manipulation of form.

  useEffect(() => {
    if (!formEnabledToAddQuote) {
      setSelectedQuote(null);
    }

    if (formEnabledToAddQuote || formEnabledToEditQuote) {
      setFormEnable(false);
    }
  }, [formEnabledToAddQuote, formEnabledToAddQuote]);

  // Initial values of the form data.
  const initialValues = {
    id: selectedQuote ? selectedQuote._id : "",
    quote: selectedQuote ? selectedQuote.quote : "",
    s_quote: selectedQuote ? selectedQuote.s_quote : "",
    author: selectedQuote ? selectedQuote.author : "",
    s_author: selectedQuote ? selectedQuote.s_author : "",
    url: selectedQuote ? selectedQuote.s_author : "",
  };

  // function to set the submitted form data to the state.
  const handleSubmit = async (values) => {
    if (values.quote || values.s_quote) {
      setData({
        ...values,
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

    try {
      // statement to check the new property change
      let response = await Axios.post(
        "/quotes/edit-quotes",
        {
          ...request,
        },
        { headers }
      );
      response && handleLoaderClose();
      setSelectedQuote(null);
      resetForm();
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
      const response = await Axios.post("/quotes/delete-quotes", data, {
        headers,
      });
      response && handleLoaderClose();
      setSelectedQuote(null);
      resetForm();
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

    try {
      request = { ...request, date: startDate.toISOString() };
      // statement to check the new property change
      let response = await Axios.post(
        "/quotes/add-quotes",
        {
          ...request,
        },
        { headers }
      );
      response && handleLoaderClose();
      setSelectedQuote(response.data.value);
      resetForm();
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
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formProps) => {
        return (
          <Form>
            <Box sx={{ marginBottom: "2%" }}>
              <label htmlFor="quote">
                <Typography fontWeight="bold">Quote</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="quote"
                name="quote"
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
              <label htmlFor="s_quote">
                <Typography fontWeight="bold">Quote (Sinhala)</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="s_quote"
                name="s_quote"
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
              <label htmlFor="author">
                <Typography fontWeight="bold">Author</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="author"
                name="author"
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
              <label htmlFor="s_author">
                <Typography fontWeight="bold">Author (Sinhala)</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="s_author"
                name="s_author"
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
              <label htmlFor="url">
                <Typography fontWeight="bold">Source URL</Typography>
              </label>
              <Field
                disabled={formEnable}
                as={TextField}
                id="url"
                name="url"
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
                disabled={formEnabledToEditQuote}
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
                disabled={formEnabledToEditQuote}
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
                disabled={formEnabledToAddQuote}
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
                      Are you sure you want to edit this quote?
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
                      Are you sure you want to delete this quote?
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

export default QuotesForm;
