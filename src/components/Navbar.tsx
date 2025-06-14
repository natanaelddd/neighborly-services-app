import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings, Home, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

const defaultMenu: MenuItem[] = [
  { id: 1, label: "Início", path: "/", visible: true },
  { id: 2, label: "Serviços", path: "/servicos", visible: true },
  { id: 3, label: "Categorias", path: "/categories", visible: true },
  { id: 4, label: "Propriedades", path: "/properties", visible: true },
  { id: 5, label: "Indicações", path: "/recommendations", visible: true },
  { id: 6, label: "Sobre", path: "/about", visible: true },
  { id: 7, label: "Contato", path: "/contact", visible: true }
];

const Navbar = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenu);

  useEffect(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    if (stored) {
      try {
        const loaded: MenuItem[] = JSON.parse(stored);
        setMenuItems(loaded);
      } catch {
        setMenuItems(defaultMenu);
      }
    } else {
      setMenuItems(defaultMenu);
    }
  }, []);

  const navigation = menuItems.filter(item => item.visible);

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const closeMenu = () => setIsOpen(false);

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
          {/* User Actions */}
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
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
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
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="space-y-2">
                        <Link to="/user-dashboard" onClick={closeMenu}>
                          <Button variant="outline" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            {profile?.name || "Usuário"}
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
                      <div className="space-y-2">
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
