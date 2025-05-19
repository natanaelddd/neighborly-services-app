
import { useState, useEffect } from 'react';
import { services as allServices } from '@/data/mockData';
import ServiceList from './ServiceList';
import { ServiceWithProvider } from '@/types';

const FeaturedServices = () => {
  const [featuredServices, setFeaturedServices] = useState<ServiceWithProvider[]>([]);
  
  useEffect(() => {
    // Em um cenário real, isso seria uma chamada API para buscar serviços em destaque
    // Aqui estamos apenas pegando alguns aleatoriamente
    const approved = allServices.filter(service => service.status === 'approved');
    const randomized = [...approved].sort(() => 0.5 - Math.random());
    setFeaturedServices(randomized.slice(0, 3));
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Serviços em Destaque</h2>
        </div>
        <ServiceList services={featuredServices} />
      </div>
    </section>
  );
};

export default FeaturedServices;
