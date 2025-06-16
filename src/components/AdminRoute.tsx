
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  console.log('AdminRoute - Debug info:', {
    user: user ? user.email : 'null',
    isLoading,
    isAdmin,
    hasUser: !!user
  });

  useEffect(() => {
    console.log('AdminRoute useEffect triggered:', { user, isLoading, isAdmin });
    
    if (!isLoading && !user) {
      console.log('User not authenticated, redirecting to login');
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/login");
    } else if (!isLoading && user && !isAdmin) {
      console.log('User authenticated but not admin, redirecting to home');
      toast.error("Você não tem permissão para acessar esta página");
      navigate("/");
    }
  }, [user, isLoading, navigate, isAdmin]);

  if (isLoading) {
    console.log('AdminRoute loading...');
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('AdminRoute blocking access:', { hasUser: !!user, isAdmin });
    return null;
  }

  console.log('AdminRoute allowing access');
  return <>{children}</>;
};

export default AdminRoute;
