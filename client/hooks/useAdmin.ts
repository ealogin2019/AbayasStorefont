import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export function useAdminAuth() {
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const getUser = (): AdminUser | null => {
    const user = localStorage.getItem("adminUser");
    return user ? JSON.parse(user) : null;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const requireAuth = () => {
    const token = getToken();
    if (!token) {
      navigate("/admin/login", { state: { from: location } });
      return false;
    }
    return true;
  };

  return {
    getToken,
    getUser,
    logout,
    requireAuth,
    isAuthenticated: !!getToken(),
  };
}

/**
 * Protected page wrapper - redirects to login if not authenticated
 */
export function useProtectedAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);
}
