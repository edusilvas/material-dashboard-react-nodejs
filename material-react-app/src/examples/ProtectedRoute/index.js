import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, hasCompletedOnboarding, redirectPath = "/auth/login", children }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Se autenticado mas sem onboarding, e não está na página de perfil, redireciona
  if (!hasCompletedOnboarding && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
