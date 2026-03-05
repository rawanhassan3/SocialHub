import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from "../contexts/Authcontext";

export default function ProtectedAuthroute({ children }) {
  const { userToken } = useContext(authContext);
  const isLoggedIn = !!userToken;

 
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}