import { Navigate } from 'react-router';

const ProtectedRouteElement = ({ loggedIn, children }) => {
  return loggedIn ? <>{children}</> : <Navigate to='/sign-in' />;
};

export default ProtectedRouteElement;
