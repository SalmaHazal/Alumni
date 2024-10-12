import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/index";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import villes from "../../Data/locat.json";

const registerSchema = yup.object().shape({
  // yup is a JavaScript schema builder
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .required("required")
    .min(8, "Password must be at least 8 characters"), // Added password length validation
  confirmPassword: yup
    .string()
    .required("required")
    .oneOf([yup.ref("password"), null], "Passwords must match"), // Added confirmPassword field with validation
  location: yup.string().required("required"),
  promotion: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "", // Added confirmPassword initial value
  location: "",
  promotion: "",
  occupation: "",
  phonenumber: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [sortedCities, setSortedCities] = useState([]);
  const promo = [
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
  ];

  useEffect(() => {
    const cities = villes.map((city) => city.city);
    cities.sort((a, b) => a.localeCompare(b));
    setSortedCities(cities);
  }, []);

  const register = async (values, onSubmitProps) => {
    try {
      // this allows us to send form info with image
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value]);
      }
      formData.append("picturePath", values.picture.name);

      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();

      if (savedUser) {
        setPageType("login");
        toast.success(savedUser.message || "Registration successful!");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const loggedIn = await loggedInResponse.json();
      console.log(loggedIn);

      onSubmitProps.resetForm();

      if (loggedIn && loggedIn.user && loggedIn.token) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        navigate("/home");
        toast.success(loggedIn.message || "Login successful!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name*"
                  title="Example : Ahmed"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name*"
                  title="Example : EL IDRISSI"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />

                <FormControl
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  sx={{ gridColumn: "span 4" }}
                  fullWidth
                >
                  <InputLabel id="promotion-label">Promotion*</InputLabel>
                  <Select
                    labelId="promotion"
                    title="Select a field"
                    id="promotion"
                    value={values.promotion}
                    name="promotion"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="promotion"
                  >
                    {promo.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {Boolean(touched.promotion) && Boolean(errors.promotion) && (
                    <FormHelperText>{errors.promotion}</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  sx={{ gridColumn: "span 4" }}
                  fullWidth
                >
                  <InputLabel id="location-label">Location*</InputLabel>
                  <Select
                    labelId="location-label"
                    title="Select a field"
                    id="location"
                    value={values.location}
                    name="location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Location"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {sortedCities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {Boolean(touched.location) && Boolean(errors.location) && (
                    <FormHelperText>{errors.location}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  label="Occupation*"
                  title="Example : Engineer"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Phone Number*"
                  title="Example : 0666666666"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phonenumber}
                  name="phonenumber"
                  error={
                    Boolean(touched.phonenumber) && Boolean(errors.phonenumber)
                  }
                  helperText={touched.phonenumber && errors.phonenumber}
                  sx={{ gridColumn: "span 4" }}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <Typography>Add Picture Here</Typography>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src={URL.createObjectURL(values.picture)}
                              alt="Selected"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                borderRadius: "5px",
                                marginBottom: "1rem",
                              }}
                            />
                            <Box sx={{ marginLeft: "1rem" }}>
                              <Typography>{values.picture.name}</Typography>
                              <IconButton
                                component="span"
                                onClick={() => setFieldValue("picture", null)}
                                sx={{ marginLeft: "0.5rem" }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email*"
              title="Example : John@gmail.com"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password*"
              title="Example : 1234A567B8"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />

            {isRegister && (
              <TextField
                label="Confirm Password*"
                title="Re-enter your password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.confirmPassword}
                name="confirmPassword"
                error={
                  Boolean(touched.confirmPassword) &&
                  Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                sx={{ gridColumn: "span 4" }}
              />
            )}

            {isLogin && (
              <Box sx={{ gridColumn: "span 4", textAlign: "right" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    color: palette.primary.main,
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
