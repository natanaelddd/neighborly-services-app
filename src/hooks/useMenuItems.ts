
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// MenuItem interface igual ao restante do projeto
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

// Menu padrão caso não haja dados no banco
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const transformedItems: MenuItem[] = data.map(item => ({
            id: item.id,
            label: item.label,
            path: item.path,
            visible: item.visible
          }));
          setMenuItems(transformedItems);
        } else {
          // Se não há dados no banco, usar menu padrão
          setMenuItems(defaultMenu);
        }
      } catch (error) {
        console.error('Erro ao carregar menu items:', error);
        setMenuItems(defaultMenu);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return { menuItems, setMenuItems, isLoading };
}
