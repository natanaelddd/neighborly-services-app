
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

function ensureRequiredButtons(arr: MenuItem[]): MenuItem[] {
  // Só adiciona os botões obrigatórios se eles não existem (pelo path)
  const required = defaultMenu.filter(dm =>
    ["/services", "/services/new", "/properties/new"].includes(dm.path)
  );
  let next = [...arr];
  required.forEach(req => {
    if (!next.some(item => item.path === req.path)) {
      // Garante id único
      next.push({ ...req, id: Math.max(...next.map(n => n.id)) + 1 });
    }
  });
  return next;
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    if (stored) {
      try {
        let loaded: MenuItem[] = JSON.parse(stored);
        // Garante botões obrigatórios sem sobrescrever edições!
        loaded = ensureRequiredButtons(loaded);
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
            loaded = ensureRequiredButtons(loaded);
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

  // Sempre que menuItems mudar, salva no localStorage (a não ser que seja igual ao atual)
  useEffect(() => {
    const stored = localStorage.getItem("menuItemsOrder");
    let loaded: MenuItem[] = [];
    try {
      if (stored) loaded = JSON.parse(stored);
    } catch {}
    // Evita sobrescrever se já está igual
    if (JSON.stringify(menuItems) !== JSON.stringify(loaded)) {
      localStorage.setItem("menuItemsOrder", JSON.stringify(menuItems));
    }
  }, [menuItems]);

  // No retorno, garanta sempre os obrigatórios presentes
  return { menuItems: ensureRequiredButtons(menuItems), setMenuItems };
}
