import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

const ADMIN_USERNAME = "root";
const ADMIN_PASSWORD = "ZZDXDX3DN1MM87IVH0QTYKJPC6160I5PQCZLP24ON96L9POOMW6XTP1L";

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
      
      console.log("Checking existing auth:", { session, isAuthenticated });
      
      if (session && isAuthenticated) {
        navigate("/admin");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error("Supabase auth error:", error);
    let errorMessage = "Ошибка авторизации: ";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage += "Неверные учетные данные администратора в Supabase";
    } else {
      errorMessage += error.message;
    }
    
    toast({
      title: "Ошибка",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First check admin credentials
      if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        throw new Error("Invalid credentials");
      }

      console.log("Admin credentials valid, attempting Supabase login...");

      // Then sign in with Supabase using the new credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "root@su.com",
        password: ADMIN_PASSWORD,
      });

      if (error) {
        handleAuthError(error);
        return;
      }

      console.log("Supabase login successful:", data);
      localStorage.setItem("isAdminAuthenticated", "true");
      navigate("/admin");
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Ошибка авторизации",
        description: "Неверный логин или пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в панель администратора</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Логин
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;