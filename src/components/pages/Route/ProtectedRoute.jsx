import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuth, authReady } = useAuth();

  // authReady bo'lguncha hech narsa ko'rsatmaymiz
  // (AuthContext allaqachon null render qiladi, bu holat kamdan-kam yuz beradi)
  if (!authReady) return null;

  return isAuth ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
