import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PtotectRoute = ({ children, user, redirects="/login" }) => {
  if(!user) return <Navigate to={redirects} />
  return children ? children : <Outlet />;
}

export default PtotectRoute