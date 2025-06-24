
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading, isAdmin, profile } = useAuth();
  const navigate = useNavigate();

  console.log('AdminRoute - Detailed debug info:', {
    user: user ? user.email : 'null',
    profile: profile ? profile.email : 'null',
    isLoading,
    isAdmin,
    hasUser: !!user,
    hasProfile: !!profile,
    userMetadata: user?.user_metadata,
    currentPath: window.location.pathname
  });

  useEffect(() => {
    console.log('AdminRoute useEffect triggered with:', { 
      user: user?.email, 
      isLoading, 
      isAdmin,
      profile: profile?.email
    });
    
    if (!isLoading) {
      if (!user) {
        console.log('User not authenticated, redirecting to login');
        toast.error("Você precisa estar logado para acessar esta página");
        navigate("/login");
        return;
      }
      
      if (!isAdmin) {
        console.log('User authenticated but not admin:', {
          userEmail: user.email,
          profileEmail: profile?.email,
          isAdmin
        });
        toast.error("Você não tem permissão para acessar esta página");
        navigate("/");
        return;
      }
      
      console.log('AdminRoute - Access granted for admin user:', user.email);
    }
  }, [user, isLoading, navigate, isAdmin, profile]);

  if (isLoading) {
    console.log('AdminRoute - Still loading auth state...');
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <div className="ml-4 text-sm text-gray-600">Verificando permissões...</div>
      </div>
    );
  }

  if (!user) {
    console.log('AdminRoute - No user, blocking access');
    return null;
  }

  if (!isAdmin) {
    console.log('AdminRoute - User not admin, blocking access:', {
      userEmail: user.email,
      isAdmin
    });
    return null;
  }

  console.log('AdminRoute - Rendering admin dashboard for:', user.email);
  return <>{children}</>;
};

export default AdminRoute;
