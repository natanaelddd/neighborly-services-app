
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

interface FeaturedProperty {
  id: number;
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  type: "venda" | "aluguel";
  price?: string;
  whatsapp?: string;
}

const defaultProperties: FeaturedProperty[] = [
  {
    id: 1,
    title: "Casa Moderna no Evidence Resort",
    description: "Linda casa com 3 quartos, sendo 1 suíte, área gourmet e piscina privativa.",
    details: "- 3 quartos (1 suíte)\n- 2 banheiros\n- Área gourmet\n- Piscina privativa\n- Garagem para 2 carros\n- Jardim paisagístico",
    imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
    type: "venda",
    price: "R$ 850.000",
    whatsapp: "5516992701617"
  },
  {
    id: 2,
    title: "Casa Aconchegante para Locação",
    description: "Casa mobiliada com 2 quartos, perfeita para quem busca conforto e praticidade.",
    details: "- 2 quartos\n- 1 banheiro\n- Sala integrada\n- Cozinha equipada\n- Área de serviço\n- Mobiliada",
    imageUrl: "/lovable-uploads/3e37d1e7-9e83-40ae-9414-bfdbf75723c1.png",
    type: "aluguel",
    price: "R$ 3.200/mês",
    whatsapp: "5516992701617"
  }
];

const FeaturedAd = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState<FeaturedProperty[]>(defaultProperties);

  useEffect(() => {
    const storedProperties = localStorage.getItem('featuredProperties');
    if (storedProperties) {
      try {
        const parsed = JSON.parse(storedProperties);
        setProperties(parsed.length > 0 ? parsed : defaultProperties);
      } catch (error) {
        console.error('Erro ao carregar propriedades do localStorage:', error);
        setProperties(defaultProperties);
      }
    }
  }, []);

  const nextProperty = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
  };

  const prevProperty = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + properties.length) % properties.length);
  };

  const handleWhatsAppContact = (property: FeaturedProperty) => {
    const whatsappNumber = property.whatsapp || "5516992701617";
    const typeText = property.type === "venda" ? "venda" : "aluguel";
    const message = `Olá! Vim do site Condo Indico e vi a casa "${property.title}" para ${typeText}. Gostaria de mais informações. Você está disponível para conversar?`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const currentProperty = properties[currentIndex];

  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold mb-8 text-foreground">Casas em Destaque</h2>
      
      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="relative">
            <img 
              src={currentProperty.imageUrl} 
              alt={currentProperty.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            
            <div className="absolute top-4 left-4">
              <Badge 
                variant={currentProperty.type === "venda" ? "default" : "secondary"}
                className="text-sm font-medium"
              >
                {currentProperty.type === "venda" ? "Venda" : "Aluguel"}
              </Badge>
            </div>

            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                className="bg-brand-green hover:bg-green-600 text-white rounded-full"
                onClick={() => handleWhatsAppContact(currentProperty)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            {properties.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevProperty}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextProperty}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <CardContent className="p-6 text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{currentProperty.title}</h3>
                <p className="text-muted-foreground mb-4">{currentProperty.description}</p>
              </div>
              {currentProperty.price && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-blue">{currentProperty.price}</p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground whitespace-pre-line">{currentProperty.details}</p>
            </div>

            <Button 
              className="w-full bg-brand-green hover:bg-green-600"
              onClick={() => handleWhatsAppContact(currentProperty)}
            >
              Entrar em Contato via WhatsApp
            </Button>
          </CardContent>
        </Card>

        {properties.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {properties.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-blue' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedAd;
