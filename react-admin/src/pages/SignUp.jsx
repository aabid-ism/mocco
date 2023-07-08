import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/axios.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext.js";

const defaultTheme = createTheme();

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string().required("Password is required"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  // function to notify successful upload
  const handleSubmitFunc = (response) => {
    if (response.status === 200) {
      toast.success(response.data.message, {
        autoClose: 1500,
        theme: "dark",
        onClose: () => {
          setTimeout(() => {
            navigate("/preliminary-posting");
          }, 1600);
        },
      });
    } else {
      toast.error(response.response.data.message, {
        autoClose: 1500,
        theme: "dark",
      });
    }
  };

  const handleSignUp = async (values, { resetForm }) => {
    try {
      let signUpResponse = await Axios.post("/auth/sign-up", values);
      if (signUpResponse) {
        localStorage.setItem("jwt", signUpResponse.data.token);
        dispatch({ type: "LOGIN", payload: signUpResponse.data.token });
        resetForm();
        handleSubmitFunc(signUpResponse);
      }
    } catch (err) {
      handleSubmitFunc(err);
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              agreeToTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            <Form noValidate>
              <Grid
                container
                spacing={2}
                sx={{
                  marginTop: 2,
                }}
              >
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error"
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error"
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                    style={{
                      color: "red",
                      fontSize: "0.8rem",
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={() => navigate("/")} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          </Formik>
          <ToastContainer />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
