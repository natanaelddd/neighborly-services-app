
import { useEffect, useState } from "react";

// MenuItem interface igual ao restante do projeto
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

// Inclui as três opções administráveis!
const defaultMenu: MenuItem[] = [
  { id: 1, label: "Home", path: "/", visible: true },
  { id: 2, label: "Encontrar Serviços", path: "/services", visible: true },
  { id: 3, label: "Oferecer Serviço", path: "/services/new", visible: true },
  { id: 4, label: "Cadastrar Casa", path: "/properties/new", visible: true },
  { id: 5, label: "Properties", path: "/properties", visible: true },
  { id: 6, label: "Recommendations", path: "/recommendations", visible: true },
  { id: 7, label: "About", path: "/about", visible: true },
  { id: 8, label: "Contact", path: "/contact", visible: true }
];

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenu);

  // Carrega do localStorage ou usa default, sempre garantindo os botões padrão
  useEffect(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    let nextMenu: MenuItem[] = defaultMenu;
    if (stored) {
      try {
        let loaded: MenuItem[] = JSON.parse(stored);
        // Garante que existam as três opções, adicionando se não existem (pelo path)
        for (const add of defaultMenu) {
          if (!loaded.some(item => item.path === add.path)) {
            loaded.push(add);
          }
        }
        setMenuItems(Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMenu);
      } catch {
        setMenuItems(defaultMenu);
      }
    } else {
      setMenuItems(defaultMenu);
    }
  }, []);

  // Atualiza menuItems no cross-tab incluindo os três botões obrigatórios
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "menuItemsOrder") {
        const stored = localStorage.getItem("menuItemsOrder");
        if (stored) {
          try {
            let loaded: MenuItem[] = JSON.parse(stored);
            for (const add of defaultMenu) {
              if (!loaded.some(item => item.path === add.path)) {
                loaded.push(add);
              }
            }
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
