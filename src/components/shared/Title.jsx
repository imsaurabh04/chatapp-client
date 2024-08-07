import React from 'react'
import {Helmet}  from "react-helmet-async";

const Title = ({ 
    title= "ChatterBox",
    description= "ChatterBox is a dynamic chat application built using the MERN stack (MongoDB, Express.js, React, Node.js). Enjoy real-time messaging, secure authentication, group chats, and media sharing with a seamless experience. Join ChatterBox for fast, secure, and engaging communication." }) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
    </Helmet>
  )
}

export default Title