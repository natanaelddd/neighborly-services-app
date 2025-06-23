
import { Category, ServiceWithProvider } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ServiceList from "@/components/ServiceList";

interface ServicesCategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  filteredServices: ServiceWithProvider[];
  services: ServiceWithProvider[];
  onCategoryChange: (value: string) => void;
}

const ServicesCategoryTabs = ({ 
  categories, 
  activeCategory, 
  filteredServices, 
  services, 
  onCategoryChange 
}: ServicesCategoryTabsProps) => {
  return (
    <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={onCategoryChange} className="mb-8">
      <ScrollArea className="w-full">
        <TabsList className="flex flex-nowrap mb-4 w-max min-w-full">
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
      
      <TabsContent value={activeCategory}>
        <ServiceList 
          services={filteredServices} 
          emptyMessage={
            filteredServices.length === 0 && services.length > 0
              ? "Nenhum serviço encontrado para esta busca."
              : "Nenhum serviço encontrado. Os serviços aparecerão aqui quando forem cadastrados e aprovados."
          }
        />
      </TabsContent>
    </Tabs>
  );
};

export default ServicesCategoryTabs;
