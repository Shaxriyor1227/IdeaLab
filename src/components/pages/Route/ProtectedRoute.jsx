import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

import Loader from '../../Loader/Loader';

const ProtectedRoute = ({children}) => {
  const { isAuth, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  return isAuth ? (
    children 
  ) : (
    <Navigate to="/signin" />
  );
};

export default ProtectedRoute
