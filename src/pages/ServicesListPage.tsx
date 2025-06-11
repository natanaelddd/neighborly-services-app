
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getServicesByCategory, getAllCategories, searchServices } from "@/data/mockData";
import { ServiceWithProvider } from "@/types";
import ServiceList from "@/components/ServiceList";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const ServicesListPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithProvider[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const categories = getAllCategories();
  
  useEffect(() => {
    // Primeiro verifica se há categoria na query string (vem do redirecionamento)
    const categoryFromQuery = searchParams.get('category');
    
    // Se houver categoria na query string, usa ela
    if (categoryFromQuery) {
      const categoryIdNumber = parseInt(categoryFromQuery);
      const categoryServices = getServicesByCategory(categoryIdNumber);
      setServices(categoryServices);
      setFilteredServices(categoryServices);
      setActiveCategory(categoryFromQuery);
    }
    // Se houver um categoryId na URL, usamos ele
    else if (categoryId) {
      const categoryIdNumber = parseInt(categoryId);
      const categoryServices = getServicesByCategory(categoryIdNumber);
      setServices(categoryServices);
      setFilteredServices(categoryServices);
      setActiveCategory(categoryId);
    } else {
      // Senão, carregamos todos os serviços
      const allServices = getServicesByCategory(null);
      setServices(allServices);
      setFilteredServices(allServices);
      setActiveCategory("all");
    }
  }, [categoryId, searchParams]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredServices(services);
      return;
    }
    
    const results = searchServices(searchTerm);
    setFilteredServices(results);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    
    if (value === "all") {
      const allServices = getServicesByCategory(null);
      setFilteredServices(allServices);
    } else {
      const categoryIdNumber = parseInt(value);
      const categoryServices = getServicesByCategory(categoryIdNumber);
      setFilteredServices(categoryServices);
    }
  };

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-6">Serviços Disponíveis</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={handleCategoryChange} className="mb-8">
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
        
        {/* O TabsContent é apenas um wrapper, o conteúdo será sempre o mesmo */}
        <TabsContent value={activeCategory}>
          <ServiceList 
            services={filteredServices} 
            emptyMessage={
              filteredServices.length === 0 && services.length > 0
                ? "Nenhum serviço encontrado para esta busca."
                : "Nenhum serviço disponível nesta categoria."
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesListPage;
