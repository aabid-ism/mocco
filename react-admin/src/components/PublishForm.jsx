import { useState, useEffect, forwardRef, cloneElement } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MenuItem, TextareaAutosize } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "../utils/axios.js";
import * as Yup from "yup";
import Backdrop from "@mui/material/Backdrop";
import { useSpring, animated } from "@react-spring/web";
import Modal from "@mui/material/Modal";

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

const PublishForm = ({ handleSubmitFunc }) => {
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  const [data, setData] = useState({});
  const [dropDownList, setDropDownList] = useState();

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

  const initialValues = {
    title: "",
    description: "",
    imageUrl: "",
    sourceName: "",
    sourceUrl: "",
    author: "",
    mainTag: "",
    secondaryTags: "",
    locality: "",
  };

  const handleSubmit = async (values) => {
    try {
      setData(values);
      // resetForm({ values: initialValues });
      setValid(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async (confirmed) => {
    try {
      if (confirmed) {
        await Axios.post("/publish-news", data);
        setOpen(false);
        handleSubmitFunc();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isValidationPassed = (values) => {
    try {
      validationSchema.validateSync(values);
      setValid(true);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("News Headline is required"),
    description: Yup.string().required("News Description is required"),
    // imageUrl: Yup.string().required("Image URL is required"),
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
          <label htmlFor="imageUrl">
            <Typography fontWeight="bold">Choose Image (JPG or PNG)</Typography>
          </label>
          <Field
            as={TextField}
            id="imageUrl"
            name="imageUrl"
            type="file"
            variant="outlined"
            fullWidth
            accept="imageUrl/jpeg, imageUrl/png"
            inputLabelProps={{
              shrink: true,
            }}
          />
          {/* <ErrorMessage
            name="imageUrl"
            component="div"
            style={{
              color: "red",
              fontSize: "0.8rem",
            }}
          /> */}
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
              id="author"
              name="author"
              select
              variant="outlined"
              fullWidth
            >
              {dropDownList
                ? dropDownList.authors.map((item) => (
                    <MenuItem value={item.name}>{item.name}</MenuItem>
                  ))
                : ""}
            </Field>
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
            >
              {dropDownList
                ? dropDownList.mainTags.map((item) => (
                    <MenuItem value={item.topic}>{item.topic}</MenuItem>
                  ))
                : ""}
            </Field>
            <ErrorMessage
              name="mainTag"
              component="div"
              style={{
                color: "red",
                fontSize: "0.8rem",
              }}
            />
          </Box>

          <Box sx={{ marginRight: "10px", width: "25%" }}>
            <label htmlFor="secondaryTags">
              <Typography fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
                Secondary News Tags
              </Typography>
            </label>
            <Field
              as={TextField}
              id="secondaryTags"
              name="secondaryTags"
              select
              variant="outlined"
              fullWidth
            >
              {dropDownList
                ? dropDownList.secondaryTags.map((item) => (
                    <MenuItem value={item.topic}>{item.topic}</MenuItem>
                  ))
                : ""}
            </Field>
            <ErrorMessage
              name="secondaryTags"
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
              <MenuItem value="Local">Local</MenuItem>
              <MenuItem value="International">International</MenuItem>
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
            Publish
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
                Are you sure you want to publish this article?
              </Typography>
              <Button
                sx={{ mt: 2, mx: "auto" }}
                variant="contained"
                onClick={() => handleConfirm(true)}
              >
                Yes
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Form>
    </Formik>
  );
};

export default PublishForm;
