import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ textAlign: "center", marginTop: "20vh" }}
    >
      <ErrorIcon sx={{fontSize: "5rem"}} />
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
