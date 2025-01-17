import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
      if (!isAuthenticated) {
        console.log("No authentication found, redirecting to login");
        navigate("/admin/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;