
import { useEffect, useState } from "react";

// Mesmo MenuItem do Navbar
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

const defaultMenu: MenuItem[] = [
  { id: 1, label: "Home", path: "/", visible: true },
  { id: 2, label: "Services", path: "/services", visible: true },
  { id: 3, label: "Categories", path: "/categories", visible: true },
  { id: 4, label: "Properties", path: "/properties", visible: true },
  { id: 5, label: "Recommendations", path: "/recommendations", visible: true },
  { id: 6, label: "About", path: "/about", visible: true },
  { id: 7, label: "Contact", path: "/contact", visible: true }
];

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenu);

  // Carrega do localStorage ou usa default
  useEffect(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    if (stored) {
      try {
        const loaded: MenuItem[] = JSON.parse(stored);
        setMenuItems(Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMenu);
      } catch {
        setMenuItems(defaultMenu);
      }
    } else {
      setMenuItems(defaultMenu);
    }
  }, []);

  // Listener cross-tab sempre que mudar no localStorage
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "menuItemsOrder") {
        const stored = localStorage.getItem("menuItemsOrder");
        if (stored) {
          try {
            const loaded: MenuItem[] = JSON.parse(stored);
            setMenuItems(Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMenu);
          } catch {
            setMenuItems(defaultMenu);
          }
        } else {
          setMenuItems(defaultMenu);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { menuItems, setMenuItems };
}
