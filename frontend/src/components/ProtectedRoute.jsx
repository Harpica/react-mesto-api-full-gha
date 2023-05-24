import { Navigate } from 'react-router';

const ProtectedRouteElement = ({ statement, children, redirect }) => {
  return statement ? <>{children}</> : <Navigate to={redirect} />;
};

export default ProtectedRouteElement;
