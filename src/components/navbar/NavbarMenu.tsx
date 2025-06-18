
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut } from "lucide-react";
import type { MenuItem } from "@/hooks/usePublicMenuItems";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavbarMenuProps {
  navigation: MenuItem[];
  isActive: (href: string) => boolean;
}

export function NavbarMenu({ navigation, isActive }: NavbarMenuProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8">
        {navigation.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              isActive(item.path)
                ? "text-primary border-b-2 border-primary"
                : "text-gray-700 hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Abrir menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-6">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={closeMenu}
                  className={`px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/user-dashboard" onClick={closeMenu}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {profile?.name || user.email?.split('@')[0] || "Usuário"}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMenu}>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
