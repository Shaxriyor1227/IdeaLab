import { useAuth } from '../../context/AuthContext';
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
