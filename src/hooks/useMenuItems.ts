import { useEffect, useState } from "react";

// MenuItem interface igual ao restante do projeto
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

// Retirar qualquer lógica de botões obrigatórios!
// Mantém só o que está salvo no localStorage ou então o menu padrão inicial

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    if (stored) {
      try {
        let loaded: MenuItem[] = JSON.parse(stored);
        // Garante: se estiver salvo, usa, senão usa padrão
        return Array.isArray(loaded) && loaded.length > 0 ? loaded : defaultMenu;
      } catch {
        return defaultMenu;
      }
    }
    return defaultMenu;
  });

  // Atualiza menuItems se localStorage mudar (multi-tab)
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "menuItemsOrder") {
        const stored = localStorage.getItem("menuItemsOrder");
        if (stored) {
          try {
            let loaded: MenuItem[] = JSON.parse(stored);
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

  // Sempre sincroniza/dispara update do localStorage se mudou
  useEffect(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    let loaded: MenuItem[] = [];
    try {
      if (stored) loaded = JSON.parse(stored);
    } catch {}
    if (JSON.stringify(menuItems) !== JSON.stringify(loaded)) {
      localStorage.setItem("menuItemsOrder", JSON.stringify(menuItems));
    }
  }, [menuItems]);

  // Retorna exatamente o que foi cadastrado, sem iteração extra
  return { menuItems, setMenuItems };
}
