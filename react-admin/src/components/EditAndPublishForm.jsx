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

const EditAndPublishForm = ({
  setSelectedNews,
  selectedNews,
  handleSubmitFunc,
  handleLoaderClose,
  handleLoaderOpen,
  handleImageSize,
  setHandleWordLimit,
  handleUserUnauthorised,
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
  const [englishNotifImageUrlChip, setEnglishImageUrlChip] = useState(""); // state to track the english notification image url chip.
  const [sinhalaNotifImageUrlChip, setSinhalaImageUrlChip] = useState(""); // state to track the sinhala notification image url chip.
  const [imageUpload, setImageUpload] = useState(null); // state to store uploaded image.
  const [englishImageUpload, setEnglishImageUpload] = useState(null); // state to store uploaded image.
  const [sinhalaImageUpload, setSinhalaImageUpload] = useState(null); // state to store uploaded image.
  const [imageFormData, setImageFormData] = useState(null); // state to store form data of the uploaded image.
  const [sinhalaImageFormData, setSinhalaImageFormData] = useState(null); // state to store sinhala form data of the uploaded image.
  const [englishImageFormData, setEnglishImageFormData] = useState(null); // state to store english form data of the uploaded image .
  const [extra, setExtra] = useState(false); // state to track the extra toggle.
  const fileInputRef = useRef(); // useRef to reference the image upload component and reset after submit.
  const englishNotifInputRef = useRef(); // useRef to reference the english notification image upload component and reset after submit.
  const sinhalaNotifInputRef = useRef(); // useRef to reference the sinhala notification image upload component and reset after submit.
  const formikRef = useRef(null); // useRef to reference the form data of formik.

  useEffect(() => {
    async function getDropDowns() {
      handleLoaderOpen();
      try {
        // get bearer token
        const storedUser = localStorage.getItem("user");
        const token = storedUser ? JSON.parse(storedUser).token : null;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await Axios.get("/news/get-drop-downs", { headers });
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
      setEnglishImageUrlChip(
        selectedNews ? selectedNews.englishNotifImageUrl : ""
      );
      setSinhalaImageUrlChip(
        selectedNews ? selectedNews.sinhalaNotifImageUrl : ""
      );
      setExtra(
        selectedNews
          ? selectedNews.typeOfPost === "extra"
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
    imageUrl: formikRef.current
      ? formikRef.current.files
        ? formikRef.current.files[0]
        : null
      : null,
    englishNotifImageUrl: formikRef.current
      ? formikRef.current.files
        ? formikRef.current.files[0]
        : null
      : null,
    sinhalaNotifImageUrl: formikRef.current
      ? formikRef.current.files
        ? formikRef.current.files[0]
        : null
      : null,
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
    if (
      (values.description.length > 0 && values.description.length < 25) ||
      (values.sinhalaDescription.length > 0 &&
        values.sinhalaDescription.length < 25)
    ) {
      if (!isDeleteMode) {
        isEditMode && setEditOpen(false);
        isApproveMode && setApproveOpen(false);
        setValid(false);
        setHandleWordLimit(true);
      }
    } else {
      if (imageUpload) {
        const formData = new FormData();
        formData.append("image", imageUpload);
        setImageFormData(formData);
      }

      if (englishImageUpload) {
        const formData = new FormData();
        formData.append("notification-image", englishImageUpload);
        setEnglishImageFormData(formData);
      }

      if (sinhalaImageUpload) {
        const formData = new FormData();
        formData.append("notification-image", sinhalaImageUpload);
        setSinhalaImageFormData(formData);
      }

      setData({
        ...values,
        secondaryTags: selectedSecondaryTags ? selectedSecondaryTags : [],
        imageUrl: imageUrlChip ? imageUrlChip : "",
        englishNotifImageUrl: englishNotifImageUrlChip
          ? englishNotifImageUrlChip
          : "",
        sinhalaNotifImageUrl: sinhalaNotifImageUrlChip
          ? sinhalaNotifImageUrlChip
          : "",
        typeOfPost: extra ? "extra" : "essential",
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
          selectedNews ? selectedNews.imageUrl : ""
        );

        // if statement to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.imageUrl) {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that the current image is removed and a new image has been uploaded.
          if (fileInputRef.current.value != "" && imageUpload) {
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
            request = { ...request, imageUrl: imageResponse.data };
          } else {
            try {
              // if file input ref is equal to "" and there is no imageUpload, the imageUrlChip
              //  is removed which indicates the user wants the image removed
              const imgUrl = selectedNews.imageUrl;
              let deleteResponse = await Axios.post("/image/delete-image", {
                imgUrl,
              });
              handleSubmitFunc(deleteResponse);
            } catch (err) {
              handleSubmitFunc(err);
              console.log(err);
            }
          }
        } else {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that a new image has been uploaded.
          if (fileInputRef.current.value != "" && imageUpload) {
            let imageResponse = await Axios.post("/image", imageFormData);
            request = { ...data, imageUrl: imageResponse.data };
          }
        }
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }
    // if a new image upload was made, a checking is carried out to check if current post already has an image.
    else if (selectedNews && selectedNews.imageUrl) {
      // if there is no imageUrlChip that means the user has removed the chip therefore intending to delete the image
      // the delete image execution is run.
      if (!imageUrlChip) {
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
      }
    }

    //  if statement that checks if the image form data object is set.
    //  This is only set when a new image is uploaded or if an image is removed and a new image is added.
    if (englishImageFormData) {
      try {
        englishImageFormData.append(
          "englishNotifImageUrl",
          selectedNews ? selectedNews.englishNotifImageUrl : ""
        );

        // if statement to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.englishNotifImageUrl) {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that the current image is removed and a new image has been uploaded.
          if (englishNotifInputRef.current.value != "" && englishImageUpload) {
            let imageResponse = await Axios.post(
              "/notif-image/english",
              englishImageFormData
            );
            try {
              const imgUrl = selectedNews.englishNotifImageUrl;
              let deleteResponse = await Axios.post(
                "/notif-image/delete-english-image",
                {
                  imgUrl,
                }
              );
              handleSubmitFunc(deleteResponse);
            } catch (err) {
              handleSubmitFunc(err);
              console.log(err);
            }
            request = { ...request, englishNotifImageUrl: imageResponse.data };
          } else {
            try {
              // if file input ref is equal to "" and there is no englishImageUpload, the englishNotifImageUrlChip
              //  is removed which indicates the user wants the image removed
              const imgUrl = selectedNews.englishNotifImageUrl;
              let deleteResponse = await Axios.post(
                "/notif-image/delete-english-image",
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
        } else {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that a new image has been uploaded.
          if (englishNotifInputRef.current.value != "" && englishImageUpload) {
            let imageResponse = await Axios.post(
              "/notif-image/english",
              englishImageFormData
            );
            request = { ...request, englishNotifImageUrl: imageResponse.data };
          }
        }
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }
    // if a new image upload was made, a checking is carried out to check if current post already has an image.
    else if (selectedNews && selectedNews.englishNotifImageUrl) {
      // if there is no englishNotifImageUrlChip that means the user has removed the chip therefore intending to delete the image
      // the delete image execution is run.
      if (!englishNotifImageUrlChip) {
        try {
          const imgUrl = selectedNews.englishNotifImageUrl;
          let deleteResponse = await Axios.post(
            "/notif-image/delete-english-image",
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

    //  if statement that checks if the image form data object is set.
    //  This is only set when a new image is uploaded or if an image is removed and a new image is added.
    if (sinhalaImageFormData) {
      try {
        sinhalaImageFormData.append(
          "sinhalaNotifImageUrl",
          selectedNews ? selectedNews.sinhalaNotifImageUrl : ""
        );

        // if statement to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.sinhalaNotifImageUrl) {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that the current image is removed and a new image has been uploaded.
          if (sinhalaNotifInputRef.current.value != "" && sinhalaImageUpload) {
            let imageResponse = await Axios.post(
              "/notif-image/sinhala",
              sinhalaImageFormData
            );
            try {
              const imgUrl = selectedNews.sinhalaNotifImageUrl;
              let deleteResponse = await Axios.post(
                "/notif-image/delete-sinhala-image",
                {
                  imgUrl,
                }
              );
              handleSubmitFunc(deleteResponse);
            } catch (err) {
              handleSubmitFunc(err);
              console.log(err);
            }
            request = { ...data, sinhalaNotifImageUrl: imageResponse.data };
          } else {
            try {
              // if file input ref is equal to "" and there is no sinhalaImageUpload, the sinhalaNotifImageUrlChip
              //  is removed which indicates the user wants the image removed
              const imgUrl = selectedNews.sinhalaNotifImageUrl;
              let deleteResponse = await Axios.post(
                "/notif-image/delete-sinhala-image",
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
        } else {
          // statement to recheck if the file input ref is not equal anything and
          // if theres an image upload to ensure that a new image has been uploaded.
          if (sinhalaNotifInputRef.current.value != "" && sinhalaImageUpload) {
            let imageResponse = await Axios.post(
              "/notif-image/sinhala",
              sinhalaImageFormData
            );
            request = { ...data, sinhalaNotifImageUrl: imageResponse.data };
          }
        }
      } catch (err) {
        handleSubmitFunc(err);
        console.log(err);
      }
    }
    // if a new image upload was made, a checking is carried out to check if current post already has an image.
    else if (selectedNews && selectedNews.sinhalaNotifImageUrl) {
      // if there is no sinhalaNotifImageUrlChip that means the user has removed the chip therefore intending to delete the image
      // the delete image execution is run.
      if (!sinhalaNotifImageUrlChip) {
        try {
          const imgUrl = selectedNews.sinhalaNotifImageUrl;
          let deleteResponse = await Axios.post(
            "/notif-image/delete-sinhala-image",
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
      let response = await Axios.post("/news/edit-unpublished-news", request, {
        headers,
      });
      response && handleLoaderClose();
      setSelectedNews(response.data.value);
      resetForm();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (englishNotifInputRef.current) {
        englishNotifInputRef.current.value = "";
      }

      if (sinhalaNotifInputRef.current) {
        sinhalaNotifInputRef.current.value = "";
      }
      setValid(false);
      setImageUpload(null);
      setEnglishImageUpload(null);
      setSinhalaImageUpload(null);
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
      const response = await Axios.post("/news/delete-unpublished-news", data, {
        headers,
      });
      response && handleLoaderClose();
      setSelectedNews(null);
      resetForm();
      setImageUpload(null);
      setEnglishImageUpload(null);
      setSinhalaImageUpload(null);
      setSelectedSecondaryTags([]);
      setValid(false);
      setExtra(false);
      setImageUrlChip("");
      setEnglishImageUrlChip("");
      setSinhalaImageUrlChip("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (englishNotifInputRef.current) {
        englishNotifInputRef.current.value = "";
      }

      if (sinhalaNotifInputRef.current) {
        sinhalaNotifInputRef.current.value = "";
      }
      handleSubmitFunc(response);
    } catch (err) {
      console.error(err);
      err && handleLoaderClose();
      handleSubmitFunc(err);
    }

    if (data.imageUrl) {
      try {
        const imgUrl = data.imageUrl;
        await Axios.post("/image/delete-image", { imgUrl });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleUserUnauthorised();
        } else {
          console.error(err);
          err && handleLoaderClose();
          handleSubmitFunc(err);
        }
      }
    }

    if (data.englishNotifImageUrl) {
      try {
        const imgUrl = data.englishNotifImageUrl;
        await Axios.post("/notif-image/delete-english-image", { imgUrl });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleUserUnauthorised();
        } else {
          console.error(err);
          err && handleLoaderClose();
          handleSubmitFunc(err);
        }
      }
    }

    if (data.sinhalaNotifImageUrl) {
      try {
        const imgUrl = data.sinhalaNotifImageUrl;
        await Axios.post("/notif-image/delete-sinhala-image", { imgUrl });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleUserUnauthorised();
        } else {
          console.error(err);
          err && handleLoaderClose();
          handleSubmitFunc(err);
        }
      }
    }
  };

  // function that adds form data to the backend local or internattional collection after confirmation from the pop up to publish.
  const handleApproveConfirm = async (resetForm) => {
    setApproveOpen(false);
    handleLoaderOpen();

    // get bearer token
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

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
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }

    if (englishImageFormData) {
      try {
        englishImageFormData.append(
          "englishNotifImageUrl",
          selectedNews ? selectedNews.englishNotifImageUrl : ""
        );

        // checking to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.englishNotifImageUrl) {
          let imageResponse = await Axios.post(
            "/notif-image/english",
            englishImageFormData
          );
          try {
            const imgUrl = selectedNews.englishNotifImageUrl;
            let deleteResponse = await Axios.post("/image/delete-image", {
              imgUrl,
            });
            handleSubmitFunc(deleteResponse);
          } catch (err) {
            handleSubmitFunc(err);
            console.log(err);
          }
          request = { ...data, englishNotifImageUrl: imageResponse.data };
        } else {
          let imageResponse = await Axios.post(
            "/notif-image/english",
            englishImageFormData
          );
          request = { ...data, englishNotifImageUrl: imageResponse.data };
        }
      } catch (err) {
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }

    if (sinhalaImageFormData) {
      try {
        sinhalaImageFormData.append(
          "sinhalaNotifImageUrl",
          selectedNews ? selectedNews.sinhalaNotifImageUrl : ""
        );

        // checking to differentiate between an already existing post or a newly added post
        if (selectedNews && selectedNews.sinhalaNotifImageUrl) {
          let imageResponse = await Axios.post(
            "/notif-image/sinhala",
            sinhalaImageFormData
          );
          try {
            const imgUrl = selectedNews.sinhalaNotifImageUrl;
            let deleteResponse = await Axios.post(
              "/notif-image/delete-sinhala-image",
              {
                imgUrl,
              }
            );
            handleSubmitFunc(deleteResponse);
          } catch (err) {
            handleSubmitFunc(err);
            console.log(err);
          }
          request = { ...data, sinhalaNotifImageUrl: imageResponse.data };
        } else {
          let imageResponse = await Axios.post(
            "/notif-image/sinhala",
            sinhalaImageFormData
          );
          request = { ...data, sinhalaNotifImageUrl: imageResponse.data };
        }
      } catch (err) {
        console.error(err);
        err && handleLoaderClose();
        handleSubmitFunc(err);
      }
    }

    try {
      if (data && data.locality === "international") {
        const response = await Axios.post(
          "/news/approve-international-news",
          request,
          { headers }
        );
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setImageUpload(null);
        setEnglishImageUpload(null);
        setSinhalaImageUpload(null);
        setSelectedSecondaryTags([]);
        setExtra(false);
        setImageUrlChip("");
        setEnglishImageUrlChip("");
        setSinhalaImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (englishNotifInputRef.current) {
          englishNotifInputRef.current.value = "";
        }

        if (sinhalaNotifInputRef.current) {
          sinhalaNotifInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      } else {
        const response = await Axios.post("/news/approve-local-news", request, {
          headers,
        });
        response && handleLoaderClose();
        setSelectedNews(null);
        resetForm();
        setImageUpload(null);
        setEnglishImageUpload(null);
        setSinhalaImageUpload(null);
        setSelectedSecondaryTags([]);
        setExtra(false);
        setValid(false);
        setImageUrlChip("");
        setImageUrlChip("");
        setEnglishImageUrlChip("");
        setSinhalaImageUrlChip("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        if (englishNotifInputRef.current) {
          englishNotifInputRef.current.value = "";
        }

        if (sinhalaNotifInputRef.current) {
          sinhalaNotifInputRef.current.value = "";
        }
        handleSubmitFunc(response);
      }
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

  // function to add the english notification image upload to a state
  const handleEnglishNotifFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB (in bytes)

    if (file && file.size > maxSize) {
      handleImageSize(englishNotifInputRef);
    } else {
      setEnglishImageUpload(file);
    }
  };

  // function to add the english notification image upload to a state
  const handleSinhalaNotifFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB (in bytes)

    if (file && file.size > maxSize) {
      handleImageSize(sinhalaNotifInputRef);
    } else {
      setSinhalaImageUpload(file);
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
    title:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("News Headline is required"),
    sinhalaTitle:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Sinhala News Title is required"),
    description:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("News Description is required"),
    imageUrl:
      !isEditMode &&
      !isDeleteMode &&
      imageUrlChip.length === 0 &&
      !imageUpload &&
      Yup.string().required("Image URL is required"),
    englishNotifImageUrl:
      !isEditMode &&
      !isDeleteMode &&
      englishNotifImageUrlChip.length === 0 &&
      !englishImageUpload &&
      Yup.string().required("English Notification Image URL is required"),
    sinhalaNotifImageUrl:
      !isEditMode &&
      !isDeleteMode &&
      sinhalaNotifImageUrlChip.length === 0 &&
      !sinhalaImageUpload &&
      Yup.string().required("Sinhala Notification Image URL is required"),
    sinhalaDescription:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Sinhala News Description is required"),
    sourceName:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Source Name is required"),
    sourceUrl:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Source URL is required"),
    mainTag:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Main News Tags are required"),
    locality:
      !isEditMode &&
      !isDeleteMode &&
      Yup.string().required("Locality is required"),
  });

  // function to handle the secondary news tag drop down
  const handleSecondaryTagChange = (e, values) => {
    const selectedValues = values.map(({ topic }) => topic);
    setSelectedSecondaryTags(selectedValues);
  };

  return (
    <Formik
      innerRef={formikRef}
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
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <label htmlFor="image">
                  <Typography fontWeight="bold">
                    Choose English Notification Image (JPG or PNG)
                  </Typography>
                </label>
                {englishNotifImageUrlChip ? (
                  <Tooltip title={englishNotifImageUrlChip} arrow>
                    <Chip
                      id="image"
                      name="image"
                      label={englishNotifImageUrlChip}
                      size="small"
                      onClick={() => {
                        window.open(englishNotifImageUrlChip, "_blank");
                      }}
                      onDelete={() => setEnglishImageUrlChip("")}
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
                inputRef={englishNotifInputRef}
                disabled={englishNotifImageUrlChip ? true : false}
                component={TextField}
                name="englishNotifImageUrl"
                type="file"
                variant="outlined"
                fullWidth
                inputProps={{ accept: "image/jpeg, image/png" }}
                onChange={(event) => handleEnglishNotifFileChange(event)}
              />
              <ErrorMessage
                name="englishNotifImageUrl"
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
                    Choose Sinhala Notification Image (JPG or PNG)
                  </Typography>
                </label>
                {sinhalaNotifImageUrlChip ? (
                  <Tooltip title={sinhalaNotifImageUrlChip} arrow>
                    <Chip
                      id="image"
                      name="image"
                      label={sinhalaNotifImageUrlChip}
                      size="small"
                      onClick={() => {
                        window.open(sinhalaNotifImageUrlChip, "_blank");
                      }}
                      onDelete={() => setSinhalaImageUrlChip("")}
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
                inputRef={sinhalaNotifInputRef}
                disabled={sinhalaNotifImageUrlChip ? true : false}
                component={TextField}
                name="sinhalaNotifImageUrl"
                type="file"
                variant="outlined"
                fullWidth
                inputProps={{ accept: "image/jpeg, image/png" }}
                onChange={(event) => handleSinhalaNotifFileChange(event)}
              />
              <ErrorMessage
                name="sinhalaNotifImageUrl"
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
                  id="author"
                  name="author"
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    readOnly: true,
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
                label="Extra"
                control={<Switch />}
                checked={extra}
                onChange={() => setExtra(!extra)}
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
                  setEditOpen(true);
                  setIsEditMode(true);
                  setIsDeleteMode(false);
                  setIsApproveMode(false);
                }}
              >
                Save
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
                  setDeleteOpen(true);
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

export default EditAndPublishForm;
