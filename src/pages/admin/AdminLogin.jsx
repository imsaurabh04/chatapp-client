import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { adminLogin, getAdminData } from "../../redux/thunks/admin";


const AdminLogin = () => {

  const dispatch = useDispatch();
  const { isAdmin } = useSelector(state => state.auth);

  const secretKey = useInputValidation("");

  useEffect(() => {
    dispatch(getAdminData());

  }, [dispatch])

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  }

  if(isAdmin) return <Navigate to="/admin/dashboard" />;
  
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
          <Typography variant={"h5"}>Admin Log In</Typography>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%"
            }}
          >
            <TextField
              required
              label="Secret Key"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
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
            >
              Log In
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
