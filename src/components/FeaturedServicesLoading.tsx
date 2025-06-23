
const FeaturedServicesLoading = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Serviços em Destaque</h2>
        </div>
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServicesLoading;
