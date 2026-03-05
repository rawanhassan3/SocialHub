import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from "../contexts/Authcontext";

export default function Protectedroutes({ children }) {
  const { userToken } = useContext(authContext);
  const isLoggedIn = !!userToken;

  
  return isLoggedIn ? children : <Navigate to="/Signin" replace />;
}
