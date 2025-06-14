
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home, Bed, BadgeDollarSign, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

type CatalogProperty = {
  id: number;
  title: string;
  description: string;
  type: string;
  price?: string;
  bedrooms: number;
  whatsapp: string;
  property_photos?: { photo_url: string; is_primary: boolean }[];
};

function formatPrice(price?: string) {
  if (!price) return "-";
  // Tenta converter pra número, retorna "R$ xxxx,xx"
  const num = Number(price.replace(/[^\d]/g, ""));
  if (isNaN(num) || !num) return price;
  return `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
}

function formatType(type: string) {
  return type === "aluguel" ? "Aluguel" : "Venda";
}

function formatWhatsapp(wa: string) {
  // retorna o formato para link do WhatsApp
  const phone = wa.replace(/\D/g, "");
  return `https://wa.me/${phone}`;
}

function truncateDescription(desc: string, max = 100) {
  if (!desc) return "";
  return desc.length > max ? desc.slice(0, max) + "..." : desc;
}

export default function PropertiesPage() {
  // Busca as propriedades aprovadas e as fotos delas
  const { data, isLoading, error } = useQuery({
    queryKey: ["approved-properties"],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          description,
          type,
          price,
          bedrooms,
          whatsapp,
          property_photos(photo_url,is_primary)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return properties as CatalogProperty[];
    },
  });

  return (
    <div className="container-custom py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Catálogo de Imóveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Veja todas as casas e apartamentos disponíveis para compra ou aluguel.
          </p>

          {isLoading && <div>Carregando imóveis...</div>}
          {error && (
            <div className="text-red-500 my-4">Erro ao buscar as propriedades.</div>
          )}
          {!isLoading && data && data.length === 0 && (
            <div className="text-muted-foreground">Nenhuma propriedade disponível no momento.</div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {data &&
              data.map((prop) => {
                // Encontra a foto principal ou placeholder
                const foto =
                  prop.property_photos?.find((f) => f.is_primary)?.photo_url ||
                  prop.property_photos?.[0]?.photo_url ||
                  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=400&q=80";
                return (
                  <div key={prop.id} className="hover-scale transition">
                    <Card className="rounded-xl overflow-hidden shadow-md h-full flex flex-col animate-fade-in">
                      <img
                        src={foto}
                        alt={prop.title}
                        className="w-full h-44 object-cover object-center"
                        loading="lazy"
                      />
                      <CardContent className="flex-1 flex flex-col gap-3 p-4">
                        <div className="flex items-center gap-2 text-xs uppercase text-primary font-semibold">
                          {formatType(prop.type)}
                        </div>
                        <h2 className="font-bold text-lg">{prop.title}</h2>
                        <div className="text-gray-600 text-sm">
                          {truncateDescription(prop.description, 90)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <BadgeDollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-md font-semibold">{formatPrice(prop.price)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Bed className="h-4 w-4" />
                          <span>{prop.bedrooms} {prop.bedrooms === 1 ? "quarto" : "quartos"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4" />
                          <a
                            href={formatWhatsapp(prop.whatsapp)}
                            className="text-primary underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
