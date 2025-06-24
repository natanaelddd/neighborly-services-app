
import SearchBar from "@/components/SearchBar";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";
import ServicesCategoryTabs from "@/components/services/ServicesCategoryTabs";
import ServicesPageLoading from "@/components/services/ServicesPageLoading";
import { useServicesListPage } from "@/hooks/useServicesListPage";

const ServicesListPage = () => {
  const {
    services,
    categories,
    filteredServices,
    activeCategory,
    isLoading,
    isDemoMode,
    handleSearch,
    handleCategoryChange
  } = useServicesListPage();

  if (isLoading) {
    return <ServicesPageLoading />;
  }

  return (
    <div className="container-custom py-10">
      <ServicesPageHeader isDemoMode={isDemoMode} />
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <ServicesCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        filteredServices={filteredServices}
        services={services}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
};

export default ServicesListPage;
