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
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string().required("Password is required"),
});

export default function SignIn() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  // Function to notify successful login
  const handleSubmitFunc = (response) => {
    if (response.status === 200) {
      toast.success(response.data.message, {
        autoClose: 1500,
        theme: "dark",
        onClose: () => {
          setTimeout(() => {
            localStorage.setItem("jwt", response.data.token);
            dispatch({ type: "LOGIN", payload: response.data.token });
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

  const handleSignIn = async (values, { resetForm }) => {
    try {
      let signInResponse = await Axios.post("/auth/sign-in", values);
      if (signInResponse) {
        resetForm();
        handleSubmitFunc(signInResponse);
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
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
          </Box>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({ isSubmitting }) => (
              <Form noValidate>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
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

                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link variant="body2" onClick={() => navigate("/sign-up")}>
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
        {/* React-toastify container for displaying notifications */}
        <ToastContainer />
      </Container>
    </ThemeProvider>
  );
}
