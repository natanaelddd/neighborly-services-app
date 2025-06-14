
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { NavbarMenu } from "./navbar/NavbarMenu";
import { usePublicMenuItems } from "@/hooks/usePublicMenuItems";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const HIDDEN_PATHS_IN_MAIN_MENU = [
  "/services",
  "/services/new",
  "/properties/new"
];

const Navbar = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const location = useLocation();
  const { menuItems } = usePublicMenuItems();

  // Só os visíveis e NÃO os três do HeroSection (igual antes)
  const navigation = menuItems.filter(
    item => 
      item.visible &&
      !HIDDEN_PATHS_IN_MAIN_MENU.includes(item.path)
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href) && href !== "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/3e37d1e7-9e83-40ae-9414-bfdbf75723c1.png" 
              alt="Condo Indico Logo" 
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Home className="h-8 w-8 text-primary hidden" />
            <span className="text-xl font-bold text-primary">Condo Indico</span>
          </Link>

          {/* Menu de Navegação extraído */}
          <NavbarMenu navigation={navigation} isActive={isActive} />

          {/* User Actions (desktop only) */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/user-dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.name || "Usuário"}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
