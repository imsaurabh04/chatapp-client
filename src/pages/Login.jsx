import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const dispatch = useDispatch();

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();

  const avatar = useFileHandler("single");

  const handleAvatarChange = (e) => {
    avatar.clear();
    avatar.changeHandler(e);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const toastId = toast.loading("Signing up..."); 

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("avatar", avatar.file);
    
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginPage = () => {
    setIsLoginPage((oldValue) => !oldValue);
  };

  return (
    <div
      style={{
        backgroundImage: `url("/login-background.png")`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isLoginPage ? (
            <>
              <Typography variant={"h5"}>Log In</Typography>
              <form
                onSubmit={handleLogin}
                style={{
                  width: "100%",
                  margin: "1rem",
                }}
              >
                <TextField
                  required
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  label="Password"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  sx={{ marginY: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Log In
                </Button>
                <Typography textAlign={"center"} variant="body2">
                  OR
                </Typography>
                <Button disabled={isLoading} variant="text" fullWidth onClick={toggleLoginPage}>
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant={"h5"}>Sign Up</Typography>
              <form
                onSubmit={handleSignup}
                style={{
                  width: "100%",
                  margin: "1rem",
                }}
              >
                <Stack position={"relative"} margin={"auto"} width={"5rem"}>
                  <Avatar
                    sx={{
                      height: "5rem",
                      width: "5rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      right: "-10px",
                      bottom: 0,
                      color: "white",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon fontSize="small" />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={handleAvatarChange}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    sx={{
                      textAlign: "center",
                      marginY: "5px",
                      fontSize: "12px",
                      color: "red",
                    }}
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  label="Bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                {username.error && (
                  <Typography sx={{ fontSize: "12px", color: "red" }}>
                    {username.error}
                  </Typography>
                )}
                <TextField
                  required
                  label="Password"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                {password.error && (
                  <Typography sx={{ fontSize: "12px", color: "red" }}>
                    {password.error}
                  </Typography>
                )}

                <Button
                  sx={{ marginY: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} variant="body2">
                  OR
                </Typography>
                <Button disabled={isLoading} variant="text" fullWidth onClick={toggleLoginPage}>
                  Log In Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
