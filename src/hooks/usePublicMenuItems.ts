
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MenuItem as SupabaseMenuItem } from "@/hooks/useSupabaseMenuItems";

export interface MenuItem extends SupabaseMenuItem {}

export function usePublicMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    supabase
      .from("menu_items")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (isMounted) {
          if (!error && data) setMenuItems(data);
          else setMenuItems([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { menuItems, isLoading };
}
