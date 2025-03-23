import React, { useState } from "react";
import "../Login/Login.scss";
import "../Register/Register.scss";
import banner1 from "../../assets/images/banner/Dashboard-banner.png";

import gIcon from "../../assets/images/vector/gl-icon.png";
import inIcon from "../../assets/images/vector/in-icon.png";

import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { InputAdornment, IconButton } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  LightButton,
  PrimaryButton,
} from "../../components/AllButtons/AllButtons.tsx";
import * as Yup from "yup";
import { getData, postData } from "../../hook/apiService.js";
import {
  DISPOSABLE_EMAIL_API1,
  DISPOSABLE_EMAIL_API2,
  FCM_TOKEN,
  LEAD,
  LOGIN,
  LOGIN_END_POINT,
  REGISTRATION_END_POINT,
  SOCIAL_SIGNUP_END_POINT,
} from "../../constants/constant.js";
import { Formik } from "formik";
import { useGoogleLogin } from "@react-oauth/google";
import ErrorSnackbar from "../../components/ErrorSnackbar/ErrorSnackbar.tsx";
import Loader from "../../components/Loader/loader.js";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/user/userSlice.js";
import axios from 'axios';
import InfoModel from "../../components/InfoModel/InforModel.tsx";

function Register() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfrimPassword] = useState(false);
  const [user, setUser] = useState<null | any>(null);
  const handleShowPassword = () => setShowPassword((show) => !show);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailMessage, setIsEmailMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sucessToggle, setSuccessToggle] = useState(false);
  const [emailExistMessage, setEmailExistMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayMessage,setDisplayMsg] = useState({title:'',message:''})
  const [showTimer, setShowTimer] = useState(false)
  const [responseData,setResponseData] =useState([])
  const dispatch = useDispatch();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleShowconfirmPassword = () =>
    setShowConfrimPassword((show) => !show);

  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().min(2).max(50).required("First name is required").matches(/^[A-Za-z]+$/, "First name can only contain alphabets"),
    last_name: Yup.string().min(2).max(50).required("Last name is required").matches(/^[A-Za-z]+$/, "Last name can only contain alphabets"),
    email: Yup.string()
      .matches(
        emailRegex,
        "Please enter a valid email (eg. johnpatel@mail.com)"
      )
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(
        pwRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords doesn't match")
      .required("Confirm password is required"),
  });

  const handleLoginClick = async (type, socialId) => {
    try {
      setIsLoading(true)
      const response = await postData(LOGIN_END_POINT, {
        fcm_token: FCM_TOKEN,
        type: type,
        social_id: socialId,
      });
      
      if (response.status === 200) {
        const userData = {
          user_id: response.id,
          token: response.token,
          first_name: response.userdata.first_name,
          last_name: response.userdata.last_name,
          email: response.userdata.email,
        };
        console.log("userData", userData);
        dispatch(
          setUserData(userData) );
        localStorage.setItem("user_data", JSON.stringify(userData));
        localStorage.setItem("token", response.token);

        navigate(LEAD);
        setIsLoading(false);
      } else if (response.status === 412) {
        setSnackbarMessage("Your password doesn’t match with your email.");
        setSnackbarOpen(true);
        setIsLoading(false)
      }
    } catch (err) {
      setSnackbarMessage( "Your password doesn’t match with your email");
      setSnackbarOpen(false);
      setIsLoading(false);
    }
  };
  const handleSignUp = async (values) => {
    setIsLoading(true);
    setDisplayMsg({title:'',message:''})
    try {
      let checkDisposable = await axios.get(`${DISPOSABLE_EMAIL_API1}/?email=${values.email}`);
      let isDisposable = checkDisposable.data.disposable;
      if (isDisposable && (isDisposable === true) || isDisposable == 'true') {
        setSnackbarOpen(true);
        setIsLoading(false);
        setSnackbarMessage("Disposable email address is not allowed.");
        return;
      }
      let response = await postData(REGISTRATION_END_POINT, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        role_id: 1,
      });

      if (response && response.status === 200) {
        setIsLoading(false);
        setInitialValues({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
        });

        localStorage.setItem("userEmail", values.email);
        // setSuccessToggle(true);
        // setSnackbarOpen(true);
        setIsLoading(false);
        setDisplayMsg({title:'Sign-Up Success',
          message:"Sign-up successful! Check your email to verify your account."})


        setSuccessToggle(true);
        setSnackbarMessage("Sign-up successful! Check your email to verify your account.");
        setSnackbarOpen(true);

        
        // setSnackbarMessage("An email has been sent to your registered email address. Please verify to proceed.");
        // setTimeout(() => {
        //   navigate('/');
        // }, 3000);
      } else {
        throw new Error(response?.data?.message || "Registration failed");
      }
    } catch (error) {
      if(error.response.data.error.email[0]=="This Email Address is Already Exists.Please Use Different Email Address"){
        setErrorMessage(error.response.data.error.email);
        setIsEmailMessage(true);
        setEmailExistMessage(error.response.data.error.email);
      }
      else{
        setError(
          error?.response?.data?.message ||
            "Registration failed, please try again."
        );
      }
      setInitialValues(values);   
      setIsLoading(false)
    }
  };

  const getUserInfo = async (accessToken) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      if (data) {
        console.log("User info:", data);
        await triggerSocialSignup(accessToken, data.id, data.email, data.family_name,data.given_name);
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
    }
  };

  const triggerSocialSignup = async (token, socialId, email,family_name,given_name) => {
    const payload = {
      type: "Google",
      token: token,
      role_id: 1,
      first_name:given_name,
      last_name:family_name,
      social_id: socialId,
      email: email,
      password: socialId,
    };
    console.log("Payload : ", payload);

    try {
      setIsLoading(true);
      const response = await postData(SOCIAL_SIGNUP_END_POINT, payload);
      console.log("response of social_signUp", response)
      console.log(response?.error?.email);
      if (response && response.status === 200) {
      //   const userData = {
      //   user_id: response?.['id'],
      //   token: response?.['token'],
      //   first_name: response?.['userdata.first_name'],
      //   last_name: response?.['userdata.last_name'],
      //   email: response?.['userdata.email'],
      // };
      // console.log("userData", userData);
      // dispatch(setUserData(userData) );
      // localStorage.setItem("user_data", JSON.stringify(userData));
      // localStorage.setItem("token", response?.['token']);
      setResponseData(response)
      setShowTimer(true)
        
        setIsLoading(false)
        setDisplayMsg({title:'Sign-Up Success',
          message:"Your sign-up was successful!"})
        openModal();
      } else {
        throw new Error(response?.data?.message || "Social signup failed");
      }
    } catch (error) {
  
      const type = error?.response?.data?.data[0]?.type;
      const social_id = error?.response?.data?.data[0]?.social_id;
      const isExist = error?.response?.data?.isExists;
      console.log("isExist", isExist);

      if (isExist === true) {
        handleLoginClick(type, social_id);
      } else {
        setErrorMessage("Error during social signup:");
        setIsLoading(false)
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setUser(response);
        console.log("Google login success:", response);
        await getUserInfo(response.access_token);
      } catch (error) {
        console.error("Error during login or signup:", error);
      }
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate("/")
  };

  return (
    <>
      <div className="authentication-main-wrapper">
        <div className="row g-0">
          <div className="col-sm-12 col-md-7 banner-left-block">
            <div className="authentication-info-block">
              <img
                className="ellipse-vactor-top"
                src={ellipseTop}
                alt="ellipseTop"
              />
              <div className="authentication-info-content">
                <h3>The Sales CRM made for you</h3>
                <p>
                  Organize your sales process, win more deals, and create <br />{" "}
                  happy customers with our automated sales CRM
                </p>
              </div>
              <div className="authentication-banner">
                <img className="w-100" src={banner1} alt="banner1" />
              </div>
              <img
                className="ellipse-vactor-bottom"
                src={ellipseBottom}
                alt="ellipseBottom"
              />
            </div>
          </div>
          <div className="col-sm-12 col-md-5 form-right-block">
            <div className="authentication-form-block">
              <h1 className="authentication-form-heading">
                Build your Relationship: <br />
                <span className="logo-i-text"> Register Today!</span>
              </h1>
              <p>Effortless Registration: Enter Your Details Below!</p>
              {isLoading && (
                <div className="loader-wrapper">
                  <Loader />
                </div>
              )}
              {!isLoading && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSignUp}
              >
                {({
                  values,
                  touched,
                  errors,
                  handleBlur,
                  handleChange,
                  setFieldError,
                  handleSubmit,
                  isValid
                }) => {
                    // Check if all fields are filled
                    const allFieldsFilled = Object.values(values).every(
                      (field) => field.trim() !== ""
                    );

                    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                      setEmailExistMessage("");
                    };
                  
                  return (
                    <form action="" onSubmit={handleSubmit}>
                      <div className="input-form-field-wrapper">
                        <label htmlFor="firstNameField">
                          First Name <span>*</span>
                        </label>
                        <TextField
                          className="out-label-input-text"
                          placeholder="Enter your first name"
                          margin="normal"
                          variant="outlined"
                          id="firstNameField"
                          fullWidth
                          type="text"
                          name="first_name"
                          value={values.first_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ borderColor: "red" }}
                          error={touched.first_name && Boolean(errors.first_name)}
                        />

                        {errors.first_name && touched?.first_name && (
                          <div
                            className="error-message error-message-height"
                            id="feedback"
                          >
                            {errors.first_name}
                          </div>
                        )}
                      </div>
                      <div className="input-form-field-wrapper">
                        <label htmlFor="lastNameField">
                          Last Name <span>*</span>
                        </label>
                        <TextField
                          className="out-label-input-text"
                          placeholder="Enter your last name"
                          margin="normal"
                          variant="outlined"
                          id="lastNameField"
                          fullWidth
                          type="text"
                          name="last_name"
                          value={values.last_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.last_name && Boolean(errors.last_name)}
                        />

                        {errors.last_name && touched?.last_name && (
                          <div
                            className="error-message error-message-height"
                            id="feedback"
                          >
                            {errors.last_name}
                          </div>
                        )}
                      </div>
                      <div className="input-form-field-wrapper">
                        <label htmlFor="email">
                          Email <span>*</span>
                        </label>
                        <TextField
                          className="out-label-input-text"
                          placeholder="youremail@domain.com"
                          margin="normal"
                          variant="outlined"
                          id="email"
                          fullWidth
                          type="text"
                          value={values.email}
                          name="email"
                          onChange={handleEmailChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                        />
                        {emailExistMessage && (
                        <div className="error-message">{emailExistMessage}</div>
                      )}
                        {errors.email && touched?.email && (
                          <div
                            className="error-message error-message-height"
                            id="feedback"
                          >
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div className="input-form-field-wrapper">
                        <label htmlFor="password">
                          Password <span>*</span>
                        </label>
                        <TextField
                          className="out-label-input-text"
                          placeholder="************"
                          margin="normal"
                          variant="outlined"
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          onChange={(e) => {
                            setError("");
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          error={touched.password && Boolean(errors.password)}
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <RemoveRedEyeIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {errors.password && touched?.password && (
                          <div
                            className="error-message error-message-height"
                            id="feedback"
                          >
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="input-form-field-wrapper">
                        <label htmlFor="confirmPasswordField">
                          Confirm Password <span>*</span>
                        </label>
                        <TextField
                          className="out-label-input-text"
                          placeholder="************"
                          margin="normal"
                          variant="outlined"
                          id="confirmPasswordField"
                          name="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={values.confirm_password}
                          onChange={(e) => {
                            setError("");
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          error={
                            touched.confirm_password &&
                            Boolean(errors.confirm_password)
                          }
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleShowconfirmPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <RemoveRedEyeIcon />
                                  ) : (
                                    <VisibilityOffIcon />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        {errors.confirm_password && touched?.confirm_password && (
                          <div
                            className="error-message error-message-height"
                            id="feedback"
                          >
                            {errors.confirm_password}
                          </div>
                        )}
                      </div>

                      <div>
                        <PrimaryButton
                          type="submit" disabled={!allFieldsFilled || !isValid}
                          sx={{ width: "100%", marginTop: "24px" }}
                        >
                          Register
                        </PrimaryButton>
                      </div>
                      {errorMessage && (
                        <div className="error-message">{ !isEmailMessage ? errorMessage : ''}</div>
                      )}
                      <ErrorSnackbar
                        open={snackbarOpen}
                        message={snackbarMessage}
                        handleClose={handleSnackbarClose}
                        success={sucessToggle}
                      />

                      <div className="seprator-title">
                        <article>
                          <p>or Register With</p>
                        </article>
                      </div>

                      <div className="social-button-group">
                        <LightButton
                          sx={{ width: "100%" }}
                          onClick={() => login()}
                        >
                          {" "}
                          <img src={gIcon} alt="gIcon" /> Google
                        </LightButton>
                      </div>
                      <div className="redirect-link">
                        Already Have an Account ? <Link to={"/"}> Login</Link>
                      </div>
                    </form>
                  )} 
                  }
              </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* <InfoModel
        isShowHide={isModalOpen}
        setGoBackOpen={closeModal}
        title={displayMessage.title}
        message={displayMessage.message}
        isTimer={showTimer}
        redirectData={responseData}
      /> */}
    </>
  );
}

export default Register;
