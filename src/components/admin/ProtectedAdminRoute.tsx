import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
        
        console.log("Checking auth:", { session, isAuthenticated });
        
        if (!session || !isAuthenticated) {
          console.log("No valid session or admin authentication found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/admin/login");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem("isAdminAuthenticated");
        navigate("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;