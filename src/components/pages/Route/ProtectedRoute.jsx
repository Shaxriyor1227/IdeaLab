import React from 'react'
import { useAuth } from '../../context/Authontext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  const {isAuth} = useAuth();
  return isAuth ? (
    children 
  ) : (
    <Navigate to="/signin" />
  );
};

export default ProtectedRoute
