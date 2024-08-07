import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Typography } from '@mui/material';

const Home = () => {
  return (
    <Typography
      variant="h5"
      textAlign={"center"}
      padding={"2rem"}
      border={"2px solid #f0f0f0"}
      height={"100%"}
    >
      Select a friend to chat
    </Typography>
  )
}

export default AppLayout()(Home);